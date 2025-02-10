// import NextAuth, { AuthOptions, User } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// import { refreshToken } from "@/src/lib/refreshTokens";
// import checkTokenExpiry from "@/src/lib/checkTokenExpiry";

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const { email, password } = credentials;

//         const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
//           method: "POST",
//           body: JSON.stringify({
//             email,
//             password,
//           }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const user = await res.json();

//         if (!res.ok) {
//           console.error(user.message);

//           return null;
//         }

//         console.log(user);
//         return user;
//       },
//     }),

//     GitHubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "github" || account?.provider === "google") {
//         const res = await fetch(
//           `${process.env.BACKEND_URL}/auth/external-login`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               name: user.name,
//               email: user.email,
//               provider: account.provider,
//               providerAccountId: account.providerAccountId,
//             }),
//           },
//         );
//         const data = await res.json();
//         // console.log(data);
//         if (!res.ok) throw new Error(data.message);

//         return data;
//       }
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? baseUrl : url;
//     },
//     async jwt({ token, user, trigger, session }) {
//       if (trigger === "update") {
//         return {
//           ...token,
//           ...session.user,
//         };
//       }

//       const isTokenExpired =
//         token.accessTokenExp &&
//         checkTokenExpiry(token.accessTokenExp as number);

//       const isRefreshTokenExpired =
//         token.refreshTokenExp &&
//         checkTokenExpiry(token.refreshTokenExp as number);

//       if (token.refreshTokenExp && isRefreshTokenExpired) {
//         return {
//           ...token,
//           error: "refresh-token-expired",
//         };
//       }

//       if (isTokenExpired) {
//         const newTokens = await refreshToken(token.refreshToken as string);

//         token.accessToken = newTokens.accessToken;
//         token.accessTokenExp = newTokens.expiresIn;
//         token.refreshTokenExp = newTokens.expiresIn;

//         return {
//           ...token,
//           ...user,
//         };
//       }

//       return { ...token, ...user };
//     },
//     async session({ token, session }) {
//       session.user = token as any;

//       return session;
//     },
//   },
// };

// export const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };