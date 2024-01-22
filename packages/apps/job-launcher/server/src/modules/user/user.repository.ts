import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDto, UserUpdateDto } from './user.dto';
import { ErrorUser } from '../../common/constants/errors';


/*
  This is not a repository.
  Instead, it should extend typeorm repository to achieve better error handling.
  Because repos errors should be handled on a service level, by default typeorm exceptions (such as duplicate error)
  will be bubbled up to controller level.
  Example of how to extend a repository: https://orkhan.gitbook.io/typeorm/docs/custom-repository
  Basically, we should create a .createUnique() method that will properly handle repo-level errors.
  
  Other methods should be overloaded only for better error handling (!!!)
*/

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  public async updateOne(
    where: FindOptionsWhere<UserEntity>,
    dto: Partial<UserUpdateDto>,
  ): Promise<UserEntity> {
    const userEntity = await this.userEntityRepository.findOneBy(where);

    if (!userEntity) {
      this.logger.log(ErrorUser.NotFound, UserRepository.name);
      throw new NotFoundException(ErrorUser.NotFound);
    }

    Object.assign(userEntity, dto);
    return userEntity.save();
  }

  public async findOne(
    where: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const userEntity = await this.userEntityRepository.findOne({
      where,
      ...options,
    });

    return userEntity;
  }

  public find(
    where: FindOptionsWhere<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<UserEntity[]> {
    return this.userEntityRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
      ...options,
    });
  }

  public async create(dto: UserDto): Promise<UserEntity> {
    return this.userEntityRepository.create(dto).save();
  }
}
