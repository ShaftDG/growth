import {
    ParticleSystem,
    VertexBuffer,
    Texture,
    TransformNode,
    Vector2,
    Vector3,
    Color3,
    Color4
} from '@babylonjs/core';

export default class ElectricField {
    constructor(emitter, baseURL, scene, engine) {

// Effect

        var effect = engine.createEffectForParticles("fire", ["time"], ["iTextureFlame", "iTextureBack", "iTextureAlpha"]);
       /* let time = 20;
        effect.onBind = function () {
            effect.setFloat("time", time);
            if (time < 50) {
                time += scene.getEngine().getDeltaTime() * 0.005;
            } else {
                time = 20;
            }
        };*/

        effect.onBindObservable.add((effect) => {
            effect.setTexture("iTextureFlame", new Texture(baseURL + 'assets/textures/lightning/noise_1.png', scene));
            effect.setTexture("iTextureBack", new Texture(baseURL + 'assets/textures/lightning/noise_2.png', scene));
            effect.setTexture("iTextureAlpha", new Texture(baseURL + 'assets/textures/lightning/noise_3.png', scene));
        });

        let time = 0.0;
        effect.onBind = function () {
            effect.setFloat("time", time);
            time += scene.getEngine().getDeltaTime() * 0.0002;
        };

        // Create a particle system
        this.particleSystem = new ParticleSystem("particles", 20, scene, effect);

        //Texture of each particle
        this.particleSystem.particleTexture = new Texture(baseURL + 'assets/textures/fire/sparks.png', scene, true,
            false, Texture.TRILINEAR_SAMPLINGMODE);

        this.particleSystemEmitter = new TransformNode("");
        this.particleSystemEmitter.position = emitter.getAbsolutePosition();
        // this.particleSystemEmitter.parent = emitter;
        // Where the particles come from
        this.particleSystem.emitter = emitter; // the starting object, the emitter
        // let options = {
        //     sizeParticles: 3
        // };
        // Size of each particle (random between...
        this.particleSystem.minSize = 1;
        this.particleSystem.maxSize = 2.5;

        // this.particleSystem.minScaleX = 0.25;
        // this.particleSystem.maxScaleX = 0.5;
        // this.particleSystem.minScaleY = 1.0;
        // this.particleSystem.maxScaleY = 1.5;
        // this.particleSystem.addSizeGradient(0, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        // this.particleSystem.addSizeGradient(0.1, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        // this.particleSystem.addSizeGradient(0.2, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        // this.particleSystem.addSizeGradient(0.3, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        // this.particleSystem.addSizeGradient(0.8, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        // this.particleSystem.addSizeGradient(0.9, options.sizeParticles * 0.4, options.sizeParticles * 0.4);
        // this.particleSystem.addSizeGradient(1.0, options.sizeParticles * 0.2, options.sizeParticles * 0.2);
        // Life time of each particle (random between...
        this.particleSystem.minLifeTime = 0.05;
        this.particleSystem.maxLifeTime = 0.075;
        // Emission rate
        this.particleSystem.emitRate = 20;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystem.gravity = new Vector3(0, 0, 0);

        // The initial rotation angle
        this.particleSystem.minInitialRotation = -Math.PI;
        this.particleSystem.maxInitialRotation = Math.PI;

        // Angular speed, in radians
        this.particleSystem.minAngularSpeed = -Math.PI / 10;
        this.particleSystem.maxAngularSpeed = Math.PI / 10;

        // Speed
        this.particleSystem.minEmitPower = 0;
        this.particleSystem.maxEmitPower = 0;
        this.particleSystem.updateSpeed = 0.01;

        // this.particleSystem.addVelocityGradient(0, 3, 5);
        // this.particleSystem.addVelocityGradient(1.0, -5, -10);

        // No billboard
        this.particleSystem.isBillboardBased = false;
        // this.particleSystem.renderingGroupId = 1;
        // Start the particle system
        //  this.particleSystem.start();
        this.particleSystem.targetStopDuration = 0.75;
        //change start position function
        var walkPS = 0;
        var meshModelVertices = emitter.getVerticesData(VertexBuffer.PositionKind);
        this.particleSystem.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {

            var randX = meshModelVertices[walkPS] * 0.9;
            var randY = meshModelVertices[walkPS + 1] * 0.65;
            var randZ = meshModelVertices[walkPS + 2] * 1.1;

            Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);

            walkPS += 9;
            if (walkPS > meshModelVertices.length) {
                walkPS = /*Math.floor(Math.random() * 10)*/0;
            }
        };

        this.glow = new ParticleSystem("sparksCore", 10, scene);
        this.glow.particleTexture = this.particleSystem.particleTexture;
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
        this.glow.addColorGradient(0.3, new Color4(0.3, 0.6, 1.0, 0.125));
        this.glow.addColorGradient(0.6, new Color4(0.3, 0.6, 1.0, 0));
        // if (this.isTargetStopDuration) {
            this.glow.targetStopDuration = 0.75;
        // }
        this.glow.updateSpeed = 0.02;
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

    start() {
        this.particleSystem.start();
        this.glow.start();
    }

    stop() {
        this.particleSystem.stop();
        this.glow.stop();
    }

    reset() {
        this.particleSystem.reset();
        this.glow.reset();
    }

}