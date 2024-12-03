import qs from 'querystring';
import crypto from 'crypto';

const CLIENT_ID = process.env.CLIENT_ID || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-library-read',
].join(' ');

if (!CLIENT_ID || !REDIRECT_URI) {
  throw new Error('Missing required environment variables: CLIENT_ID or REDIRECT_URI.');
}

/**
 * Generates a random state string for OAuth2 to prevent CSRF attacks.
 * @returns {string} A random hexadecimal string.
 */
function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function GET(request: Request) {
  try {
    const state = generateState();

    const queryParams = qs.stringify({
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      scope: SCOPES,
      state,
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

    return Response.redirect(spotifyAuthUrl, 302);
  } catch (error) {
    console.error('Error generating Spotify authorization URL:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
