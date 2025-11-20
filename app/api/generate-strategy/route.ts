import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { niche, platform, goal } = await request.json();

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert social media strategist with deep knowledge of all major platforms. Generate comprehensive, actionable strategies.`;

    const userPrompt = `Create a detailed social media growth strategy for:
- Niche: ${niche}
- Platform: ${platform}
- Goal: ${goal}

Provide a JSON response with this structure:
{
  "contentPillars": ["pillar1", "pillar2", "pillar3", "pillar4"],
  "postingSchedule": {
    "frequency": "X posts per day/week",
    "bestTimes": "specific times with timezone"
  },
  "engagementTactics": ["tactic1", "tactic2", "tactic3", "tactic4", "tactic5"],
  "contentIdeas": ["idea1", "idea2", "idea3", "idea4", "idea5"],
  "hashtagStrategy": {
    "description": "brief description",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  }
}`;

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
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate strategy');
    }

    const strategy = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ strategy });
  } catch (error: any) {
    console.error('Error generating strategy:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}
