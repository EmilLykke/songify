import axios from 'axios';
import { NextRequest } from 'next/server';
import qs from 'querystring';

const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Missing required environment variables: CLIENT_ID, CLIENT_SECRET, or REDIRECT_URI.');
}

/**
 * Extracts the authorization code and state from a URL query string.
 * @param {string} url - The full URL to parse.
 * @returns {[string | null, string | null]} An array containing the authorization code and state.
 */
function extractCodeAndState(url: string): [string | null, string | null] {
  const query = new URL(url).searchParams;
  const code = query.get('code');
  const state = query.get('state');
  return [code, state];
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const [code, state] = extractCodeAndState(request.url);

    if (!state) {
      return Response.redirect(
        `/#${qs.stringify({ error: 'state_mismatch' })}`,
        302
      );
    }

    if (!code) {
      return new Response('Authorization code not found', { status: 400 });
    }

    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        state
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Construct the redirect URL using the base of the redirect URI
    const baseRedirectUrl = new URL(REDIRECT_URI).origin;
    const urlParams = new URLSearchParams()
    urlParams.set('access_token', access_token)
    urlParams.set('refresh_token', refresh_token)
    return Response.redirect(`${baseRedirectUrl}/songs?${urlParams.toString()}`, 302);
  } catch (error) {
    console.error('Error during token exchange or redirection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
