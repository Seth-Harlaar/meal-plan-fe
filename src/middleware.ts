import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if(request.cookies.has('user-profile')){
    console.log(request.cookies.get('user-profile'));
  } else {
    console.log('none found', request.cookies.getAll());
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}