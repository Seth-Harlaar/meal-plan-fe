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
  
    try {
    const {tokens} = await oauth2Client.getToken(code);

      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      console.log(payload);


      let res = NextResponse.redirect(`${process.env.BASE_URL}/home`);
    } catch {

      let res = NextResponse.redirect(`${process.env.BASE_URL}/404`);
    }



    // create user obj and save
    let userLoggingIn = await User.GetUser(new UserSearchCriteria({GoogleId: userProfile.googleId}));
    console.log('userLoggingIn', userLoggingIn);
    if(userLoggingIn){
      return res;

    } else {
      let names = userProfile.name.split(' ');
      let firstName = names[0];
      let lastName = names[names.length - 1];
      let createdUser = new User(firstName, lastName, userProfile.email, userProfile.googleId);
      await createdUser.SaveUser();
      console.log('created new', createdUser);
      if(createdUser.UserId > 0){
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
