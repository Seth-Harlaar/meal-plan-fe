import { User, UserSearchCriteria } from "@/models/User";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
const {google} = require('googleapis');

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
    let userLoggingIn = await User.GetUser(new UserSearchCriteria({GoogleId: payload['sub']}));
    console.log('userLoggingIn', userLoggingIn);

    if(!userLoggingIn){
      let createdUser = new User(payload['given_name'], payload['family_name'], payload['email'], payload['sub']);
      await createdUser.SaveUser();
      console.log('created new', createdUser);
      if(createdUser.UserId > 0){ 
        throw new Error('Could not create new user');
      }
    }

    // creat jwt
    var x = 

    let res = NextResponse.redirect(`${process.env.BASE_URL}/home`);
    res.cookies.set('user-profile', JSON.stringify(userProfile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: "strict",
    });

    return res;

  } catch (error) {
    console.log(error);
    return Response.redirect(`${process.env.BASE_URL}/404`);
  }
}
