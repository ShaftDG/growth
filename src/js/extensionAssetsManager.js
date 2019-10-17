import { AssetsManager } from '@babylonjs/core/Misc/assetsManager';
import { ContainerAssetTask } from "./ContainerAssetTask";

/**
 * Add a ContainerAssetTask to the list of active tasks
 * @param taskName defines the name of the new task
 * @param meshesNames defines the name of meshes to load
 * @param rootUrl defines the root url to use to locate files
 * @param sceneFilename defines the filename of the scene file
 * @returns a new ContainerAssetTask object
 */
AssetsManager.prototype.addContainerTask = function (taskName, meshesNames, rootUrl, sceneFilename) {
    var task = new ContainerAssetTask(taskName, meshesNames, rootUrl, sceneFilename);
    this._tasks.push(task);
    return task;
};

export {};