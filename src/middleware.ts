import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User, UserSearchCriteria } from './models/User';
import { getSession } from "next-auth/react";
 
// export async function middleware(request: NextRequest) {
//   // grab auth and verify
//   if(request.cookies.has('auth_token')){
//     const token = request.cookies.get('auth_token')?.value;
//     const encodedKey = (new TextEncoder()).encode(process.env.JWT_SECRET);

//     if(token){
//       try {
//         // verify token
//         const { payload } = await jose.jwtVerify(token, encodedKey);

//         let user = await User.GetUser(new UserSearchCriteria({GoogleId: payload['sub']}));
//         console.log('user loggin in is:', user?.FirstName, user?.LastName);

//         return NextResponse.next();
//       } catch (e) {
//         // token verification failed
//         console.log("Token is invalid");
//       }
//     }
//   }
  
//   return NextResponse.redirect('api/login');
// }


export const config = {
  matcher: ['/'],
}


export async function middleware(request: NextRequest){
  const session = await getSession();

  console.log(session);
}