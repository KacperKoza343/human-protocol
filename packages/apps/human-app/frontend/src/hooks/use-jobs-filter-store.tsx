/* eslint-disable camelcase -- api params*/
import { create } from 'zustand';

export interface JobsFilterStoreProps {
  filterParams: {
    sort?: 'ASC' | 'DESC';
    sort_field?: 'chain_id' | 'job_type' | 'reward_amount' | 'created_at';
    network?: 'MATIC' | 'POLYGON';
    // TODO add allowed job types
    job_type?: string;
    status?:
      | 'ACTIVE'
      | 'COMPLETED'
      | 'CANCELED'
      | 'VALIDATION'
      | 'EXPIRED'
      | 'REJECTED';
    escrow_address?: string;
    page: number;
    page_size: number;
    fields: string[];
    oracle_address?: string;
    chain_id?: number;
  };
  setFilterParams: (
    partialParams: Partial<JobsFilterStoreProps['filterParams']>
  ) => void;
  resetFilterParams: () => void;
  setSearchEscrowAddress: (escrow_address: string) => void;
  setOracleAddress: (oracleAddress: string) => void;
}

const initialFiltersState = {
  page: 0,
  page_size: 5,
  fields: ['reward_amount', 'job_description', 'reward_token'],
};

export const useJobsFilterStore = create<JobsFilterStoreProps>((set) => ({
  filterParams: initialFiltersState,
  setFilterParams: (
    partialParams: Partial<JobsFilterStoreProps['filterParams']>
  ) => {
    set((state) => ({
      ...state,
      filterParams: {
        ...state.filterParams,
        ...partialParams,
      },
    }));
  },
  resetFilterParams: () => {
    set({ filterParams: initialFiltersState });
  },
  setSearchEscrowAddress: (escrow_address: string) => {
    set((state) => ({
      ...state,
      filterParams: {
        ...state.filterParams,
        escrow_address,
      },
    }));
  },
  setOracleAddress: (oracleAddress: string) => {
    set((state) => ({
      ...state,
      filterParams: {
        ...state.filterParams,
        oracle_address: oracleAddress,
      },
    }));
  },
}));