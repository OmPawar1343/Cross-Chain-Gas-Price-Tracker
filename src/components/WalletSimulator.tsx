import React, { useState } from 'react';
import { Chain } from '../store/gasStore';

interface WalletSimulatorProps {
  onSimulate?: (amount: number, currency: string) => void;
}

const CHAIN_LABELS: Record<Chain, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
};

export const WalletSimulator: React.FC<WalletSimulatorProps> = ({ onSimulate }) => {
  const [amount, setAmount] = useState('0.5');
  const [currency, setCurrency] = useState<Chain>('ethereum');

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSimulate) onSimulate(Number(amount), currency);
  };

  const isInvalid = !amount || Number(amount) <= 0;

  return (
    <form onSubmit={handleSimulate} style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <label style={{ fontWeight: 500 }}>
        Amount:
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ marginLeft: 8, width: 100, padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
      </label>
      <label style={{ fontWeight: 500 }}>
        Chain:
        <select value={currency} onChange={e => setCurrency(e.target.value as Chain)} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}>
          {Object.entries(CHAIN_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        style={{ padding: '8px 24px', borderRadius: 6, background: isInvalid ? '#bbb' : '#26a69a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: isInvalid ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
        disabled={isInvalid}
      >
        Simulate
      </button>
    </form>
  );
}; 