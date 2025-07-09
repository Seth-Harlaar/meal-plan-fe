import { User, UserSearchCriteria } from "@/models/User";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { Jwt } from "jsonwebtoken";
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');

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
      user = Object.assign(new User(), {
        GoogleId: payload['sub'],
        FirstName: payload['given_name'],
        LastName: payload['family_name'],
        Email: payload['email'],
      });
      await user.SaveUser();
      console.log('created new', user);
      if(user.UserId <= 0){
        throw new Error('Could not create new user');
      }
    }

    // creat jwt
    var token = jwt.sign({userSub: user.GoogleId}, process.env.JWT_SECRET);

    let res = NextResponse.redirect(`${process.env.BASE_URL}/auth-callback`);
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;

  } catch (error) {
    console.log(error);
    return Response.redirect(`${process.env.BASE_URL}/404`);
  }
}
