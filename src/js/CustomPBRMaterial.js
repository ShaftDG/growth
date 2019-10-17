import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { MaterialHelper } from '@babylonjs/core/Materials/materialHelper';
import { PBRBaseMaterial } from '@babylonjs/core/Materials/PBR/pbrBaseMaterial';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { EffectFallbacks } from '@babylonjs/core/Materials/effectFallbacks';
import { Effect } from "@babylonjs/core/Materials/effect";
import { Scene } from '@babylonjs/core/scene';
import { Color3 } from '@babylonjs/core/Maths/math.color';

import * as tslib_1 from "tslib";
import {expandToProperty, serialize, serializeAsTexture} from "@babylonjs/core/Misc/decorators";
import {TmpColors} from "@babylonjs/core/Maths/math.color";
import {MaterialFlags} from "@babylonjs/core/Materials/materialFlags";
import {PBRClearCoatConfiguration} from "@babylonjs/core/Materials/PBR/pbrClearCoatConfiguration";
import {PBRSubSurfaceConfiguration} from "@babylonjs/core/Materials/PBR/pbrSubSurfaceConfiguration";
import {PBRSheenConfiguration} from "@babylonjs/core/Materials/PBR/pbrSheenConfiguration";
import {PBRAnisotropicConfiguration} from "@babylonjs/core/Materials/PBR/pbrAnisotropicConfiguration";

