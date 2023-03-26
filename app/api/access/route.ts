import axios from 'axios';
import { NextRequest } from 'next/server';
import qs from 'querystring';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const re = REDIRECT_URI || "";
const arr = re?.split("/");

const url = arr[0] + "//" + arr[2];


export async function GET(request: NextRequest) {

    let params = request.url.split("?")
    params = params[1].split("&")
    var code = params[0].replace("code=","") || null;
    var state = params[1].replace("state=","") || null;

    if (state === null) {
        return Response.redirect("/#"+qs.stringify({error: "state_mismatch"}),302);

      } else{


    // const tokenResponse = await axios.post(
    //     'https://accounts.spotify.com/api/token',
    //     qs.stringify({
    //         grant_type: 'authorization_code',
    //         code:code,
    //         redirect_uri: REDIRECT_URI,
    //     }),
    //     {
    //         headers: {
    //         "Content-Type": "application/x-www-form-urlencoded", 
    //         'Authorization':'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    //         },
    //     },
    //     );
    //     const {access_token} = tokenResponse.data
        
    // return Response.redirect(url+"/songs/"+access_token);
    return new Response(code);
}

  }
  