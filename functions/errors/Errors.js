"use strict";

module.exports = {
    async handle(source, error, message) {
        if (!error) return;

        if (error?.httpStatus === 429 || error?.code === 429) {
            const retryAfter = error?.retryAfter || error?.retry_after || 5;
            console.log(`[RateLimit] ${source}: Waiting ${retryAfter}s`);
            try {
                await message?.author?.send(`Rate limited on ${source}. Retrying in ${retryAfter}s...`).catch(() => {});
            } catch {}
            await new Promise(r => setTimeout(r, retryAfter * 1000));
            return 'retry';
        }

        if (error?.code === 30013) {
            console.log(`[MaxChannels] ${source}: Server channel limit reached`);
            try {
                await message?.author?.send(`${source}: Server has reached max channels (500).`).catch(() => {});
            } catch {}
            return 'stop';
        }

        if (error?.code === 50013) {
            console.log(`[MissingPerms] ${source}: Missing permissions`);
            try {
                await message?.author?.send(`${source}: Bot is missing required permissions.`).catch(() => {});
            } catch {}
            return 'stop';
        }

        if (error?.code === 50001) {
            console.log(`[MissingAccess] ${source}: No access`);
            return 'skip';
        }

        if (error?.code === 10003) {
            console.log(`[UnknownChannel] ${source}: Channel not found`);
            return 'skip';
        }

        if (error?.code === 10008) {
            console.log(`[UnknownMessage] ${source}: Message not found`);
            return 'skip';
        }

        if (error?.code) {
            console.log(`[DiscordAPI] ${source}: Code ${error.code} - ${error.message || 'Unknown'}`);
            try {
                await message?.author?.send(`${source}: Discord API error (${error.code}).`).catch(() => {});
            } catch {}
            return 'skip';
        }

        console.error(`[Error] ${source}:`, error.message || error);
        try {
            await message?.author?.send(`${source}: ${error.message || 'Unknown error'}`).catch(() => {});
        } catch {}
        return 'skip';
    },

    isRetry(result) { return result === 'retry'; },
    isStop(result) { return result === 'stop'; },
    isSkip(result) { return result === 'skip'; }
};