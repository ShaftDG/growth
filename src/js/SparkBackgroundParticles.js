import {
    ParticleSystem,
    TransformNode,
    Vector2,
    Vector3,
    Color3,
    Color4
} from '@babylonjs/core';
// import {ParticleHelper} from "@babylonjs/core/index";
export default class SparkBackgroundParticles {
    constructor(scene, engine) {

        // Create a particle system
let options = {
    sizeParticles: 10
};

        this.particleSystem = new ParticleSystem("particles", 20, scene);
        this.particleSystem.preWarmCycles = 10;
        this.particleSystem.preWarmStepOffset = 2;

        this.sparkEmitter = new TransformNode("");
        // this.sparkEmitter.parent = emitter;
        // this.sparkEmitter.position = new Vector3(0, 0, 0).subtract(emitter.position);
        // Where the particles come from
        this.particleSystem.emitter = this.sparkEmitter; // the starting object, the emitter

        // Colors of all particles
        this.particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        this.particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        this.particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        this.particleSystem.minSize = 5.0;
        this.particleSystem.maxSize = 9.0;

        this.particleSystem.addSizeGradient(0, options.sizeParticles * 0.2, options.sizeParticles * 0.2);
        this.particleSystem.addSizeGradient(0.1, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        this.particleSystem.addSizeGradient(0.2, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        this.particleSystem.addSizeGradient(0.3, options.sizeParticles * 0.8, options.sizeParticles * 0.8);
        this.particleSystem.addSizeGradient(0.8, options.sizeParticles * 0.7, options.sizeParticles * 0.7);
        this.particleSystem.addSizeGradient(0.9, options.sizeParticles * 0.6, options.sizeParticles * 0.6);
        this.particleSystem.addSizeGradient(1.0, options.sizeParticles * 0.5, options.sizeParticles * 0.5);

        // Life time of each particle (random between...
        this.particleSystem.minLifeTime = 12;
        this.particleSystem.maxLifeTime = 12;

        // Emission rate
        this.particleSystem.emitRate = 7;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystem.gravity = new Vector3(0, 0, 0);

        // Direction of each particle after it has been emitted
        //this.particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        // this.particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

        // Angular speed, in radians
        this.particleSystem.minInitialRotation = 0;
        this.particleSystem.maxInitialRotation = Math.PI;
        this.particleSystem.minAngularSpeed = -0.025;
        this.particleSystem.maxAngularSpeed = 0.025;

        // Speed
        this.particleSystem.minEmitPower = 0;
        this.particleSystem.maxEmitPower = 0;
        this.particleSystem.updateSpeed = 0.1;

        this.particleSystem.targetStopDuration = 2.5;
        // No billboard
        // particleSystemSpark.isBillboardBased = false;
    }

    setEmitterPosition (emitter) {
        this.sparkEmitter.position = emitter.getAbsolutePosition();
        this.sparkEmitter.position.z -= 0.5;
    }

    setTextureSpark (texture) {
        this.particleSystem.particleTexture = texture;
    }

    start() {

       /* var mySet = ParticleHelper.ExportSet( [this.particleSystem] );

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

        this.particleSystem.start();
    }

    stop() {
        this.particleSystem.stop();
    }

    reset() {
        this.particleSystem.reset();
    }
}