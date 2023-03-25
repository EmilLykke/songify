import axios from 'axios';
import { NextResponse } from 'next/server';
import qs from 'querystring';

let nums = 1;

function selectFiveGenres(list:any){
  let arr = [];
    while(arr.length < nums+2){
        let r = Math.floor(Math.random() * 125) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    // console.log(arr); 
    
    let total: string = "";

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if(i==0){
        total += `${list[element]}`
      } else{
        total += `,${list[element]}`
      }
    }


    return total;
}

function selectFiveArtists(list:any){
  let arr = [];
    while(arr.length < nums){
        let r = Math.floor(Math.random() * 19) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    // console.log(arr); 
    
    let total: string = "";

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      
      if(i==0){
        total += `${list[element]["id"]}`
      } else{
        total += `,${list[element]["id"]}`
      }
    }

    return total;
}


export async function GET(request: Request, params: any) {
    const access = params["params"]["access_token"]

    const genres = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+access
        },
      },
    );

    const genresList = genres.data.genres;

    
    let genreString: string = selectFiveGenres(genresList);

    
    
    const artists: any = await axios.get(
      'https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          "Authorization": "Bearer "+access,
          "Content-Type": "application/json"
        },
      },
    );


    const artistsList = artists.data.items;
    let artistsString: string = selectFiveArtists(artistsList);
    
    let artistsArr = artistsString.split(",")

    let top_songsString:string = "";
    for (let i = 0; i < nums; i++) {
      const element = artistsArr[i];
      const tracks: any = await axios.get(
        `https://api.spotify.com/v1/artists/${element}/top-tracks?market=DK`,
        {
          headers: {
            "Authorization": "Bearer "+access,
            "Content-Type": "application/json"
          },
        },
      );
      if(tracks.data.tracks[0] == undefined){
        continue
      } else{
        if(i==0){
          top_songsString += `${tracks.data.tracks[0].id}`
        } else{
          top_songsString += `,${tracks.data.tracks[0].id}`
        }
      }
      
    }

    const songs = await axios.get(
      `https://api.spotify.com/v1/recommendations?`+qs.stringify({
        seed_artists: artistsString,
        seed_genres: genreString,
        seed_tracks: top_songsString,
        market: "DK"
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+access
        },
      },
    );
      
    console.log(songs.data.tracks);

    return NextResponse.json(songs.data.tracks); // Redirect the user back to the homepage or another page in your application
  }
  