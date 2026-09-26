import React from 'react';
import { EconomicProvider, useEconomic } from './context/EconomicContext';
import { RoleProvider } from './context/RoleContext';
import { Header } from './components/Header';
import { PipelineStepper } from './components/PipelineStepper';
import { EconomicIntegrityAlert } from './components/EconomicIntegrityAlert';
import { OverviewScreen } from './screens/OverviewScreen';
import { UsersListScreen } from './screens/UsersListScreen';
import { UserControlCenterScreen } from './screens/UserControlCenterScreen';
import { TransactionsListScreen } from './screens/TransactionsListScreen';
import { CreateTransactionScreen } from './screens/CreateTransactionScreen';
import { TransactionDetailScreen } from './screens/TransactionDetailScreen';
import { ExceptionReviewScreen } from './screens/ExceptionReviewScreen';
import { SettlementRecommendationScreen } from './screens/SettlementRecommendationScreen';
import { FinalSettlementScreen } from './screens/FinalSettlementScreen';
import { SettlementScreen } from './screens/SettlementScreen';
import { LedgerScreen } from './screens/LedgerScreen';
import { AIOperatorScreen } from './screens/AIOperatorScreen';
import { CreditTypesScreen } from './screens/CreditTypesScreen';
import { CreditTypeDetailScreen } from './screens/CreditTypeDetailScreen';
import { RewardRulesScreen } from './screens/RewardRulesScreen';
import { RewardRuleBuilderScreen } from './screens/RewardRuleBuilderScreen';
import { SpendProductsScreen } from './screens/SpendProductsScreen';
import { PricingScreen } from './screens/PricingScreen';
import { WalletPoliciesScreen } from './screens/WalletPoliciesScreen';
import { RiskPoliciesScreen } from './screens/RiskPoliciesScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { EconomyHealthScreen } from './screens/EconomyHealthScreen';
import { AuditLogScreen } from './screens/AuditLogScreen';
import { ImpactSimulationScreen } from './screens/ImpactSimulationScreen';
import { OrganizationsListScreen } from './screens/OrganizationsListScreen';
import { OrganizationDetailScreen } from './screens/OrganizationDetailScreen';
import { ProgramsHubScreen } from './screens/ProgramsHubScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { PoolDetailScreen } from './screens/PoolDetailScreen';
import { PoolsHubScreen } from './screens/PoolsHubScreen';
import { CreditWalletScreen } from './screens/CreditWalletScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { AIIntegrationsScreen } from './screens/AIIntegrationsScreen';
import { HeroEndToEndDemoScreen } from './screens/HeroEndToEndDemoScreen';
import { ExperiencesScreen } from './screens/ExperiencesScreen';
import { HackathonDemoBar } from './components/HackathonDemoBar';

