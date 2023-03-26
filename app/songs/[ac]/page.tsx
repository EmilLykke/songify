"use client"

import { useEffect, useState } from "react";

const REDIRECT_URI = process.env.REDIRECT_URI;
const re = REDIRECT_URI || "http://localhost:3000/";
const arr = re?.split("/");


const url = arr[0] + "//" + arr[2];



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
          fetch(url+"/api/songs/"+access_token).then(res => res.json()).then(data => setSongsState(data))
      },[par])

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

