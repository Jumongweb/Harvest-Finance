'use client';

import React from 'react';
import { Card, CardBody, Stack } from '@/components/ui';
import { Users, Landmark, ArrowDownLeft, BarChart3, Coins, Wifi, WifiOff } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { PlatformMetrics, RecentTransaction } from '@/hooks/useRealtimeAnalytics';

interface LivePlatformMetricsProps {
  metrics: PlatformMetrics | null;
  connected: boolean;
  /** Rolling history of snapshots for the trend sparkline */
  history: PlatformMetrics[];
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const KPI_CARDS = (m: PlatformMetrics) => [
  { label: 'Total Users',       value: m.totalUsers.toString(),        icon: <Users className="w-5 h-5 text-blue-600" />,   bg: 'bg-blue-50' },
  { label: 'Active Users',      value: m.activeUsers.toString(),       icon: <Users className="w-5 h-5 text-green-600" />,  bg: 'bg-green-50' },
  { label: 'Total Deposits',    value: fmt(m.totalDeposits),           icon: <Landmark className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
  { label: 'Total Withdrawals', value: fmt(m.totalWithdrawals),        icon: <ArrowDownLeft className="w-5 h-5 text-red-500" />, bg: 'bg-red-50' },
  { label: 'Active Vaults',     value: m.activeVaults.toString(),      icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
  { label: 'Total Rewards',     value: fmt(m.totalRewards),            icon: <Coins className="w-5 h-5 text-amber-600" />,  bg: 'bg-amber-50' },
];

function TransactionFeed({ items, label }: { items: RecentTransaction[]; label: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No recent activity</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((t) => (
            <li key={t.id} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate max-w-[60%]">{t.vaultName}</span>
              <span className="font-semibold text-gray-900">{fmt(t.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const LivePlatformMetrics: React.FC<LivePlatformMetricsProps> = ({
  metrics,
  connected,
  history,
}: LivePlatformMetricsProps) => {
  const sparkData = history.map((h: PlatformMetrics) => ({
    t: timeLabel(h.timestamp),
    deposits: h.totalDeposits,
    users: h.totalUsers,
  }));

  return (
    <Stack gap="lg">
      {/* Connection status */}
      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <><Wifi className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Live</span></>
        ) : (
          <><WifiOff className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Connecting…</span></>
        )}
        {metrics && (
          <span className="text-gray-400 ml-2">Last update: {timeLabel(metrics.timestamp)}</span>
        )}
      </div>

      {/* KPI cards */}
      {metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {KPI_CARDS(metrics).map((kpi, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardBody className="p-3">
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-2`}>
                  {kpi.icon}
                </div>
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Waiting for first snapshot…</p>
      )}

      {/* Trend sparkline */}
      {sparkData.length > 1 && (
        <Card className="border-none shadow-sm">
          <CardBody>
            <p className="text-sm font-semibold text-gray-700 mb-3">Deposit trend (live)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={sparkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => fmt(v)} width={60} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Line type="monotone" dataKey="deposits" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      {/* Recent activity feeds */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-none shadow-sm">
            <CardBody>
              <TransactionFeed items={metrics.recentDeposits} label="Recent Deposits" />
            </CardBody>
          </Card>
          <Card className="border-none shadow-sm">
            <CardBody>
              <TransactionFeed items={metrics.recentWithdrawals} label="Recent Withdrawals" />
            </CardBody>
          </Card>
        </div>
      )}
    </Stack>
  );
};
