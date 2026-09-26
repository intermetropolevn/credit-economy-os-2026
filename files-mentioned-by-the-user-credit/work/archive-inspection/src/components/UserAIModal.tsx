import React from 'react';
import { User } from '../types';
import { UserAIIntelligenceCard } from './UserAIIntelligenceCard';
import { X } from 'lucide-react';

interface UserAIModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPool?: (poolId: string) => void;
  onRequestCampaignCreate?: (userName: string) => void;
}

export const UserAIModal: React.FC<UserAIModalProps> = ({
  user,
  isOpen,
  onClose,
  onNavigateToPool,
  onRequestCampaignCreate,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-3xl w-full my-8">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#1b1f2a] border border-[#262a35] text-[#939183] hover:text-[#dfe2f0] flex items-center justify-center cursor-pointer shadow-lg"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <UserAIIntelligenceCard
          user={user}
          onNavigateToPool={(poolId) => {
            onClose();
            if (onNavigateToPool) onNavigateToPool(poolId);
          }}
          onRequestCampaignCreate={(userName) => {
            onClose();
            if (onRequestCampaignCreate) onRequestCampaignCreate(userName);
          }}
        />
      </div>
    </div>
  );
};
