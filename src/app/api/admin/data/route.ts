import { NextResponse } from 'next/server';
import { SERVICES_DATA, BLOG_POSTS } from '@/data/mockData';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tasks = await db.getWorkTasks();
  const leads = await db.getLeads();
  const bookings = await db.getBookings();
  const subscribers = await db.getSubscribers();

  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return NextResponse.json({
    success: true,
    data: {
      leads,
      bookings,
      subscribers,
      services: SERVICES_DATA,
      blogPosts: BLOG_POSTS,
      workTasks: tasks,
      stats: {
        totalLeads: leads.length,
        totalBookings: bookings.length,
        totalSubscribers: subscribers.length,
        totalServices: SERVICES_DATA.length,
        totalBlogPosts: BLOG_POSTS.length,
        newLeadsCount: leads.filter(l => l.status === 'New').length,
        estimatedPipelineValue: 4500000,
        pendingWorksCount: pendingCount,
        completedWorksCount: completedCount
      }
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'addWorkTask') {
      const newTask = await db.addWorkTask(body.task);
      return NextResponse.json({ success: true, data: newTask });
    }
    if (body.action === 'deleteWorkTask') {
      await db.deleteWorkTask(body.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'updateWorkTask') {
      const updated = await db.updateWorkTask(body.id, body.updates);
      return NextResponse.json({ success: true, data: updated });
    }
    if (body.action === 'deleteBooking') {
      await db.deleteBooking(body.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'clearWorkTasks') {
      await db.clearWorkTasks();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true, data: body });
  } catch (e) {
    console.error('Admin API Error:', e);
    return NextResponse.json({ success: false, message: String(e) }, { status: 400 });
  }
}