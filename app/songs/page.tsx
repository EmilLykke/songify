"use client"

import { useEffect, useState } from "react";
import { Spotify } from "react-spotify-embed";
import "./page.scss"
import { useSearchParams } from "next/navigation";

export default function Songs() {
  const params = useSearchParams()

  const [songs, setSongsState] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const res =  await fetch(`/api/songs`, {method: 'POST', body: JSON.stringify({access_token, refresh_token})})
      const resJson = await res.json()
      setSongsState(resJson)
    }
    getSongs()
  }, [params])

  if(!songs.length){
    return (
      <div className="grid gap-[50px] grid-cols-fluid m-16 spot">
        <h1>Loading songs...</h1>
      </div>
    )
  }

  return (
    <div className="grid gap-[50px] grid-cols-fluid m-16 spot">
      {songs.map((data: any) => (
        <div key={data.name} className="w-[300px]">
          <Spotify link={data.external_urls.spotify} />
        </div>
      ))}
    </div>
  )
}

