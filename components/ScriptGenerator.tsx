'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check } from 'lucide-react';

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('reel');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('short');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const contentTypes = [
    { id: 'reel', name: 'Instagram Reel/TikTok' },
    { id: 'youtube', name: 'YouTube Video' },
    { id: 'caption', name: 'Caption/Post' },
    { id: 'story', name: 'Story Series' },
  ];

  const tones = [
    { id: 'casual', name: 'Casual & Friendly' },
    { id: 'professional', name: 'Professional' },
    { id: 'humorous', name: 'Humorous' },
    { id: 'inspirational', name: 'Inspirational' },
    { id: 'educational', name: 'Educational' },
  ];

  const lengths = [
    { id: 'short', name: 'Short (15-30s)' },
    { id: 'medium', name: 'Medium (30-60s)' },
    { id: 'long', name: 'Long (1-3min)' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setScript(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, contentType, tone, length }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.script);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gradient-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold">Script & Content Generator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Topic/Subject</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., 5 morning habits for productivity, How to start a side hustle"
            className="w-full p-4 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {contentTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {tones.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {lengths.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
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
              Generating Script...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Script
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {script && (
          <div className="space-y-6 mt-6">
            <div className="gradient-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Hook</h3>
                <button
                  onClick={() => handleCopy(script.hook)}
                  className="p-2 hover:bg-purple-600/20 rounded transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-200">{script.hook}</p>
            </div>

            <div className="gradient-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Main Content</h3>
                <button
                  onClick={() => handleCopy(script.mainContent)}
                  className="p-2 hover:bg-purple-600/20 rounded transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-200">{script.mainContent}</div>
            </div>

            <div className="gradient-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Call to Action</h3>
                <button
                  onClick={() => handleCopy(script.cta)}
                  className="p-2 hover:bg-purple-600/20 rounded transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-200">{script.cta}</p>
            </div>

            {script.hashtags && (
              <div className="gradient-border p-6">
                <h3 className="text-xl font-bold mb-4">Suggested Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {script.hashtags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleCopy(`${script.hook}\n\n${script.mainContent}\n\n${script.cta}\n\n${script.hashtags?.map((t: string) => '#' + t).join(' ')}`)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              Copy Full Script
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
