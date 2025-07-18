import React from 'react';
import { Chain } from '../store/gasStore';

interface GasTableProps {
  chains: Record<Chain, { baseFee: number; priorityFee: number }>;
  usdPrice: number;
}

const CHAIN_LABELS: Record<Chain, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
};

export const GasTable: React.FC<GasTableProps> = ({ chains, usdPrice }) => {
  const gasLimit = 21000;
  return (
    <div style={{ margin: '24px 0', padding: 16, background: '#fafafa', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Chain</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Base Fee (Gwei)</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Priority Fee (Gwei)</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Total Gas (Gwei)</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Est. USD Cost</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(chains).map(([chain, { baseFee, priorityFee }]) => {
            const totalGwei = (baseFee + priorityFee) * gasLimit;
            const totalEth = totalGwei / 1e9;
            const usdCost = totalEth * usdPrice;
            return (
              <tr key={chain}>
                <td style={{ padding: 8 }}>{CHAIN_LABELS[chain as Chain]}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{baseFee.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{priorityFee.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{totalGwei.toLocaleString()}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>${usdCost.toFixed(4)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; 