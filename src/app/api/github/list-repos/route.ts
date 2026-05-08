
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from 'octokit';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * @fileOverview Lists the authenticated user's GitHub repositories.
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 });
  }

  try {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
