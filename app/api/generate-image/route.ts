import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, style, format } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const formatSizes: { [key: string]: string } = {
      post: '1024x1024',
      story: '1024x1792',
      banner: '1792x1024',
      flyer: '1024x1792',
    };

    const stylePrompts: { [key: string]: string } = {
      realistic: 'photorealistic, high quality, detailed',
      artistic: 'artistic, creative, vibrant colors, expressive',
      minimalist: 'minimalist, clean, simple, modern design',
      vibrant: 'vibrant colors, bold, eye-catching, energetic',
      professional: 'professional, clean, corporate, polished',
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || stylePrompts.realistic}, high quality, perfect for social media`;

    const size = formatSizes[format] || '1024x1024';

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: 'standard',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate image');
    }

    return NextResponse.json({
      imageUrl: data.data[0].url,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
