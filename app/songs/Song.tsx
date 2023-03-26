import React from 'react'

type Props = {
    link: string
}


export default function Song({link}: Props) {

    let src = link.replace("/track", "/embed/track")

  return (
    <div>
        <iframe
        src={src}
        width="100%"
        height="352" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>

    </div>
  )
}
