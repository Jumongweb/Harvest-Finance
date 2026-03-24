'use client';

import { WalletButton, BalanceDisplay } from '@/components/wallet';
import { Card, CardHeader, CardBody, Container, Badge } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-harvest-green-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <Container size="xl">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-harvest-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HF</span>
              </div>
              <span className="font-semibold text-gray-900">Harvest Finance</span>
            </div>
            <WalletButton />
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main>
        <Container size="xl" className="py-8 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="primary" isPill className="mb-4">
              DeFi for Agriculture
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Empowering Farmers Through Blockchain
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A decentralized platform connecting farmers, buyers, and inspectors
              for transparent agricultural finance.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-1">
              <BalanceDisplay />
            </div>

            {/* Stats Cards */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
              <Card variant="default" padding="lg">
                <CardHeader
                  title="Active Vaults"
                  subtitle="Currently earning yield"
                />
                <CardBody>
                  <p className="text-3xl font-bold text-harvest-green-600">3</p>
                </CardBody>
              </Card>

              <Card variant="default" padding="lg">
                <CardHeader
                  title="Total Deposited"
                  subtitle="Across all vaults"
                />
                <CardBody>
                  <p className="text-3xl font-bold text-harvest-green-600">$750.00</p>
                </CardBody>
              </Card>

              <Card variant="default" padding="lg">
                <CardHeader
                  title="Pending Rewards"
                  subtitle="Available to claim"
                />
                <CardBody>
                  <p className="text-3xl font-bold text-emerald-600">$12.50</p>
                </CardBody>
              </Card>

              <Card variant="default" padding="lg">
                <CardHeader
                  title="APY Average"
                  subtitle="Weighted by deposit"
                />
                <CardBody>
                  <p className="text-3xl font-bold text-blue-600">8.5%</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
