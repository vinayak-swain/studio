
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from 'octokit';

/**
 * @fileOverview Lists the authenticated user's GitHub repositories.
 */

export async function GET() {
  const session = await getServerSession();
  
  // Note: In a real implementation, we'd retrieve the accessToken from the session/JWT
  // For this prototype, we assume the environment/session handling is configured.
  // We'll use a placeholder or the session token if available.
  
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
