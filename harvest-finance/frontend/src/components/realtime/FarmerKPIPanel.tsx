'use client';

import React from 'react';
import { Card, CardBody, Stack } from '@/components/ui';
import { Coins, Sprout, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FarmerMetrics, CropYield } from '@/hooks/useRealtimeAnalytics';

interface FarmerKPIPanelProps {
  metrics: FarmerMetrics | null;
  connected: boolean;
}

function fmt(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

const PROGRESS_COLOR = (pct: number) =>
  pct >= 75 ? '#16a34a' : pct >= 40 ? '#d97706' : '#2563eb';

export const FarmerKPIPanel: React.FC<FarmerKPIPanelProps> = ({ metrics, connected }: FarmerKPIPanelProps) => {
  return (
    <Stack gap="lg">
      {/* Connection badge */}
      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <><Wifi className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Live</span></>
        ) : (
          <><WifiOff className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Connecting…</span></>
        )}
      </div>

      {/* Summary KPIs */}
      {metrics ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm">
              <CardBody className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Savings</p>
                  <p className="text-xl font-bold text-gray-900">{fmt(metrics.totalSavings)}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="border-none shadow-sm">
              <CardBody className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Rewards</p>
                  <p className="text-xl font-bold text-gray-900">{fmt(metrics.totalRewards)}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="border-none shadow-sm">
              <CardBody className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Farm Vaults</p>
                  <p className="text-xl font-bold text-gray-900">{metrics.activeFarmVaults}</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Crop yield progress chart */}
          {metrics.cropYields.length > 0 && (
            <Card className="border-none shadow-sm">
              <CardBody>
                <p className="text-sm font-semibold text-gray-700 mb-4">Crop Yield Progress</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics.cropYields} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip
                      formatter={(val: number, _name: string, props: any) => [
                        `${val}% — projected yield: ${fmt(props.payload.projectedYield)}`,
                        'Progress',
                      ]}
                    />
                    <Bar dataKey="progressPercent" radius={[0, 4, 4, 0]}>
                      {metrics.cropYields.map((entry: CropYield, i: number) => (
                        <Cell key={i} fill={PROGRESS_COLOR(entry.progressPercent)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Milestone table */}
                <div className="mt-4 space-y-2">
                  {metrics.cropYields.map((cy: CropYield) => (
                    <div key={cy.vaultId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{cy.name}</span>
                      <div className="flex items-center gap-4 text-right">
                        <span className="text-gray-500">Balance: {fmt(cy.balance)}</span>
                        <span className="font-semibold text-green-700">+{fmt(cy.projectedYield)} yield</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400">Waiting for metrics…</p>
      )}
    </Stack>
  );
};
