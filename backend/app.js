require("dotenv/config");
const path = require('node:path')
const express = require("express");
const fetch = require("node-fetch");
const { PORT = 3000, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

const memory = {}

const app = express();
// parse POST params sent in body in json format
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', 'frontend')))

app.post('/getToken', async (req, res) => {
  const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code: req.body.code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.FRONTEND_URL,
      scope: 'identify',
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const oauthData = await tokenResponseData.json();
  return res.json(oauthData)
});

app.get("/p/getMe", async (req, res) => {
  const authString = req.headers.authorization
  const me = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: authString,
    },
  })
  if (!me.ok) {
    return false
  }
  const response = await me.json()
  const { id, username } = response;
  const coins = memory[id] || 0
  if (!coins) { memory[id] = 0 }
  const user = { id, username, coins }
  res.json(user)
});

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}`);
});
