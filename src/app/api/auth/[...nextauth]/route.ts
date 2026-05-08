
import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * @fileOverview NextAuth configuration for GitHub OAuth.
 * Exporting authOptions allows it to be reused in getServerSession calls.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: { scope: "read:user user:email repo" }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-nest-fallback-secret-123",
  pages: {
    signIn: '/import',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
