import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country');
  const name = searchParams.get('name');

  if (!country) {
    return NextResponse.json({ error: 'Country parameter is required' }, { status: 400 });
  }

  try {
    // Build URL with name parameter if provided
    let url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }

    const data = await response.json();
    
    // Validate that data is an array
    if (!Array.isArray(data)) {
      console.error('Invalid data format from external API:', data);
      return NextResponse.json([], { status: 200 });
    }
    
    // Limit results to prevent overwhelming the client (especially for US)
    const limitedData = data.slice(0, 500);
    
    return NextResponse.json(limitedData);
  } catch (error) {
    console.error('Error fetching universities:', error);
    // Return empty array instead of error object to prevent client-side crashes
    return NextResponse.json([], { status: 200 });
  }
}
