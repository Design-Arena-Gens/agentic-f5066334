'use client';

import { useState } from 'react';
import { Wand2, Download, Loader2 } from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [format, setFormat] = useState('post');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');

  const styles = [
    { id: 'realistic', name: 'Realistic' },
    { id: 'artistic', name: 'Artistic' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'vibrant', name: 'Vibrant' },
    { id: 'professional', name: 'Professional' },
  ];

  const formats = [
    { id: 'post', name: 'Instagram Post', size: '1080x1080' },
    { id: 'story', name: 'Instagram Story', size: '1080x1920' },
    { id: 'banner', name: 'Twitter Banner', size: '1500x500' },
    { id: 'flyer', name: 'Flyer', size: '1080x1350' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `social-media-${format}-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="gradient-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold">AI Image Generator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Describe your image</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A modern tech workspace with laptop and coffee, professional lighting, clean aesthetic"
            className="w-full p-4 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none min-h-[100px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {formats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.size})
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
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto"
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
