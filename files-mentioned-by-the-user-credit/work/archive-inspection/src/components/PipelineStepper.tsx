import React from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  PlusCircle,
  Lock,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export const PipelineStepper: React.FC = () => {
  const { currentPath, navigate, tx } = useEconomic();

  // Do NOT show the detailed stepper on Overview, as Overview has its own dedicated Transaction Lifecycle section
  if (currentPath === '/' || currentPath === '/overview') {
    return null;
  }

  // Only display stepper when in transaction flows or related workflows
  const isTxWorkflow =
    currentPath.startsWith('/transactions') ||
    currentPath.startsWith('/settlement') ||
    currentPath.startsWith('/ledger');

  if (!isTxWorkflow) {
    return null;
  }

  const isTxPage =
    currentPath.startsWith('/transactions/') &&
    !currentPath.includes('/new') &&
    !currentPath.includes('/create');

  const steps = [
    {
      id: 1,
      name: 'Create',
      path: '/transactions/new',
      icon: PlusCircle,
      activeWhen: currentPath === '/transactions/new' || currentPath === '/transactions/create',
      completedWhen: true,
    },
    {
      id: 2,
      name: 'Reserve',
      path: `/transactions/${tx.id}`,
      icon: Lock,
      activeWhen:
        isTxPage &&
        !currentPath.includes('/exception') &&
        !currentPath.includes('/settlement') &&
        !currentPath.includes('/settled') &&
        tx.state === 'RESERVED',
      completedWhen: tx.state !== 'DRAFT',
    },
    {
      id: 3,
      name: 'Deliver',
      path: `/transactions/${tx.id}`,
      icon: UploadCloud,
      activeWhen:
        isTxPage &&
        !currentPath.includes('/exception') &&
        !currentPath.includes('/settlement') &&
        !currentPath.includes('/settled') &&
        tx.state === 'SUBMITTED',
      completedWhen: [
        'SUBMITTED',
        'VERIFYING',
        'EXCEPTION_DETECTED',
        'RECOMMENDED',
        'APPROVED',
        'SETTLED',
      ].includes(tx.state),
    },
    {
      id: 4,
      name: 'Verify',
      path: `/transactions/${tx.id}`,
      icon: CheckCircle,
      activeWhen:
        currentPath.endsWith('/verify') ||
        tx.state === 'VERIFYING' ||
        (isTxPage && tx.state === 'SUBMITTED'),
      completedWhen: [
        'EXCEPTION_DETECTED',
        'RECOMMENDED',
        'APPROVED',
        'SETTLED',
      ].includes(tx.state),
    },
    {
      id: 5,
      name: 'Exception',
      path: `/transactions/${tx.id}/exception`,
      icon: AlertTriangle,
      activeWhen:
        currentPath.endsWith('/exception') ||
        (isTxPage &&
          tx.state === 'EXCEPTION_DETECTED' &&
          !currentPath.includes('/settlement') &&
          !currentPath.includes('/settled')),
      completedWhen: ['RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state),
    },
    {
      id: 6,
      name: 'Review',
      path: `/transactions/${tx.id}/settlement`,
      icon: FileSearch,
      activeWhen:
        currentPath.endsWith('/settlement') &&
        (tx.state === 'RECOMMENDED' || tx.state === 'APPROVED'),
      completedWhen: tx.state === 'SETTLED',
    },
    {
      id: 7,
      name: 'Settle',
      path: `/settlement`,
      icon: CheckCircle2,
      activeWhen: currentPath === '/settlement' || (isTxPage && tx.state === 'APPROVED'),
      completedWhen: tx.state === 'SETTLED',
    },
    {
      id: 8,
      name: 'Ledger',
      path: `/ledger`,
      icon: FileCheck2,
      activeWhen: currentPath === '/ledger' || currentPath.endsWith('/settled'),
      completedWhen: tx.state === 'SETTLED',
    },
  ];

  return (
    <div className="bg-[#141824] border-b border-[#262a35] px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max text-xs">
          <span className="text-[11px] font-medium text-[#939183] mr-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-[#e4e1a9] rounded-full mr-1.5" />
            Transaction Lifecycle:
          </span>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.activeWhen;
            const isDone = step.completedWhen;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => navigate(step.path)}
                  className={`flex items-center px-2 py-1 rounded transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#e4e1a9] text-[#171b26] font-semibold shadow-sm'
                      : isDone
                      ? 'bg-[#1b1f2a] text-[#dfe2f0] hover:bg-[#262a35]'
                      : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 mr-1.5 ${
                      isCurrent
                        ? 'text-[#171b26]'
                        : isDone
                        ? 'text-[#c8c58f]'
                        : 'text-[#939183]'
                    }`}
                  />
                  <span>
                    <span className="text-[10px] mr-1 opacity-70">
                      {step.id}.
                    </span>
                    {step.name}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <span className="text-[#3b4152] text-xs">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
