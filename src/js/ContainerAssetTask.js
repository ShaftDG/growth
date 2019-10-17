import { __extends } from "tslib";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { AbstractAssetTask } from "@babylonjs/core/Misc/assetsManager";

var ContainerAssetTask = /** @class */ (function (_super) {
    __extends(ContainerAssetTask, _super);
    /**
     * Creates a new ContainerAssetTask
     * @param name defines the name of the task
     * @param meshesNames defines the list of mesh's names you want to load
     * @param rootUrl defines the root url to use as a base to load your meshes and associated resources
     * @param sceneFilename defines the filename of the scene to load from
     */
    function ContainerAssetTask(
        /**
         * Defines the name of the task
         */
        name,
        /**
         * Defines the list of mesh's names you want to load
         */
        meshesNames,
        /**
         * Defines the root url to use as a base to load your meshes and associated resources
         */
        rootUrl,
        /**
         * Defines the filename of the scene to load from
         */
        sceneFilename) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.meshesNames = meshesNames;
        _this.rootUrl = rootUrl;
        _this.sceneFilename = sceneFilename;
        return _this;
    }
    /**
     * Execute the current task
     * @param scene defines the scene where you want your assets to be loaded
     * @param onSuccess is a callback called when the task is successfully executed
     * @param onError is a callback called if an error occurs
     */
    ContainerAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
        var _this = this;
        SceneLoader.LoadAssetContainer(this.rootUrl, this.sceneFilename, scene, function (container) {
            _this.loadedContainer = container;
            _this.loadedMeshes = container.meshes;
            _this.loadedParticleSystems = container.particleSystems;
            _this.loadedSkeletons = container.skeletons;
            _this.loadedAnimationGroups = container.animationGroups;
            onSuccess();
        }, null, function (scene, message, exception) {
            onError(message, exception);
        });
    };
    return ContainerAssetTask;
}(AbstractAssetTask));
export { ContainerAssetTask };