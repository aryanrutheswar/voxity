import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, slot, notes, audioNote } = body;

    // Automatically create a Pending Work task for every strategy call booking
    const newWorkTask = await db.addWorkTask({
      title: `📞 Strategy Call: ${name || 'Client'}`,
      clientName: `${name || 'Client'} (${email || 'No email'}${phone ? ' | ' + phone : ''})`,
      serviceCategory: 'Strategy Audit',
      description: `Booked Slot: ${slot || '30 Min Audit'}. Notes: ${notes || 'None'}${audioNote ? ' [Voice Note Attached]' : ''}`,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Scheduled next day
      priority: 'High',
    });

    await db.addBooking({
      name: name || 'Client',
      email: email || '',
      phone,
      slot: slot || '30 Min Audit',
      notes,
      audioNote,
    });

    return NextResponse.json({
      success: true,
      message: 'Booking received and added to Pending Works',
      data: newWorkTask
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
