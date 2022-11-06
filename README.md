# Penthouse crawler

Telegram bot which checks for new top floor apartments from Oikotie, and notifies the user.

New apartments are checked once per hour. You can also ban specific areas, so that the apartments in that area gets ignored.

Note that some apartments do not contain floor information on Oikotie. In this case, user is notified about the apartment just in case.

## How to run it

Just do `npm i` and `npm start` to run this bot. Remember to specify environemnt variables (see section below). **The first time someone does `/start` command, their chat id is saved and later only that user is able to use the bot.**

I'm hosting this bot on fly.io. You can host it pretty much anywhere you want, as long as it has persistent storage (for saving chat id, checked links and banned areas).

You probably want to change the `URL_SEARCH_RESULTS` variable at `scraper.js`. If you want to change the cron job frequency, check `CronJob` in `bot.js`.

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