import {
    ParticleSystem,
    ParticleHelper,
    NoiseProceduralTexture,
    // AbstractMesh,
    // CylinderParticleEmitter,
    // Effect,
    Texture,
    // Axis,
    // Mesh,
    // Scalar,
    TransformNode,
    Vector2,
    Vector3,
    Color3,
    Color4
} from '@babylonjs/core';

export default class FireParticles {
    constructor(/*emitter,*/ inOptions) {
        let options = inOptions || {
            sizeParticlesAddBlendMode: 10,
            sizeParticlesStandardBlendMode: 8,
            countParticlesAddBlendMode: 4,
            countParticlesStandardBlendMode: 3
        };
this.scene = options.scene;
this.emitter = null;
        this.isTargetStopDuration = true;
////////////////////////////////////////////////////////////////////////////////////////////////////
                // Effect
        this.effect = options.engine.createEffectForParticles("customFireParticle", ["time"], ["customNoiseSamplerParticles"]);

        let time = 0;
        let order = 0;

        let start_time = Date.now();
        let effect = this.effect;
        this.effect.onBind = function () {
            effect.setFloat("time", time);

            order = (Date.now() - start_time) * 0.0009;
            start_time = Date.now();
            time += order;
        };

        this.ashesParticlesAddBlendMode = new ParticleSystem("ashesParticlesAddBlendMode", 100, options.scene, this.effect);

        this.ashesParticlesEmitter = new TransformNode("");

        this.ashesParticlesAddBlendMode.emitter = this.ashesParticlesEmitter; // the starting object, the emitter
        this.ashesParticlesAddBlendMode.minScaleX = 1.1;
        this.ashesParticlesAddBlendMode.minScaleY = 1.0;
        this.ashesParticlesAddBlendMode.maxScaleX = 1.2;
        this.ashesParticlesAddBlendMode.maxScaleY = 1.2;
        this.ashesParticlesAddBlendMode.preWarmCycles = 20;
        this.ashesParticlesAddBlendMode.preWarmStepOffset = 2;
        this.ashesParticlesAddBlendMode.addSizeGradient(0, options.sizeParticlesAddBlendMode * 0.2, options.sizeParticlesAddBlendMode * 0.2);
        this.ashesParticlesAddBlendMode.addSizeGradient(0.1, options.sizeParticlesAddBlendMode * 0.6, options.sizeParticlesAddBlendMode * 0.6);
        this.ashesParticlesAddBlendMode.addSizeGradient(0.2, options.sizeParticlesAddBlendMode * 0.7, options.sizeParticlesAddBlendMode * 0.7);
        this.ashesParticlesAddBlendMode.addSizeGradient(0.3, options.sizeParticlesAddBlendMode * 0.8, options.sizeParticlesAddBlendMode * 0.8);
        this.ashesParticlesAddBlendMode.addSizeGradient(0.8, options.sizeParticlesAddBlendMode * 0.4, options.sizeParticlesAddBlendMode * 0.4);
        this.ashesParticlesAddBlendMode.addSizeGradient(0.9, options.sizeParticlesAddBlendMode * 0.3, options.sizeParticlesAddBlendMode * 0.3);
        this.ashesParticlesAddBlendMode.addSizeGradient(1.0, options.sizeParticlesAddBlendMode * 0.1, options.sizeParticlesAddBlendMode * 0.1);

        this.ashesParticlesAddBlendMode.translationPivot = new Vector2(0, -0.35);

        // Colors of all particles
        this.ashesParticlesAddBlendMode.addColorGradient(0.2, new Color4.FromHexString("#fdab8000"));
        this.ashesParticlesAddBlendMode.addColorGradient(0.7, new Color4.FromHexString("#f27d0c55"));
        this.ashesParticlesAddBlendMode.addColorGradient(0.6, new Color4.FromHexString("#f2ebe7ff"));
        this.ashesParticlesAddBlendMode.addColorGradient(0.4, new Color4.FromHexString("#643901ff"));

        this.ashesParticlesAddBlendMode.addColorGradient(0.75, new Color4.FromHexString("#f27d0c00"));
        this.ashesParticlesAddBlendMode.addColorGradient(0.9, new Color4.FromHexString("#75767600"));
        this.ashesParticlesAddBlendMode.addColorGradient(1.0, new Color4.FromHexString("#0000000"));

        // // Life time of each particle (random between...)
        this.ashesParticlesAddBlendMode.minLifeTime = 5.0;
        this.ashesParticlesAddBlendMode.maxLifeTime = 6.5;

        // Emission rate
        this.ashesParticlesAddBlendMode.emitRate = options.countParticlesAddBlendMode;
        //
        // // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.ashesParticlesAddBlendMode.blendMode = ParticleSystem.BLENDMODE_ADD;
        //
        // // Set the gravity of all particles
        this.ashesParticlesAddBlendMode.gravity = new Vector3(0, 0, 0);
        //
        // // Angular speed, in radians
        this.ashesParticlesAddBlendMode.minAngularSpeed = 0;
        this.ashesParticlesAddBlendMode.maxAngularSpeed = 0;
        //
        // // Speed
        this.ashesParticlesAddBlendMode.minEmitPower = 0;
        this.ashesParticlesAddBlendMode.maxEmitPower = 0;
        this.ashesParticlesAddBlendMode.updateSpeed = 0.05;
        if (this.isTargetStopDuration) {
            this.ashesParticlesAddBlendMode.targetStopDuration = 3.5;
        }
//////////////////////////////////////////////////////////////////////////////////////////////
        this.effectStandardBlendMode = options.engine.createEffectForParticles("customFireParticleStandardBlendmode", ["time"], ["customNoiseSamplerParticles"]);

        let time1 = 0;
        let order1 = 0;

        let start_time1 = Date.now();
        let effectStandardBlendMode = this.effectStandardBlendMode;
        this.effectStandardBlendMode.onBind = function () {
            effectStandardBlendMode.setFloat("time", time1);

            order1 = (Date.now() - start_time1) * 0.0009;
            start_time1 = Date.now();
            time1 += order1;
        };

        this.ashesParticlesStandardBlendMode = new ParticleSystem("ashesParticlesStandardBlendMode", 100, options.scene, this.effectStandardBlendMode);

        this.ashesParticlesEmitterStandardBlendMode = new TransformNode("");

        this.ashesParticlesStandardBlendMode.emitter = this.ashesParticlesEmitterStandardBlendMode; // the starting object, the emitter
        this.ashesParticlesStandardBlendMode.minScaleX = 1.0;
        this.ashesParticlesStandardBlendMode.minScaleY = 0.7;
        this.ashesParticlesStandardBlendMode.maxScaleX = 1.2;
        this.ashesParticlesStandardBlendMode.maxScaleY = 0.95;
        this.ashesParticlesStandardBlendMode.preWarmCycles = 20;
        this.ashesParticlesStandardBlendMode.preWarmStepOffset = 2;
        this.ashesParticlesStandardBlendMode.addSizeGradient(0, options.sizeParticlesStandardBlendMode * 0.2, options.sizeParticlesStandardBlendMode * 0.2);
        this.ashesParticlesStandardBlendMode.addSizeGradient(0.1, options.sizeParticlesStandardBlendMode * 0.6, options.sizeParticlesStandardBlendMode * 0.6);
        this.ashesParticlesStandardBlendMode.addSizeGradient(0.2, options.sizeParticlesStandardBlendMode * 0.7, options.sizeParticlesStandardBlendMode * 0.7);
        this.ashesParticlesStandardBlendMode.addSizeGradient(0.3, options.sizeParticlesStandardBlendMode * 0.8, options.sizeParticlesStandardBlendMode * 0.8);
        this.ashesParticlesStandardBlendMode.addSizeGradient(0.8, options.sizeParticlesStandardBlendMode * 0.4, options.sizeParticlesStandardBlendMode * 0.4);
        this.ashesParticlesStandardBlendMode.addSizeGradient(0.9, options.sizeParticlesStandardBlendMode * 0.3, options.sizeParticlesStandardBlendMode * 0.3);
        this.ashesParticlesStandardBlendMode.addSizeGradient(1.0, options.sizeParticlesStandardBlendMode * 0.1, options.sizeParticlesStandardBlendMode * 0.1);

        this.ashesParticlesStandardBlendMode.translationPivot = new Vector2(0, -0.35);

        // Colors of all particles
        this.ashesParticlesStandardBlendMode.addColorGradient(0.2, new Color4.FromHexString("#fdab8000"));
        this.ashesParticlesStandardBlendMode.addColorGradient(0.7, new Color4.FromHexString("#f27d0c55"));
        this.ashesParticlesStandardBlendMode.addColorGradient(0.6, new Color4.FromHexString("#f28d00ff"));
        this.ashesParticlesStandardBlendMode.addColorGradient(0.4, new Color4.FromHexString("#643901ff"));
        this.ashesParticlesStandardBlendMode.addColorGradient(0.75, new Color4.FromHexString("#f27d0c00")); //77
        this.ashesParticlesStandardBlendMode.addColorGradient(0.9, new Color4.FromHexString("#75767600"));  //00
        this.ashesParticlesStandardBlendMode.addColorGradient(1.0, new Color4.FromHexString("#00000000"));  //00

        // // Life time of each particle (random between...)
        this.ashesParticlesStandardBlendMode.minLifeTime = 5.0;
        this.ashesParticlesStandardBlendMode.maxLifeTime = 6.5;

        // Emission rate
        this.ashesParticlesStandardBlendMode.emitRate = options.countParticlesStandardBlendMode;
        //
        // // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.ashesParticlesStandardBlendMode.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        //
        // // Set the gravity of all particles
        this.ashesParticlesStandardBlendMode.gravity = new Vector3(0, 0, 0);
        //
        // // Angular speed, in radians
        this.ashesParticlesStandardBlendMode.minAngularSpeed = 0;
        this.ashesParticlesStandardBlendMode.maxAngularSpeed = 0;
        //
        // // Speed
        this.ashesParticlesStandardBlendMode.minEmitPower = 0;
        this.ashesParticlesStandardBlendMode.maxEmitPower = 0;
        this.ashesParticlesStandardBlendMode.updateSpeed = 0.05;
        if (this.isTargetStopDuration) {
            this.ashesParticlesStandardBlendMode.targetStopDuration = 3.5;
        }
///////////////////// SPARKS /////////////////////////////////////////
        // Particle color
        var colorParticles = function(system)
        {
            system.addColorGradient(0.0, new Color4(0.9245, 0.6540, 0.0915, 1));
            system.addColorGradient(0.04, new Color4(0.9062, 0.6132, 0.0942, 1));
            system.addColorGradient(0.4, new Color4(0.7968, 0.3685, 0.1105, 1));
            system.addColorGradient(0.7, new Color4(0.6886, 0.1266, 0.1266, 1));
            system.addColorGradient(0.9, new Color4(0.3113, 0.0367, 0.0367, 1));
            system.addColorGradient(1.0, new Color4(0.3113, 0.0367, 0.0367, 1));

            // Defines the color ramp to apply
            system.addRampGradient(0.0, new Color3(1, 1, 1));
            system.addRampGradient(1.0, new Color3(0.7968, 0.3685, 0.1105));
            system.useRampGradients = true;

            system.addColorRemapGradient(0, 0, 0.1);
            system.addColorRemapGradient(0.2, 0.1, 0.8);
            system.addColorRemapGradient(0.3, 0.2, 0.85);
            system.addColorRemapGradient(0.35, 0.4, 0.85);
            system.addColorRemapGradient(0.4, 0.5, 0.9);
            system.addColorRemapGradient(0.5, 0.95, 1.0);
            system.addColorRemapGradient(1.0, 0.95, 1.0);

        }

        // Noise 1
     /*   var noiseTexture1 = new NoiseProceduralTexture("perlin", 16, options.scene);
        noiseTexture1.animationSpeedFactor = 10;
        noiseTexture1.persistence = 0.8;
        noiseTexture1.brightness = .5;
        noiseTexture1.octaves = 8;*/
        //
        // var noiseTexture3 = new NoiseProceduralTexture("perlin", 256, options.scene);
        // noiseTexture3.animationSpeedFactor = 10;
        // noiseTexture3.persistence = 2;
        // noiseTexture3.brightness = .5;
        // noiseTexture3.octaves = 4;

        // Particles
        this.sparksCore = new ParticleSystem("sparksCore", 10, options.scene);
        this.sparksCore.emitter = this.ashesParticlesEmitter; // the starting object, the emitter
        this.sparksCore.minLifeTime = 0.5;
        this.sparksCore.maxLifeTime = 1.0;
        this.sparksCore.minSize = 0.35;
        this.sparksCore.maxSize = 0.8;
        this.sparksCore.emitRate = 10;
        this.sparksCore.minEmitPower = 3;
        this.sparksCore.maxEmitPower = 7;
        this.sparksCore.noiseTexture = options.noiseTexture;
        this.sparksCore.noiseStrength = new Vector3(10, 1, 10);
        this.sparksCore.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED;
        this.sparksCore.blendMode = ParticleSystem.BLENDMODE_ADD;
        if (this.isTargetStopDuration) {
            this.sparksCore.targetStopDuration = 1.5;
        }
        this.sparksCore.updateSpeed = 0.02;
        colorParticles(this.sparksCore);

        this.sparksCoreBurst = new ParticleSystem("sparksCore", 30, options.scene);
        this.sparksCoreBurst.emitter = this.ashesParticlesEmitter; // the starting object, the emitter
        this.sparksCoreBurst.minLifeTime = 0.5;
        this.sparksCoreBurst.maxLifeTime = 1.0;
        this.sparksCoreBurst.minSize = 0.075;
        this.sparksCoreBurst.maxSize = 0.15;
        this.sparksCoreBurst.emitRate = 20;
        this.sparksCoreBurst.minEmitPower = 2;
        this.sparksCoreBurst.maxEmitPower = 7;
        this.sparksCoreBurst.noiseTexture = options.noiseTexture;
        this.sparksCoreBurst.noiseStrength = new Vector3(10, 2, 10);
        this.sparksCoreBurst.blendMode = ParticleSystem.BLENDMODE_ADD;
        if (this.isTargetStopDuration) {
            this.sparksCoreBurst.targetStopDuration = 1.5;
        }
        this.sparksCoreBurst.updateSpeed = 0.02;
        colorParticles(this.sparksCoreBurst);

        this.glow = new ParticleSystem("sparksCore", 10, options.scene);
        this.glow.emitter = this.ashesParticlesEmitter;
        this.glow.emitRate = 5;
        this.glow.minLifeTime = 0.5;
        this.glow.maxLifeTime = 1;
        this.glow.minScaleX = 11;
        this.glow.maxScaleX = 13;
        this.glow.minScaleY = 9;
        this.glow.maxScaleY = 11;
        this.glow.minEmitPower = 0.2;
        this.glow.maxEmitPower = 0.4;
        this.glow.addColorGradient(0, new Color4(0.3113, 0.1367, 0.0367, 0));
        this.glow.addColorGradient(0.3, new Color4(0.3113, 0.1367, 0.0367, 0.5));
        this.glow.addColorGradient(0.6, new Color4(0.3113, 0.1367, 0.0367, 0));
        if (this.isTargetStopDuration) {
            this.glow.targetStopDuration = 2.0;
        }
        this.glow.updateSpeed = 0.02;
        this.glow.blendMode = ParticleSystem.BLENDMODE_ADD;
    }

