import { ParticleSystemSet } from "@babylonjs/core/Particles/particleSystemSet";
import { ParticleHelper } from "@babylonjs/core/Particles/particleHelper";
import '@babylonjs/core/Particles/particleSystemComponent';
import { Vector2 } from '@babylonjs/core/Maths/math.vector';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

export default class FireParticlesHelper {
    constructor(scene, engine) {
        ParticleSystemSet.BaseAssetsUrl = document.location.href + "/src/assets";
        ParticleHelper.BaseAssetsUrl = document.location.href + "/src/assets";

        this.particles = ParticleHelper.CreateAsync("customFire", scene, false);


        this.particles.then((set) => {
            set.systems[0].particleTexture.wrapU = Texture.MIRROR_ADDRESSMODE;
            set.systems[0].particleTexture.wrapV = Texture.MIRROR_ADDRESSMODE;
            set.systems[1].particleTexture.wrapU = Texture.MIRROR_ADDRESSMODE;
            set.systems[1].particleTexture.wrapV = Texture.MIRROR_ADDRESSMODE;
            let effect = engine.createEffectForParticles("customFireParticle", ["time"], ["customNoiseSamplerParticles"]);

            let time = 0;
            let order = 0;

            let start_time = Date.now();

            effect.onBind = function () {
                effect.setFloat("time", time);

                order = (Date.now() - start_time) * 0.0009;
                start_time = Date.now();
                time += order;
            };
            set.systems[0]._customEffect = effect;

            let effectStandardBlendMode = engine.createEffectForParticles("customFireParticleStandardBlendmode", ["time"], ["customNoiseSamplerParticles"]);

            let time1 = 0;
            let order1 = 0;

            let start_time1 = Date.now();
            effectStandardBlendMode.onBind = function () {
                effectStandardBlendMode.setFloat("time", time1);

                order1 = (Date.now() - start_time1) * 0.001;
                start_time1 = Date.now();
                time1 += order1;
            };
            set.systems[1]._customEffect = effectStandardBlendMode;

        });
    }

    setEmitter (emitter) {
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
        this.particles.then((set) => {
            set.systems.map(v => {
              v.emitter = emitter.getAbsolutePosition();
            });
            set.systems[0].translationPivot = new Vector2(0, -0.35);
            set.systems[1].translationPivot = new Vector2(0, -0.35);
            set.systems[2].startPositionFunction =
                set.systems[0].startPositionFunction = function(worldMatrix, positionToUpdate)
                {
                    var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
                    var randX = 1.6 * Math.sin(rndAngle);
                    var randY = 1.7 * Math.cos(rndAngle);
                    var randZ = 2.0 * (Math.random() <= 0.35 ? -1 : 1);
                    Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
                };
            set.systems[3].startPositionFunction =
                function(worldMatrix, positionToUpdate)
                {
                    var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
                    var randX = 1.6 * Math.sin(rndAngle);
                    var randY = 1.7 * Math.cos(rndAngle);
                    var randZ = 2.0 * (Math.random() <= 0.35 ? -1 : 1);
                    Vector3.TransformCoordinatesFromFloatsToRef(randX, randY + 1.0, randZ, worldMatrix, positionToUpdate);
                };
            set.systems[4].startPositionFunction =
                function(worldMatrix, positionToUpdate)
                {
                    var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
                    var randX = 1.2 * Math.sin(rndAngle);
                    var randY = 0.5 * Math.cos(rndAngle);
                    var randZ = 2.4;

                    Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
                };
            let index = 0;
            set.systems[1].startPositionFunction = function(worldMatrix, positionToUpdate)
            {
                var randX = coordParticles[index].x;
                var randY = coordParticles[index].y;
                var randZ = coordParticles[index].z;
                if (index < 5) {
                    index++;
                } else {
                    index = 0;
                }
                Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
            }
        });
    }

    setEmitterPosition (emitter) {
        this.particles.then((set) => {
            set.systems.map(v => {
                v.emitter = emitter.getAbsolutePosition();
            });
        });
    }

    setTextureNoiseCombustion1 (texture) {
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;

        this.particles.then((set) => {
            set.systems[0]._customEffect.onBindObservable.add((effect) => {
                effect.setTexture("customNoiseSamplerParticles", texture);
            });
            set.systems[1]._customEffect.onBindObservable.add((effect) => {
                effect.setTexture("customNoiseSamplerParticles", texture);
            });
        });
    }

    start() {
        this.particles.then((set) => {
            set.start();
        });
    }

    stop() {
        this.particles.then((set) => {
            set.systems.map(v => {
                v.stop();
            });
        });
    }

    reset() {
        this.particles.then((set) => {
            set.systems.map(v => {
                v.reset();
            });
        });
    }
}