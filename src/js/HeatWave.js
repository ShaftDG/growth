import * as tslib_1 from "tslib";
import { serialize, SerializationHelper } from "@babylonjs/core/Misc/decorators";
import { Observable } from "@babylonjs/core/Misc/observable";
import { Tools } from "@babylonjs/core/Misc/tools";
import { Vector2, Color3, Color4 } from "@babylonjs/core/Maths/math";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";
import { Material } from "@babylonjs/core/Materials/material";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { PassPostProcess } from "@babylonjs/core/PostProcesses/passPostProcess";
import { BlurPostProcess } from "@babylonjs/core/PostProcesses/blurPostProcess";
import { EffectLayer } from "@babylonjs/core";
import { AbstractScene } from "@babylonjs/core/abstractScene";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Logger } from "@babylonjs/core/Misc/logger";
import { _TypeStore } from '@babylonjs/core/Misc/typeStore';
import "@babylonjs/core/Shaders/glowMapMerge.fragment";
import "@babylonjs/core/Shaders/glowMapMerge.vertex";
import "@babylonjs/core/Shaders/glowBlurPostProcess.fragment";
AbstractScene.prototype.getHeatWaveByName = function (name) {
    for (var index = 0; index < this.effectLayers.length; index++) {
        if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === HeatWave.EffectName) {
            return this.effectLayers[index];
        }
    }
    return null;
};
/**
 * Special Glow Blur post process only blurring the alpha channel
 * It enforces keeping the most luminous color in the color channel.
 */
var HeatWavePostProcess = /** @class */ (function (_super) {
    tslib_1.__extends(HeatWavePostProcess, _super);
    function HeatWavePostProcess(name, time, noiseTexture0, options, camera, samplingMode, engine, reusable) {
        if (samplingMode === void 0) { samplingMode = Texture.BILINEAR_SAMPLINGMODE; }

        var _this = _super.call(this, name, "heatWaveEffect", ["time", "screenSize"], ["noiseRef0", "noiseRef1"], options, camera, samplingMode, engine, reusable) || this;
        _this.time = time;
        _this.noiseTexture0 = noiseTexture0;
        _this.onApplyObservable.add(function (effect) {
            // effect.setFloat("blurWidth", _this.kernel);
            effect.setVector2("screenSize", _this.width, _this.height);
            effect.setFloat('time', _this.time);
            effect.setTexture('noiseRef0', _this.noiseTexture0);
        });
        // _this.onApplyObservable.addOnce(function (effect) {
        //     effect.setTexture('noiseRef0', _this.noiseTexture0);
        // });
        return _this;
    }
    return HeatWavePostProcess;
}(PostProcess));
/**
 * The highlight layer Helps adding a glow effect around a mesh.
 *
 * Once instantiated in a scene, simply use the pushMesh or removeMesh method to add or remove
 * glowy meshes to your scene.
 *
 * !!! THIS REQUIRES AN ACTIVE STENCIL BUFFER ON THE CANVAS !!!
 */
