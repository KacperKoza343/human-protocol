import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChainId } from '@human-protocol/sdk';

import { AddressValidationPipe } from '../../common/pipes/address-validation.pipe';
import { DetailsService } from './details.service';
import {
  DetailsResponseDto,
  DetailsPaginationResponseDto,
  KVStoreDataDto,
} from './dto/details-response.dto';
import {
  DetailsTransactionsPaginationDto,
  DetailsEscrowsPaginationDto,
  LeadersPaginationDto,
} from './dto/details-pagination.dto';
import { WalletDto } from './dto/wallet.dto';
import { EscrowDto, EscrowPaginationDto } from './dto/escrow.dto';
import { LeaderDto } from './dto/leader.dto';
import { TransactionPaginationDto } from './dto/transaction.dto';

@ApiTags('Details')
@Controller('/details')
@UsePipes(new ValidationPipe({ transform: true }))
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Get('/leaders')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get leaders',
    description: 'Returns leaders for the given filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaders retrieved successfully',
    type: LeaderDto,
    isArray: true,
  })
  public async leaders(
    @Query() query: LeadersPaginationDto,
  ): Promise<LeaderDto[]> {
    return this.detailsService.getLeaders(query.chainId, {
      orderBy: query.orderBy,
      orderDirection: query.orderDirection,
      first: query.first,
    });
  }

  @Get('/:address')
  @ApiQuery({ name: 'chainId', enum: ChainId })
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get address details',
    description: 'Returns details about given address.',
  })
  @ApiResponse({
    status: 200,
    description: 'Details retrieved successfully',
    type: DetailsResponseDto,
  })
  public async details(
    @Param('address', AddressValidationPipe) address: string,
    @Query('chainId') chainId: ChainId,
  ): Promise<DetailsResponseDto> {
    const details: WalletDto | EscrowDto | LeaderDto =
      await this.detailsService.getDetails(chainId, address);
    if (details instanceof WalletDto) {
      const response: DetailsResponseDto = {
        wallet: details,
      };
      return response;
    }
    if (details instanceof EscrowDto) {
      const response: DetailsResponseDto = {
        escrow: details,
      };
      return response;
    }
    if (details instanceof LeaderDto) {
      const response: DetailsResponseDto = {
        leader: details,
      };
      return response;
    }
  }

  @Get('/transactions/:address')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get transactions by address',
    description: 'Returns transactions for a given address.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: DetailsPaginationResponseDto,
  })
  public async transactions(
    @Param('address', AddressValidationPipe) address: string,
    @Query() query: DetailsTransactionsPaginationDto,
  ): Promise<DetailsPaginationResponseDto> {
    const transactions: TransactionPaginationDto[] =
      await this.detailsService.getTransactions(
        query.chainId,
        address,
        query.first,
        query.skip,
      );

    const response: DetailsPaginationResponseDto = {
      address,
      chainId: query.chainId,
      first: query.first,
      skip: query.skip,
      results: transactions,
    };

    return response;
  }

  @Get('/escrows/:address')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get escrows by address',
    description: 'Returns escrows for a given address.',
  })
  @ApiResponse({
    status: 200,
    description: 'Escrows retrieved successfully',
    type: DetailsPaginationResponseDto,
  })
  public async escrows(
    @Param('address', AddressValidationPipe) address: string,
    @Query() query: DetailsEscrowsPaginationDto,
  ): Promise<DetailsPaginationResponseDto> {
    const escrows: EscrowPaginationDto[] = await this.detailsService.getEscrows(
      query.chainId,
      query.role,
      address,
      query.first,
      query.skip,
    );

    const response: DetailsPaginationResponseDto = {
      address,
      chainId: query.chainId,
      first: query.first,
      skip: query.skip,
      results: escrows,
    };

    return response;
  }

  @Get('/kvstore/:address')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get KVStore data by address',
    description: 'Returns all the data stored in KVStore for a given address.',
  })
  @ApiQuery({ name: 'chain_id', enum: ChainId, required: true })
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
    type: KVStoreDataDto,
    isArray: true,
  })
  public async KVStore(
    @Param('address', AddressValidationPipe) address: string,
    @Query('chain_id') chainId: ChainId,
  ): Promise<KVStoreDataDto[]> {
    return this.detailsService.getKVStoreData(chainId, address);
  }
}
