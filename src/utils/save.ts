import * as core from "@actions/core";
import * as cache from "@martijnhols/actions-cache";

import * as utils from "./actionUtils";
import { Inputs } from "./constants";

export default async function save(primaryKey: string): Promise<void> {
    const cachePaths = utils.getInputAsArray(Inputs.Path, {
        required: true
    });

    const cacheId = await cache.saveCache(cachePaths, primaryKey, {
        uploadChunkSize: utils.getInputAsInt(Inputs.UploadChunkSize)
    });

    if (cacheId != -1) {
        core.info(`Cache saved with key: ${primaryKey}`);
    }
}
