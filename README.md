# Penthouse crawler

Telegram bot which checks for new top floor apartments from Oikotie, and notifies the user. New apartments are checked once per hour.

Note that some apartments do not contain floor information on Oikotie. In this case, user is notified about the apartment.

## How to

I'm hosting this bot on fly.io. If you want to use this bot yourself, all you gotta do is host it somewhere, specify environemnt variables (see below) and probably change the `URL_SEARCH_RESULTS` variable at `scraper.js`.

## Environemnt variables

- `BOT_TOKEN` - Your Telegram bot token

## Storage

- Uses [node-persist](https://www.npmjs.com/package/node-persist) to store stuff
- BANNED_AREAS: Array of banned areas. New apartments found in banned areas are not notified to the user.
  - All banned areas are saved in lower case, for simplicity.
- CHECKED_LINKS: Array of apartment links which are already checked.
- CHAT_ID: Id of the chat with you & and the bot. Used to send messages to the correct chat.
  - This is saved when you start the bot first time using `/start`