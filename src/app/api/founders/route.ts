import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const foundersFilePath = path.join(process.cwd(), 'src', 'data', 'founders.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(foundersFilePath, 'utf8');
    const founders = JSON.parse(fileContents);
    return NextResponse.json(founders);
  } catch (error) {
    console.error('Error reading founders:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const founders = body.founders;
    
    // Write updated founders
    fs.writeFileSync(foundersFilePath, JSON.stringify(founders, null, 2));
    
    return NextResponse.json({ success: true, founders });
  } catch (error) {
    console.error('Error updating founders:', error);
    return NextResponse.json({ success: false, error: 'Failed to update founders' }, { status: 500 });
  }
}
