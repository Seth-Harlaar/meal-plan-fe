// const {google} = require('googleapis');

// export async function GET() {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_SECRET,
//     'http://localhost:3000/api/login/redirect',
//   );
  
//   // generate a url that asks permissions for Blogger and Google Calendar scopes
//   const scopes = [
//     'profile',
//     'email'
//   ];
  
//   const url = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: 'offline',
//     scope: scopes
//   });
 
//   return Response.redirect(url)
// }


export async function POST(request: Request){


}