'use client';

import { useState } from 'react';
import { Video, Upload, Loader2, Download } from 'lucide-react';

export default function VideoCreator() {
  const [imageUrl, setImageUrl] = useState('');
  const [motion, setMotion] = useState('zoom');
  const [duration, setDuration] = useState('3');
  const [music, setMusic] = useState('upbeat');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const motionTypes = [
    { id: 'zoom', name: 'Zoom In' },
    { id: 'pan', name: 'Pan Across' },
    { id: 'fade', name: 'Fade & Zoom' },
    { id: 'slideshow', name: 'Slideshow' },
  ];

  const musicTypes = [
    { id: 'upbeat', name: 'Upbeat & Energetic' },
    { id: 'calm', name: 'Calm & Relaxing' },
    { id: 'corporate', name: 'Professional/Corporate' },
    { id: 'none', name: 'No Music' },
  ];

  const handleGenerate = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl('');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, motion, duration: parseInt(duration), music }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setVideoUrl(data.videoUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <Video className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold">Video Creator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste your image URL here or upload below"
            className="w-full p-4 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
          />
          <p className="text-sm text-gray-400 mt-2">
            Tip: Use the Image Generator to create images, then use them here
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Motion Effect</label>
            <select
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {motionTypes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="3">3 seconds</option>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="15">15 seconds</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Background Music</label>
            <select
              value={music}
              onChange={(e) => setMusic(e.target.value)}
              className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {musicTypes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
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
              Creating Video...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Create Video
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {videoUrl && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={videoUrl}
                controls
                className="w-full h-auto"
              />
            </div>
            <a
              href={videoUrl}
              download
              className="block w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-center"
            >
              <Download className="w-5 h-5 inline mr-2" />
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
