import GoogleProvider from 'next-auth/providers/google'

import { AuthOptions, getServerSession } from "next-auth"

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_ID,
    }),
  ],

  // callbacks: {
  //   async jwt({token, account, profile }){
  //     token.sub = profile?.sub;
  //     console.log(token);
  //     return token
  //   },

  //   async session({ session, token, user }) {
  //     console.log('nextauth - signing in');
  //     return session
  //   }
  // }
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }