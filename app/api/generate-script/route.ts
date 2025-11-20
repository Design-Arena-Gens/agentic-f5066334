import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, contentType, tone, length } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const lengthGuides: { [key: string]: string } = {
      short: '15-30 seconds',
      medium: '30-60 seconds',
      long: '1-3 minutes',
    };

    const systemPrompt = `You are an expert social media content creator and scriptwriter. Create engaging, viral-worthy scripts that capture attention and drive engagement.`;

    const userPrompt = `Create a ${tone} script for a ${contentType} about: "${topic}"
Length: ${lengthGuides[length] || lengthGuides.short}

Provide a JSON response with this structure:
{
  "hook": "An attention-grabbing opening line (1-2 sentences)",
  "mainContent": "The main content/body of the script with clear structure and timing cues",
  "cta": "A strong call-to-action ending",
  "hashtags": ["relevant", "hashtags", "for", "reach"]
}

Make it engaging, authentic, and optimized for ${contentType}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate script');
    }

    const script = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ script });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    );
  }
}
