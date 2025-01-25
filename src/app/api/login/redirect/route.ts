import { User, UserSearchCriteria } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
const {google} = require('googleapis');

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    'http://localhost:3000/api/login/redirect',
  );

  try {
    const params = request.nextUrl.searchParams;
    const code = params.get('code')
  
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
  
    const idToken = tokens.id_token;
    const decodedToken = decodeJwt(idToken);
    console.log(decodedToken);

    const userProfile = {
      googleId: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };
    
    // set user profile cookie in res
    let res = NextResponse.redirect(`${process.env.BASE_URL}/api/login/signin-auth0`);
    res.cookies.set('user-profile', JSON.stringify(userProfile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: "strict",
    });

    // create user obj and save
    let userLoggingIn = await User.GetUser(new UserSearchCriteria().GoogleId = userProfile.googleId);
    console.log('userLoggingIn', userLoggingIn);
    if(userLoggingIn){
      return res;

    } else {
      userLoggingIn = new User(userProfile.name, userProfile.name, userProfile.email, userProfile.googleId);
      userLoggingIn.SaveUser();
      console.log('created new', userLoggingIn);
      if(userLoggingIn.UserId > 0){
        let res = NextResponse.redirect(`${process.env.BASE_URL}/home`);
        return res;
      }
    }

    return res;
  } catch (error) {
    console.log(error);
    return Response.redirect(`${process.env.BASE_URL}/404`);
  }
}


function decodeJwt(idToken: any) {
  const payload = idToken.split('.')[1];
  const buffer = Buffer.from(payload, 'base64');
  const decoded = JSON.parse(buffer.toString('utf8'));
  return decoded;
}