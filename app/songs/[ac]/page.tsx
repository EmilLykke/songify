"use client"

import { useEffect, useState } from "react";
import { Spotify } from "react-spotify-embed";
import "./page.scss"

export default function Songs({params}:any) {

  const [songs, setSongsState] = useState<any>([]);
    const par = params;
    let access_token:string;
    
    if(par["ac"] != null){
       access_token = par["ac"]
    } else{
      access_token = "";
    }
     
    useEffect(()=>{
      fetch("/api/songs/"+access_token).then(res => res.json()).then(data => setSongsState(data))
    },[par])

  return (
    <div className="grid gap-[50px] grid-cols-fluid m-16 spot">
      {songs.map((data: any)=>(
      <div key={data.name} className="w-[300px]">
        <Spotify link={data.external_urls.spotify} />
      </div>
      
    ))}
    </div>
  )
}

