import {
    GPUParticleSystem,
    ParticleSystem,
    TransformNode,
    Vector3
} from '@babylonjs/core'
export default class {
    constructor (height, width, scene) {
        this.scene = scene;
        this.centerCoord = new Vector3(0,0,0);
        this.emitter = new TransformNode("emitterParticles");
        this.move = {
            toLeft: true,
            toRight: false,
            toUp: false,
            toDown: false
        };
        this.height = height || 3;
        this.width = width || 3;
        this.halfHeight = this.height / 2;
        this.halfWidth = this.width / 2;
        this.speedMove = 2;
        // this.particleSystem = new GPUParticleSystem("particles", { capacity: 500 }, scene);
        this.particleSystem = new ParticleSystem("particles", 500, scene);
        this.particleSystem.minSize = 0.1;
        this.particleSystem.maxSize = 0.8;
        this.particleSystem.minAngularSpeed = -3;
        this.particleSystem.maxAngularSpeed = 3;
        this.particleSystem.minEmitPower = 2.5;
        this.particleSystem.maxEmitPower = 5.0;
        this.particleSystem.minLifeTime = 0.25;
        this.particleSystem.maxLifeTime = 0.75;
        this.particleSystem.emitter = this.emitter;
        this.particleSystem.emitRate = 500;
        this.particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        this.particleSystem.minEmitBox = new Vector3(0.1, 0.1, 0.1);
        this.particleSystem.maxEmitBox = new Vector3(0.25, 0.25, 0.25);
        this.particleSystem.gravity = new Vector3(0, 0.5, 0);
        this.particleSystem.direction1 = new Vector3(0.25, 0.25, 0);
        this.particleSystem.direction2 = new Vector3(-0.25, -0.25, 0);
        // this.particleSystem.start();

        this.alpha = 0;
    }
    setTexture (texture) {
        this.particleSystem.particleTexture = texture;
    }

    setCenter (x,y,z) {
        this.centerCoord = new Vector3(x,y,z);
        this.emitter.position = new Vector3(this.centerCoord.x - this.halfWidth,this.centerCoord.y + this.halfHeight, this.centerCoord.z);
    }

    start() {
        this.particleSystem.start()
    }
    stop() {
        this.particleSystem.stop()
    }

    motionUpdate(deltaTime) {
        // this.emitter.position.x = this.halfHeight * Math.cos(this.alpha) + this.centerCoord.x;
        // this.emitter.position.y = this.halfHeight * Math.sin(this.alpha) + this.centerCoord.y;
        // this.emitter.position.z = this.centerCoord.z;
        // this.alpha += deltaTime * this.scene.getAnimationRatio();
        if (this.move.toLeft && this.emitter.position.x < this.centerCoord.x + this.halfWidth) {
            this.emitter.position.y = this.centerCoord.y + this.halfHeight;
            this.emitter.position.x += deltaTime * this.speedMove;
            this.move.toDown = true;
            this.move.toRight = false;
            this.move.toUp = false;
        } else if (this.move.toDown && this.emitter.position.y > this.centerCoord.y - this.halfHeight) {
            this.emitter.position.x = this.centerCoord.x + this.halfWidth;
            this.emitter.position.y -= deltaTime * this.speedMove;
            this.move.toLeft = false;
            this.move.toRight = true;
            this.move.toUp = false;
        } else if (this.move.toRight && this.emitter.position.x > this.centerCoord.x - this.halfWidth) {
            this.emitter.position.y = this.centerCoord.y - this.halfHeight;
            this.emitter.position.x -= deltaTime * this.speedMove;
            this.move.toLeft = false;
            this.move.toDown = false;
            this.move.toUp = true;
        }  else if (this.move.toUp && this.emitter.position.y < this.centerCoord.y + this.halfHeight) {
            this.emitter.position.x = this.centerCoord.x - this.halfWidth;
            this.emitter.position.y += deltaTime * this.speedMove;
        } else {
            this.move.toLeft = true;
            this.move.toUp = false;
        }
    }

}