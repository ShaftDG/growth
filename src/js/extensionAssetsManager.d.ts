import { ContainerAssetTask } from "./ContainerAssetTask";

declare module "@babylonjs/core/Misc/assetsManager" {
    interface AssetsManager {
        /**
         * Add a ContainerAssetTask to the list of active tasks
         * @param taskName defines the name of the new task
         * @param meshesNames defines the name of meshes to load
         * @param rootUrl defines the root url to use to locate files
         * @param sceneFilename defines the filename of the scene file
         * @returns a new ContainerAssetTask object
         */
        addContainerTask(taskName: string, meshesNames: any, rootUrl: string, sceneFilename: string): ContainerAssetTask;
    }
}

export declare {};