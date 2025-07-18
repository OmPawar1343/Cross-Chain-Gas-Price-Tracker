import { useEffect } from 'react';
import { Contract, JsonRpcProvider } from 'ethers';
import { useGasStore } from '../store/gasStore';
import { UNISWAP_POOL, UNISWAP_ABI } from '../utils/uniswap';

const ALCHEMY_API_KEY = 'cVWydKeWnM0LP0Q8HUFVf';
const ETH_RPC = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export function useUniswapPrice(opts?: { onError?: (err: Error) => void }) {
  const setUsdPrice = useGasStore((s: { setUsdPrice: (price: number) => void }) => s.setUsdPrice);

  useEffect(() => {
    let didError = false;
    const provider = new JsonRpcProvider(ETH_RPC);
    const pool = new Contract(UNISWAP_POOL, UNISWAP_ABI, provider);

    const handleSlot0 = async () => {
      try {
        const slot0 = await pool.slot0();
        const sqrtPriceX96 = BigInt(slot0[0]);
        const price = Number((sqrtPriceX96 * sqrtPriceX96 * 1_000_000_000_000n) / (BigInt(2) ** 192n)) / 1_000_000;
        setUsdPrice(price);
      } catch (err) {
        if (!didError && opts?.onError) {
          didError = true;
          opts.onError(err instanceof Error ? err : new Error('Uniswap price fetch error'));
        }
      }
    };

    handleSlot0();
    const interval = setInterval(handleSlot0, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [setUsdPrice, opts]);
} 