var HeatWave = /** @class */ (function (_super) {
    tslib_1.__extends(HeatWave, _super);
    /**
     * Instantiates a new highlight Layer and references it to the scene..
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     * @param options Sets of none mandatory options to use with the layer (see IHighlightLayerOptions for more information)
     */
    function HeatWave(name, scene, options) {
        var _this = _super.call(this, name, scene) || this;
        _this.name = name;
        /**
         * Specifies whether or not the inner glow is ACTIVE in the layer.
         */
        _this.innerGlow = true;
        /**
         * Specifies whether or not the outer glow is ACTIVE in the layer.
         */
        _this.outerGlow = true;
        /**
         * An event triggered when the highlight layer is being blurred.
         */
        _this.onBeforeBlurObservable = new Observable();
        /**
         * An event triggered when the highlight layer has been blurred.
         */
        _this.onAfterBlurObservable = new Observable();
        _this._instanceGlowingMeshStencilReference = HeatWave.GlowingMeshStencilReference++;
        _this._meshes = {};
        _this._excludedMeshes = {};
        _this.neutralColor = HeatWave.NeutralColor;
        // Warn on stencil
        if (!_this._engine.isStencilEnable) {
            Logger.Warn("Rendering the Highlight Layer requires the stencil to be active on the canvas. var engine = new Engine(canvas, antialias, { stencil: true }");
        }
        // Adapt options
        _this._options = tslib_1.__assign({ time: 0.5, noiseTexture0: null, mainTextureRatio: 0.5, blurTextureSizeRatio: 0.5, heatWaveSize: 1.0, alphaBlendingMode: Constants.ALPHA_COMBINE, camera: null, renderingGroupId: -1 }, options);
        // Initialize the layer
        _this._init({
            alphaBlendingMode: _this._options.alphaBlendingMode,
            camera: _this._options.camera,
            mainTextureFixedSize: _this._options.mainTextureFixedSize,
            mainTextureRatio: _this._options.mainTextureRatio,
            renderingGroupId: _this._options.renderingGroupId
        });
        // Do not render as long as no meshes have been added
        _this._shouldRender = false;
        return _this;
    }

    Object.defineProperty(HeatWave.prototype, "time", {
        /**
         * Gets the time.
         */
        get: function () {
            return this._heatWavePostprocess.time;
        },
        /**
         * Specifies the time.
         */
        set: function (value) {
            this._heatWavePostprocess.time = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(HeatWave.prototype, "noiseTexture0", {
        /**
         * Gets the noiseTexture0.
         */
        get: function () {
            return this._heatWavePostprocess.noiseTexture0;
        },
        /**
         * Specifies the noiseTexture0.
         */
        set: function (value) {
            this._heatWavePostprocess.noiseTexture0 = value;
        },
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(HeatWave.prototype, "heatWaveSize", {
        /**
         * Gets the vertical size of the blur.
         */
        get: function () {
            return this._heatWavePostprocess.kernel;
        },
        /**
         * Specifies the vertical size of the blur.
         */
        set: function (value) {
            this._heatWavePostprocess.kernel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the effect name of the layer.
     * @return The effect name
     */
    HeatWave.prototype.getEffectName = function () {
        return HeatWave.EffectName;
    };
    /**
     * Create the merge effect. This is the shader use to blit the information back
     * to the main canvas at the end of the scene rendering.
     */
    HeatWave.prototype._createMergeEffect = function () {
        // Effect
        return this._engine.createEffect("glowMapMerge", [VertexBuffer.PositionKind], ["offset"], ["textureSampler"], this._options.isStroke ? "#define STROKE \n" : undefined);
    };
    /**
     * Creates the render target textures and post processes used in the highlight layer.
     */
    HeatWave.prototype._createTextureAndPostProcesses = function () {
        var _this = this;
        var blurTextureWidth = this._mainTextureDesiredSize.width * this._options.blurTextureSizeRatio;
        var blurTextureHeight = this._mainTextureDesiredSize.height * this._options.blurTextureSizeRatio;
        blurTextureWidth = this._engine.needPOTTextures ? Tools.GetExponentOfTwo(blurTextureWidth, this._maxSize) : blurTextureWidth;
        blurTextureHeight = this._engine.needPOTTextures ? Tools.GetExponentOfTwo(blurTextureHeight, this._maxSize) : blurTextureHeight;
        var textureType = 0;
        if (this._engine.getCaps().textureHalfFloatRender) {
            textureType = Constants.TEXTURETYPE_HALF_FLOAT;
        }
        else {
            textureType = Constants.TEXTURETYPE_UNSIGNED_INT;
        }
        this._blurTexture = new RenderTargetTexture("HeatWaveRTT", {
            width: blurTextureWidth,
            height: blurTextureHeight
        }, this._scene, false, true, textureType);
        this._blurTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
        this._blurTexture.renderParticles = false;
        this._blurTexture.ignoreCameraViewport = true;
        this._textures = [this._blurTexture];
        if (this._options.alphaBlendingMode === Constants.ALPHA_COMBINE) {
            this._downSamplePostprocess = new PassPostProcess("sceneCopy", this._options.blurTextureSizeRatio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine());
            this._downSamplePostprocess.onApplyObservable.add(function (effect) {
                effect.setTexture("textureSampler", _this._mainTexture);
            });

            this._heatWavePostprocess = new HeatWavePostProcess("heatWaveEffect", this._options.time, this._options.noiseTexture0, 1, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine());
            let time = this._options.time;
            let noiseTexture0 = this._options.noiseTexture0;

            this._heatWavePostprocess.onApplyObservable.add(function (effect) {
                // effect.setTexture("textureSampler", _this._mainTexture);
                effect.setFloat2("screenSize", blurTextureWidth, blurTextureHeight);
                // effect.setFloat('time', time);
                // effect.setTexture('noiseRef0', noiseTexture0);
                // console.log(time);
            });
            this._postProcesses = [this._heatWavePostprocess, this._downSamplePostprocess,];
        }
        this._mainTexture.onAfterUnbindObservable.add(function () {
            _this.onBeforeBlurObservable.notifyObservers(_this);
            var internalTexture = _this._blurTexture.getInternalTexture();
            if (internalTexture) {
                _this._scene.postProcessManager.directRender(_this._postProcesses, internalTexture, true);
            }
            _this.onAfterBlurObservable.notifyObservers(_this);
        });
        // Prevent autoClear.
        this._postProcesses.map(function (pp) { pp.autoClear = false; });
    };
    /**
     * Returns wether or nood the layer needs stencil enabled during the mesh rendering.
     */
    HeatWave.prototype.needStencil = function () {
        return true;
    };
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify wether or not to use instances to render the mesh
     * @param emissiveTexture the associated emissive texture used to generate the glow
     * @return true if ready otherwise, false
     */
    HeatWave.prototype.isReady = function (subMesh, useInstances) {
        var material = subMesh.getMaterial();
        var mesh = subMesh.getRenderingMesh();
        if (!material || !mesh || !this._meshes) {
            return false;
        }
        var emissiveTexture = null;
        var highlightLayerMesh = this._meshes[mesh.uniqueId];
        if (highlightLayerMesh && highlightLayerMesh.glowEmissiveOnly && material) {
            emissiveTexture = material.emissiveTexture;
        }
        return _super.prototype._isReady.call(this, subMesh, useInstances, emissiveTexture);
    };
    /**
     * Implementation specific of rendering the generating effect on the main canvas.
     * @param effect The effect used to render through
     */
    HeatWave.prototype._internalRender = function (effect) {
        // Texture
        effect.setTexture("textureSampler", this._blurTexture);
        effect.setFloat("offset", 0.5);
        // Cache
        var engine = this._engine;
        engine.cacheStencilState();
        // Stencil operations
        engine.setStencilOperationPass(Constants.REPLACE);
        engine.setStencilOperationFail(Constants.KEEP);
        engine.setStencilOperationDepthFail(Constants.KEEP);
        // Draw order
        engine.setStencilMask(0x00);
        engine.setStencilBuffer(true);
        engine.setStencilFunctionReference(this._instanceGlowingMeshStencilReference);
        // 2 passes inner outer
        if (this.outerGlow) {
            effect.setFloat("offset", 0);
            engine.setStencilFunction(Constants.NOTEQUAL);
            engine.drawElementsType(Material.TriangleFillMode, 0, 6);
        }
        if (this.innerGlow) {
            effect.setFloat("offset", 1);
            engine.setStencilFunction(Constants.EQUAL);
            engine.drawElementsType(Material.TriangleFillMode, 0, 6);
        }
        // Restore Cache
        engine.restoreStencilState();
    };
    /**
     * Returns true if the layer contains information to display, otherwise false.
     */
    HeatWave.prototype.shouldRender = function () {
        if (_super.prototype.shouldRender.call(this)) {
            return this._meshes ? true : false;
        }
        return false;
    };
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    HeatWave.prototype._shouldRenderMesh = function (mesh) {
        // Excluded Mesh
        if (this._excludedMeshes && this._excludedMeshes[mesh.uniqueId]) {
            return false;
        }
        if (!_super.prototype.hasMesh.call(this, mesh)) {
            return false;
        }
        return true;
    };
    /**
     * Sets the required values for both the emissive texture and and the main color.
     */
    HeatWave.prototype._setEmissiveTextureAndColor = function (mesh, subMesh, material) {
        var highlightLayerMesh = this._meshes[mesh.uniqueId];
        if (highlightLayerMesh) {
            this._emissiveTextureAndColor.color.set(highlightLayerMesh.color.r, highlightLayerMesh.color.g, highlightLayerMesh.color.b, 1.0);
        }
        else {
            this._emissiveTextureAndColor.color.set(this.neutralColor.r, this.neutralColor.g, this.neutralColor.b, this.neutralColor.a);
        }
        if (highlightLayerMesh && highlightLayerMesh.glowEmissiveOnly && material) {
            this._emissiveTextureAndColor.texture = material.emissiveTexture;
            this._emissiveTextureAndColor.color.set(1.0, 1.0, 1.0, 1.0);
        }
        else {
            this._emissiveTextureAndColor.texture = null;
        }
    };
    /**
     * Add a mesh in the exclusion list to prevent it to impact or being impacted by the highlight layer.
     * @param mesh The mesh to exclude from the highlight layer
     */
    HeatWave.prototype.addExcludedMesh = function (mesh) {
        if (!this._excludedMeshes) {
            return;
        }
        var meshExcluded = this._excludedMeshes[mesh.uniqueId];
        if (!meshExcluded) {
            this._excludedMeshes[mesh.uniqueId] = {
                mesh: mesh,
                beforeBind: mesh.onBeforeBindObservable.add(function (mesh) {
                    mesh.getEngine().setStencilBuffer(false);
                }),
                afterRender: mesh.onAfterRenderObservable.add(function (mesh) {
                    mesh.getEngine().setStencilBuffer(true);
                }),
            };
        }
    };
    /**
     * Remove a mesh from the exclusion list to let it impact or being impacted by the highlight layer.
     * @param mesh The mesh to highlight
     */
    HeatWave.prototype.removeExcludedMesh = function (mesh) {
        if (!this._excludedMeshes) {
            return;
        }
        var meshExcluded = this._excludedMeshes[mesh.uniqueId];
        if (meshExcluded) {
            if (meshExcluded.beforeBind) {
                mesh.onBeforeBindObservable.remove(meshExcluded.beforeBind);
            }
            if (meshExcluded.afterRender) {
                mesh.onAfterRenderObservable.remove(meshExcluded.afterRender);
            }
        }
        this._excludedMeshes[mesh.uniqueId] = null;
    };
    /**
     * Determine if a given mesh will be highlighted by the current HeatWave
     * @param mesh mesh to test
     * @returns true if the mesh will be highlighted by the current HeatWave
     */
    HeatWave.prototype.hasMesh = function (mesh) {
        if (!this._meshes) {
            return false;
        }
        if (!_super.prototype.hasMesh.call(this, mesh)) {
            return false;
        }
        return this._meshes[mesh.uniqueId] !== undefined && this._meshes[mesh.uniqueId] !== null;
    };
    /**
     * Add a mesh in the highlight layer in order to make it glow with the chosen color.
     * @param mesh The mesh to highlight
     * @param color The color of the highlight
     * @param glowEmissiveOnly Extract the glow from the emissive texture
     */
    HeatWave.prototype.addMesh = function (mesh, color, glowEmissiveOnly) {
        var _this = this;
        if (glowEmissiveOnly === void 0) { glowEmissiveOnly = false; }
        if (!this._meshes) {
            return;
        }
        var meshHighlight = this._meshes[mesh.uniqueId];
        if (meshHighlight) {
            meshHighlight.color = color;
        }
        else {
            this._meshes[mesh.uniqueId] = {
                mesh: mesh,
                color: color,
                // Lambda required for capture due to Observable this context
                observerHighlight: mesh.onBeforeBindObservable.add(function (mesh) {
                    if (_this._excludedMeshes && _this._excludedMeshes[mesh.uniqueId]) {
                        _this._defaultStencilReference(mesh);
                    }
                    else {
                        mesh.getScene().getEngine().setStencilFunctionReference(_this._instanceGlowingMeshStencilReference);
                    }
                }),
                observerDefault: mesh.onAfterRenderObservable.add(this._defaultStencilReference),
                glowEmissiveOnly: glowEmissiveOnly
            };
            mesh.onDisposeObservable.add(function () {
                _this._disposeMesh(mesh);
            });
        }
        this._shouldRender = true;
    };
    /**
     * Remove a mesh from the highlight layer in order to make it stop glowing.
     * @param mesh The mesh to highlight
     */
    HeatWave.prototype.removeMesh = function (mesh) {
        if (!this._meshes) {
            return;
        }
        var meshHighlight = this._meshes[mesh.uniqueId];
        if (meshHighlight) {
            if (meshHighlight.observerHighlight) {
                mesh.onBeforeBindObservable.remove(meshHighlight.observerHighlight);
            }
            if (meshHighlight.observerDefault) {
                mesh.onAfterRenderObservable.remove(meshHighlight.observerDefault);
            }
            delete this._meshes[mesh.uniqueId];
        }
        this._shouldRender = false;
        for (var meshHighlightToCheck in this._meshes) {
            if (this._meshes[meshHighlightToCheck]) {
                this._shouldRender = true;
                break;
            }
        }
    };
    /**
     * Force the stencil to the normal expected value for none glowing parts
     */
    HeatWave.prototype._defaultStencilReference = function (mesh) {
        mesh.getScene().getEngine().setStencilFunctionReference(HeatWave.NormalMeshStencilReference);
    };
    /**
     * Free any resources and references associated to a mesh.
     * Internal use
     * @param mesh The mesh to free.
     * @hidden
     */
    HeatWave.prototype._disposeMesh = function (mesh) {
        this.removeMesh(mesh);
        this.removeExcludedMesh(mesh);
    };
    /**
     * Dispose the highlight layer and free resources.
     */
    HeatWave.prototype.dispose = function () {
        if (this._meshes) {
            // Clean mesh references
            for (var id in this._meshes) {
                var meshHighlight = this._meshes[id];
                if (meshHighlight && meshHighlight.mesh) {
                    if (meshHighlight.observerHighlight) {
                        meshHighlight.mesh.onBeforeBindObservable.remove(meshHighlight.observerHighlight);
                    }
                    if (meshHighlight.observerDefault) {
                        meshHighlight.mesh.onAfterRenderObservable.remove(meshHighlight.observerDefault);
                    }
                }
            }
            this._meshes = null;
        }
        if (this._excludedMeshes) {
            for (var id in this._excludedMeshes) {
                var meshHighlight = this._excludedMeshes[id];
                if (meshHighlight) {
                    if (meshHighlight.beforeBind) {
                        meshHighlight.mesh.onBeforeBindObservable.remove(meshHighlight.beforeBind);
                    }
                    if (meshHighlight.afterRender) {
                        meshHighlight.mesh.onAfterRenderObservable.remove(meshHighlight.afterRender);
                    }
                }
            }
            this._excludedMeshes = null;
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * Gets the class name of the effect layer
     * @returns the string with the class name of the effect layer
     */
    HeatWave.prototype.getClassName = function () {
        return "HeatWave";
    };
    /**
     * Serializes this Highlight layer
     * @returns a serialized Highlight layer object
     */
    HeatWave.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.HeatWave";
        // Highlighted meshes
        serializationObject.meshes = [];
        if (this._meshes) {
            for (var m in this._meshes) {
                var mesh = this._meshes[m];
                if (mesh) {
                    serializationObject.meshes.push({
                        glowEmissiveOnly: mesh.glowEmissiveOnly,
                        color: mesh.color.asArray(),
                        meshId: mesh.mesh.id
                    });
                }
            }
        }
        // Excluded meshes
        serializationObject.excludedMeshes = [];
        if (this._excludedMeshes) {
            for (var e in this._excludedMeshes) {
                var excludedMesh = this._excludedMeshes[e];
                if (excludedMesh) {
                    serializationObject.excludedMeshes.push(excludedMesh.mesh.id);
                }
            }
        }
        return serializationObject;
    };
    /**
     * Creates a Highlight layer from parsed Highlight layer data
     * @param parsedHightlightLayer defines the Highlight layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the Highlight layer information
     * @returns a parsed Highlight layer
     */
    HeatWave.Parse = function (parsedHightlightLayer, scene, rootUrl) {
        var hl = SerializationHelper.Parse(function () { return new HeatWave(parsedHightlightLayer.name, scene, parsedHightlightLayer.options); }, parsedHightlightLayer, scene, rootUrl);
        var index;
        // Excluded meshes
        for (index = 0; index < parsedHightlightLayer.excludedMeshes.length; index++) {
            var mesh = scene.getMeshByID(parsedHightlightLayer.excludedMeshes[index]);
            if (mesh) {
                hl.addExcludedMesh(mesh);
            }
        }
        // Included meshes
        for (index = 0; index < parsedHightlightLayer.meshes.length; index++) {
            var highlightedMesh = parsedHightlightLayer.meshes[index];
            var mesh = scene.getMeshByID(highlightedMesh.meshId);
            if (mesh) {
                hl.addMesh(mesh, Color3.FromArray(highlightedMesh.color), highlightedMesh.glowEmissiveOnly);
            }
        }
        return hl;
    };
    /**
     * Effect Name of the highlight layer.
     */
    HeatWave.EffectName = "HeatWave";
    /**
     * The neutral color used during the preparation of the glow effect.
     * This is black by default as the blend operation is a blend operation.
     */
    HeatWave.NeutralColor = new Color4(0, 0, 0, 0);
    /**
     * Stencil value used for glowing meshes.
     */
    HeatWave.GlowingMeshStencilReference = 0x02;
    /**
     * Stencil value used for the other meshes in the scene.
     */
    HeatWave.NormalMeshStencilReference = 0x01;
    tslib_1.__decorate([
        serialize()
    ], HeatWave.prototype, "innerGlow", void 0);
    tslib_1.__decorate([
        serialize()
    ], HeatWave.prototype, "outerGlow", void 0);
    tslib_1.__decorate([
        serialize()
    ], HeatWave.prototype, "heatWaveSize", null);
    tslib_1.__decorate([
        serialize("options")
    ], HeatWave.prototype, "_options", void 0);
    return HeatWave;
}(EffectLayer));
export { HeatWave };
_TypeStore.RegisteredTypes["BABYLON.HeatWave"] = HeatWave;
//# sourceMappingURL=highlightLayer.js.map