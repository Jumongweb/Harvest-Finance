'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Trophy,
  Sparkles,
  Wifi,
  WifiOff,
  Activity,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useVaultRealtime, VaultActivityEvent, VaultActivityType } from '@/hooks/useVaultRealtime';
import { formatDistanceToNow } from 'date-fns';

const activityConfig: Record<
  VaultActivityType,
  { icon: React.FC<{ className?: string }>; color: string; label: string; bgColor: string }
> = {
  deposit: {
    icon: ArrowUpRight,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    label: 'Deposit',
  },
  withdrawal: {
    icon: ArrowDownLeft,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    label: 'Withdrawal',
  },
  milestone: {
    icon: Trophy,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    label: 'Milestone',
  },
  ai_insight: {
    icon: Sparkles,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'AI Insight',
  },
};

function ActivityItem({ event }: { event: VaultActivityEvent }) {
  const config = activityConfig[event.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
    >
      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">{event.vaultName}</p>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {event.type === 'deposit' && event.amount !== undefined && (
            <span>
              <span className="font-medium text-emerald-600">+${event.amount.toLocaleString()}</span>
              {event.newBalance !== undefined && (
                <span className="text-gray-400"> · Balance: ${event.newBalance.toLocaleString()}</span>
              )}
            </span>
          )}
          {event.type === 'withdrawal' && event.amount !== undefined && (
            <span>
              <span className="font-medium text-amber-600">-${event.amount.toLocaleString()}</span>
              {event.newBalance !== undefined && (
                <span className="text-gray-400"> · Balance: ${event.newBalance.toLocaleString()}</span>
              )}
            </span>
          )}
          {event.type === 'milestone' && event.milestone}
          {event.type === 'ai_insight' && event.insight}
        </p>
      </div>
      <Badge
        variant="outline"
        className={`text-xs flex-shrink-0 ${config.color} border-current`}
      >
        {config.label}
      </Badge>
    </motion.div>
  );
}

export function VaultActivityFeed() {
  const { isConnected, activities, clearActivities } = useVaultRealtime({ maxActivityItems: 15 });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-harvest-green-600" />
            Live Vault Activity
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time updates from all vault actions.</p>
        </div>
        <div className="flex items-center gap-3">
          {activities.length > 0 && (
            <button
              onClick={clearActivities}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Live
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Card variant="default">
        <CardBody className="p-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {isConnected ? 'Listening for vault activity…' : 'Connecting to live feed…'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Updates appear here instantly when deposits, withdrawals, or milestones occur.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {activities.map((event, i) => (
                <ActivityItem key={`${event.vaultId}-${event.timestamp}-${i}`} event={event} />
              ))}
            </AnimatePresence>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
