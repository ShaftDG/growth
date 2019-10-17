import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Color4 } from '@babylonjs/core/Maths/math.color';

export default class SparksParticles {
    constructor(/*emitter,*/ inOptions) {
        let options = inOptions || {
            size: 10
        };
        this.scene = options.scene;
        this.isTargetStopDuration = true;
////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////// SPARKS /////////////////////////////////////////
        // Particle color
        var colorParticles = function(system, size, EmitPower)
        {
            system.addColorGradient(0.0, new Color4(1.9245, 1.6540, 1.0915, 1));
            system.addColorGradient(0.04, new Color4(1.9062, 1.6132, 1.0942, 1));
            system.addColorGradient(0.4, new Color4(1.7968, 1.3685, 1.1105, 1));
            system.addColorGradient(0.7, new Color4(1.6886, 1.1266, 1.1266, 1));
            system.addColorGradient(0.9, new Color4(0.3113, 0.0367, 0.0367, 1));
            system.addColorGradient(1.0, new Color4(0.3113, 0.0367, 0.0367, 0));

            // Defines the color ramp to apply
            system.addRampGradient(0.0, new Color3(1, 1, 1));
            system.addRampGradient(0.7, new Color3(2, 2, 2));
            system.addRampGradient(1.0, new Color3(0.7968, 0.3685, 0.1105));
            system.useRampGradients = true;

            system.addColorRemapGradient(0, 0, 0.1);
            system.addColorRemapGradient(0.2, 0.1, 0.8);
            system.addColorRemapGradient(0.3, 0.2, 0.85);
            system.addColorRemapGradient(0.35, 0.4, 0.85);
            system.addColorRemapGradient(0.4, 0.5, 0.9);
            system.addColorRemapGradient(0.5, 0.95, 1.0);
            system.addColorRemapGradient(1.0, 0.95, 1.0);

            system.addSizeGradient(0, size * 1.0, size * 1.0);
            system.addSizeGradient(0.1, size * 1.0, size * 1.0);
            system.addSizeGradient(0.2, size * 1.5, size * 1.5);
            system.addSizeGradient(0.3, size * 1.0, size * 1.0);
            system.addSizeGradient(0.8, size * 0.0, size * 0.0);
            system.addSizeGradient(0.9, size * 0.1, size * 0.1);
            system.addSizeGradient(1.0, size * 0.0, size * 0.0);

            // system.addLimitVelocityGradient(10, 15, 10);
            // system.addLimitVelocityGradient(0.120, 12.983, 0.25);
            // system.addLimitVelocityGradient(0.445, 1.780, 0.5);
            // system.addLimitVelocityGradient(0.691, -1.502, 0.75);
            // system.addLimitVelocityGradient(0.930, -1.05, 1.0);
            // system.addLimitVelocityGradient(1.0, -1.0, 1.25);

            // system.limitVelocityDamping = 1.0;
            system.gravity = new Vector3(0, -10, 0);
            system.direction1 = new Vector3(-0.5, 0, 0);
            system.direction2 = new Vector3(0, -1, 0);

            system.noiseStrength = new Vector3(4, 4, 4);

            // system.minEmitPower = -EmitPower / 4;
            // system.maxEmitPower = EmitPower;

            system.targetStopDuration = 1.0;
        };
        this.particlesEmitter = new TransformNode("");
        // Particles
        this.sparksCore = new ParticleSystem("sparksCore", 200, options.scene);
        this.sparksCore.preWarmCycles = 12;
        this.sparksCore.preWarmStepOffset = 3;
        this.sparksCore.emitter = this.particlesEmitter; // the starting object, the emitter
        this.sparksCore.minLifeTime = 0.25;
        this.sparksCore.maxLifeTime = 0.85;
        this.sparksCore.minSize = 0.15;
        this.sparksCore.maxSize = 1.5;
        this.sparksCore.minScaleX = 0.5;
        this.sparksCore.maxScaleX = 0.75;
        this.sparksCore.minScaleY = 0.75;
        this.sparksCore.maxScaleY = 1.0;
        this.sparksCore.emitRate = 200;
        this.sparksCore.noiseTexture = options.noiseTexture;

        this.sparksCore.minEmitPower = 6;
        this.sparksCore.maxEmitPower = 12;
        // this.sparksCore.gravity = new Vector3(0, 0, -10);

        this.sparksCore.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED;
        this.sparksCore.blendMode = ParticleSystem.BLENDMODE_ADD;

        this.sparksCore.updateSpeed = 0.02;
        colorParticles(this.sparksCore, options.size, 12.0);

        this.sparksCore1 = new ParticleSystem("sparksCore1", 200, options.scene);
        this.sparksCore1.preWarmCycles = 12;
        this.sparksCore1.preWarmStepOffset = 3;
        this.sparksCore1.emitter = this.particlesEmitter; // the starting object, the emitter
        this.sparksCore1.minLifeTime = 0.25;
        this.sparksCore1.maxLifeTime = 0.85;
        this.sparksCore1.minSize = 0.15;
        this.sparksCore1.maxSize = 0.2;
        this.sparksCore1.minScaleY = 0.5;
        this.sparksCore1.maxScaleY = 0.6;
        this.sparksCore1.emitRate = 70;

        this.sparksCore1.minEmitPower = -1;
        this.sparksCore1.maxEmitPower = 1;
        // The initial rotation angle
        this.sparksCore1.minInitialRotation = 0;
        this.sparksCore1.maxInitialRotation = Math.PI;

        // Angular speed, in radians
        this.sparksCore1.minAngularSpeed = -Math.PI;
        this.sparksCore1.maxAngularSpeed = Math.PI;

        this.sparksCore1.noiseTexture = options.noiseTexture;

        // this.sparksCore1.gravity = new Vector3(0, 0, -10);

        this.sparksCore1.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED;
        this.sparksCore1.blendMode = ParticleSystem.BLENDMODE_ADD;

        this.sparksCore1.updateSpeed = 0.02;
        colorParticles(this.sparksCore1, options.size * 0.7, 6.0);
    }

    setEmitter (emitter, points) {
        this.particlesEmitter.position = emitter.getAbsolutePosition();

        var walkPS = 0;

        this.sparksCore.startPositionFunction =
        this.sparksCore1.startPositionFunction =
            function (worldMatrix, positionToUpdate, particle) {
                let f = points[walkPS].add(
                    new Vector3(
                        Math.random() * (Math.random() <= 0.5 ? -1 : 1),
                        Math.random() * (Math.random() <= 0.5 ? -1 : 1),
                        Math.random() * (Math.random() <= 0.5 ? -1 : 1)
                    ).scale(Math.random() * (0.15 - 0.05) + 0.05)
                );
                let randX = f.x;
                let randY = f.y;
                let randZ = f.z;

                Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);

                walkPS++;
                if (walkPS > points.length - 1) {
                    walkPS = 0;
                }
            };
    }

    setEmitterPosition (emitter) {
        this.particlesEmitter.position = emitter.getAbsolutePosition();
    }

    setTextureSparkStretched (texture) {
        this.sparksCore.particleTexture = texture;
    }

    setTextureSparkWelding (texture) {
        this.sparksCore1.particleTexture = texture;
    }

    start() {
        this.sparksCore.start();
        this.sparksCore1.start();
    }

    stop() {
        this.sparksCore.stop();
        this.sparksCore1.stop();
    }

    reset() {
        this.sparksCore.reset();
        this.sparksCore1.reset();
    }
}