import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeOracleGateway } from '../../../integrations/exchange-oracle/exchange-oracle.gateway';
import { JobAssignmentService } from '../job-assignment.service';
import {
  jobAssignmentCommandFixture,
  jobsFetchParamsCommandFixture,
  jobsFetchResponseFixture,
  jobsFetchResponseItemFixture,
  EXCHANGE_ORACLE_ADDRESS,
  USER_ADDRESS,
} from './job-assignment.fixtures';
import { EnvironmentConfigService } from '../../../common/config/environment-config.service';
import { EscrowUtilsGateway } from '../../../integrations/escrow/escrow-utils-gateway.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResignJobCommand } from '../model/job-assignment.model';

const TEST_RETENTION_TTL = 1000 * 60 * 60 * 24;
const cacheKey = `jobs:assigned:${USER_ADDRESS}:${EXCHANGE_ORACLE_ADDRESS}`;

describe('JobAssignmentService', () => {
  let service: JobAssignmentService;
  let exchangeOracleGatewayMock: Partial<ExchangeOracleGateway>;
  let cacheManagerMock: any;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    exchangeOracleGatewayMock = {
      postNewJobAssignment: jest.fn(),
      fetchAssignedJobs: jest.fn(),
      resignAssignedJob: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobAssignmentService,
        { provide: ExchangeOracleGateway, useValue: exchangeOracleGatewayMock },
        {
          provide: EscrowUtilsGateway,
          useValue: {
            getExchangeOracleAddressByEscrowAddress: jest.fn(),
          },
        },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        {
          provide: EnvironmentConfigService,
          useValue: {
            jobAssignmentsRetentionDays: 1,
          },
        },
      ],
    }).compile();

    service = module.get<JobAssignmentService>(JobAssignmentService);
    jest
      .spyOn(service as any, 'getEvmAddressFromToken')
      .mockReturnValue(USER_ADDRESS);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processJobAssignment', () => {
    it('should process job assignment correctly', async () => {
      const command = jobAssignmentCommandFixture;
      (
        exchangeOracleGatewayMock.postNewJobAssignment as jest.Mock
      ).mockResolvedValue({
        assignment_id: '123',
      });
      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockResolvedValue(jobsFetchResponseFixture);

      const result = await service.processJobAssignment(command);

      expect(
        exchangeOracleGatewayMock.postNewJobAssignment,
      ).toHaveBeenCalledWith(command);
      expect(result).toEqual({ assignment_id: '123' });
    });

    it('handles errors when updating cached assignments', async () => {
      const mockResult = {
        assignment_id: '123',
      };

      const command = jobAssignmentCommandFixture;
      (
        exchangeOracleGatewayMock.postNewJobAssignment as jest.Mock
      ).mockResolvedValue(mockResult);

      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockRejectedValueOnce(new Error('Unhandled error'));

      const result = await service.processJobAssignment(command);

      expect(result).toEqual(mockResult);
    });
  });

  describe('processGetAssignedJobs', () => {
    it('should fetch assigned jobs correctly when not cached', async () => {
      const now = Date.now();
      jest.useFakeTimers().setSystemTime(now);

      const command = jobsFetchParamsCommandFixture;
      const jobsFetchResponse = jobsFetchResponseFixture;

      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockResolvedValue(jobsFetchResponse);

      cacheManagerMock.get.mockResolvedValueOnce(undefined);

      const result = await service.processGetAssignedJobs(command);

      expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
      expect(exchangeOracleGatewayMock.fetchAssignedJobs).toHaveBeenCalledWith(
        command,
      );
      expect(command.data.updatedAfter).toBe(
        new Date(now - TEST_RETENTION_TTL).toISOString(),
      );

      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        cacheKey,
        jobsFetchResponse.results,
      );
      expect(result).toEqual({
        results: jobsFetchResponse.results,
        page: 0,
        page_size: 5,
        total_pages: 1,
        total_results: jobsFetchResponse.total_results,
      });
    });

    it('should fetch assigned jobs correctly when cached', async () => {
      const command = jobsFetchParamsCommandFixture;
      const cachedJobs = jobsFetchResponseFixture.results;

      cacheManagerMock.get.mockResolvedValueOnce(cachedJobs);

      const result = await service.processGetAssignedJobs(command);

      expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
      expect(
        exchangeOracleGatewayMock.fetchAssignedJobs,
      ).not.toHaveBeenCalled();
      expect(result).toEqual({
        results: cachedJobs,
        page: 0,
        page_size: 5,
        total_pages: 1,
        total_results: cachedJobs.length,
      });
    });
  });

  describe('updateAssignmentsCache', () => {
    it('should update assignments cache when empty', async () => {
      const command = jobsFetchParamsCommandFixture;
      const newAssignments = jobsFetchResponseFixture.results;

      cacheManagerMock.get.mockResolvedValueOnce([]);
      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockResolvedValue({ results: newAssignments });

      await service['updateAssignmentsCache'](command);

      expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
      expect(exchangeOracleGatewayMock.fetchAssignedJobs).toHaveBeenCalledWith(
        command,
      );
      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        cacheKey,
        newAssignments,
      );
    });

    it('should apply retention config to cached assignments', async () => {
      const latestUpdatedAt = new Date().toISOString();
      cacheManagerMock.get.mockResolvedValueOnce([
        {
          ...jobsFetchResponseItemFixture,
          updated_at: new Date(
            /**
             * Extract extra ms to avoid test being flaky
             * if executed too quick
             */
            Date.now() - TEST_RETENTION_TTL - 1,
          ).toISOString(),
        },
        {
          ...jobsFetchResponseItemFixture,
          updated_at: latestUpdatedAt,
        },
      ]);

      const newAssignments = jobsFetchResponseFixture.results;
      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockResolvedValueOnce({ results: newAssignments });

      const command = jobsFetchParamsCommandFixture;

      await service['updateAssignmentsCache'](command);

      expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
      expect(exchangeOracleGatewayMock.fetchAssignedJobs).toHaveBeenCalledWith(
        command,
      );
      expect(command.data.updatedAfter).toBe(latestUpdatedAt);
      expect(cacheManagerMock.set).toHaveBeenCalledWith(cacheKey, [
        jobsFetchResponseItemFixture,
      ]);
    });
  });

  describe('resignJob', () => {
    it('should resign job and update cache correctly', async () => {
      const command = new ResignJobCommand();
      (
        exchangeOracleGatewayMock.resignAssignedJob as jest.Mock
      ).mockResolvedValue({ success: true });

      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockResolvedValue(jobsFetchResponseFixture);

      await service.resignJob(command);

      expect(exchangeOracleGatewayMock.resignAssignedJob).toHaveBeenCalledWith(
        command,
      );
    });

    it('handles errors when updating cached assignments', async () => {
      const command = new ResignJobCommand();

      const mockResult = { success: true };
      (
        exchangeOracleGatewayMock.resignAssignedJob as jest.Mock
      ).mockResolvedValue(mockResult);

      (
        exchangeOracleGatewayMock.fetchAssignedJobs as jest.Mock
      ).mockRejectedValueOnce(new Error('Unhandled error'));

      const result = await service.resignJob(command);

      expect(result).toEqual(mockResult);
    });
  });
});
