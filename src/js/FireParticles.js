import {
    ParticleSystem,
    NoiseProceduralTexture,
    AbstractMesh,
    CylinderParticleEmitter,
    Effect,
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
            sizeParticle: 4.5,
            countParticles: 14
        };
        this.particleSystemFire = new ParticleSystem("flame", 100, options.scene, null, true);

        //Texture of each particle
        /*this.particleSystemFire.particleTexture = options.textureFlame*//* new Texture("textures/flare2.png", scene, true,
            false, Texture.TRILINEAR_SAMPLINGMODE);*/

        // this.particleSystemFire.addSizeGradient(0.4, 0.5, 0.3);
        //  this.particleSystemFire.addSizeGradient(5.0, 3.0, 4.0);
        // Where the particles come from
        this.fireEmitter = new TransformNode("");
        // fireEmitter.parent = emitter;

        //fireEmitter.position.z += 2.0;
        this.particleSystemFire.emitter = this.fireEmitter; // the starting object, the emitter
        // let emitterType = new BABYLON.SphereParticleEmitter();
        // emitterType.radius = 2.25;
        // this.particleSystemFire.particleEmitterType = emitterType;
        this.particleSystemFire.spriteRandomStartCell = true;
        this.particleSystemFire.startSpriteCellID = 0;
        this.particleSystemFire.endSpriteCellID = 31;
        this.particleSystemFire.spriteCellHeight = 256;
        this.particleSystemFire.spriteCellWidth = 128;
        this.particleSystemFire.spriteCellChangeSpeed = 5;

        this.particleSystemFire.minScaleX = 1.0;
        this.particleSystemFire.minScaleY = 1.75;
        this.particleSystemFire.maxScaleX = 1.0;
        this.particleSystemFire.maxScaleY = 1.75;

        /*  this.particleSystemFire.addSizeGradient(0, 3.0, 3.0);
          this.particleSystemFire.addSizeGradient(0.2, 2.5, 2.5);
          this.particleSystemFire.addSizeGradient(0.4, 2.0, 2.0);
          this.particleSystemFire.addSizeGradient(0.6, 1.5, 1.5);
          this.particleSystemFire.addSizeGradient(0.8, 1.0, 1.0);
          this.particleSystemFire.addSizeGradient(1.0, 0.5, 0.5);
          this.particleSystemFire.addSizeGradient(1.2, 0.0, 0.0);*/
        this.particleSystemFire.addSizeGradient(0, 0.0, 0.0);
        this.particleSystemFire.addSizeGradient(0.1, options.sizeParticle, options.sizeParticle / 2);
        this.particleSystemFire.addSizeGradient(0.08, options.sizeParticle * 0.72, (options.sizeParticle * 0.72) / 2);
        this.particleSystemFire.addSizeGradient(0.7, 0, 0);
        // this.particleSystemFire.addSizeGradient(1.0, 2.4, 1.2);
        // this.particleSystemFire.addSizeGradient(1.0, 2.0, 1.0);

        this.particleSystemFire.translationPivot = new Vector2(0, -0.5);

        // Colors of all particles
        this.particleSystemFire.addColorGradient(0.25, new Color4.FromHexString("#fdf3d2ff"));
        this.particleSystemFire.addColorGradient(1.0, new Color4.FromHexString("#fdcf58ff"));
        this.particleSystemFire.addColorGradient(0.75, new Color4.FromHexString("#f27d0cff"));
        this.particleSystemFire.addColorGradient(0.6, new Color4.FromHexString("#f2210044"));
        this.particleSystemFire.addColorGradient(0.5, new Color4.FromHexString("#f07f1311"));
        this.particleSystemFire.addColorGradient(0.25, new Color4.FromHexString("#75767600"));
        //
        this.particleSystemFire.color1 = new Color4.FromHexString("#fdcf58ff");
        this.particleSystemFire.color2 = new Color4.FromHexString("#f27d0cff");
        this.particleSystemFire.colorDead = new Color4.FromHexString("#757676ff");

        // Life time of each particle (random between...)
        // this.particleSystemFire.minLifeTime = 4.0;
        // this.particleSystemFire.maxLifeTime = 4.0;

        this.particleSystemFire.addLifeTimeGradient(0, 2.0);
        this.particleSystemFire.addLifeTimeGradient(0.75, 4.0);
        this.particleSystemFire.addLifeTimeGradient(0.7, 2.0);
        this.particleSystemFire.addLifeTimeGradient(0.9, 0);


        // // Defines the color ramp to apply
        this.particleSystemFire.addRampGradient(0.0, new Color3(1, 1, 1));
        this.particleSystemFire.addRampGradient(0.09, new Color3(209 / 255, 204 / 255, 15 / 255));
        this.particleSystemFire.addRampGradient(0.18, new Color3(221 / 255, 120 / 255, 14 / 255));
        this.particleSystemFire.addRampGradient(0.47, new Color3(209 / 255, 175 / 255, 15 / 255));
        this.particleSystemFire.addRampGradient(0.50, new Color3(200 / 255, 150 / 255, 18 / 255));
        this.particleSystemFire.addRampGradient(0.47, new Color3(115 / 255, 22 / 255, 15 / 255));
        this.particleSystemFire.useRampGradients = true;

        // Defines the color remapper over time
        // this.particleSystemFire.addColorRemapGradient(0, 0, 0.1);
        // this.particleSystemFire.addColorRemapGradient(0.2, 0.1, 0.8);
        // this.particleSystemFire.addColorRemapGradient(0.3, 0.2, 0.85);
        // this.particleSystemFire.addColorRemapGradient(0.35, 0.2, 0.85);
        // this.particleSystemFire.addColorRemapGradient(0.4, 0.3, 0.9);
        // this.particleSystemFire.addColorRemapGradient(0.75, 0.65, 1.0);
        // this.particleSystemFire.addColorRemapGradient(1.0, 0.95, 1.0);

        // Limit velocity over time
        this.particleSystemFire.addLimitVelocityGradient(10, 15, 10);
        this.particleSystemFire.addLimitVelocityGradient(0.120, 12.983, 0.25);
        this.particleSystemFire.addLimitVelocityGradient(0.445, 1.780, 0.5);
        this.particleSystemFire.addLimitVelocityGradient(0.691, 0.502, 0.75);
        this.particleSystemFire.addLimitVelocityGradient(0.930, 0.05, 1.0);
        this.particleSystemFire.addLimitVelocityGradient(1.0, 0, 1.25);

        this.particleSystemFire.limitVelocityDamping = 1.0;

        // Emission rate
        this.particleSystemFire.emitRate = options.countParticles / 2;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystemFire.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystemFire.gravity = new Vector3(0, 1.5, 0);

        // Angular speed, in radians
        this.particleSystemFire.minAngularSpeed = 0;
        this.particleSystemFire.maxAngularSpeed = Math.PI / 10;

        // Speed
        this.particleSystemFire.minEmitPower = 0;
        this.particleSystemFire.maxEmitPower = 0;
        this.particleSystemFire.updateSpeed = 0.04;
        this.particleSystemFire.targetStopDuration = 3.0;
        // this.particleSystemFire.renderingGroupId = 1;
        // this.particleSystemFire.isBillboardBased = false;
        //change start position function
        /*  let walkPS = 0;
          let meshModelVertices = emitter.getVerticesData(BABYLON.VertexBuffer.PositionKind);
          this.particleSystemFire.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {

              let randX = meshModelVertices[walkPS]*0.8;
              let randY = meshModelVertices[walkPS + 1]*0.9;
              let randZ = meshModelVertices[walkPS + 2]*1.05;

              BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);

              walkPS += 3;
              if (walkPS > meshModelVertices.length) {
                  walkPS = 0;
              }
          };*/

