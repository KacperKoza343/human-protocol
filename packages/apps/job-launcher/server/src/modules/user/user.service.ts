import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserStatus, UserType } from '../../common/enums/user';
import { UserBalanceDto, UserCreateDto, UserUpdateDto } from './user.dto';
import { UserRepository } from './user.repository';
import { ValidatePasswordDto } from '../auth/auth.dto';
import { ErrorUser } from '../../common/constants/errors';
import { PaymentService } from '../payment/payment.service';
import { Currency } from '../../common/enums/payment';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private HASH_ROUNDS = 12;
  constructor(
    /*
      Should be a custom repository (look at user.repository.ts)
    */
    private userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
  ) {}

  /* 
    Method is not being used.
    Anyway, to avoid race conditions on update, put a lock.
  */
  public async update(userId: number, dto: UserUpdateDto): Promise<UserEntity> {
    return this.userRepository.updateOne({ id: userId }, dto);
  }

  public async create(dto: UserCreateDto): Promise<UserEntity> {
    const { email, password, ...rest } = dto;

    await this.checkEmail(email, 0); // remove

    /* 
      Create a user entity first.
      Then, call this.usersRepository.insert(userEntity);
      No reason to use .save() method here according to the typeorm. Check:
      /typeorm/repository/BaseEntity.d.ts
      
      In case of an error thrown by a repository, no need to handle it here, auth.service should
      take care of it instead.

      In case of a successful user creation, return userEntity (!). You should return a value from a repository.
    */
    
    return await this.userRepository.create({
      ...rest,
      email,
      password: bcrypt.hashSync(password, this.HASH_ROUNDS),
      type: UserType.REQUESTER,
      status: UserStatus.PENDING,
    });
  }

  public async getByCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    // Use await this.getByEmail() since it's already declared
    const userEntity = await this.userRepository.findOne({
      email,
    });

    if (!userEntity) {
      throw new NotFoundException(ErrorUser.InvalidCredentials);
    }

    if (!bcrypt.compareSync(password, userEntity.password)) {
      throw new NotFoundException(ErrorUser.InvalidCredentials);
    }

    return userEntity;
  }

  public async getByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ email });
  }

  public updatePassword(
    userEntity: UserEntity,
    /* 
      Pass only password instead of a dto 
    */
    data: ValidatePasswordDto,
  ): Promise<UserEntity> {
    userEntity.password = bcrypt.hashSync(data.password, this.HASH_ROUNDS);
    /*
      Use a repository method here. 
    */
    return userEntity.save();
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.status = UserStatus.ACTIVE;
    /*
      Use a repository method here. 
    */
    return userEntity.save();
  }

  /* 
  Shouldn't be used during signup flow. 
  DB table should have a unique email index which will return duplicate error on create attempt.
  */
  public async checkEmail(email: string, id: number): Promise<void> {
    const userEntity = await this.userRepository.findOne({
      email,
      id: Not(id), // What is this
    });

    if (userEntity) {
      this.logger.log(ErrorUser.AccountCannotBeRegistered, UserService.name);
      throw new BadRequestException(ErrorUser.AccountCannotBeRegistered);
    }
  }

  public async getBalance(userId: number): Promise<UserBalanceDto> {
    return {
      amount: await this.paymentService.getUserBalance(userId),
      currency: Currency.USD,
    };
  }
}
