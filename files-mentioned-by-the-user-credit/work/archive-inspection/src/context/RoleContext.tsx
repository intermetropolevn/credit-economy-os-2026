import React, { createContext, useContext, useState } from 'react';

export type AdminRole =
  | 'TREASURY_ADMIN'
  | 'RISK_OFFICER'
  | 'MONETIZATION_LEAD'
  | 'GROWTH_DIRECTOR'
  | 'CHIEF_AUDITOR';

export interface RolePermission {
  role: AdminRole;
  displayName: string;
  department: string;
  canSettleDisbursals: boolean;
  canReleaseRiskHolds: boolean;
  canModifyPricing: boolean;
  canCreateRewardRules: boolean;
  canAdjustBudgets: boolean;
  canDualSign: boolean;
  isReadOnly: boolean;
}

const roleDefinitions: Record<AdminRole, RolePermission> = {
  TREASURY_ADMIN: {
    role: 'TREASURY_ADMIN',
    displayName: 'Elena Vance',
    department: 'Treasury & Reserve Operations',
    canSettleDisbursals: true,
    canReleaseRiskHolds: false,
    canModifyPricing: false,
    canCreateRewardRules: false,
    canAdjustBudgets: true,
    canDualSign: true,
    isReadOnly: false,
  },
  RISK_OFFICER: {
    role: 'RISK_OFFICER',
    displayName: 'Marcus Kane',
    department: 'Risk & Invariant Enforcement',
    canSettleDisbursals: false,
    canReleaseRiskHolds: true,
    canModifyPricing: false,
    canCreateRewardRules: false,
    canAdjustBudgets: false,
    canDualSign: true,
    isReadOnly: false,
  },
  MONETIZATION_LEAD: {
    role: 'MONETIZATION_LEAD',
    displayName: 'Aria Sterling',
    department: 'Product Monetization & Pricing',
    canSettleDisbursals: false,
    canReleaseRiskHolds: false,
    canModifyPricing: true,
    canCreateRewardRules: false,
    canAdjustBudgets: false,
    canDualSign: false,
    isReadOnly: false,
  },
  GROWTH_DIRECTOR: {
    role: 'GROWTH_DIRECTOR',
    displayName: 'Devon Miller',
    department: 'Growth & Developer Relations',
    canSettleDisbursals: false,
    canReleaseRiskHolds: false,
    canModifyPricing: false,
    canCreateRewardRules: true,
    canAdjustBudgets: false,
    canDualSign: false,
    isReadOnly: false,
  },
  CHIEF_AUDITOR: {
    role: 'CHIEF_AUDITOR',
    displayName: 'Sophia Laurent',
    department: 'Cryptographic & Financial Audit',
    canSettleDisbursals: false,
    canReleaseRiskHolds: false,
    canModifyPricing: false,
    canCreateRewardRules: false,
    canAdjustBudgets: false,
    canDualSign: false,
    isReadOnly: true,
  },
};

interface RoleContextType {
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;
  permission: RolePermission;
  availableRoles: RolePermission[];
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<AdminRole>('TREASURY_ADMIN');

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        permission: roleDefinitions[currentRole],
        availableRoles: Object.values(roleDefinitions),
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