////////////////////////
        this.particleSystemFireOrigin = new ParticleSystem("origin", 100, options.scene, null, true);

        //Texture of each particle
        /*this.particleSystemFireOrigin.particleTexture = options.textureOrigin *//*new Texture("textures/flare4.png", scene, true,
            false, Texture.TRILINEAR_SAMPLINGMODE);*/

        // this.particleSystemFireOrigin.addSizeGradient(0.4, 0.5, 0.3);
        //  this.particleSystemFireOrigin.addSizeGradient(5.0, 3.0, 4.0);
        // Where the particles come from
        this.fireEmitterOrigin = new TransformNode("");
        // fireEmitterOrigin.parent = emitter;
        // fireEmitterOrigin.position.z += 0.5;

        this.particleSystemFireOrigin.emitter = this.fireEmitterOrigin; // the starting object, the emitter
        // let emitterType = new BABYLON.SphereParticleEmitter();
        // emitterType.radius = 2.25;
        // this.particleSystemFireOrigin.particleEmitterType = emitterType;

        this.particleSystemFireOrigin.startSpriteCellID = 0;
        this.particleSystemFireOrigin.endSpriteCellID = 31;
        this.particleSystemFireOrigin.spriteCellHeight = 128;
        this.particleSystemFireOrigin.spriteCellWidth = 64;
        this.particleSystemFireOrigin.spriteCellChangeSpeed = 5;

        this.particleSystemFireOrigin.minScaleX = 1.0;
        this.particleSystemFireOrigin.minScaleY = 1.75;
        this.particleSystemFireOrigin.maxScaleX = 1.0;
        this.particleSystemFireOrigin.maxScaleY = 1.75;

        /*  this.particleSystemFireOrigin.addSizeGradient(0, 3.0, 3.0);
          this.particleSystemFireOrigin.addSizeGradient(0.2, 2.5, 2.5);
          this.particleSystemFireOrigin.addSizeGradient(0.4, 2.0, 2.0);
          this.particleSystemFireOrigin.addSizeGradient(0.6, 1.5, 1.5);
          this.particleSystemFireOrigin.addSizeGradient(0.8, 1.0, 1.0);
          this.particleSystemFireOrigin.addSizeGradient(1.0, 0.5, 0.5);
          this.particleSystemFireOrigin.addSizeGradient(1.2, 0.0, 0.0);*/
        this.particleSystemFireOrigin.addSizeGradient(0, options.sizeParticle / 2, options.sizeParticle / 4);
        this.particleSystemFireOrigin.addSizeGradient(0.3, options.sizeParticle / 2, options.sizeParticle / 4);
        this.particleSystemFireOrigin.addSizeGradient(0.4, options.sizeParticle / 2 * 0.52, (options.sizeParticle * 0.52) / 4);
        this.particleSystemFireOrigin.addSizeGradient(0.6, options.sizeParticle / 2 * 0.25, 0.25 * options.sizeParticle / 4);
        this.particleSystemFireOrigin.addSizeGradient(0.7, options.sizeParticle / 2 * 0.3, 0.3 * options.sizeParticle / 4);
        this.particleSystemFireOrigin.addSizeGradient(0.8, 0, 0);
        // this.particleSystemFireOrigin.addSizeGradient(1.0, 2.4, 1.2);
        // this.particleSystemFireOrigin.addSizeGradient(1.0, 2.0, 1.0);

        this.particleSystemFireOrigin.translationPivot = new Vector2(0, -0.5);

        // Colors of all particles
        this.particleSystemFireOrigin.addColorGradient(0.25, new Color4.FromHexString("#fdf3d2ff"));
        this.particleSystemFireOrigin.addColorGradient(1.0, new Color4.FromHexString("#fdcf58ff"));
        this.particleSystemFireOrigin.addColorGradient(0.75, new Color4.FromHexString("#f27d0c22"));
        this.particleSystemFireOrigin.addColorGradient(0.6, new Color4.FromHexString("#f2210044"));
        this.particleSystemFireOrigin.addColorGradient(0.5, new Color4.FromHexString("#f07f1333"));
        this.particleSystemFireOrigin.addColorGradient(0.25, new Color4.FromHexString("#75767622"));
        //
        this.particleSystemFireOrigin.color1 = new Color4.FromHexString("#fdcf58ff");
        this.particleSystemFireOrigin.color2 = new Color4.FromHexString("#f27d0cff");
        this.particleSystemFireOrigin.colorDead = new Color4.FromHexString("#757676ff");

        // Life time of each particle (random between...)
        this.particleSystemFireOrigin.minLifeTime = 3.5;
        this.particleSystemFireOrigin.maxLifeTime = 4.5;

        // this.particleSystemFireOrigin.addLifeTimeGradient(0, 2.0);
        // this.particleSystemFireOrigin.addLifeTimeGradient(0.75, 4.0);
        // this.particleSystemFireOrigin.addLifeTimeGradient(1, 0.0);

        // // Defines the color ramp to apply
        this.particleSystemFireOrigin.addRampGradient(0.0, new Color3(1, 1, 1));
        this.particleSystemFireOrigin.addRampGradient(0.09, new Color3(209 / 255, 204 / 255, 15 / 255));
        this.particleSystemFireOrigin.addRampGradient(0.18, new Color3(221 / 255, 120 / 255, 14 / 255));
        this.particleSystemFireOrigin.addRampGradient(0.47, new Color3(209 / 255, 175 / 255, 15 / 255));
        this.particleSystemFireOrigin.addRampGradient(0.50, new Color3(200 / 255, 150 / 255, 18 / 255));
        this.particleSystemFireOrigin.addRampGradient(0.47, new Color3(115 / 255, 22 / 255, 15 / 255));
        this.particleSystemFireOrigin.useRampGradients = true;

        // Defines the color remapper over time
        // this.particleSystemFireOrigin.addColorRemapGradient(0, 0, 0.1);
        // this.particleSystemFireOrigin.addColorRemapGradient(0.2, 0.1, 0.8);
        // this.particleSystemFireOrigin.addColorRemapGradient(0.3, 0.2, 0.85);
        // this.particleSystemFireOrigin.addColorRemapGradient(0.35, 0.2, 0.85);
        // this.particleSystemFireOrigin.addColorRemapGradient(0.4, 0.3, 0.9);
        // this.particleSystemFireOrigin.addColorRemapGradient(0.75, 0.65, 1.0);
        // this.particleSystemFireOrigin.addColorRemapGradient(1.0, 0.95, 1.0);

        // Limit velocity over time
        this.particleSystemFireOrigin.addLimitVelocityGradient(10, 15, 10);
        this.particleSystemFireOrigin.addLimitVelocityGradient(0.120, 12.983, 0.25);
        this.particleSystemFireOrigin.addLimitVelocityGradient(0.445, 1.780, 0.5);
        this.particleSystemFireOrigin.addLimitVelocityGradient(0.691, 0.502, 0.75);
        this.particleSystemFireOrigin.addLimitVelocityGradient(0.930, 0.05, 1.0);
        this.particleSystemFireOrigin.addLimitVelocityGradient(1.0, 0, 1.25);

        this.particleSystemFireOrigin.limitVelocityDamping = 0.97;

        // Emission rate
        this.particleSystemFireOrigin.emitRate = options.countParticles / 2;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.particleSystemFireOrigin.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        this.particleSystemFireOrigin.gravity = new Vector3(0, 1.4, 0);

        // Angular speed, in radians
        this.particleSystemFireOrigin.minAngularSpeed = 0;
        this.particleSystemFireOrigin.maxAngularSpeed = 0;

        // Speed
        this.particleSystemFireOrigin.minEmitPower = 0;
        this.particleSystemFireOrigin.maxEmitPower = 0;
        this.particleSystemFireOrigin.updateSpeed = 0.04;
        // this.particleSystemFireOrigin.targetStopDuration = 2.0;

        //change start position function
        /*  let walkPS = 0;
          let meshModelVertices = emitter.getVerticesData(BABYLON.VertexBuffer.PositionKind);
          this.particleSystemFireOrigin.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {

              let randX = meshModelVertices[walkPS]*0.8;
              let randY = meshModelVertices[walkPS + 1];
              let randZ = meshModelVertices[walkPS + 2]*1.05;

              BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);

              walkPS += 3;
              if (walkPS > meshModelVertices.length) {
                  walkPS = 0;
              }
          };*/
      
        // return {flame: this.particleSystemFire, origin: this.particleSystemFireOrigin};
