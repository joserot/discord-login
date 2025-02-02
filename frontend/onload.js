const DISCORD_LOGIN_URL =
  "https://discord.com/oauth2/authorize?client_id=1335700572254240860&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=identify";

const getToken = async (code) => {
  const result = await fetch("/getToken", {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resultJson = await result.json();
  window.localStorage.setItem("access_token", resultJson.access_token);
  window.localStorage.setItem("token_type", resultJson.token_type);
  return resultJson;
};

const getMe = async (tokenType, accessToken) => {
  const result = await fetch("/p/getMe", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  });

  const resultJson = await result.json();

  const { username, id, coins } = resultJson;
  document.getElementById("coins").innerText = coins;
  document.getElementById(
    "info"
  ).innerText = `Logged in as: ${username} (id: ${id})`;
  return resultJson;
};

const logout = async () => {
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("token_type");
  window.localStorage.removeItem("refresh_token");
  document.getElementById("info").innerText = "Not logged in";
  document.getElementById("login").style.display = `block`;
  document.getElementById("logout").style.display = `none`;
};

window.onload = async () => {
  const accessToken = window.localStorage.getItem("access_token");
  const tokenType = window.localStorage.getItem("token_type");
  // get code from URL
  const fragment = new URLSearchParams(window.location.search);
  const code = fragment.get("code");

  document.getElementById("login").href = DISCORD_LOGIN_URL;

  if (!code && !accessToken) {
    // if no code and no token (not logged in),
    // show button "Login with Discord"
    document.getElementById("login").style.display = `block`;

    document.getElementById("logout").style.display = `none`;
    return;
  }

  if (code && !accessToken) {
    // if there is code but no token (code not yet exchanged),
    // exchange code for tokens and save tokens in localStorage
    window.history.replaceState({}, document.title, "/"); // set url to "/"
    const result = await getToken(code);
    if (result.token_type && result.access_token) {
      window.localStorage.setItem("token_type", result.token_type);
      window.localStorage.setItem("access_token", result.access_token);
      // get the user info
      await getMe(result.token_type, result.access_token);
      document.getElementById("logout").style.display = `block`;
    }
  }
  if (accessToken) {
    // if token exists, just get the user info
    await getMe(tokenType, accessToken);
    document.getElementById("logout").style.display = `block`;
  }
};
