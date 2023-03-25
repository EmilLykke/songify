export default async function Auth() {

    const res = await fetch("http://localhost:3000/api/access?code=");

    return (
      <main>
        <h1>Welcome Lat!</h1>
      </main>
    )
  }
  