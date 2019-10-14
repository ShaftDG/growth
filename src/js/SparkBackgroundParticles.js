import {
    ParticleSystem,
    TransformNode,
    Vector2,
    Vector3,
    Color3,
    Color4
} from '@babylonjs/core';
import {Texture, VertexBuffer} from "@babylonjs/core/index";
// import {ParticleHelper} from "@babylonjs/core/index";
export default class SparkBackgroundParticles {
    constructor(baseURL, scene, engine) {

        // Create a particle system
let options = {
    sizeParticles: 10
};

        this.particleSystemSparks = new ParticleSystem("particles", 20, scene);
        this.particleSystemSparks.preWarmCycles = 10;
        this.particleSystemSparks.preWarmStepOffset = 2;

        this.sparkEmitter = new TransformNode("");
        // this.sparkEmitter.parent = emitter;
        // this.sparkEmitter.position = new Vector3(0, 0, 0).subtract(emitter.position);
        // Where the particles come from
        this.particleSystemSparks.emitter = this.sparkEmitter; // the starting object, the emitter

        // Colors of all particles
        this.particleSystemSparks.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        this.particleSystemSparks.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        this.particleSystemSparks.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        this.particleSystemSparks.minSize = 5.0;
        this.particleSystemSparks.maxSize = 9.0;

        this.particleSystemSparks.addSizeGradient(0, options.sizeParticles * 0.2, options.sizeParticles * 0.2);
        this.particleSystemSparks.addSizeGradient(0.1, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        this.particleSystemSparks.addSizeGradient(0.2, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        this.particleSystemSparks.addSizeGradient(0.3, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        this.particleSystemSparks.addSizeGradient(0.8, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        this.particleSystemSparks.addSizeGradient(0.9, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        this.particleSystemSparks.addSizeGradient(1.0, options.sizeParticles * 0.5, options.sizeParticles * 0.5);

        // Life time of each particle (random between...
        this.particleSystemSparks.minLifeTime = 12;
        this.particleSystemSparks.maxLifeTime = 12;

        // Emission rate
        this.particleSystemSparks.emitRate = 7;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystemSparks.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystemSparks.gravity = new Vector3(0, 0, 0);

        // Direction of each particle after it has been emitted
        //this.particleSystemSparks.direction1 = new BABYLON.Vector3(-7, 8, 3);
        // this.particleSystemSparks.direction2 = new BABYLON.Vector3(7, 8, -3);

        // Angular speed, in radians
        this.particleSystemSparks.minInitialRotation = 0;
        this.particleSystemSparks.maxInitialRotation = Math.PI;
        this.particleSystemSparks.minAngularSpeed = -0.025;
        this.particleSystemSparks.maxAngularSpeed = 0.025;

        // Speed
        this.particleSystemSparks.minEmitPower = 0;
        this.particleSystemSparks.maxEmitPower = 0;
        this.particleSystemSparks.updateSpeed = 0.1;

        this.particleSystemSparks.targetStopDuration = 2.5;
        // No billboard
        // particleSystemSpark.isBillboardBased = false;

        var effect = engine.createEffectForParticles("electric", ["time"], ["iTextureFlame", "iTextureBack", "iTextureAlpha"]);

        effect.onBindObservable.add((effect) => {
            effect.setTexture("iTextureFlame", new Texture(baseURL + 'assets/textures/lightning/noise_1.png', scene));
            effect.setTexture("iTextureBack", new Texture(baseURL + 'assets/textures/lightning/noise_2.png', scene));
            effect.setTexture("iTextureAlpha", new Texture(baseURL + 'assets/textures/lightning/noise_3.png', scene));
        });

        let time = 0.0;
        effect.onBind = function () {
            effect.setFloat("time", time);
            time += scene.getEngine().getDeltaTime() * 0.00005;
        };

        // Create a particle system
        this.particleSystemLightning = new ParticleSystem("particles", 20, scene, effect);

        //Texture of each particle


        this.particleSystemEmitter = new TransformNode("");

        // this.particleSystemEmitter.parent = emitter;
        // Where the particles come from
        // the starting object, the emitter
        this.particleSystemLightning.emitter = this.particleSystemEmitter;
        // let options = {
        //     sizeParticles: 3
        // };
        // Size of each particle (random between...
        this.particleSystemLightning.minSize = 1.0;
        this.particleSystemLightning.maxSize = 3.5;

        // this.particleSystemLightning.minScaleX = 0.25;
        // this.particleSystemLightning.maxScaleX = 0.5;
        this.particleSystemLightning.minScaleY = 1.0;
        this.particleSystemLightning.maxScaleY = 2.0;
        // this.particleSystemLightning.addSizeGradient(0, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        // this.particleSystemLightning.addSizeGradient(0.1, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        // this.particleSystemLightning.addSizeGradient(0.2, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        // this.particleSystemLightning.addSizeGradient(0.3, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        // this.particleSystemLightning.addSizeGradient(0.8, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        // this.particleSystemLightning.addSizeGradient(0.9, options.sizeParticles * 0.4, options.sizeParticles * 0.4);
        // this.particleSystemLightning.addSizeGradient(1.0, options.sizeParticles * 0.2, options.sizeParticles * 0.2);
        // Life time of each particle (random between...
        this.particleSystemLightning.minLifeTime = 0.5;
        this.particleSystemLightning.maxLifeTime = 2.75;
        // Emission rate
        this.particleSystemLightning.emitRate = 6;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystemLightning.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystemLightning.gravity = new Vector3(0, 0, 0);

        // The initial rotation angle
        this.particleSystemLightning.minInitialRotation = 0;
        this.particleSystemLightning.maxInitialRotation = Math.PI;

        // Angular speed, in radians
        this.particleSystemLightning.minAngularSpeed = -Math.PI / 5;
        this.particleSystemLightning.maxAngularSpeed = Math.PI / 5;

        // Speed
        this.particleSystemLightning.minEmitPower = 0;
        this.particleSystemLightning.maxEmitPower = 0;
        this.particleSystemLightning.updateSpeed = 0.1;

        // this.particleSystemLightning.addVelocityGradient(0, 3, 5);
        // this.particleSystemLightning.addVelocityGradient(1.0, -5, -10);

        // No billboard
        this.particleSystemLightning.isBillboardBased = false;
        // this.particleSystemLightning.renderingGroupId = 1;
        // Start the particle system
        //  this.particleSystemLightning.start();
        this.particleSystemLightning.targetStopDuration = 4.75;

        this.glow = new ParticleSystem("sparksCore", 10, scene);
        this.glow.emitter = this.particleSystemEmitter;
        this.glow.emitRate = 5;
        this.glow.minLifeTime = 0.25;
        this.glow.maxLifeTime = 0.5;
        this.glow.minScaleX = 9;
        this.glow.maxScaleX = 11;
        this.glow.minScaleY = 7;
        this.glow.maxScaleY = 9;
        this.glow.minEmitPower = 0.2;
        this.glow.maxEmitPower = 0.4;
        this.glow.addColorGradient(0, new Color4(0.3, 0.6, 1.0, 0));
        this.glow.addColorGradient(0.3, new Color4(0.3, 0.6, 1.0, 0.25));
        this.glow.addColorGradient(0.5, new Color4(0.3, 0.6, 1.0, 0));

        this.glow.minInitialRotation = 0;
        this.glow.maxInitialRotation = Math.PI;
        this.glow.minAngularSpeed = -0.025;
        this.glow.maxAngularSpeed = 0.025;
        // if (this.isTargetStopDuration) {
        this.glow.targetStopDuration = 0.4;
        // }
        this.glow.updateSpeed = 0.01;
        this.glow.blendMode = ParticleSystem.BLENDMODE_ADD;
        // this.glow.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {
        //
        //     var randX = meshModelVertices[walkPS];
        //     var randY = meshModelVertices[walkPS + 1];
        //     var randZ = meshModelVertices[walkPS + 2];
        //
        //     Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
        //
        //     walkPS += 9;
        //     if (walkPS > meshModelVertices.length) {
        //         walkPS = 0;
        //     }
        // };
    }

    setEmitterPosition (emitter) {
        // this.particleSystemLightning.emitter = emitter;
        //change start position function
        // console.log(emitter.name)
        // var walkPS = 0;
        // var meshModelVertices = emitter._children[0]._children[1].getVerticesData(VertexBuffer.PositionKind);
        this.particleSystemLightning.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {

            // var randX = meshModelVertices[walkPS] * 0.9;
            // var randY = meshModelVertices[walkPS + 1] * 0.65;
            // var randZ = meshModelVertices[walkPS + 2] * 1.1;

            var rndAngle = 2 * Math.random() * Math.PI;
            var randX = 1.2 * Math.sin(rndAngle);
            var randY = 1.0 * Math.cos(rndAngle);
            var randZ = 1.92 * (Math.random() <= 0.25 ? -1 : 1);

            Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);

            // walkPS += 9;
            // if (walkPS > meshModelVertices.length) {
            //     walkPS = /*Math.floor(Math.random() * 10)*/0;
            // }
        };
        this.particleSystemEmitter.position = emitter.getAbsolutePosition();
        this.sparkEmitter.position = emitter.getAbsolutePosition();
        this.sparkEmitter.position.z -= 0.5;
    }

    setTextureSpark (texture) {
        this.particleSystemSparks.particleTexture = texture;
        this.particleSystemLightning.particleTexture = texture;
    }

    setTextureGlow (texture) {
        this.glow.particleTexture = texture;
    }

    start() {

       /* var mySet = ParticleHelper.ExportSet( [this.particleSystemSparks] );

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

        exportToJsonFile(mySet);*/

        this.particleSystemSparks.start();
        this.particleSystemLightning.start();
        this.glow.start();
    }

    stop() {
        this.particleSystemSparks.stop();
        this.particleSystemLightning.stop();
        this.glow.stop();
    }

    reset() {
        this.particleSystemSparks.reset();
        this.particleSystemLightning.reset();
        this.glow.reset();
    }
}