const MainRouter: React.FC = () => {
  const { currentPath } = useEconomic();

  const renderScreen = () => {
    // 1. Overview
    if (currentPath === '/' || currentPath === '/overview') {
      return <OverviewScreen />;
    }

    // Consumer Credit Wallet & MCP AI Agent Layer
    if (currentPath === '/wallet' || currentPath.startsWith('/wallet')) {
      return <CreditWalletScreen />;
    }

    // Users Management & Control Center
    if (currentPath === '/users') {
      return <UsersListScreen />;
    }
    if (currentPath.startsWith('/users/')) {
      return <UserControlCenterScreen />;
    }

    // 2. Credit Types
    if (currentPath === '/credit-types') {
      return <CreditTypesScreen />;
    }

    // 3. Credit Type Detail
    if (currentPath.startsWith('/credit-types/')) {
      return <CreditTypeDetailScreen />;
    }

    // 4. Reward Rules
    if (currentPath === '/reward-rules') {
      return <RewardRulesScreen />;
    }

    // 5. Reward Rule Builder
    if (currentPath === '/reward-rules/new' || currentPath === '/reward-rule-builder') {
      return <RewardRuleBuilderScreen />;
    }

    // 6. Spend Products
    if (currentPath === '/spend-products') {
      return <SpendProductsScreen />;
    }

    // 7. Pricing
    if (currentPath === '/pricing') {
      return <PricingScreen />;
    }

    // 8. Wallet Policies
    if (currentPath === '/wallet-policies') {
      return <WalletPoliciesScreen />;
    }

    // 9. Risk Policies
    if (currentPath === '/risk-policies') {
      return <RiskPoliciesScreen />;
    }

    // 10. Budget
    if (currentPath === '/budget') {
      return <BudgetScreen />;
    }

    // 11. Economy Health
    if (currentPath === '/economy-health') {
      return <EconomyHealthScreen />;
    }

    // 12. Transactions List
    if (currentPath === '/transactions') {
      return <TransactionsListScreen />;
    }

    // Transaction Creation
    if (currentPath === '/transactions/new' || currentPath === '/transactions/create') {
      return <CreateTransactionScreen />;
    }

    // 14. Settlement Console
    if (currentPath === '/settlement') {
      return <SettlementScreen />;
    }
    if (currentPath.endsWith('/settled')) {
      return <FinalSettlementScreen />;
    }
    if (currentPath.endsWith('/settlement')) {
      return <SettlementRecommendationScreen />;
    }
    if (currentPath.endsWith('/exception')) {
      return <ExceptionReviewScreen />;
    }

    // 13. Transaction Detail
    if (currentPath.startsWith('/transactions/')) {
      return <TransactionDetailScreen />;
    }

    // 15. Ledger
    if (currentPath === '/ledger') {
      return <LedgerScreen />;
    }

    // 16. Audit Log
    if (currentPath === '/audit-log' || currentPath === '/audit') {
      return <AuditLogScreen />;
    }

    // 17. AI Economic Operator
    if (currentPath === '/agents' || currentPath === '/operator') {
      return <AIOperatorScreen />;
    }

    // Organizations & Vendors
    if (currentPath.startsWith('/organizations/')) {
      return <OrganizationDetailScreen />;
    }
    if (currentPath.startsWith('/organizations')) {
      return <OrganizationsListScreen />;
    }

    // Programs & Quests & Simulator
    if (currentPath.startsWith('/programs')) {
      return <ProgramsHubScreen />;
    }

    // Benefit Pools Detail Page
    if (
      currentPath.startsWith('/rewards/pools/') ||
      currentPath.startsWith('/pools/') ||
      currentPath === '/pool-detail'
    ) {
      return <PoolDetailScreen />;
    }

    // Destination Pools Hub (Demand / Allocation-Centric)
    if (currentPath === '/pools' || currentPath.startsWith('/pools')) {
      return <PoolsHubScreen />;
    }

    // Reward Catalog (Inventory-Centric)
    if (currentPath.startsWith('/rewards')) {
      return <RewardsScreen />;
    }

    // Analytics
    if (currentPath === '/analytics' || currentPath.startsWith('/analytics')) {
      return <AnalyticsScreen />;
    }

    // Experiences Module: Digital Experience Layer (DX)
    if (
      currentPath === '/experiences' ||
      currentPath.startsWith('/experiences') ||
      currentPath === '/journeys' ||
      currentPath === '/experience-builder' ||
      currentPath === '/experience-marketplace' ||
      currentPath === '/touchpoints'
    ) {
      return <ExperiencesScreen />;
    }

    // Economy Navigation Shortcuts
    if (currentPath === '/economy/rules') {
      return <CreditTypesScreen />;
    }
    if (currentPath === '/economy/ledger') {
      return <LedgerScreen />;
    }
    if (currentPath === '/economy/earning') {
      return <RewardRulesScreen />;
    }
    if (currentPath === '/economy/redemption') {
      return <SpendProductsScreen />;
    }
    if (currentPath === '/economy/templates' || currentPath === '/economy/samples') {
      return <ProgramsHubScreen />;
    }
    if (currentPath === '/economy/config') {
      return <EconomyHealthScreen />;
    }

    // Operations Shortcuts
    if (currentPath === '/operations/adjustments') {
      return <UsersListScreen />;
    }
    if (currentPath === '/operations/audit') {
      return <AuditLogScreen />;
    }
    if (currentPath === '/operations/config') {
      return <RiskPoliciesScreen />;
    }

    // Platform Settings: AI & Integrations (MCP Infrastructure)
    if (
      currentPath === '/settings/integrations' ||
      currentPath === '/settings/mcp' ||
      currentPath === '/settings' ||
      currentPath === '/integrations' ||
      currentPath === '/mcp' ||
      currentPath.startsWith('/settings/integrations')
    ) {
      return <AIIntegrationsScreen />;
    }

    // Hero End-to-End Demo Scenario: Fitness Acquisition & Closed-Loop Aggregation
    if (
      currentPath === '/demo' ||
      currentPath === '/hero-demo' ||
      currentPath === '/scenario' ||
      currentPath === '/hero'
    ) {
      return <HeroEndToEndDemoScreen />;
    }

    // Default fallback to Overview
    return <OverviewScreen />;
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f0] flex flex-col font-sans bg-grid-pattern selection:bg-[#c8c58f]/20 selection:text-[#e4e1a9]">
      <Header />
      <PipelineStepper />
      <EconomicIntegrityAlert />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderScreen()}
      </main>

      <HackathonDemoBar />

      <footer className="app-footer border-t py-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-neutral-400">
            <span className="font-semibold">Credit Economy OS</span>
            <span>·</span>
            <span>AI-native economic control plane for programmable value</span>
          </div>

          <div className="flex items-center space-x-4 text-neutral-500">
            <span>Double-Entry Balance Model</span>
            <span>·</span>
            <span>Append-only journal</span>
            <span>·</span>
            <a className="footer-link" href="https://github.com/intermetropolevn" target="_blank" rel="noreferrer">Intermetropole</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RoleProvider>
      <EconomicProvider>
        <MainRouter />
      </EconomicProvider>
    </RoleProvider>
  );
}
