import {} from 'babylonjs';

export default class MyCustomPBR extends BABYLON.PBRMaterial {
    constructor (name, scene) {
        super(name, scene);

        this.customNoiseTexture = null;
        this.gradientFireTexture = null;
        // this._prepareEffect = this._prepareEffect.bind(this);
        // this.bindForSubMesh = this.bindForSubMesh.bind(this);
        // this.dispose = this.dispose.bind(this);

        BABYLON.Effect.ShadersStore["customPbrPixelShader"] =
            BABYLON.Effect.ShadersStore.pbrPixelShader
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
            float rateFactor = time*0.25;
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
        
        // if ( combustionTexture.r > upFactor /*|| (uv2.x > 0.5 && uv2.y > 0.2 && uv2.y < 0.8)*/ ) {
        //     discard;            
        // }
        #endif             
      
       // gl_FragColor=max(blended, vec4(0.0));
        gl_FragColor=finalColor;
     `);

    }

    _prepareEffect (mesh, defines, onCompiled, onError, useInstances, useClipPlane) {
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
        var fallbacks = new BABYLON.EffectFallbacks();
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
        if (defines.ENVIRONMENTBRDF) {
            fallbacks.addFallback(fallbackRank++, "ENVIRONMENTBRDF");
        }
        if (defines.TANGENT) {
            fallbacks.addFallback(fallbackRank++, "TANGENT");
        }
        if (defines.BUMP) {
            fallbacks.addFallback(fallbackRank++, "BUMP");
        }
        fallbackRank = BABYLON.MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights, fallbackRank++);
        if (defines.SPECULARTERM) {
            fallbacks.addFallback(fallbackRank++, "SPECULARTERM");
        }
        if (defines.USESPHERICALFROMREFLECTIONMAP) {
            fallbacks.addFallback(fallbackRank++, "USESPHERICALFROMREFLECTIONMAP");
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
        if (defines.NUM_BONE_INFLUENCERS > 0) {
            fallbacks.addCPUSkinningFallback(fallbackRank++, mesh);
        }
        if (defines.MORPHTARGETS) {
            fallbacks.addFallback(fallbackRank++, "MORPHTARGETS");
        }
        //Attributes
        var attribs = [BABYLON.VertexBuffer.PositionKind];
        if (defines.NORMAL) {
            attribs.push(BABYLON.VertexBuffer.NormalKind);
        }
        if (defines.TANGENT) {
            attribs.push(BABYLON.VertexBuffer.TangentKind);
        }
        if (defines.UV1) {
            attribs.push(BABYLON.VertexBuffer.UVKind);
        }
        if (defines.UV2) {
            attribs.push(BABYLON.VertexBuffer.UV2Kind);
        }
        if (defines.VERTEXCOLOR) {
            attribs.push(BABYLON.VertexBuffer.ColorKind);
        }
        BABYLON.MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
        BABYLON.MaterialHelper.PrepareAttributesForInstances(attribs, defines);
        BABYLON.MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
        var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vAlbedoColor", "vReflectivityColor", "vEmissiveColor", "vReflectionColor",
            "vFogInfos", "vFogColor", "pointSize",
            "vAlbedoInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vReflectionPosition", "vReflectionSize", "vEmissiveInfos", "vReflectivityInfos",
            "vMicroSurfaceSamplerInfos", "vBumpInfos", "vLightmapInfos", "vRefractionInfos",
            "mBones",
            "vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "albedoMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "reflectivityMatrix", "normalMatrix", "microSurfaceSamplerMatrix", "bumpMatrix", "lightmapMatrix", "refractionMatrix",
            "vLightingIntensity",
            "logarithmicDepthConstant",
            "vSphericalX", "vSphericalY", "vSphericalZ",
            "vSphericalXX", "vSphericalYY", "vSphericalZZ",
            "vSphericalXY", "vSphericalYZ", "vSphericalZX",
            "vReflectionMicrosurfaceInfos", "vRefractionMicrosurfaceInfos",
            "vTangentSpaceParams",
            "time"
        ];
        var samplers = ["albedoSampler", "reflectivitySampler", "ambientSampler", "emissiveSampler",
            "bumpSampler", "lightmapSampler", "opacitySampler",
            "refractionSampler", "refractionSamplerLow", "refractionSamplerHigh",
            "reflectionSampler", "reflectionSamplerLow", "reflectionSamplerHigh",
            "microSurfaceSampler", "environmentBrdfSampler",
            "customNoiseSampler", "gradientFireSampler"];
        var uniformBuffers = ["Material", "Scene"];
        if (BABYLON.ImageProcessingConfiguration) {
            BABYLON.ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
            BABYLON.ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
        }
        BABYLON.MaterialHelper.PrepareUniformsAndSamplersList({
            uniformsNames: uniforms,
            uniformBuffersNames: uniformBuffers,
            samplers: samplers,
            defines: defines,
            maxSimultaneousLights: this._maxSimultaneousLights
        });
        var join = defines.toString();
        return engine.createEffect({
            vertexElement: "pbr",
            fragmentElement: "customPbr"
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
            if (this.customNoiseTexture) {
                this.customNoiseTexture.dispose();
            }
            if (this.gradientFireTexture) {
                this.gradientFireTexture.dispose();
            }
        }
        super.dispose(forceDisposeEffect, forceDisposeTextures);
    };
}