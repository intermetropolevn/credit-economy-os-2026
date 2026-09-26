import { TransactionState } from '../types';

export interface StatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}

export function getDisplayStatus(state: TransactionState): StatusConfig {
  switch (state) {
    case 'DRAFT':
      return {
        label: 'Draft',
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        dotClass: 'bg-neutral-400',
        description: 'Transaction details configured, not yet submitted',
      };
    case 'RESERVED':
      return {
        label: 'Reserved',
        badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        dotClass: 'bg-blue-400',
        description: 'Credits locked in escrow, awaiting deliverables',
      };
    case 'SUBMITTED':
      return {
        label: 'Verification Required',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        dotClass: 'bg-amber-400',
        description: 'Deliverables submitted, ready for verification',
      };
    case 'VERIFYING':
      return {
        label: 'In Progress',
        badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
        dotClass: 'bg-cyan-400 animate-pulse',
        description: 'AI verification actively checking evidence',
      };
    case 'EXCEPTION_DETECTED':
      return {
        label: 'Exception',
        badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
        dotClass: 'bg-orange-400',
        description: 'Deliverable discrepancy detected, review needed',
      };
    case 'RECOMMENDED':
      return {
        label: 'Review Required',
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
        dotClass: 'bg-yellow-400',
        description: 'Verification complete, recommended action pending approval',
      };
    case 'APPROVED':
      return {
        label: 'Approved',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        dotClass: 'bg-emerald-400',
        description: 'Approved by authorized officer, ready to settle',
      };
    case 'SETTLED':
      return {
        label: 'Settled',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        dotClass: 'bg-emerald-400',
        description: 'Credits disbursed and recorded in ledger',
      };
    default:
      return {
        label: state,
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        dotClass: 'bg-neutral-400',
        description: 'State updated',
      };
  }
}
