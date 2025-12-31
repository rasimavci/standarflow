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
    console.log('[SERVER] POST /api/messages - Body:', JSON.stringify(body, null, 2));
    
    // Read current messages
    let messages = [];
    try {
      const fileContents = fs.readFileSync(messagesFilePath, 'utf8');
      messages = JSON.parse(fileContents);
      console.log('[SERVER] Current messages count:', messages.length);
    } catch (error) {
      console.log('[SERVER] No existing messages file, starting fresh');
      messages = [];
    }

    if (body.action === 'add') {
      // Add new message
      console.log('[SERVER] Adding message:', body.message);
      messages.push(body.message);
      console.log('[SERVER] New messages count:', messages.length);
    } else if (body.action === 'update') {
      // Update messages (for status changes, etc.)
      messages = body.messages;
      console.log('[SERVER] Updating all messages, count:', messages.length);
    } else if (body.action === 'markAsRead') {
      // Mark messages as read
      console.log('[SERVER] Marking as read for conversation:', body.conversationId);
      messages = messages.map((m: any) => {
        if (m.conversationId === body.conversationId && m.recipientEmail === body.recipientEmail) {
          return { ...m, read: true };
        }
        return m;
      });
    }

    // Write updated messages
    console.log('[SERVER] Writing to file:', messagesFilePath);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    console.log('[SERVER] File written successfully');
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('[SERVER] Error updating messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to update messages' }, { status: 500 });
  }
}