////////////////////////////////////////////////////////////////////////////////////////////////////
   /*     Effect.ShadersStore["particlesVertexShader"] =
            Effect.ShadersStore.particlesVertexShader
                .replace("varying vec4 vColor;",
                    "varying vec4 vColor;\n" +
                    "varying vec3 vPosition;\n" +
                    "varying vec2 vSize;\n"
     )
                .replace("vec2 cornerPos;",
                    "vSize = size;\n" +
                    "vPosition = position;\n" +
                    "vec2 cornerPos;\n"
     );


        Effect.ShadersStore["customFireParticleFragmentShader"] =
            "#ifdef GL_ES\n" +
            "precision highp float;\n" +
            "#endif\n" +

            "varying vec2 vUV;\n" +                     // Provided by babylon.js
            "varying vec4 vColor;\n" +                  // Provided by babylon.js
            "varying vec2 vSize;\n" +
            "varying vec3 vPosition;\n" +
            "uniform sampler2D diffuseSampler;\n" +     // Provided by babylon.js
            "uniform sampler2D customNoiseSamplerParticles;\n" +
            "uniform float time;\n" +                   // This one is custom so we need to declare it to the effect

            "float fbm(vec2 uv, float speedFactor)\n" +
            "        {\n" +
            "            float f;\n" +
            "            mat2 m = mat2( 1.4,  1.2, -1.2,  1.4 );\n" +
            "            f  = 0.5000*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;\n" +
            "            f += 0.2500*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;\n" +
            "            f += 0.1250*texture2D( customNoiseSamplerParticles, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;\n" +
            "            f += 0.0625*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;\n" +
            "            f = 0.5 + 0.5*f;\n" +
            "            return f;\n" +
            "        }\n" +
            "float fbm2(vec2 uv, float speedFactor)\n" +
            "        {\n" +
            "            float f;\n" +
            "            mat2 m = mat2( 2.6,  1.2, -2.2,  1.4 );\n" +
            "            f  = 1.000*texture2D( diffuseSampler, vec2(uv.x * 1.00 - sin(time * 0.15 * speedFactor), uv.y * 0.80 - time * speedFactor) * 1.0000).r; uv = m*uv;\n" +
            "            f += 0.500*texture2D( diffuseSampler, vec2(uv.x * 0.25 - sin(time * 0.25 * speedFactor), uv.y * 0.70 - time * speedFactor) * 0.5000).r; uv = m*uv;\n" +
            "            f += 0.250*texture2D( customNoiseSamplerParticles, vec2(uv.x * 1.00 + sin(time * 0.15 * speedFactor), uv.y * 0.80 - time * speedFactor) * 0.2500).r; uv = m*uv;\n" +
            "            f += 0.125*texture2D( diffuseSampler, vec2(uv.x * 0.25 + sin(time * 0.25 * speedFactor), uv.y * 0.70 - time * speedFactor) * 0.1250).r; uv = m*uv;\n" +
            "            f = 0.25 + 0.75*f;\n" +
            "            return f;\n" +
            "        }\n" +

            "void main(void) {\n" +
            "        if (vUV.x <= 0.25 || vUV.x >= 0.75) discard;\n" +
            "        gl_FragColor = vColor;\n" +
            "        float speedFactor = clamp(normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(vPosition.y)).r, 0.3, 0.55);\n" +
            "        float distortFlameFactor = clamp(vColor.a * vSize.x * normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(abs(vPosition.y))).g * 0.5, 0.9, 1.35);\n" +
            "        vec2 q = vUV;\n" +
            "        vec2 uv = vUV;\n" +
            "        float strength = floor(q.x+1.0);\n" +
            "        float T3 = max(3.,1.25*strength) * time * speedFactor;\n" +
            "        float T3_a = max(3.,1.25*strength) * time * speedFactor;\n" +
            "        q.x -= 0.5;\n" +
            "        q.y -= 0.25;\n" +
            "        float n = fbm(strength * vec2(q.x * distortFlameFactor, q.y * distortFlameFactor * 0.95) - vec2(0.5,T3), speedFactor);\n" +
            "        float n2 = fbm2(strength * vec2(q.x * distortFlameFactor, q.y * distortFlameFactor * 0.95) - vec2(0.5,T3_a), speedFactor);\n" +
            "        float c = 1. - 16.0 * pow(\n" +
            "            //  max( 0.0, length(q*vec2(2.2+q.y*4.25,0.175)) - n * max( 0.35, q.y+.05 ) ),\n" +
            "            max( 0.0, length(q*vec2(1.4+q.y*2.25,0.875)) - n * max( 0.25, q.y+.25 ) ),\n" +
            "            1.0 //contrast\n" +
            "        );\n" +
            "        float c_a = 1. - 16.0 * pow(\n" +
            "            max( 0.0, length(q*vec2(1.0+q.y*2.25,1.2)) - n2 * max( 0.0, q.y+.25 ) ),\n" +
            "            1.2 //contrast\n" +
            "        );\n" +
            "        float c1 = n * c * (1.5-pow(1.0*uv.y,2.0));\n" +
            "        float c2 = n2 * c_a * (1.5-pow(1.0*uv.y,2.0));\n" +
            "        c1=clamp(c1,0.,1.);\n" +
            "        c2=clamp(c2,0.,1.);\n" +
            "        vec3 col = vec3(1.5*c1, 1.35*c1*c1*c1, c1*c1*c1*c1*c1*c1);\n" +
            "        vec3 col2 = vec3(1.5*c2, 1.35*c2*c2*c2, c2*c2*c2*c2*c2*c2);\n" +
            "        float a = c2 * c1 / (pow(uv.y,-0.0005));\n" +
            "        gl_FragColor += vec4( (mix(vec3(0.0),col * col2,a) ), 1.0);\n" +
            "        gl_FragColor.a = mix(c2,  c1, gl_FragColor.g * gl_FragColor.r) * vColor.a * a * 0.55;\n" +
            "}\n";*/

                // Effect
        this.effect = options.engine.createEffectForParticles("customFireParticle", ["time"], ["customNoiseSamplerParticles"]);

        let time = 0;
        let order = 0;

        let start_time = Date.now();
        let effect = this.effect;
        this.effect.onBind = function () {
            effect.setFloat("time", time);

            order = (Date.now() - start_time) * 0.00125;
            start_time = Date.now();
            time += order;
            // if (time > 3) {
            //     time = 0;
            // }
        };

        this.ashesParticles = new ParticleSystem("ashesParticles", 20, options.scene, this.effect, true);
        this.ashesParticles.startSpriteCellID = 10;
        this.ashesParticles.endSpriteCellID = 31;
        this.ashesParticles.spriteCellHeight = 256;
        this.ashesParticles.spriteCellWidth = 128;
        this.ashesParticles.spriteCellChangeSpeed = 5;
        // this.ashesParticles.spriteRandomStartCell = true;
        this.ashesParticlesEmitter = new TransformNode("");

        this.ashesParticles.emitter = this.ashesParticlesEmitter; // the starting object, the emitter
        this.ashesParticles.minScaleX = 0.85;
        this.ashesParticles.minScaleY = 0.7;
        this.ashesParticles.maxScaleX = 1.1;
        this.ashesParticles.maxScaleY = 0.8;
        this.ashesParticles.preWarmCycles = 20;
        this.ashesParticles.preWarmStepOffset = 2;
        this.ashesParticles.addSizeGradient(0, options.sizeParticle * 0.2, options.sizeParticle * 0.2);
        this.ashesParticles.addSizeGradient(0.1, options.sizeParticle * 0.6, options.sizeParticle * 0.6);
        this.ashesParticles.addSizeGradient(0.2, options.sizeParticle * 0.7, options.sizeParticle * 0.7);
        this.ashesParticles.addSizeGradient(0.3, options.sizeParticle * 0.8, options.sizeParticle * 0.8);
        this.ashesParticles.addSizeGradient(0.8, options.sizeParticle * 0.2, options.sizeParticle * 0.7);
        this.ashesParticles.addSizeGradient(0.9, options.sizeParticle * 0.1, options.sizeParticle * 0.7);
        this.ashesParticles.addSizeGradient(1.0, options.sizeParticle * 0.0, options.sizeParticle * 0.0);

        this.ashesParticles.translationPivot = new Vector2(0, -0.35);

        // Colors of all particles
        this.ashesParticles.addColorGradient(0.2, new Color4.FromHexString("#fdab8000"));
        this.ashesParticles.addColorGradient(0.7, new Color4.FromHexString("#f27d0c55"));
        this.ashesParticles.addColorGradient(0.6, new Color4.FromHexString("#f22100ff"));
        // this.ashesParticles.addColorGradient(0.25, new Color4.FromHexString("#757676ff"));
        this.ashesParticles.addColorGradient(0.4, new Color4.FromHexString("#640300ff"));
        this.ashesParticles.addColorGradient(0.75, new Color4.FromHexString("#f27d0c00")); //00
        this.ashesParticles.addColorGradient(0.9, new Color4.FromHexString("#75767600"));  //00
        this.ashesParticles.addColorGradient(1.0, new Color4.FromHexString("#00000000"));  //00

        // this.ashesParticles.addColorGradient(0.75, new Color4.FromHexString("#f27d0c55"));
        // this.ashesParticles.addColorGradient(0.9, new Color4.FromHexString("#75767688"));
        // this.ashesParticles.addColorGradient(1.0, new Color4.FromHexString("#00000077"));

        //
        // this.ashesParticles.color1 = new Color4.FromHexString("#fdcf58ff");
        // this.ashesParticles.color2 = new Color4.FromHexString("#f20100ff");
        // this.ashesParticles.colorDead = new Color4.FromHexString("#75767600");
        //
        // // Life time of each particle (random between...)
        this.ashesParticles.minLifeTime = 5.0;
        this.ashesParticles.maxLifeTime = 6.5;
        // this.ashesParticles.billboardMode = AbstractMesh.BILLBOARDMODE_Y;
        //
        // // Limit velocity over time
        // this.ashesParticles.addLimitVelocityGradient(1, 1.5, 1);
        // this.ashesParticles.addLimitVelocityGradient(0.120, 12.983, 0.25);
        // this.ashesParticles.addLimitVelocityGradient(0.445, 1.780, 0.5);
        // this.ashesParticles.addLimitVelocityGradient(0.291, 0.502, 0.15);
        // this.ashesParticles.addLimitVelocityGradient(0.08, 0.08, 0.08);
        // this.ashesParticles.addLimitVelocityGradient(0.01, 0, 0.02);
        // //
        // this.ashesParticles.limitVelocityDamping = 0.01;

        // Emission rate
        this.ashesParticles.emitRate = options.countParticles / 2;
        //
        // // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        this.ashesParticles.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        //
        // // Set the gravity of all particles
        this.ashesParticles.gravity = new Vector3(0, 0, 0);
        //
        // // Angular speed, in radians
        this.ashesParticles.minAngularSpeed = 0;
        this.ashesParticles.maxAngularSpeed = 0;
        //
        // // Speed
        this.ashesParticles.minEmitPower = 0;
        this.ashesParticles.maxEmitPower = 0;
        this.ashesParticles.updateSpeed = 0.045;
        this.ashesParticles.targetStopDuration = 2.0;

        // No billboard
        // this.ashesParticles.isBillboardBased = false;
        // this.ashesParticles.billboardMode = AbstractMesh.BILLBOARDMODE_Y;
    }

    setEmitter (emitter) {
        this.fireEmitter.position.y -= 0.5 / emitter.parent.scaling.x;
        this.fireEmitter.position.z += 0.5 / emitter.parent.scaling.x;
        this.fireEmitter.parent = emitter;
        this.particleSystemFire.createCylinderEmitter(1.5 / emitter.parent.scaling.x, 2.5 / emitter.parent.scaling.x, 0, 0);

        this.fireEmitterOrigin.position.y -= 2.25 / emitter.parent.scaling.x;
        this.fireEmitterOrigin.position.z += 0.5 / emitter.parent.scaling.x;
        this.fireEmitterOrigin.parent = emitter;
        // let hemisphericEmitter = this.particleSystemFireOrigin.createHemisphericEmitter(1.2 / emitter.parent.scaling.x);
        // hemisphericEmitter.radiusRange = 0;
        // let hemisphericEmitter = this.particleSystemFireOrigin.createSphereEmitter(1.2 / emitter.parent.scaling.x);
        // hemisphericEmitter.radiusRange = 0;

        this.particleSystemFireOrigin.createCylinderEmitter(1.25 / emitter.parent.scaling.x, 0.1 / emitter.parent.scaling.x, 0, 0);

        this.ashesParticlesEmitter.position = emitter.getAbsolutePosition();

        var angle = Math.PI / 6;
        let coordParticles = [

            new Vector3(1.45 * Math.sin(angle * 4 + (0.7 * Math.PI)) + 0.25, 1.7 * Math.cos(angle * 4 +  (0.7 * Math.PI)) * 1.7, 1.92),
            new Vector3(1.45 * Math.sin(angle * 1 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 1 + (0.7 * Math.PI)), 1.92),
            new Vector3(1.45 * Math.sin(angle * 0 + (0.7 * Math.PI)) + 0.5, 1.7 * Math.cos(angle * 0 + (0.7 * Math.PI)) * 0.25, -1.92),
            new Vector3(1.45 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 +  (0.7 * Math.PI)) * 0.75, -1.92),
            new Vector3(1.45 * Math.sin(angle * 0 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 0 + (0.7 * Math.PI)), 1.92),
            new Vector3(1.45 * Math.sin(angle * 2 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 2 +  (0.7 * Math.PI)), 1.92),
            new Vector3(1.45 * Math.sin(angle * 3 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 3 +  (0.7 * Math.PI)), -1.92),



            // new Vector3(1.45 * Math.sin(angle * 4 + (0.7 * Math.PI)) - 0.25, 1.7 * Math.cos(angle * 4 +  (0.7 * Math.PI)) * 0.5, 1.92),

            // new Vector3(1.7 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 7 + (1.8 * Math.PI)), 1.7 * Math.cos(angle * 7 + (1.8 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 1 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 1 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 8 + (1.4 * Math.PI)), 1.7 * Math.cos(angle * 8 + (1.4 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 + (0.7 * Math.PI)), 1.92),

            // new Vector3(1.7 * Math.sin(angle * 9 + (1.7 * Math.PI)), 1.7 * Math.cos(angle * 9 + (1.7 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 7 + (1.8 * Math.PI)), 1.7 * Math.cos(angle * 7 + (1.8 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 1 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 1 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 8 + (1.4 * Math.PI)), 1.7 * Math.cos(angle * 8 + (1.4 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 + (0.7 * Math.PI)), 1.92),
            //
            // new Vector3(1.7 * Math.sin(angle * 2 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 2 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 9 + (1.8 * Math.PI)), 1.7 * Math.cos(angle * 9 + (1.8 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 4 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 4 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 3 + (1.8 * Math.PI)), 1.7 * Math.cos(angle * 3 + (1.8 * Math.PI)), -1.92),
            // new Vector3(1.7 * Math.sin(angle * 1 + (0.7 * Math.PI)), 1.7 * Math.cos(angle * 1 + (0.7 * Math.PI)), 1.92),
            // new Vector3(1.7 * Math.sin(angle * 9 + (1.8 * Math.PI)), 1.7 * Math.cos(angle * 9 + (1.8 * Math.PI)), -1.92)
        ];

        // for (let i = 0; i < 10; i++) {
        //     var randX = 1.3 * Math.sin(angle * i + (0.7 * Math.PI));
        //     var randY = 1.3 * Math.cos(angle * i + (0.7 * Math.PI));
        //     coordParticles.push(new Vector3(randX, randY, i < 5 ? 1.92 : -1.92))
        // }

        let index = 0;
        this.ashesParticles.startPositionFunction = function(worldMatrix, positionToUpdate, particle)
        {

            /*var rndAngle = 2 * (Math.random() * (0.65 - 0.35) + 0.35) * Math.PI;
            var randX = 1.6 * Math.sin(rndAngle);
            var randY = 1.6 * Math.cos(rndAngle);
            var randZ = 1.92 * (Math.random() <= 0.35 ? -1 : 1);*/

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

    setTextureFlame (texture) {
        this.particleSystemFire.particleTexture = texture;
    }
    setTextureOrigin (texture) {
        this.particleSystemFireOrigin.particleTexture = texture;
    }

    setTextureNoiseCombustion (texture) {
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;
        this.ashesParticles.particleTexture = texture;
    }

    setTextureNoiseCombustion1 (texture) {
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;
        let effect = this.effect;
        this.effect.onBindObservable.add(() => {
            effect.setTexture("customNoiseSamplerParticles", texture);
        });
    }

    start() {
        // this.particleSystemFire.start();
        // this.particleSystemFireOrigin.start();
        this.ashesParticles.start();
        // console.log( this.particleSystemFire);
        // console.log( this.effect.getUniform("time"));
        console.log(Effect.ShadersStore["particlesVertexShader"]);
        // console.log(Effect.ShadersStore["particlesPixelShader"]);
    }

    stop() {
        // this.particleSystemFire.start();
        // this.particleSystemFireOrigin.start();
        this.ashesParticles.stop();
    }
}