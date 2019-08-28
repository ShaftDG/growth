import {
    HighlightLayer
} from '@babylonjs/core/Layers'
import {VertexBuffer} from "@babylonjs/core/Meshes/buffer";
import {Texture} from "@babylonjs/core/index";
import {MaterialHelper} from "@babylonjs/core/Materials/materialHelper";
import {EffectLayer} from "@babylonjs/core/Layers/effectLayer";
import {RenderTargetTexture} from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import {Vector2} from "@babylonjs/core/Maths/math";
import {PassPostProcess} from "@babylonjs/core/PostProcesses/passPostProcess";
import {Tools} from "@babylonjs/core/Misc/tools";
import {Constants} from "@babylonjs/core/Engines/constants";
import {BlurPostProcess} from "@babylonjs/core/PostProcesses/blurPostProcess";

class CustomHighLightLayer extends HighlightLayer{
    constructor (name, scene, options) {
        super(name, scene, options);
        this.texture = null;
    }

    _createTextureAndPostProcesses () {
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
        this._blurTexture = new RenderTargetTexture("HighlightLayerBlurRTT", {
            width: blurTextureWidth,
            height: blurTextureHeight
        }, this._scene, false, true, textureType);
        this._blurTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture.anisotropicFilteringLevel = 16;
        this._blurTexture.updateSamplingMode(Texture.TRILINEAR_SAMPLINGMODE);
        this._blurTexture.renderParticles = false;
        this._blurTexture.ignoreCameraViewport = true;
        this._textures = [this._blurTexture];
        if (this._options.alphaBlendingMode === Constants.ALPHA_COMBINE) {
            this._downSamplePostprocess = new PassPostProcess("HighlightLayerPPP", this._options.blurTextureSizeRatio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine());
            this._downSamplePostprocess.onApplyObservable.add(function (effect) {
                effect.setTexture("textureSampler", _this._mainTexture);
            });
            this._horizontalBlurPostprocess = new GlowBlurPostProcess("HighlightLayerHBP", new Vector2(1.0, 0), this._options.blurHorizontalSize, 1, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine());
            this._horizontalBlurPostprocess.onApplyObservable.add(function (effect) {
                effect.setFloat2("screenSize", blurTextureWidth, blurTextureHeight);
            });
            this._verticalBlurPostprocess = new GlowBlurPostProcess("HighlightLayerVBP", new Vector2(0, 1.0), this._options.blurVerticalSize, 1, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine());
            this._verticalBlurPostprocess.onApplyObservable.add(function (effect) {
                effect.setFloat2("screenSize", blurTextureWidth, blurTextureHeight);
            });
            this._postProcesses = [this._downSamplePostprocess, this._horizontalBlurPostprocess, this._verticalBlurPostprocess];
        }
        else {
            this._horizontalBlurPostprocess = new BlurPostProcess("HighlightLayerHBP", new Vector2(1.0, 0), this._options.blurHorizontalSize / 2, {
                width: blurTextureWidth,
                height: blurTextureHeight
            }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
            this._horizontalBlurPostprocess.width = blurTextureWidth;
            this._horizontalBlurPostprocess.height = blurTextureHeight;
            this._horizontalBlurPostprocess.onApplyObservable.add(function (effect) {
                effect.setTexture("textureSampler", _this._mainTexture);
            });
            this._verticalBlurPostprocess = new BlurPostProcess("HighlightLayerVBP", new Vector2(0, 1.0), this._options.blurVerticalSize / 2, {
                width: blurTextureWidth,
                height: blurTextureHeight
            }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
            this._postProcesses = [this._horizontalBlurPostprocess, this._verticalBlurPostprocess];
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
    }
}

export { CustomHighLightLayer }