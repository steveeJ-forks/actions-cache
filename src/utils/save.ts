import * as core from "@actions/core";
import * as cache from "@martijnhols/actions-cache";

import * as utils from "./actionUtils";
import { Inputs } from "./constants";

export default async function save(primaryKey: string): Promise<void> {
    const cachePaths = utils.getInputAsArray(Inputs.Path, {
        required: true
    });

    try {
        await cache.saveCache(cachePaths, primaryKey, {
            uploadChunkSize: utils.getInputAsInt(Inputs.UploadChunkSize)
        });
        core.info(`Cache saved with key: ${primaryKey}`);
    } catch (error) {
        const typedError = error as Error

        if (typedError.name === cache.ValidationError.name) {
            throw typedError;
        } else if (typedError.name === cache.ReserveCacheError.name) {
            core.info(typedError.message);
        } else {
            utils.logWarning(typedError.message);
        }
    }
}
