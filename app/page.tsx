'use client';

import { useState } from 'react';
import { Wand2, Image as ImageIcon, Video, FileText, TrendingUp, Sparkles } from 'lucide-react';
import ImageGenerator from '@/components/ImageGenerator';
import VideoCreator from '@/components/VideoCreator';
import ContentStrategy from '@/components/ContentStrategy';
import ScriptGenerator from '@/components/ScriptGenerator';

type Tool = 'image' | 'video' | 'strategy' | 'script';

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const tools = [
    { id: 'image' as Tool, name: 'Image Generator', icon: ImageIcon, description: 'Create stunning images, banners, and flyers' },
    { id: 'video' as Tool, name: 'Video Creator', icon: Video, description: 'Turn images into engaging videos' },
    { id: 'strategy' as Tool, name: 'Growth Strategy', icon: TrendingUp, description: 'AI-powered social media strategies' },
    { id: 'script' as Tool, name: 'Script Writer', icon: FileText, description: 'Generate content scripts and captions' },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Social Media Agent
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Your complete AI-powered toolkit for social media success
          </p>
        </div>

        {!activeTool ? (
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="gradient-border p-8 text-left hover:scale-105 transition-transform duration-200"
              >
                <tool.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{tool.name}</h2>
                <p className="text-gray-400">{tool.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveTool(null)}
              className="mb-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              ← Back to Tools
            </button>

            {activeTool === 'image' && <ImageGenerator />}
            {activeTool === 'video' && <VideoCreator />}
            {activeTool === 'strategy' && <ContentStrategy />}
            {activeTool === 'script' && <ScriptGenerator />}
          </div>
        )}
      </div>
    </main>
  );
}
