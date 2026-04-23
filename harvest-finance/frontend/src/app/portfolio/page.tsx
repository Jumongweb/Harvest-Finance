'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Wallet, PieChart } from 'lucide-react';
import { 
  Container, 
  Section, 
  Stack, 
  Button, 
  Card, 
  CardBody, 
  Badge 
} from '@/components/ui';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';
import { TransactionTable } from '@/components/portfolio/TransactionTable';
import { MOCK_STATS, MOCK_TRANSACTIONS } from '@/lib/mock-data';

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header / Navigation Overlay */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 mb-8">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 border-l border-gray-200 pl-4">
                My Portfolio
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
              <Button variant="primary" size="sm" leftIcon={<Wallet className="w-4 h-4" />}>
                Connect Wallet
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          <Card variant="default" className="md:max-w-xs">
            <CardBody className="p-6">
              <Stack gap="md">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" size="sm">3 Vaults</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Asset Allocation</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-2 w-1/2 bg-harvest-green-500 rounded-full" />
                    <div className="h-2 w-1/4 bg-blue-500 rounded-full" />
                    <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </Stack>
            </CardBody>
          </Card>

          <Section paddingY="none">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
              <p className="text-gray-500">Track your assets, earnings, and performance across all Harvest vaults.</p>
            </div>
            <PortfolioOverview stats={MOCK_STATS} />
          </Section>

          <Section paddingY="none">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-gray-500">A detailed log of your deposits, withdrawals, and reward claims.</p>
            </div>
            <TransactionTable transactions={MOCK_TRANSACTIONS} />
          </Section>
        </motion.div>
      </Container>
    </main>
  );
}
