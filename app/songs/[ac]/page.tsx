"use client"

import { useEffect, useState } from "react";

export default function Songs({params}:any) {
  const [songs, setSongsState] = useState<any>([]);
    const url = params;
    
    let access_token:string;
    
    if(url["ac"] != null){
       access_token = url["ac"]
    } else{
      access_token = "";
    }

    
      useEffect(()=>{
          fetch("http://localhost:3000/api/songs/"+access_token).then(res => res.json()).then(data => setSongsState(data))
      })

  return (
    <div>
      {songs.map((data: any)=>(
      <div key={data.name}>
        <p>{data.name}</p>

      </div>
      
    ))}
    </div>
  )
}