export default class CustomPBRMaterial extends PBRMaterial {
    constructor (name, scene) {
        super(name, scene);

        tslib_1.__decorate([
            serializeAsTexture(),
            expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], CustomPBRMaterial.prototype, "customNoiseTexture", void 0);
        tslib_1.__decorate([
            serializeAsTexture(),
            expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], CustomPBRMaterial.prototype, "gradientFireTexture", void 0);
        tslib_1.__decorate([
            serialize(),
            expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "time", void 0);

        Effect.ShadersStore["customPbrPixelShader"] =
            Effect.ShadersStore.pbrPixelShader
                .replace('#include<fogFragmentDeclaration>',
                    `#include<fogFragmentDeclaration>
                    uniform float time;
                    uniform sampler2D customNoiseSampler;
                    uniform sampler2D gradientFireSampler;

                /*before main  for define your uniform*/ 
                `)
                .replace('gl_FragColor=finalColor;',
                    `
     /*before gl_position use positionUpdate */ 
        vec3 totalColor = vec3(1.0);
        vec3 combustionColor = vec3(0.0);
        vec3 fireColor = vec3(0.0);
        vec3 coalColor = vec3(1.0);
        #ifdef ALBEDO
        vec2 uv2 = vAlbedoUV+uvOffset;
            float upFactor = 0.659;
            float scaleFactorX = 2.0;
            float scaleFactorY = 3.0;
            float iTime = sin(time*0.1);
            float rateFactor = iTime * 1.25;
            float speedFactor = cos(sin(rateFactor*2.0)*2.0);
            float hotFactor = 0.1;
            vec4 noiseTex = texture2D(customNoiseSampler,uv2); 
            vec3 combustionTexture = noiseTex.rgb + rateFactor;            
            
            if ( combustionTexture.r > 0.5 ) {
                fireColor = texture2D( gradientFireSampler,vec2(combustionTexture.r*4.5) ).rgb;
            }  
            
            
         if (combustionTexture.r < upFactor+0.1 && combustionTexture.r > upFactor-0.07) {
            combustionColor = texture2D(gradientFireSampler,vec2( combustionTexture.r*5.53 )).rgb; 
            
            float cutEdge = texture2D(customNoiseSampler,vec2(uv2.x*scaleFactorX, uv2.y*scaleFactorY+speedFactor)).g+ rateFactor;
            if (cutEdge < 0.45) {
                combustionColor*=texture2D(customNoiseSampler,vec2(uv2.x*scaleFactorX, uv2.y*scaleFactorY+speedFactor)).g*hotFactor*clamp(sin(rateFactor*50.0)*10.0, 1.0, 5.0);           
            }
       
            if (cutEdge >= 0.75) {
                combustionColor*=(vec3(1.1, 1.75, 1.1)+texture2D(customNoiseSampler,vec2(uv2.x*scaleFactorX, uv2.y*scaleFactorY+speedFactor)).g)*clamp(sin(rateFactor*50.0), 0.0, 2.0);           
            }
       
            combustionColor*=toLinearSpace(combustionColor);
            combustionColor*=vLightingIntensity.y; 
            
            coalColor = vec3(1.0-texture2D(gradientFireSampler,vec2( combustionTexture.r*5.6 )).r)+0.05;   
        }       
           
        vec4 blended = finalColor * vec4(coalColor, 1.0)+vec4(combustionColor, 1.0);
        
        if ( combustionTexture.r > upFactor ) {
            discard;            
        }
        #endif             
      
       gl_FragColor=blended;
        // gl_FragColor=finalColor;
     `);

    }

    bindForSubMesh(world, mesh, subMesh) {
        var scene = this.getScene();
        var defines = subMesh._materialDefines;
        if (!defines) {
            return;
        }
        var effect = subMesh.effect;
        if (!effect) {
            return;
        }
        this._activeEffect = effect;
        // Matrices
        if (!defines.INSTANCES) {
            this.bindOnlyWorldMatrix(world);
        }
        // Normal Matrix
        if (defines.OBJECTSPACE_NORMALMAP) {
            world.toNormalMatrix(this._normalMatrix);
            this.bindOnlyNormalMatrix(this._normalMatrix);
        }
        var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
        // Bones
        MaterialHelper.BindBonesParameters(mesh, this._activeEffect);
        var reflectionTexture = null;
        var ubo = this._uniformBuffer;
        if (mustRebind) {
            var engine = scene.getEngine();
            ubo.bindToEffect(effect, "Material");
            this.bindViewProjection(effect);
            reflectionTexture = this._getReflectionTexture();
            if (!ubo.useUbo || !this.isFrozen || !ubo.isSync) {
                // Texture uniforms
                if (scene.texturesEnabled) {
                    if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                        ubo.updateFloat2("vAlbedoInfos", this._albedoTexture.coordinatesIndex, this._albedoTexture.level);
                        MaterialHelper.BindTextureMatrix(this._albedoTexture, ubo, "albedo");
                    }
                    if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                        ubo.updateFloat4("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level, this._ambientTextureStrength, this._ambientTextureImpactOnAnalyticalLights);
                        MaterialHelper.BindTextureMatrix(this._ambientTexture, ubo, "ambient");
                    }
                    if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                        ubo.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                        MaterialHelper.BindTextureMatrix(this._opacityTexture, ubo, "opacity");
                    }
                    if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                        ubo.updateMatrix("reflectionMatrix", reflectionTexture.getReflectionTextureMatrix());
                        ubo.updateFloat2("vReflectionInfos", reflectionTexture.level, 0);
                        if (reflectionTexture.boundingBoxSize) {
                            var cubeTexture = reflectionTexture;
                            ubo.updateVector3("vReflectionPosition", cubeTexture.boundingBoxPosition);
                            ubo.updateVector3("vReflectionSize", cubeTexture.boundingBoxSize);
                        }
                        if (!defines.USEIRRADIANCEMAP) {
                            var polynomials = reflectionTexture.sphericalPolynomial;
                            if (defines.USESPHERICALFROMREFLECTIONMAP && polynomials) {
                                if (defines.SPHERICAL_HARMONICS) {
                                    var preScaledHarmonics = polynomials.preScaledHarmonics;
                                    this._activeEffect.setVector3("vSphericalL00", preScaledHarmonics.l00);
                                    this._activeEffect.setVector3("vSphericalL1_1", preScaledHarmonics.l1_1);
                                    this._activeEffect.setVector3("vSphericalL10", preScaledHarmonics.l10);
                                    this._activeEffect.setVector3("vSphericalL11", preScaledHarmonics.l11);
                                    this._activeEffect.setVector3("vSphericalL2_2", preScaledHarmonics.l2_2);
                                    this._activeEffect.setVector3("vSphericalL2_1", preScaledHarmonics.l2_1);
                                    this._activeEffect.setVector3("vSphericalL20", preScaledHarmonics.l20);
                                    this._activeEffect.setVector3("vSphericalL21", preScaledHarmonics.l21);
                                    this._activeEffect.setVector3("vSphericalL22", preScaledHarmonics.l22);
                                }
                                else {
                                    this._activeEffect.setFloat3("vSphericalX", polynomials.x.x, polynomials.x.y, polynomials.x.z);
                                    this._activeEffect.setFloat3("vSphericalY", polynomials.y.x, polynomials.y.y, polynomials.y.z);
                                    this._activeEffect.setFloat3("vSphericalZ", polynomials.z.x, polynomials.z.y, polynomials.z.z);
                                    this._activeEffect.setFloat3("vSphericalXX_ZZ", polynomials.xx.x - polynomials.zz.x, polynomials.xx.y - polynomials.zz.y, polynomials.xx.z - polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalYY_ZZ", polynomials.yy.x - polynomials.zz.x, polynomials.yy.y - polynomials.zz.y, polynomials.yy.z - polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalZZ", polynomials.zz.x, polynomials.zz.y, polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalXY", polynomials.xy.x, polynomials.xy.y, polynomials.xy.z);
                                    this._activeEffect.setFloat3("vSphericalYZ", polynomials.yz.x, polynomials.yz.y, polynomials.yz.z);
                                    this._activeEffect.setFloat3("vSphericalZX", polynomials.zx.x, polynomials.zx.y, polynomials.zx.z);
                                }
                            }
                        }
                        ubo.updateFloat3("vReflectionMicrosurfaceInfos", reflectionTexture.getSize().width, reflectionTexture.lodGenerationScale, reflectionTexture.lodGenerationOffset);
                    }
                    if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                        ubo.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                        MaterialHelper.BindTextureMatrix(this._emissiveTexture, ubo, "emissive");
                    }
                    if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                        ubo.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                        MaterialHelper.BindTextureMatrix(this._lightmapTexture, ubo, "lightmap");
                    }
                    if (MaterialFlags.SpecularTextureEnabled) {
                        if (this._metallicTexture) {
                            ubo.updateFloat3("vReflectivityInfos", this._metallicTexture.coordinatesIndex, this._metallicTexture.level, this._ambientTextureStrength);
                            MaterialHelper.BindTextureMatrix(this._metallicTexture, ubo, "reflectivity");
                        }
                        else if (this._reflectivityTexture) {
                            ubo.updateFloat3("vReflectivityInfos", this._reflectivityTexture.coordinatesIndex, this._reflectivityTexture.level, 1.0);
                            MaterialHelper.BindTextureMatrix(this._reflectivityTexture, ubo, "reflectivity");
                        }
                        if (this._microSurfaceTexture) {
                            ubo.updateFloat2("vMicroSurfaceSamplerInfos", this._microSurfaceTexture.coordinatesIndex, this._microSurfaceTexture.level);
                            MaterialHelper.BindTextureMatrix(this._microSurfaceTexture, ubo, "microSurfaceSampler");
                        }
                    }
                    if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                        ubo.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, this._bumpTexture.level, this._parallaxScaleBias);
                        MaterialHelper.BindTextureMatrix(this._bumpTexture, ubo, "bump");
                        if (scene._mirroredCameraPosition) {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                        }
                        else {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                        }
                    }
                }
                // Point size
                if (this.pointsCloud) {
                    ubo.updateFloat("pointSize", this.pointSize);
                }
                // Colors
                if (defines.METALLICWORKFLOW) {
                    TmpColors.Color3[0].r = (this._metallic === undefined || this._metallic === null) ? 1 : this._metallic;
                    TmpColors.Color3[0].g = (this._roughness === undefined || this._roughness === null) ? 1 : this._roughness;
                    ubo.updateColor4("vReflectivityColor", TmpColors.Color3[0], 0);
                }
                else {
                    ubo.updateColor4("vReflectivityColor", this._reflectivityColor, this._microSurface);
                }
                ubo.updateColor3("vEmissiveColor", MaterialFlags.EmissiveTextureEnabled ? this._emissiveColor : Color3.BlackReadOnly);
                ubo.updateColor3("vReflectionColor", this._reflectionColor);
                if (!defines.SS_REFRACTION && this.subSurface.linkRefractionWithTransparency) {
                    ubo.updateColor4("vAlbedoColor", this._albedoColor, 1);
                }
                else {
                    ubo.updateColor4("vAlbedoColor", this._albedoColor, this.alpha);
                }
                // Visibility
                ubo.updateFloat("visibility", mesh.visibility);
                // Misc
                this._lightingInfos.x = this._directIntensity;
                this._lightingInfos.y = this._emissiveIntensity;
                this._lightingInfos.z = this._environmentIntensity * scene.environmentIntensity;
                this._lightingInfos.w = this._specularIntensity;
                ubo.updateVector4("vLightingIntensity", this._lightingInfos);
            }
            // Textures
            if (scene.texturesEnabled) {
                if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                    ubo.setTexture("albedoSampler", this._albedoTexture);
                }
                if (this._customNoiseTexture) {
                    ubo.setTexture("customNoiseSampler", this._customNoiseTexture);
                }
                if (this._gradientFireTexture) {
                    ubo.setTexture("gradientFireSampler", this._gradientFireTexture);
                }
                if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                    ubo.setTexture("ambientSampler", this._ambientTexture);
                }
                if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                    ubo.setTexture("opacitySampler", this._opacityTexture);
                }
                if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                    if (defines.LODBASEDMICROSFURACE) {
                        ubo.setTexture("reflectionSampler", reflectionTexture);
                    }
                    else {
                        ubo.setTexture("reflectionSampler", reflectionTexture._lodTextureMid || reflectionTexture);
                        ubo.setTexture("reflectionSamplerLow", reflectionTexture._lodTextureLow || reflectionTexture);
                        ubo.setTexture("reflectionSamplerHigh", reflectionTexture._lodTextureHigh || reflectionTexture);
                    }
                    if (defines.USEIRRADIANCEMAP) {
                        ubo.setTexture("irradianceSampler", reflectionTexture.irradianceTexture);
                    }
                }
                if (defines.ENVIRONMENTBRDF) {
                    ubo.setTexture("environmentBrdfSampler", this._environmentBRDFTexture);
                }
                if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                    ubo.setTexture("emissiveSampler", this._emissiveTexture);
                }
                if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                    ubo.setTexture("lightmapSampler", this._lightmapTexture);
                }
                if (MaterialFlags.SpecularTextureEnabled) {
                    if (this._metallicTexture) {
                        ubo.setTexture("reflectivitySampler", this._metallicTexture);
                    }
                    else if (this._reflectivityTexture) {
                        ubo.setTexture("reflectivitySampler", this._reflectivityTexture);
                    }
                    if (this._microSurfaceTexture) {
                        ubo.setTexture("microSurfaceSampler", this._microSurfaceTexture);
                    }
                }
                if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                    ubo.setTexture("bumpSampler", this._bumpTexture);
                }
            }
            this.subSurface.bindForSubMesh(ubo, scene, engine, this.isFrozen, defines.LODBASEDMICROSFURACE);
            this.clearCoat.bindForSubMesh(ubo, scene, engine, this._disableBumpMap, this.isFrozen, this._invertNormalMapX, this._invertNormalMapY);
            this.anisotropy.bindForSubMesh(ubo, scene, this.isFrozen);
            this.sheen.bindForSubMesh(ubo, scene, this.isFrozen);
            // Clip plane
            MaterialHelper.BindClipPlane(this._activeEffect, scene);
            // Colors
            scene.ambientColor.multiplyToRef(this._ambientColor, this._globalAmbientColor);
            var eyePosition = scene._forcedViewPosition ? scene._forcedViewPosition : (scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.globalPosition);
            var invertNormal = (scene.useRightHandedSystem === (scene._mirroredCameraPosition != null));
            effect.setFloat4("vEyePosition", eyePosition.x, eyePosition.y, eyePosition.z, invertNormal ? -1 : 1);
            effect.setColor3("vAmbientColor", this._globalAmbientColor);
            effect.setFloat2("vDebugMode", this.debugLimit, this.debugFactor);
        }
        if (mustRebind || !this.isFrozen) {
            // Lights
            if (scene.lightsEnabled && !this._disableLighting) {
                MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights, this._lightFalloff !== PBRBaseMaterial.LIGHTFALLOFF_STANDARD, this._rebuildInParallel);
            }
            // View
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE || reflectionTexture) {
                this.bindView(effect);
            }
            // Fog
            MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect, true);
            // Morph targets
            if (defines.NUM_MORPH_INFLUENCERS) {
                MaterialHelper.BindMorphTargetParameters(mesh, this._activeEffect);
            }
            // image processing
            this._imageProcessingConfiguration.bind(this._activeEffect);
            // Log. depth
            MaterialHelper.BindLogDepth(defines, this._activeEffect, scene);
        }
        ubo.update();
        this._afterBind(mesh, this._activeEffect);
    };

    _prepareEffect(mesh, defines, onCompiled, onError, useInstances, useClipPlane) {
        if (onCompiled === void 0) { onCompiled = null; }
        if (onError === void 0) { onError = null; }
        if (useInstances === void 0) { useInstances = null; }
        if (useClipPlane === void 0) { useClipPlane = null; }
        this._prepareDefines(mesh, defines, useInstances, useClipPlane);
        if (!defines.isDirty) {
            return null;
        }
        defines.markAsProcessed();
        var scene = this.getScene();
        var engine = scene.getEngine();
        // Fallbacks
        var fallbacks = new EffectFallbacks();
        var fallbackRank = 0;
        if (defines.USESPHERICALINVERTEX) {
            fallbacks.addFallback(fallbackRank++, "USESPHERICALINVERTEX");
        }
        if (defines.FOG) {
            fallbacks.addFallback(fallbackRank, "FOG");
        }
        if (defines.SPECULARAA) {
            fallbacks.addFallback(fallbackRank, "SPECULARAA");
        }
        if (defines.POINTSIZE) {
            fallbacks.addFallback(fallbackRank, "POINTSIZE");
        }
        if (defines.LOGARITHMICDEPTH) {
            fallbacks.addFallback(fallbackRank, "LOGARITHMICDEPTH");
        }
        if (defines.PARALLAX) {
            fallbacks.addFallback(fallbackRank, "PARALLAX");
        }
        if (defines.PARALLAXOCCLUSION) {
            fallbacks.addFallback(fallbackRank++, "PARALLAXOCCLUSION");
        }
        fallbackRank = PBRAnisotropicConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRAnisotropicConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRSubSurfaceConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRSheenConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        if (defines.ENVIRONMENTBRDF) {
            fallbacks.addFallback(fallbackRank++, "ENVIRONMENTBRDF");
        }
        if (defines.TANGENT) {
            fallbacks.addFallback(fallbackRank++, "TANGENT");
        }
        if (defines.BUMP) {
            fallbacks.addFallback(fallbackRank++, "BUMP");
        }
        fallbackRank = MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights, fallbackRank++);
        if (defines.SPECULARTERM) {
            fallbacks.addFallback(fallbackRank++, "SPECULARTERM");
        }
        if (defines.USESPHERICALFROMREFLECTIONMAP) {
            fallbacks.addFallback(fallbackRank++, "USESPHERICALFROMREFLECTIONMAP");
        }
        if (defines.USEIRRADIANCEMAP) {
            fallbacks.addFallback(fallbackRank++, "USEIRRADIANCEMAP");
        }
        if (defines.LIGHTMAP) {
            fallbacks.addFallback(fallbackRank++, "LIGHTMAP");
        }
        if (defines.NORMAL) {
            fallbacks.addFallback(fallbackRank++, "NORMAL");
        }
        if (defines.AMBIENT) {
            fallbacks.addFallback(fallbackRank++, "AMBIENT");
        }
        if (defines.EMISSIVE) {
            fallbacks.addFallback(fallbackRank++, "EMISSIVE");
        }
        if (defines.VERTEXCOLOR) {
            fallbacks.addFallback(fallbackRank++, "VERTEXCOLOR");
        }
        if (defines.MORPHTARGETS) {
            fallbacks.addFallback(fallbackRank++, "MORPHTARGETS");
        }
        if (defines.MULTIVIEW) {
            fallbacks.addFallback(0, "MULTIVIEW");
        }
        //Attributes
        var attribs = [VertexBuffer.PositionKind];
        if (defines.NORMAL) {
            attribs.push(VertexBuffer.NormalKind);
        }
        if (defines.TANGENT) {
            attribs.push(VertexBuffer.TangentKind);
        }
        if (defines.UV1) {
            attribs.push(VertexBuffer.UVKind);
        }
        if (defines.UV2) {
            attribs.push(VertexBuffer.UV2Kind);
        }
        if (defines.VERTEXCOLOR) {
            attribs.push(VertexBuffer.ColorKind);
        }
        MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
        MaterialHelper.PrepareAttributesForInstances(attribs, defines);
        MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
        var shaderName = "customPbr";
        var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vAlbedoColor", "vReflectivityColor", "vEmissiveColor", "visibility", "vReflectionColor",
            "vFogInfos", "vFogColor", "pointSize",
            "vAlbedoInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vReflectionPosition", "vReflectionSize", "vEmissiveInfos", "vReflectivityInfos",
            "vMicroSurfaceSamplerInfos", "vBumpInfos", "vLightmapInfos",
            "mBones",
            "vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "albedoMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "reflectivityMatrix", "normalMatrix", "microSurfaceSamplerMatrix", "bumpMatrix", "lightmapMatrix",
            "vLightingIntensity",
            "logarithmicDepthConstant",
            "vSphericalX", "vSphericalY", "vSphericalZ",
            "vSphericalXX_ZZ", "vSphericalYY_ZZ", "vSphericalZZ",
            "vSphericalXY", "vSphericalYZ", "vSphericalZX",
            "vSphericalL00",
            "vSphericalL1_1", "vSphericalL10", "vSphericalL11",
            "vSphericalL2_2", "vSphericalL2_1", "vSphericalL20", "vSphericalL21", "vSphericalL22",
            "vReflectionMicrosurfaceInfos",
            "vTangentSpaceParams", "boneTextureWidth",
            "vDebugMode",
            "time"
        ];
        var samplers = ["albedoSampler", "reflectivitySampler", "ambientSampler", "emissiveSampler",
            "bumpSampler", "lightmapSampler", "opacitySampler",
            "reflectionSampler", "reflectionSamplerLow", "reflectionSamplerHigh", "irradianceSampler",
            "microSurfaceSampler", "environmentBrdfSampler", "boneSampler",
            "customNoiseSampler", "gradientFireSampler"];
        var uniformBuffers = ["Material", "Scene"];
        PBRSubSurfaceConfiguration.AddUniforms(uniforms);
        PBRSubSurfaceConfiguration.AddSamplers(samplers);
        PBRClearCoatConfiguration.AddUniforms(uniforms);
        PBRClearCoatConfiguration.AddSamplers(samplers);
        PBRAnisotropicConfiguration.AddUniforms(uniforms);
        PBRAnisotropicConfiguration.AddSamplers(samplers);
        PBRSheenConfiguration.AddUniforms(uniforms);
        PBRSheenConfiguration.AddSamplers(samplers);
        if (ImageProcessingConfiguration) {
            ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
            ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
        }
        MaterialHelper.PrepareUniformsAndSamplersList({
            uniformsNames: uniforms,
            uniformBuffersNames: uniformBuffers,
            samplers: samplers,
            defines: defines,
            maxSimultaneousLights: this._maxSimultaneousLights
        });
        if (this.customShaderNameResolve) {
            shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines);
        }
        var join = defines.toString();
        return engine.createEffect({
            vertexElement: "pbr",
            fragmentElement: shaderName
        }, {
            attributes: attribs,
            uniformsNames: uniforms,
            uniformBuffersNames: uniformBuffers,
            samplers: samplers,
            defines: join,
            fallbacks: fallbacks,
            onCompiled: onCompiled,
            onError: onError,
            indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS }
        }, engine);
    };

    dispose (forceDisposeEffect, forceDisposeTextures) {
        if (forceDisposeTextures) {
            if (this._albedoTexture) {
                this._albedoTexture.dispose();
            }
            if (this._customNoiseTexture) {
                this._customNoiseTexture.dispose();
            }
            if (this._gradientFireTexture) {
                this._gradientFireTexture.dispose();
            }
            if (this._ambientTexture) {
                this._ambientTexture.dispose();
            }
            if (this._opacityTexture) {
                this._opacityTexture.dispose();
            }
            if (this._reflectionTexture) {
                this._reflectionTexture.dispose();
            }
            if (this._environmentBRDFTexture && this.getScene()._environmentBRDFTexture !== this._environmentBRDFTexture) {
                this._environmentBRDFTexture.dispose();
            }
            if (this._emissiveTexture) {
                this._emissiveTexture.dispose();
            }
            if (this._metallicTexture) {
                this._metallicTexture.dispose();
            }
            if (this._reflectivityTexture) {
                this._reflectivityTexture.dispose();
            }
            if (this._bumpTexture) {
                this._bumpTexture.dispose();
            }
            if (this._lightmapTexture) {
                this._lightmapTexture.dispose();
            }
            if (this._refractionTexture) {
                this._refractionTexture.dispose();
            }
        }
        this._renderTargets.dispose();
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        super.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
    };
}