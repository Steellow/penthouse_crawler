# Penthouse crawler

Telegram bot which checks for new top floor apartments from Oikotie, and notifies the user.

New apartments are checked once per hour. You can also ban specific areas, so that the apartments in that area gets ignored.

Note that some apartments do not contain floor information on Oikotie. In this case, user is notified about the apartment just in case.

## How to run it

Just do `npm i` and `npm start` to run this bot. Remember to specify environemnt variables (see section below). **The first time someone does `/start` command, their chat id is saved and later only that user is able to use the bot.**

You might want to change the `URL_SEARCH_RESULTS` variable at `scraper.js`. If you want to change the cron job frequency, check `CronJob` in `bot.js`.

### Running on pm2

I tried to host this bot on Fly.io, but getting [Puppeteer](https://www.npmjs.com/package/puppeteer) to work on cloud just wasn't worth the hassle. So instead, I'm running it using [pm2](https://pm2.keymetrics.io/) on my laptop. This means the bot is running only when the laptop is running, but that's good enough for me since I don't need it to fetch new results at night :)

1. Install [pm2](https://pm2.keymetrics.io/): `npm install pm2 -g`
2. Add this app to pm2: `BOT_TOKEN=xxx pm2 start src/bot.js --name penthouse_crawler`
3. Generate a startup script: `pm2 startup`
4. Save the app to be restored at reboot: `pm2 save`

## Commands

- `/start` - Gives info about the bot and saves the chat id
- `/now` - Runs the cron job immediately
- `/ban x` - Bans specified area

## Environemnt variables

- `BOT_TOKEN` - Your Telegram bot token

## Storage

- Uses [node-persist](https://www.npmjs.com/package/node-persist) to store stuff.
- BANNED_AREAS: Array of banned areas.
  - If a new top floor apartment is located in a banned area, user is not notified about it.
  - All banned areas are saved in lower case, for simplicity.
- CHECKED_LINKS: Array of apartment links which are already checked.
- CHAT_ID: Id of the chat with you & and the bot.
  - Used to send messages to the correct chat.
  - This is saved when you start the bot first time using `/start`.
  - Also prevents bot usage if the chat is doesn't match.