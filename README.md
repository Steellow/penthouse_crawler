# Penthouse crawler

What it does...

## Environemnt variables

- `BOT_TOKEN` - Your Telegram bot token

## Storage

- Uses [node-persist](https://www.npmjs.com/package/node-persist) to store stuff
- "banned_areas": Array of banned areas. New apartments found in banned areas are not notified to the user.
  - All banned areas are saved in lower case
- "checked_links": Array of apartment links which are already checked.