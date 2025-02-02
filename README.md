# Discord Login Implementation

To implement the login with Discord, follow these steps:

1. **Create a Discord Application:**

   - Go to [Discord Developer Applications](https://discord.com/developers/applications) and create a new application.

2. **Add Redirect URL:**

   - In your application's settings, add `http://localhost:3000` to the Redirects section.

3. **Clone Repository and Set Up Environment:**

   - Clone the repository.
   - Create a `.env` file and add your app tokens by following the `.env.example` file.

4. **Update Frontend Configuration:**

   - Navigate to `frontend/onload.js`.
   - Change the variable `DISCORD_LOGIN_URL` to the URL generated in your Discord application.

5. **Install and Run:**

   - Install dependencies: `npm install`.
   - Start the application: `npm run start`.

6. **Visit the Application:**
   - Open your browser and go to `http://localhost:3000`.

That's it! Your Discord login should now be implemented.
