import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const messagesFilePath = path.join(process.cwd(), 'src', 'data', 'messages.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(messagesFilePath, 'utf8');
    const messages = JSON.parse(fileContents);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Read current messages
    let messages = [];
    try {
      const fileContents = fs.readFileSync(messagesFilePath, 'utf8');
      messages = JSON.parse(fileContents);
    } catch (error) {
      messages = [];
    }

    if (body.action === 'add') {
      // Add new message
      messages.push(body.message);
    } else if (body.action === 'update') {
      // Update messages (for status changes, etc.)
      messages = body.messages;
    } else if (body.action === 'markAsRead') {
      // Mark messages as read
      messages = messages.map((m: any) => {
        if (m.conversationId === body.conversationId && m.recipientEmail === body.recipientEmail) {
          return { ...m, read: true };
        }
        return m;
      });
    }

    // Write updated messages
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error updating messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to update messages' }, { status: 500 });
  }
}
