import * as core from "@actions/core";

import * as utils from "./utils/actionUtils";
import { State } from "./utils/constants";
import save from "./utils/save";
import validate from "./utils/validate";

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on("uncaughtException", e => utils.logWarning(e.message));

async function run(): Promise<void> {
    try {
        validate();

        // Inputs are re-evaluted before the post action, so we want the original key used for restore
        const primaryKey = core.getState(State.CachePrimaryKey);
        if (!primaryKey) {
            throw new Error(`Error retrieving key from state.`);
        }

        const state = utils.getCacheState();

        if (utils.isExactKeyMatch(primaryKey, state)) {
            core.info(
                `Cache hit occurred on the primary key ${primaryKey}, not saving cache.`
            );
            return;
        }

        await save(primaryKey);
    } catch (error) {
        utils.logWarning((error as Error).message);
    }
}

run();

export default run;
