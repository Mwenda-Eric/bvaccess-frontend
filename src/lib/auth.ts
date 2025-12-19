import NextAuth from 'next-auth';
import type { NextAuthConfig, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { authApi } from './api/auth';
import { AdminRole } from '@/types';

// Extend types
declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: AdminRole;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      name: string;
      role: AdminRole;
    };
    accessToken: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    email: string;
    name: string;
    role: AdminRole;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await authApi.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response && response.admin) {
            return {
              id: response.admin.id,
              username: response.admin.username,
              email: response.admin.email,
              name: response.admin.fullName,
              role: response.admin.role,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
          }
          return null;
        } catch (error) {
          const err = error as { message?: string };
          throw new Error(err.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email!;
        token.name = user.name!;
        token.role = user.role as AdminRole;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // Set access token expiry (assume 1 hour from now)
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = (session as { name?: string }).name || token.name;
      }

      // Return previous token if access token hasn't expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        const response = await authApi.refreshToken(token.refreshToken);
        return {
          ...token,
          accessToken: response.accessToken,
          accessTokenExpires: Date.now() + response.expiresIn * 1000,
        };
      } catch {
        // Refresh failed, return token but mark as expired
        return {
          ...token,
          error: 'RefreshTokenExpired',
        };
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          username: token.username,
          email: token.email,
          name: token.name,
          role: token.role,
        },
        accessToken: token.accessToken,
        error: token.error,
      } as Session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
