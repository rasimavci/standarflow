import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const investorsFilePath = path.join(process.cwd(), 'src', 'data', 'investors.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(investorsFilePath, 'utf8');
    const investors = JSON.parse(fileContents);
    return NextResponse.json(investors);
  } catch (error) {
    console.error('Error reading investors:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const investors = body.investors;
    
    // Write updated investors
    fs.writeFileSync(investorsFilePath, JSON.stringify(investors, null, 2));
    
    return NextResponse.json({ success: true, investors });
  } catch (error) {
    console.error('Error updating investors:', error);
    return NextResponse.json({ success: false, error: 'Failed to update investors' }, { status: 500 });
  }
}
