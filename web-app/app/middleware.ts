// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkExistenceInDB } from './middlewares/checkContent';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/analyze-content')) {
    return checkExistenceInDB(request);
  }



  return NextResponse.next(); 
}

export const config = {
    matcher: [
      '/api/analyze-content',
    ],
  };