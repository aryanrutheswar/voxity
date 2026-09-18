import { NextResponse } from 'next/server';
import { SERVICES_DATA, BLOG_POSTS } from '@/data/mockData';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tasks = db.getWorkTasks();
  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return NextResponse.json({
    success: true,
    data: {
      leads: db.getLeads(),
      bookings: db.getBookings(),
      subscribers: db.getSubscribers(),
      services: SERVICES_DATA,
      blogPosts: BLOG_POSTS,
      workTasks: tasks,
      stats: {
        totalLeads: db.getLeads().length,
        totalBookings: db.getBookings().length,
        totalSubscribers: db.getSubscribers().length,
        totalServices: SERVICES_DATA.length,
        totalBlogPosts: BLOG_POSTS.length,
        newLeadsCount: db.getLeads().filter(l => l.status === 'New').length,
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
      const newTask = db.addWorkTask(body.task);
      return NextResponse.json({ success: true, data: newTask });
    }
    if (body.action === 'deleteWorkTask') {
      db.deleteWorkTask(body.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'updateWorkTask') {
      const updated = db.updateWorkTask(body.id, body.updates);
      return NextResponse.json({ success: true, data: updated });
    }
    if (body.action === 'deleteBooking') {
      db.deleteBooking(body.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'clearWorkTasks') {
      db.clearWorkTasks();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true, data: body });
  } catch (e) {
    console.error('Admin API Error:', e);
    return NextResponse.json({ success: false, message: String(e) }, { status: 400 });
  }
}