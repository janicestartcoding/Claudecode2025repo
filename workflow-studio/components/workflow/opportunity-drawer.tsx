'use client';

import { useState, useEffect } from 'react';
import { OpportunityNote } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface OpportunityDrawerProps {
  workflowId: string;
  targetType: 'node' | 'edge';
  targetId: string;
  existingNote?: OpportunityNote;
  onSave: (note: OpportunityNote) => void;
  onClose: () => void;
}

export function OpportunityDrawer({
  workflowId,
  targetType,
  targetId,
  existingNote,
  onSave,
  onClose,
}: OpportunityDrawerProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [expectedImpact, setExpectedImpact] = useState<'low' | 'medium' | 'high'>('medium');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (existingNote) {
      setFrom(existingNote.from);
      setTo(existingNote.to);
      setHypothesis(existingNote.hypothesis);
      setExpectedImpact(existingNote.expectedImpact);
      setConfidence(existingNote.confidence);
      setTags(existingNote.tags);
    }
  }, [existingNote]);

  const handleSave = () => {
    const note: OpportunityNote = {
      id: existingNote?.id || `opp-${Date.now()}`,
      workflowId,
      targetType,
      targetId,
      from,
      to,
      hypothesis,
      expectedImpact,
      confidence,
      tags,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
    };
    onSave(note);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-slate-200 flex flex-col z-50">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-amber-50">
        <div>
          <h3 className="font-semibold text-slate-900">Opportunity Note</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {targetType === 'node' ? 'Process Step' : 'Transition'}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            From (Current State)
          </label>
          <Textarea
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Describe the current process or state..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            To (Desired State)
          </label>
          <Textarea
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Describe the improved process with AI..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Hypothesis
          </label>
          <Textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="What's your hypothesis about this opportunity?"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expected Impact
            </label>
            <Select
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confidence
            </label>
            <Select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 flex gap-2">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save Note
        </Button>
      </div>
    </div>
  );
}
