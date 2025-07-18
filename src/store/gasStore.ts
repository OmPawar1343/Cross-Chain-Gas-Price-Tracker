import { create } from 'zustand';

export type Chain = 'ethereum' | 'polygon' | 'arbitrum';

export interface GasPoint {
  timestamp: number;
  baseFee: number;
  priorityFee: number;
}

interface ChainState {
  baseFee: number;
  priorityFee: number;
  history: GasPoint[];
}

interface GasStore {
  mode: 'live' | 'simulation';
  chains: Record<Chain, ChainState>;
  usdPrice: number;
  setMode: (mode: 'live' | 'simulation') => void;
  updateChain: (chain: Chain, data: Partial<ChainState>) => void;
  setUsdPrice: (price: number) => void;
}

export const useGasStore = create<GasStore>((set) => ({
  mode: 'live',
  chains: {
    ethereum: { baseFee: 0, priorityFee: 0, history: [] },
    polygon: { baseFee: 0, priorityFee: 0, history: [] },
    arbitrum: { baseFee: 0, priorityFee: 0, history: [] },
  },
  usdPrice: 0,
  setMode: (mode) => set({ mode }),
  updateChain: (chain, data) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: { ...state.chains[chain], ...data },
      },
    })),
  setUsdPrice: (price) => set({ usdPrice: price }),
}));

export {}; 