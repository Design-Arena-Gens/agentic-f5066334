'use client';

import { useState } from 'react';
import { TrendingUp, Loader2, Target, Users, Calendar } from 'lucide-react';

export default function ContentStrategy() {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [goal, setGoal] = useState('growth');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [error, setError] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'twitter', name: 'Twitter/X' },
    { id: 'linkedin', name: 'LinkedIn' },
  ];

  const goals = [
    { id: 'growth', name: 'Follower Growth' },
    { id: 'engagement', name: 'Engagement Rate' },
    { id: 'sales', name: 'Sales/Conversions' },
    { id: 'brand', name: 'Brand Awareness' },
  ];

  const handleGenerate = async () => {
    if (!niche.trim()) {
      setError('Please enter your niche');
      return;
    }

    setLoading(true);
    setError('');
    setStrategy(null);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform, goal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate strategy');
      }

      setStrategy(data.strategy);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold">Growth Strategy Generator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Your Niche/Industry</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="E.g., Fitness & Health, Tech Reviews, Fashion, Cooking"
            className="w-full p-4 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Strategy...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              Generate Strategy
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {strategy && (
          <div className="space-y-6 mt-6">
            <div className="gradient-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Content Pillars</h3>
              </div>
              <ul className="space-y-2">
                {strategy.contentPillars?.map((pillar: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{pillar}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Posting Schedule</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Frequency:</strong> {strategy.postingSchedule?.frequency}</p>
                <p><strong>Best Times:</strong> {strategy.postingSchedule?.bestTimes}</p>
              </div>
            </div>

            <div className="gradient-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Engagement Tactics</h3>
              </div>
              <ul className="space-y-2">
                {strategy.engagementTactics?.map((tactic: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-border p-6">
              <h3 className="text-xl font-bold mb-4">Content Ideas</h3>
              <ul className="space-y-2">
                {strategy.contentIdeas?.map((idea: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">{idx + 1}.</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-border p-6">
              <h3 className="text-xl font-bold mb-4">Hashtag Strategy</h3>
              <p className="mb-2">{strategy.hashtagStrategy?.description}</p>
              <div className="flex flex-wrap gap-2">
                {strategy.hashtagStrategy?.tags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
