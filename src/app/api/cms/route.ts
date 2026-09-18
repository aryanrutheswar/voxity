import { NextResponse } from 'next/server';
import { SERVICES_DATA, CASE_STUDIES, BLOG_POSTS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      services: SERVICES_DATA,
      caseStudies: CASE_STUDIES,
      blogPosts: BLOG_POSTS,
    },
  });
}
