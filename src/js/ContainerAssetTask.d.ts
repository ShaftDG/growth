import {IParticleSystem} from "@babylonjs/core/Particles/IParticleSystem";
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup";
import {Scene} from "@babylonjs/core/scene";
import {AssetContainer} from "@babylonjs/core/assetContainer";
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import {Skeleton} from "@babylonjs/core/Bones/skeleton";
import {AbstractAssetTask} from "@babylonjs/core/Misc/assetsManager";

export declare class ContainerAssetTask extends AbstractAssetTask {
    /**
     * Defines the name of the task
     */
    name: string;
    /**
     * Defines the list of mesh's names you want to load
     */
    meshesNames: any;
    /**
     * Defines the root url to use as a base to load your meshes and associated resources
     */
    rootUrl: string;
    /**
     * Defines the filename of the scene to load from
     */
    sceneFilename: string;
    /**
     * Gets the list of loaded container
     */
    loadedContainer: AssetContainer;
    /**
     * Gets the list of loaded meshes
     */
    loadedMeshes: Array<AbstractMesh>;
    /**
     * Gets the list of loaded particle systems
     */
    loadedParticleSystems: Array<IParticleSystem>;
    /**
     * Gets the list of loaded skeletons
     */
    loadedSkeletons: Array<Skeleton>;
    /**
     * Gets the list of loaded animation groups
     */
    loadedAnimationGroups: Array<AnimationGroup>;
    /**
     * Callback called when the task is successful
     */
    onSuccess: (task: ContainerAssetTask) => void;
    /**
     * Callback called when the task is successful
     */
    onError: (task: ContainerAssetTask, message?: string, exception?: any) => void;
    /**
     * Creates a new MeshAssetTask
     * @param name defines the name of the task
     * @param meshesNames defines the list of mesh's names you want to load
     * @param rootUrl defines the root url to use as a base to load your meshes and associated resources
     * @param sceneFilename defines the filename of the scene to load from
     */
    constructor(
        /**
         * Defines the name of the task
         */
        name: string,
        /**
         * Defines the list of mesh's names you want to load
         */
        meshesNames: any,
        /**
         * Defines the root url to use as a base to load your meshes and associated resources
         */
        rootUrl: string,
        /**
         * Defines the filename of the scene to load from
         */
        sceneFilename: string);
    /**
     * Execute the current task
     * @param scene defines the scene where you want your assets to be loaded
     * @param onSuccess is a callback called when the task is successfully executed
     * @param onError is a callback called if an error occurs
     */
    runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
}