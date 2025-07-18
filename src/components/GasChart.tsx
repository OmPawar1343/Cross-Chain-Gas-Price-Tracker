import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, UTCTimestamp } from 'lightweight-charts';

interface GasChartProps {
  history: Array<{ timestamp: number; baseFee: number; priorityFee: number }>;
}

function aggregateCandles(history: GasChartProps['history']) {
  const interval = 15 * 60 * 1000;
  const buckets: Record<number, number[]> = {};
  history.forEach(point => {
    const bucket = Math.floor(point.timestamp / interval) * interval;
    if (!buckets[bucket]) buckets[bucket] = [];
    buckets[bucket].push(point.baseFee);
  });
  return Object.entries(buckets).map(([bucket, values]) => {
    const open = values[0];
    const close = values[values.length - 1];
    const high = Math.max(...values);
    const low = Math.min(...values);
    return {
      time: Math.floor(Number(bucket) / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
    };
  });
}

export const GasChart: React.FC<GasChartProps> = ({ history }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.remove();
      chartInstance.current = null;
    }
    chartInstance.current = createChart(chartRef.current, {
      height: 400,
      width: chartRef.current.offsetWidth,
      layout: { background: { color: '#f5f5f5' } },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    // Use the open-source API
    seriesRef.current = (chartInstance.current as any).addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    return () => {
      chartInstance.current?.remove();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    const candles = aggregateCandles(history);
    seriesRef.current.setData(candles);
  }, [history]);

  return (
    <div ref={chartRef} style={{ height: 400, width: '100%', background: '#f5f5f5', borderRadius: 8 }} />
  );
}; 