import { Observable } from "@babylonjs/core/Misc/observable";
import { Nullable } from "@babylonjs/core/types";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Color4 } from "@babylonjs/core/Maths/math";
import { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Material } from "@babylonjs/core/Materials/material";
import { EffectLayer } from "@babylonjs/core";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import "@babylonjs/core/Shaders/glowMapMerge.fragment";
import "@babylonjs/core/Shaders/glowMapMerge.vertex";
import "@babylonjs/core/Shaders/glowBlurPostProcess.fragment";
declare module "../abstractScene" {
    interface AbstractScene {
        /**
         * Return a the first highlight layer of the scene with a given name.
         * @param name The name of the highlight layer to look for.
         * @return The highlight layer if found otherwise null.
         */
        getHeatWaveByName(name: string): Nullable<HeatWave>;
    }
}
/**
 * HeatWave layer options. This helps customizing the behaviour
 * of the highlight layer.
 */
export interface IHeatWaveOptions {
    time: number;
    noiseTexture0: Texture;
    /**
     * Multiplication factor apply to the canvas size to compute the render target size
     * used to generated the glowing objects (the smaller the faster).
     */
    mainTextureRatio: number;
    /**
     * Enforces a fixed size texture to ensure resize independant blur.
     */
    mainTextureFixedSize?: number;
    /**
     * Multiplication factor apply to the main texture size in the first step of the blur to reduce the size
     * of the picture to blur (the smaller the faster).
     */
    blurTextureSizeRatio: number;
    /**
     * How big in texel of the blur texture is the vertical blur.
     */
    blurVerticalSize: number;
    /**
     * How big in texel of the blur texture is the horizontal blur.
     */
    blurHorizontalSize: number;
    /**
     * Alpha blending mode used to apply the blur. Default is combine.
     */
    alphaBlendingMode: number;
    /**
     * The camera attached to the layer.
     */
    camera: Nullable<Camera>;
    /**
     * Should we display highlight as a solid stroke?
     */
    isStroke?: boolean;
    /**
     * The rendering group to draw the layer in.
     */
    renderingGroupId: number;
}
/**
 * The highlight layer Helps adding a glow effect around a mesh.
 *
 * Once instantiated in a scene, simply use the pushMesh or removeMesh method to add or remove
 * glowy meshes to your scene.
 *
 * !!! THIS REQUIRES AN ACTIVE STENCIL BUFFER ON THE CANVAS !!!
 */
export declare class HeatWave extends EffectLayer {

    name: string;
    /**
     * Effect Name of the highlight layer.
     */
    static readonly EffectName = "HeatWave";
    /**
     * The neutral color used during the preparation of the glow effect.
     * This is black by default as the blend operation is a blend operation.
     */
    static NeutralColor: Color4;
    /**
     * Stencil value used for glowing meshes.
     */
    static GlowingMeshStencilReference: number;
    /**
     * Stencil value used for the other meshes in the scene.
     */
    static NormalMeshStencilReference: number;
    /**
     * Specifies whether or not the inner glow is ACTIVE in the layer.
     */
    innerGlow: boolean;
    /**
     * Specifies whether or not the outer glow is ACTIVE in the layer.
     */
    outerGlow: boolean;
    /**
     * Specifies the horizontal size of the blur.
     */
    /**
     * Gets the horizontal size of the blur.
     */
    blurHorizontalSize: number;
    /**
     * Specifies the vertical size of the blur.
     */
    /**
     * Gets the vertical size of the blur.
     */
    blurVerticalSize: number;
    /**
     * An event triggered when the highlight layer is being blurred.
     */
    onBeforeBlurObservable: Observable<HeatWave>;
    /**
     * An event triggered when the highlight layer has been blurred.
     */
    onAfterBlurObservable: Observable<HeatWave>;
    private _instanceGlowingMeshStencilReference;
    private _options;
    private _downSamplePostprocess;
    private _horizontalBlurPostprocess;
    private _verticalBlurPostprocess;
    private _blurTexture;
    private _meshes;
    private _excludedMeshes;
    /**
     * Instantiates a new highlight Layer and references it to the scene..
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     * @param options Sets of none mandatory options to use with the layer (see IHighlightLayerOptions for more information)
     */
    constructor(name: string, scene: Scene, options?: Partial<IHeatWaveOptions>);
    /**
     * Get the effect name of the layer.
     * @return The effect name
     */
    getEffectName(): string;
    /**
     * Create the merge effect. This is the shader use to blit the information back
     * to the main canvas at the end of the scene rendering.
     */
    protected _createMergeEffect(): Effect;
    /**
     * Creates the render target textures and post processes used in the highlight layer.
     */
    protected _createTextureAndPostProcesses(): void;
    /**
     * Returns wether or nood the layer needs stencil enabled during the mesh rendering.
     */
    needStencil(): boolean;
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify wether or not to use instances to render the mesh
     * @param emissiveTexture the associated emissive texture used to generate the glow
     * @return true if ready otherwise, false
     */
    isReady(subMesh: SubMesh, useInstances: boolean): boolean;
    /**
     * Implementation specific of rendering the generating effect on the main canvas.
     * @param effect The effect used to render through
     */
    protected _internalRender(effect: Effect): void;
    /**
     * Returns true if the layer contains information to display, otherwise false.
     */
    shouldRender(): boolean;
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    protected _shouldRenderMesh(mesh: Mesh): boolean;
    /**
     * Sets the required values for both the emissive texture and and the main color.
     */
    protected _setEmissiveTextureAndColor(mesh: Mesh, subMesh: SubMesh, material: Material): void;
    /**
     * Add a mesh in the exclusion list to prevent it to impact or being impacted by the highlight layer.
     * @param mesh The mesh to exclude from the highlight layer
     */
    addExcludedMesh(mesh: Mesh): void;
    /**
     * Remove a mesh from the exclusion list to let it impact or being impacted by the highlight layer.
     * @param mesh The mesh to highlight
     */
    removeExcludedMesh(mesh: Mesh): void;
    /**
     * Determine if a given mesh will be highlighted by the current HeatWave
     * @param mesh mesh to test
     * @returns true if the mesh will be highlighted by the current HeatWave
     */
    hasMesh(mesh: AbstractMesh): boolean;
    /**
     * Add a mesh in the highlight layer in order to make it glow with the chosen color.
     * @param mesh The mesh to highlight
     * @param color The color of the highlight
     * @param glowEmissiveOnly Extract the glow from the emissive texture
     */
    addMesh(mesh: Mesh, color: Color3, glowEmissiveOnly?: boolean): void;
    /**
     * Remove a mesh from the highlight layer in order to make it stop glowing.
     * @param mesh The mesh to highlight
     */
    removeMesh(mesh: Mesh): void;
    /**
     * Force the stencil to the normal expected value for none glowing parts
     */
    private _defaultStencilReference;
    /**
     * Free any resources and references associated to a mesh.
     * Internal use
     * @param mesh The mesh to free.
     * @hidden
     */
    _disposeMesh(mesh: Mesh): void;
    /**
     * Dispose the highlight layer and free resources.
     */
    dispose(): void;
    /**
     * Gets the class name of the effect layer
     * @returns the string with the class name of the effect layer
     */
    getClassName(): string;
    /**
     * Serializes this HeatWave layer
     * @returns a serialized HeatWave layer object
     */
    serialize(): any;
    /**
     * Creates a HeatWave layer from parsed HeatWave layer data
     * @param parsedHeatWave defines the HeatWave layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the HeatWave layer information
     * @returns a parsed HeatWave layer
     */
    static Parse(parsedHeatWave: any, scene: Scene, rootUrl: string): HeatWave;
}
