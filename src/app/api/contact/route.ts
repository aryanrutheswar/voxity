import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const newTask = await db.addWorkTask({
      title: `📩 Lead Inquiry: ${name || 'Website Contact'}`,
      clientName: `${name || 'Client'} (${email || 'No email'}${phone ? ' | ' + phone : ''})`,
      serviceCategory: 'Growth Inquiry',
      description: message || 'Submitted website contact form.',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'High',
    });

    await db.addLead({
      name: name || 'Website Visitor',
      email: email || '',
      company: phone ? `Phone: ${phone}` : '',
      service: 'General Inquiry',
      budget: 'Flexible',
      message: message || '',
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully', data: newTask });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
