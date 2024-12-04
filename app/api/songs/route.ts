import {
  AccessToken,
  SpotifyApi
} from "@spotify/web-api-ts-sdk";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import genres from './spotify-genres.json'

const CLIENT_ID = process.env.CLIENT_ID;
const openAiApiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: openAiApiKey });

export async function POST(request: Request) {
  const resJson = await request.json();

  const accesToken: AccessToken = {
    access_token: resJson.access_token,
    refresh_token: resJson.refresh_token,
    token_type: "Bearer",
    expires_in: 3600,
  };
  try {
    const api = SpotifyApi.withAccessToken(CLIENT_ID || "", accesToken);

    // list of terms
    // const terms = ['long_term', 'medium_term', 'short_term'];

    // Fetch user's top artists
    const topArtistsResponse = await api.currentUser.topItems('artists', 'long_term',20, Math.floor(Math.random()*30));
    const artistsList = topArtistsResponse.items.map((artist) => artist.name);

    const topTracks = await api.currentUser.topItems('tracks', 'long_term', 20, Math.floor(Math.random()*30));
    const trackList = topTracks.items
    const trackNames = trackList.map((track)=> `Song name: ${track.name}; Artists: ${track.artists.map((artist)=>artist.name).join(',')}`)


    // Get 5 random genres
    const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 5);
    const genresList = randomGenres.map((genre) => genre.name);

    const total = JSON.stringify(
      "Artists: " + artistsList.join('\n') + "\n" +
      "Tracks: " + trackNames.join('\n') + "\n" +
      "Genres: " + genresList.join('\n')
    )

    const aiRes = await sendAiPrompt(JSON.stringify(total))

    // For testing
    // const aiRes ={"content":`javascript[    { song: "Blinding Lights", artist: "The Weeknd" },    { song: "Shape of You", artist: "Ed Sheeran" },    { song: "Watermelon Sugar", artist: "Harry Styles" },    { song: "Peaches", artist: "Justin Bieber" },    { song: "Levitating", artist: "Dua Lipa" },    { song: "Good 4 U", artist: "Olivia Rodrigo" },    { song: "Stay", artist: "The Kid LAROI, Justin Bieber" },    { song: "Shivers", artist: "Ed Sheeran" },    { song: "Montero (Call Me By Your Name)", artist: "Lil Nas X" },    { song: "drivers license", artist: "Olivia Rodrigo" },    { song: "Savage Love", artist: "Jawsh 685, Jason Derulo" },    { song: "Higher Power", artist: "Coldplay" },    { song: "Kiss Me More", artist: "Doja Cat, SZA" },    { song: "Bad Habits", artist: "Ed Sheeran" },    { song: "Leave The Door Open", artist: "Bruno Mars, Anderson .Paak" },    { song: "Don't Start Now", artist: "Dua Lipa" },    { song: "Industry Baby", artist: "Lil Nas X, Jack Harlow" },    { song: "Take My Breath", artist: "The Weeknd" },    { song: "Take You Dancing", artist: "Jason Derulo" },    { song: "Butter", artist: "BTS" }]`, }
    const formattedRes = resFormatter(aiRes.content ?? '') ?? []

    const recommendations = await Promise.all(formattedRes.map(async (song) => {
      const searchResult = await api.search(`${song.song} ${song.artist}`, ['track', 'artist'])
      const searchTrack = {name: searchResult.tracks.items[0].name, external_urls: searchResult.tracks.items[0].external_urls}
      return searchTrack
    }))

    return NextResponse.json(recommendations);
  }
   catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data." },
      { status: 500 }
    );
  }
}

const prompt = "You will recieve a list of top artists and top songs with their related artists as well as a list of genres. From this please generate a list of 20 random songs not on the provided list. Only answer with a JavaScript array with objects containing the song name and the artist name."

const sendAiPrompt = async (topString: string) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: topString,
      },
    ],
  });
  return completion.choices[0].message
}

const resFormatter = (res: string) => {
  const formattedres = res.replace(/\n/g, '').replace(/```/g, '').replace('\\', '')
  const regexForSongs = /\{\s*("?)(song|songName)("?)\s*:\s*"([^"]+)"\s*,\s*("?)artist("?)\s*:\s*"([^"]+)"\s*\}/g
  
  const matches = formattedres.match(regexForSongs)
  const mappedMatches = matches?.map((match) => {
    if(match.includes(`"songName`) || match.includes(`"song"`)) {
      return JSON.parse(match)
    }
    else {
      return JSON.parse(match.replace(`song`, `"song"`).replace(`artist`, `"artist"`))
    }
  })
  // Make sure that the key is song and artist
  const keyMap = mappedMatches?.map((match) => ({song: match[Object.keys(match)[0]], artist: match[Object.keys(match)[1]].split(',')[0]}))
  return keyMap
}