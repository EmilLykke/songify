export default async function Home() {


    const songs = await fetch("/api/songs");
    console.log(songs)

    return (
      <main>
        <h1>Welcome Lat!</h1>
      </main>
    )
  }
  