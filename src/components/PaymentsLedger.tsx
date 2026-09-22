import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Icon } from './ui/icon';
import { MetricCard } from './ui/metric-card';
import { BadgeGroup } from './ui/badge-group';
import { EmptyState } from './ui/empty-state';
import { formatCurrency } from '../lib/utils';

export const PaymentsLedger: React.FC = () => {
  const { transactions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const totalVolume = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((acc, t) => acc + t.amount, 0);

  const refundedVolume = transactions
    .filter(t => t.status === 'REFUNDED')
    .reduce((acc, t) => acc + t.amount, 0);

  const successfulCount = transactions.filter(t => t.status === 'SUCCESS').length;

  const filteredTransactions = transactions.filter((t) =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.idempotencyKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div className="space-y-3">
          <BadgeGroup
            badge="PAYMENT SERVICE"
            message="Port 8086 • Idempotent Financial Settlement"
            variant="brand"
            showArrow={false}
          />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
            Financial Ledger
          </h2>
          <p className="text-sm text-neutral-600">
            Real-time transaction capture, cryptographic idempotency tracking, and automated refund ledger.
          </p>
        </div>
      </div>

      {/* Untitled UI KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="Settled Volume"
          value={formatCurrency(totalVolume)}
          change="+24.8%"
          trend="up"
          subtext={`${successfulCount} Successful captured charges`}
          icon="payments"
          progressPercent={92}
        />

        <MetricCard
          label="Refunds Dispatched"
          value={formatCurrency(refundedVolume)}
          change="0 Overpayments"
          trend="neutral"
          subtext={`${transactions.filter(t => t.status === 'REFUNDED').length} Automated refund rollbacks`}
          icon="replay"
          progressPercent={10}
        />

        <MetricCard
          label="Idempotency Deduplication"
          value="100.0%"
          change="Zero Collisions"
          trend="up"
          subtext="Cryptographic SHA-256 Keys"
          icon="verified_user"
          progressPercent={100}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Icon name="search" size={18} className="absolute left-4 top-3 text-neutral-400" />
          <Input
            placeholder="Search by Transaction ID, PNR, or receipt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-full bg-white border-neutral-200 text-xs font-mono placeholder:text-neutral-400 focus:bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Transactions List or Empty State */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="No transactions found"
            description={searchTerm ? `No financial records match "${searchTerm}".` : "No transactions recorded yet."}
            actionText="Clear Search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white border border-neutral-200/90 hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md"
            >
              <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-6">
                <div className="font-mono">
                  <div className="font-black text-base text-black">{t.id}</div>
                  <div className="text-[10px] text-neutral-400">{t.receiptNumber}</div>
                </div>

                <div>
                  <div className="font-bold text-black text-sm">{t.travelerName}</div>
                  <div className="text-xs text-neutral-500 font-mono">PNR: {t.pnr} &bull; Method: {t.method}</div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <div className="text-right font-mono">
                  <div className="text-lg font-black text-black">{formatCurrency(t.amount)}</div>
                  <div className="text-[10px] text-neutral-400">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <Badge
                  variant={t.status === 'SUCCESS' ? 'success' : t.status === 'REFUNDED' ? 'destructive' : 'secondary'}
                  showDot
                  className="rounded-full text-[10px]"
                >
                  {t.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
