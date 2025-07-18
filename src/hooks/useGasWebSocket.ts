import { useEffect } from 'react';
import { useGasStore, Chain, GasPoint } from '../store/gasStore';
import { Alchemy, Network } from 'alchemy-sdk';

const GAS_UPDATE_INTERVAL = 6000;

interface UseGasWebSocketOptions {
  onError?: (err: Error) => void;
}

const ALCHEMY_API_KEY = 'cVWydKeWnM0LP0Q8HUFVf';

const ALCHEMY_NETWORKS: Record<Chain, Network> = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
  arbitrum: Network.ARB_MAINNET,
};

export function useGasWebSocket(chain: Chain, opts?: UseGasWebSocketOptions) {
  const updateChain = useGasStore((s) => s.updateChain);
  const chainState = useGasStore((s) => s.chains[chain]);

  useEffect(() => {
    let didError = false;
    const alchemy = new Alchemy({ apiKey: ALCHEMY_API_KEY, network: ALCHEMY_NETWORKS[chain] });
    const interval = setInterval(async () => {
      try {
        const block = await alchemy.core.getBlock('latest');
        if (!block || !block.baseFeePerGas) return;
        const baseFee = typeof block.baseFeePerGas === 'string'
          ? Number(BigInt(block.baseFeePerGas) / 1_000_000_000n)
          : Number(block.baseFeePerGas) / 1e9;
        const priorityFee = 0;
        const newPoint: GasPoint = {
          timestamp: Date.now(),
          baseFee,
          priorityFee,
        };
        updateChain(chain, {
          baseFee,
          priorityFee,
          history: [...(chainState?.history || []), newPoint],
        });
      } catch (err) {
        if (!didError && opts?.onError) {
          didError = true;
          opts.onError(err instanceof Error ? err : new Error('Unknown error'));
        }
      }
    }, GAS_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [chain, updateChain, chainState, opts]);
}

export {}; 