    setEmitter (emitter) {
        this.emitter = emitter;
        console.log(1111111111111, this.glow.emitter)
        this.ashesParticlesEmitter.position = emitter.getAbsolutePosition();
        this.ashesParticlesEmitterStandardBlendMode.position = emitter.getAbsolutePosition();

        var angle = Math.PI / 6;
        let coordParticles = [

            new Vector3(1.25 * Math.sin(angle * 4 + (0.7 * Math.PI)) + 0.25, 1.7 * Math.cos(angle * 4 +  (0.7 * Math.PI)) * 1.7, 1.92),
            new Vector3(1.25 * Math.sin(angle * 1 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 1 + (0.7 * Math.PI)), 1.92),
            new Vector3(1.25 * Math.sin(angle * 0 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 0 + (0.7 * Math.PI)) * 0.25, -1.92),
            new Vector3(1.25 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 +  (0.7 * Math.PI)) * 0.75, -1.92),
            new Vector3(1.25 * Math.sin(angle * 0 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 0 + (0.7 * Math.PI)), 1.92),
            new Vector3(1.25 * Math.sin(angle * 2 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 2 +  (0.7 * Math.PI)), 1.92),
            new Vector3(1.25 * Math.sin(angle * 3 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 3 +  (0.7 * Math.PI)), -1.92)
        ];
        // this.glow.startPositionFunction =
            // this.sparksCoreBurst.startPositionFunction =
                this.sparksCore.startPositionFunction =
                    this.ashesParticlesAddBlendMode.startPositionFunction = function(worldMatrix, positionToUpdate, particle)
        {

            var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
            var randX = 1.6 * Math.sin(rndAngle);
            var randY = 1.7 * Math.cos(rndAngle);
            var randZ = 1.92 * (Math.random() <= 0.35 ? -1 : 1);

            // var randX = coordParticles[index1].x;
            // var randY = coordParticles[index1].y;
            // var randZ = coordParticles[index1].z;
            // if (index1 < 5) {
            //     index1++;
            // } else {
            //     index1 = 0;
            // }
            Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
            // console.log(particle);
        }

