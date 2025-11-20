import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl, motion, duration, music } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const motionPrompts: { [key: string]: string } = {
      zoom: 'slow zoom in effect, smooth camera movement',
      pan: 'pan across the image, cinematic movement',
      fade: 'fade in with zoom, professional transition',
      slideshow: 'slideshow style with gentle transitions',
    };

    const prompt = `Animate this image with ${motionPrompts[motion] || motionPrompts.zoom}, duration ${duration} seconds, smooth and professional`;

    const replicateKey = process.env.REPLICATE_API_TOKEN;

    if (!replicateKey) {
      return NextResponse.json(
        {
          error: 'Video generation requires Replicate API key. Please add REPLICATE_API_TOKEN to your environment variables.',
          videoUrl: imageUrl,
          demo: true,
        },
        { status: 200 }
      );
    }

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${replicateKey}`,
      },
      body: JSON.stringify({
        version: 'stability-ai/stable-video-diffusion',
        input: {
          image: imageUrl,
          motion_bucket_id: motion === 'zoom' ? 127 : motion === 'pan' ? 180 : 100,
          frames_per_second: 6,
          num_frames: duration * 6,
        },
      }),
    });

    const prediction = await response.json();

    if (!response.ok) {
      throw new Error(prediction.detail || 'Failed to start video generation');
    }

    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 60;

    while (!videoUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${replicateKey}`,
          },
        }
      );

      const status = await statusResponse.json();

      if (status.status === 'succeeded') {
        videoUrl = status.output;
      } else if (status.status === 'failed') {
        throw new Error('Video generation failed');
      }

      attempts++;
    }

    if (!videoUrl) {
      throw new Error('Video generation timed out');
    }

    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
