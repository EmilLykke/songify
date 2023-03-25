import qs from 'querystring';
const crypto = require("crypto")

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = 'user-read-email user-read-private user-top-read user-library-read';

const state =  crypto.randomBytes(16).toString('hex');

export async function GET(request: Request) {
    return Response.redirect('https://accounts.spotify.com/authorize?'+
    qs.stringify({
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      scope: SCOPES,
      state: state,
    }),302); // Redirect the user back to the homepage or another page in your application
    
  }
  