        this.sparksCoreBurst.startPositionFunction =
           function(worldMatrix, positionToUpdate, particle)
            {

                var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
                var randX = 1.6 * Math.sin(rndAngle);
                var randY = 1.7 * Math.cos(rndAngle);
                var randZ = 1.92 * (Math.random() <= 0.35 ? -1 : 1);

                // var randX = coordParticles[index1].x;
                // var randY = coordParticles[index1].y;
                // var randZ = coordParticles[index1].z;
                // if (index1 < 5) {
                //     index1++;
                // } else {
                //     index1 = 0;
                // }
                Vector3.TransformCoordinatesFromFloatsToRef(randX, randY + 1.0, randZ, worldMatrix, positionToUpdate);
                // console.log(particle);
            }

        this.glow.startPositionFunction =
           function(worldMatrix, positionToUpdate, particle)
                {

                    var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
                    var randX = 1.2 * Math.sin(rndAngle);
                    var randY = 0.5 * Math.cos(rndAngle);
                    var randZ = 2.4;

                    // var randX = coordParticles[index1].x;
                    // var randY = coordParticles[index1].y;
                    // var randZ = coordParticles[index1].z;
                    // if (index1 < 5) {
                    //     index1++;
                    // } else {
                    //     index1 = 0;
                    // }
                    Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
                    // console.log(particle);
                }

