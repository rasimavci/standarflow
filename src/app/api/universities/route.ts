import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country');

  if (!country) {
    return NextResponse.json({ error: 'Country parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}
