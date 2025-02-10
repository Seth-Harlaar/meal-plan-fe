import { User, UserSearchCriteria } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
const {google} = require('googleapis');
import * as jose from 'jose'

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    'http://localhost:3000/api/login/redirect',
  );

  try {
    // get google auth response
    const params = request.nextUrl.searchParams;
    const code = params.get('code')
    const {tokens} = await oauth2Client.getToken(code);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log(payload);

    // find or create user
    let user = await User.GetUser(new UserSearchCriteria({GoogleId: payload['sub']}));
    console.log('user loggin in:', user);

    if(!user){
      user = new User(payload['given_name'], payload['family_name'], payload['email'], payload['sub']);
      await user.SaveUser();
      console.log('created new', user);
      if(user.UserId > 0){ 
        throw new Error('Could not create new user');
      }
    }

    const encodedKey = (new TextEncoder()).encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({userSub: user.GoogleId}) // details to  encode in the token
        .setProtectedHeader({ alg: 'HS256' }) // algorithm
        .setIssuedAt()
        .setExpirationTime("1 hour") // token expiration time, e.g., "1 day"
        .sign(encodedKey); // secretKey generated from previous step
    console.log(token); // log token to console

    let res = NextResponse.redirect(`${process.env.BASE_URL}/home`);
    res.cookies.set('auth_token', token);
    return res;

  } catch (error) {
    console.log(error);
    return Response.redirect(`${process.env.BASE_URL}/404`);
  }
}
