'use client';

import { useState, useMemo } from 'react';
import { OpportunityNote } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { StickyNote, TrendingUp, Target, Filter, Search, Trash2 } from 'lucide-react';

interface OpportunityListProps {
  opportunities: OpportunityNote[];
  onSelectOpportunity: (opp: OpportunityNote) => void;
  onDeleteOpportunity: (id: string) => void;
}

export function OpportunityList({
  opportunities,
  onSelectOpportunity,
  onDeleteOpportunity,
}: OpportunityListProps) {
  const [filterImpact, setFilterImpact] = useState<string>('');
  const [filterConfidence, setFilterConfidence] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    opportunities.forEach((opp) => opp.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (filterImpact && opp.expectedImpact !== filterImpact) return false;
      if (filterConfidence && opp.confidence !== filterConfidence) return false;
      if (filterTag && !opp.tags.includes(filterTag)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          opp.hypothesis.toLowerCase().includes(query) ||
          opp.from.toLowerCase().includes(query) ||
          opp.to.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [opportunities, filterImpact, filterConfidence, filterTag, searchQuery]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'success';
      case 'medium':
        return 'info';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-amber-600" />
          Opportunity Notes
        </h2>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Select value={filterImpact} onChange={(e) => setFilterImpact(e.target.value)}>
              <option value="">All Impact</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>

            <Select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
            >
              <option value="">All Confidence</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>

            <Select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Showing {filteredOpportunities.length} of {opportunities.length} notes
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No opportunity notes yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Switch to Ideation Mode and click nodes/edges to add notes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onSelectOpportunity(opp)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex gap-2">
                    <Badge variant={getImpactColor(opp.expectedImpact)}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {opp.expectedImpact} impact
                    </Badge>
                    <Badge variant={getConfidenceColor(opp.confidence)}>
                      <Target className="w-3 h-3 mr-1" />
                      {opp.confidence} conf
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this opportunity note?')) {
                        onDeleteOpportunity(opp.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-sm font-medium text-slate-900 mb-2 line-clamp-2">
                  {opp.hypothesis}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="font-medium">From:</span>{' '}
                    <span className="line-clamp-1">{opp.from}</span>
                  </div>
                  <div>
                    <span className="font-medium">To:</span>{' '}
                    <span className="line-clamp-1">{opp.to}</span>
                  </div>
                </div>

                {opp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opp.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