        let index = 0;
        this.ashesParticlesStandardBlendMode.startPositionFunction = function(worldMatrix, positionToUpdate, particle)
        {

            // var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
            // var randX = 1.6 * Math.sin(rndAngle);
            // var randY = 1.7 * Math.cos(rndAngle);
            // var randZ = 1.92 * (Math.random() <= 0.35 ? -1 : 1);

            var randX = coordParticles[index].x;
            var randY = coordParticles[index].y;
            var randZ = coordParticles[index].z;
            if (index < 5) {
                index++;
            } else {
                index = 0;
            }
            Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
            // console.log(particle);
        }
    }

    setEmitterPosition (emitter) {
        this.emitter = emitter;
        this.ashesParticlesEmitter.position = emitter.getAbsolutePosition();
        this.ashesParticlesEmitterStandardBlendMode.position = emitter.getAbsolutePosition();

      /*  let scene = this.scene;
        this.sparksCore.onAnimationEnd = function () {
            scene.imageProcessingConfiguration.exposure = 1.0;
            emitter._children.map(v => {
                if (v.material) {
                    v.material.environmentIntensity = 1.0;
                }
            });
        };*/
    }

    setTextureNoiseCombustion (texture) {
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;
        this.ashesParticlesAddBlendMode.particleTexture = texture;
        this.ashesParticlesStandardBlendMode.particleTexture = texture;
    }

    setTextureNoiseCombustion1 (texture) {
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;
        this.effect.onBindObservable.add((effect) => {
            effect.setTexture("customNoiseSamplerParticles", texture);
        });
        this.effectStandardBlendMode.onBindObservable.add((effect) => {
            effect.setTexture("customNoiseSamplerParticles", texture);
        });
    }

    setTextureSpark (texture) {
        this.glow.particleTexture = texture;
        this.sparksCoreBurst.particleTexture = texture;
    }

    setTextureSparkStretched (texture) {
        this.sparksCore.particleTexture = texture;
    }

    start() {

        var mySet = ParticleHelper.ExportSet( [this.ashesParticlesAddBlendMode, this.ashesParticlesStandardBlendMode, this.sparksCore, this.sparksCoreBurst, this.glow] );

        function exportToJsonFile(jsonData) {
console.log(jsonData)
            let dataStr = JSON.stringify(jsonData.serialize());

            // let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            //
            // let exportFileDefaultName = 'data.json';
            //
            // let linkElement = document.createElement('a');
            // linkElement.setAttribute('href', dataUri);
            // linkElement.setAttribute('download', exportFileDefaultName);
            // linkElement.click();
        }

        exportToJsonFile(mySet);

        this.ashesParticlesAddBlendMode.start();
        this.ashesParticlesStandardBlendMode.start();
        this.sparksCore.start();
        this.sparksCoreBurst.start();
        this.glow.start();
        // this.scene.imageProcessingConfiguration.exposure = 0.25;

        // for (var i = 0; i < this.scene.materials.length; i++) {
        //     this.scene.materials[i].environmentIntensity = 0.25;
        // }

        // this.emitter._children.map(v => {
        //    if (v.material) {
        //        v.material.environmentIntensity = 4.0;
        //    }
        // });


        // console.log( this.particleSystemFire);
        // console.log( this.effect.getUniform("time"));
        // console.log(Effect.ShadersStore["glowMapMergePixelShader"]);
        // console.log(Effect.ShadersStore["customFireParticleFragmentShader"]);

    }

    stop() {
        this.ashesParticlesAddBlendMode.stop();
        this.ashesParticlesStandardBlendMode.stop();
        this.sparksCore.stop();
        this.sparksCoreBurst.stop();
        this.glow.stop();
     /*   let scene = this.scene;
        let emitter = this.emitter;
        setTimeout(function () {
            scene.imageProcessingConfiguration.exposure = 1.0;
            emitter._children.map(v => {
                if (v.material) {
                    v.material.environmentIntensity = 1.0;
                }
            });
        }, 500);*/

        // this.scene.imageProcessingConfiguration.exposure = 1.0;
        // this.emitter._children.map(v => {
        //     if (v.material) {
        //         v.material.environmentIntensity = 1.0;
        //     }
        // });
        // for (var i = 0; i < this.scene.materials.length; i++) {
        //     this.scene.materials[i].environmentIntensity = 1.0;
        // }

    }

    reset() {
        this.ashesParticlesAddBlendMode.reset();
        this.ashesParticlesStandardBlendMode.reset();
        this.sparksCore.reset();
        this.sparksCoreBurst.reset();
        this.glow.reset();
        // this.scene.imageProcessingConfiguration.exposure = 1.0;
        // this.emitter._children.map(v => {
        //     if (v.material) {
        //         v.material.environmentIntensity = 1.0;
        //     }
        // });
    }
}