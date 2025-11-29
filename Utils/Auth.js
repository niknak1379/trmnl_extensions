export async function trmnlAuth() {
  // its happening on my own backend anyway ill just make an extra login
  // dont have to put in the refresh token implementation
  console.log("url", process.env.TRMNL_URL);
  let login_with_pass = await fetch(process.env.TRMNL_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: process.env.TRMNL_USER,
      password: process.env.TRMNL_PASSWORD,
    }),
  });
  let tokens = await login_with_pass.json();
  return tokens.access_token;
}
export default trmnlAuth;
