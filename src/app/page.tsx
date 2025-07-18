"use client";
import React, { useState } from 'react';
import { useGasWebSocket } from '../hooks/useGasWebSocket';
import { useUniswapPrice } from '../hooks/useUniswapPrice';
import { useGasStore, Chain } from '../store/gasStore';
import { GasChart } from '../components/GasChart';
import { GasTable } from '../components/GasTable';
import { WalletSimulator } from '../components/WalletSimulator';

const CHAIN_LABELS: Record<Chain, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
};

export default function Home() {
  useGasWebSocket('ethereum');
  useGasWebSocket('polygon');
  useGasWebSocket('arbitrum');
  useUniswapPrice();

  const { chains, usdPrice } = useGasStore();
  const ethHistory = chains.ethereum.history;

  const [sim, setSim] = useState<{ amount: number; chain: Chain } | null>(null);
  const handleSimulate = (amount: number, chain: string) => {
    setSim({ amount, chain: chain as Chain });
  };

  let simRows: Array<{ chain: Chain; gasCost: number; totalCost: number; usd: number }> = [];
  if (sim) {
    const gasLimit = 21000;
    simRows = (Object.keys(chains) as Chain[]).map((chain) => {
      const { baseFee, priorityFee } = chains[chain];
      const gasCost = (baseFee + priorityFee) * gasLimit / 1e9;
      const totalCost = gasCost + (chain === sim.chain ? sim.amount : 0);
      const usd = totalCost * usdPrice;
      return { chain, gasCost, totalCost, usd };
    });
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', color: '#111' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, letterSpacing: -1 }}>⛽ Cross-Chain Gas Price Tracker</h1>
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Wallet Simulation</h2>
        <div style={{ boxShadow: '0 2px 8px #0001', borderRadius: 10, background: '#fff', padding: 20 }}>
          <WalletSimulator onSimulate={handleSimulate} />
          {sim && (
            <div style={{ margin: '16px 0', padding: 16, background: '#e3f2fd', borderRadius: 8 }}>
              <h3 style={{ margin: 0, fontWeight: 500 }}>Simulation Results for {sim.amount} {sim.chain.toUpperCase()} Transfer</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8 }}>Chain</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Gas Cost</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Total (Token)</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {simRows.map(row => (
                    <tr key={row.chain}>
                      <td style={{ padding: 8 }}>{CHAIN_LABELS[row.chain]}</td>
                      <td style={{ textAlign: 'right', padding: 8 }}>{row.gasCost.toFixed(6)}</td>
                      <td style={{ textAlign: 'right', padding: 8 }}>{row.totalCost.toFixed(6)}</td>
                      <td style={{ textAlign: 'right', padding: 8 }}>${row.usd.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Live Gas Price Comparison</h2>
        <div style={{ boxShadow: '0 2px 8px #0001', borderRadius: 10, background: '#fff', padding: 20 }}>
          <GasTable chains={{
            ethereum: { baseFee: chains.ethereum.baseFee, priorityFee: chains.ethereum.priorityFee },
            polygon: { baseFee: chains.polygon.baseFee, priorityFee: chains.polygon.priorityFee },
            arbitrum: { baseFee: chains.arbitrum.baseFee, priorityFee: chains.arbitrum.priorityFee },
          }} usdPrice={usdPrice} />
        </div>
      </section>
      <section>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Gas Price Volatility (15-min Candles)</h2>
        <div style={{ boxShadow: '0 2px 8px #0001', borderRadius: 10, background: '#fff', padding: 20 }}>
          <GasChart history={ethHistory} />
        </div>
      </section>
    </main>
  );
} 