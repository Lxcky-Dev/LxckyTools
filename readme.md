# LuckyTools

A LuckyTools Production Bought to you by Lxcky and Tubs Thanks to the original Devs Atler , Lucky and myself this is a full stack discord
bot any issues report it to our discord.
Some fetures may not be included.


## Credits

- **Tubs**
- **Lxcky**

**[discord.gg/the-end](https://discord.gg/the-end)**

---

## Features

### Slash Commands
- `/ad` - Get a spam button that works anywhere
- `/custom` - Spam button with your own message
- `/fakeip` - Fake IP lookup with realistic locations
- `/fakenitro` - Fake Discord Nitro gift embed
- `/help` - List all slash commands
- `/ping` - Check bot latency

### Prefix Commands
- `$help` - List all prefix commands
- `$n` - Nuke the server (deletes channels, creates new ones, spams @everyone)
- `$spamroles` - spam create 250 roles

### Core Features
- **User Install Support** - Works in DMs and servers the bot isn't in
- **Protected Server** - Commands blocked in main server
- **Main Guild Check** - Users must be in the main Discord server
- **Cooldowns** - 30min nuke cooldown, 2min command cooldowns
- **Logging** - All commands, buttons, nukes, and errors logged to Discord channel and file
- **Error Handling** - Rate limits, missing perms, max channels all handled gracefully
- **Button Interactions** - Spam buttons with 5min expiry timers

---

## Logging

All events are sent to the log channel:

- Slash command usage (with options)
- Prefix command usage (with args)
- Nuke start (user, server, member count)
- Nuke completion (channels created, messages sent)
- Button clicks
- Errors with stack traces


---

## Error Handling

Handles:
- Rate limits (429) with auto-retry
- Max channels reached (30013)
- Missing permissions (50013)
- Missing access (50001)
- Unknown channels (10003)
- Unknown messages (10008)
- General Discord API errors

Users are DMed when errors occur.

---

## Requirements

- Node.js 18+
- discord.js v14

---

## License

**© LuckyTools , LxckyTools**
