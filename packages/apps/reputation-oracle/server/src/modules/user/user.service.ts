import { KVStoreClient, KVStoreUtils } from '@human-protocol/sdk';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HCaptchaConfigService } from '../../config/hcaptcha-config.service';
import { Web3ConfigService } from '../../config/web3-config.service';
import {
  KycStatus,
  OperatorStatus,
  UserStatus,
  Role,
} from '../../common/enums/user';
import { SignatureType } from '../../common/enums/web3';
import { SiteKeyType } from '../../common/enums';
import { HCaptchaService } from '../../integrations/hcaptcha/hcaptcha.service';
import {
  generateNonce,
  verifySignature,
  prepareSignatureBody,
} from '../../utils/web3';
import { Web3Service } from '../web3/web3.service';
import { SiteKeyEntity } from './site-key.entity';
import { SiteKeyRepository } from './site-key.repository';
import { RegisterAddressRequestDto } from './user.dto';
import { UserEntity } from './user.entity';
import {
  UserError,
  UserErrorMessage,
  DuplicatedWalletAddressError,
  InvalidWeb3SignatureError,
} from './user.error';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly HASH_ROUNDS = 12;

  constructor(
    private userRepository: UserRepository,
    private siteKeyRepository: SiteKeyRepository,
    private readonly web3Service: Web3Service,
    private readonly hcaptchaService: HCaptchaService,
    private readonly web3ConfigService: Web3ConfigService,
    private readonly hcaptchaConfigService: HCaptchaConfigService,
  ) {}

  static checkPasswordMatchesHash(
    password: string,
    passwordHash: string,
  ): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }

  public async create({
    email,
    password,
  }: Pick<UserEntity, 'email' | 'password'>): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.email = email;
    newUser.password = bcrypt.hashSync(password, this.HASH_ROUNDS);
    newUser.role = Role.WORKER;
    newUser.status = UserStatus.PENDING;
    await this.userRepository.createUnique(newUser);
    return newUser;
  }

  public updatePassword(
    userEntity: UserEntity,
    newPassword: string,
  ): Promise<UserEntity> {
    userEntity.password = bcrypt.hashSync(newPassword, this.HASH_ROUNDS);
    return this.userRepository.updateOne(userEntity);
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.status = UserStatus.ACTIVE;
    return this.userRepository.updateOne(userEntity);
  }

  public async createWeb3User(address: string): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.evmAddress = address.toLowerCase();
    newUser.nonce = generateNonce();
    newUser.role = Role.OPERATOR;
    newUser.status = UserStatus.ACTIVE;

    await this.userRepository.createUnique(newUser);
    return newUser;
  }

  public async updateNonce(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.nonce = generateNonce();
    return this.userRepository.updateOne(userEntity);
  }

  public async registerLabeler(user: UserEntity): Promise<string> {
    if (user.role !== Role.WORKER) {
      throw new UserError(UserErrorMessage.INVALID_ROLE, user.id);
    }

    if (!user.evmAddress) {
      throw new UserError(UserErrorMessage.MISSING_ADDRESS, user.id);
    }

    if (user.kyc?.status !== KycStatus.APPROVED) {
      throw new UserError(UserErrorMessage.KYC_NOT_APPROVED, user.id);
    }

    if (user.siteKeys && user.siteKeys.length > 0) {
      const existingHcaptchaSiteKey = user.siteKeys?.find(
        (key) => key.type === SiteKeyType.HCAPTCHA,
      );
      if (existingHcaptchaSiteKey) {
        return existingHcaptchaSiteKey.siteKey;
      }
    }

    // Register user as a labeler at hcaptcha foundation
    const registeredLabeler = await this.hcaptchaService.registerLabeler({
      email: user.email,
      evmAddress: user.evmAddress,
      country: user.kyc.country,
    });

    if (!registeredLabeler) {
      throw new UserError(UserErrorMessage.LABELING_ENABLE_FAILED, user.id);
    }

    // Retrieve labeler sitekeys from hCaptcha foundation
    const labelerData = await this.hcaptchaService.getLabelerData(user.email);
    if (!labelerData?.sitekeys.length) {
      throw new UserError(UserErrorMessage.LABELING_ENABLE_FAILED, user.id);
    }

    const siteKey = labelerData.sitekeys[0].sitekey;

    const newSiteKey = new SiteKeyEntity();
    newSiteKey.siteKey = siteKey;
    newSiteKey.user = user;
    newSiteKey.type = SiteKeyType.HCAPTCHA;

    await this.siteKeyRepository.createUnique(newSiteKey);

    return siteKey;
  }

  public async registerAddress(
    user: UserEntity,
    data: RegisterAddressRequestDto,
  ): Promise<void> {
    const lowercasedAddress = data.address.toLocaleLowerCase();

    if (user.evmAddress) {
      throw new UserError(UserErrorMessage.ADDRESS_EXISTS, user.id);
    }

    if (user.kyc?.status !== KycStatus.APPROVED) {
      throw new UserError(UserErrorMessage.KYC_NOT_APPROVED, user.id);
    }

    const dbUser =
      await this.userRepository.findOneByAddress(lowercasedAddress);
    if (dbUser) {
      throw new DuplicatedWalletAddressError(user.id, lowercasedAddress);
    }

    // Prepare signed data and verify the signature
    const signedData = prepareSignatureBody({
      from: lowercasedAddress,
      to: this.web3ConfigService.operatorAddress,
      contents: SignatureType.REGISTER_ADDRESS,
    });
    const verified = verifySignature(signedData, data.signature, [
      lowercasedAddress,
    ]);

    if (!verified) {
      throw new InvalidWeb3SignatureError(user.id, lowercasedAddress);
    }

    user.evmAddress = lowercasedAddress;
    await this.userRepository.updateOne(user);
  }

  public async enableOperator(
    user: UserEntity,
    signature: string,
  ): Promise<void> {
    const signedData = prepareSignatureBody({
      from: user.evmAddress,
      to: this.web3ConfigService.operatorAddress,
      contents: SignatureType.ENABLE_OPERATOR,
    });

    const verified = verifySignature(signedData, signature, [user.evmAddress]);

    if (!verified) {
      throw new InvalidWeb3SignatureError(user.id, user.evmAddress);
    }

    const chainId = this.web3ConfigService.reputationNetworkChainId;
    const signer = this.web3Service.getSigner(chainId);
    const kvstore = await KVStoreClient.build(signer);

    let status: string | undefined;
    try {
      status = await KVStoreUtils.get(chainId, signer.address, user.evmAddress);
    } catch {}

    if (status === OperatorStatus.ACTIVE) {
      throw new UserError(UserErrorMessage.OPERATOR_ALREADY_ACTIVE, user.id);
    }

    await kvstore.set(user.evmAddress.toLowerCase(), OperatorStatus.ACTIVE);
  }

  public async disableOperator(
    user: UserEntity,
    signature: string,
  ): Promise<void> {
    const signedData = prepareSignatureBody({
      from: user.evmAddress,
      to: this.web3ConfigService.operatorAddress,
      contents: SignatureType.DISABLE_OPERATOR,
    });

    const verified = verifySignature(signedData, signature, [user.evmAddress]);

    if (!verified) {
      throw new InvalidWeb3SignatureError(user.id, user.evmAddress);
    }

    const chainId = this.web3ConfigService.reputationNetworkChainId;
    const signer = this.web3Service.getSigner(chainId);
    const kvstore = await KVStoreClient.build(signer);

    const status = await KVStoreUtils.get(
      chainId,
      signer.address,
      user.evmAddress,
    );

    if (status === OperatorStatus.INACTIVE) {
      throw new UserError(UserErrorMessage.OPERATOR_NOT_ACTIVE, user.id);
    }

    await kvstore.set(user.evmAddress.toLowerCase(), OperatorStatus.INACTIVE);
  }

  public async registrationInExchangeOracle(
    user: UserEntity,
    oracleAddress: string,
  ): Promise<SiteKeyEntity> {
    const siteKey = await this.siteKeyRepository.findByUserSiteKeyAndType(
      user,
      oracleAddress,
      SiteKeyType.REGISTRATION,
    );
    if (siteKey) return siteKey;

    const newSiteKey = new SiteKeyEntity();
    newSiteKey.siteKey = oracleAddress;
    newSiteKey.type = SiteKeyType.REGISTRATION;
    newSiteKey.user = user;

    return await this.siteKeyRepository.createUnique(newSiteKey);
  }

  public async getRegistrationInExchangeOracles(
    user: UserEntity,
  ): Promise<string[]> {
    const siteKeys = await this.siteKeyRepository.findByUserAndType(
      user,
      SiteKeyType.REGISTRATION,
    );
    return siteKeys.map((siteKey) => siteKey.siteKey);
  }
}
