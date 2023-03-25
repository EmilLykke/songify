"use client"

import { useEffect, useState } from "react";

export default function Songs({params}:any) {
  const [songs, setSongsState] = useState<any>([]);
    const url = params;
    
    
    if(url["ac"] != null){
      const access_token = url["ac"]
      useEffect(()=>{
          fetch("http://localhost:3000/api/songs/"+access_token).then(res => res.json()).then(data => setSongsState(data))
      },[])
    }

    useEffect(()=>{
      console.log(songs)
    },[songs])


  return (
    <div>
      {songs.map((data: any)=>(
      <p>{data.name}</p>
    ))}
    </div>
  )
}

