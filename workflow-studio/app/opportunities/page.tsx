'use client';

import { useState, useEffect } from 'react';
import { OpportunityNote, Workflow } from '@/types';
import { getOpportunities, getWorkflows, deleteOpportunity, saveOpportunity } from '@/lib/storage';
import { OpportunityList } from '@/components/opportunities/opportunity-list';
import { OpportunityDrawer } from '@/components/workflow/opportunity-drawer';
import { StickyNote, TrendingUp, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityNote[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityNote | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    setOpportunities(getOpportunities());
    setWorkflows(getWorkflows());
  }, []);

  const handleSelectOpportunity = (opp: OpportunityNote) => {
    setSelectedOpportunity(opp);
    setShowDrawer(true);
  };

  const handleSaveOpportunity = (opp: OpportunityNote) => {
    saveOpportunity(opp);
    setOpportunities(getOpportunities());
  };

  const handleDeleteOpportunity = (id: string) => {
    deleteOpportunity(id);
    setOpportunities(getOpportunities());
  };

  const stats = {
    total: opportunities.length,
    highImpact: opportunities.filter((o) => o.expectedImpact === 'high').length,
    highConfidence: opportunities.filter((o) => o.confidence === 'high').length,
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 bg-slate-50 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Opportunity Notes</h1>
            <p className="text-slate-600">
              Track and prioritize AI automation opportunities across your workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Opportunities</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <StickyNote className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">High Impact</p>
                  <p className="text-3xl font-bold text-green-600">{stats.highImpact}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="success" className="text-xs">
                  {stats.total > 0
                    ? Math.round((stats.highImpact / stats.total) * 100)
                    : 0}
                  % of total
                </Badge>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">High Confidence</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.highConfidence}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="info" className="text-xs">
                  {stats.total > 0
                    ? Math.round((stats.highConfidence / stats.total) * 100)
                    : 0}
                  % of total
                </Badge>
              </div>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-16 text-center">
              <StickyNote className="w-20 h-20 mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                No Opportunity Notes Yet
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Start capturing AI automation opportunities by switching to Ideation Mode in the
                Workflows page
              </p>
              <div className="space-y-4 max-w-lg mx-auto text-left bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900">How to capture opportunities:</h3>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li>1. Go to Workflows and select a workflow</li>
                  <li>2. Switch to "Ideation Mode"</li>
                  <li>3. Click on nodes (steps) or edges (transitions)</li>
                  <li>4. Fill in the opportunity note form</li>
                  <li>5. Tag and prioritize by impact and confidence</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <OpportunityList
                opportunities={opportunities}
                onSelectOpportunity={handleSelectOpportunity}
                onDeleteOpportunity={handleDeleteOpportunity}
              />
            </div>
          )}
        </div>
      </div>

      {showDrawer && selectedOpportunity && (
        <OpportunityDrawer
          workflowId={selectedOpportunity.workflowId}
          targetType={selectedOpportunity.targetType}
          targetId={selectedOpportunity.targetId}
          existingNote={selectedOpportunity}
          onSave={handleSaveOpportunity}
          onClose={() => {
            setShowDrawer(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
}
