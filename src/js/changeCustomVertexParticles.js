import {Effect} from "@babylonjs/core/index";

export default class ChangeCustomVertexParticles {
    constructor () {
        Effect.ShadersStore
            ["particlesVertexShader"] =
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


        Effect.ShadersStore
            ["customFireParticleFragmentShader"] =
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
            "        if (vUV.x <= 0.3 || vUV.x >= 0.8 || vUV.y <= 0.05 || vUV.y >= 0.9) discard;\n" +
            "        gl_FragColor = vColor;\n" +
            "        float speedFactor = clamp(normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(vPosition.y)).r, 0.3, 0.55);\n" +
            "        float distortFlameFactor = clamp(vColor.a * vSize.x * normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(abs(vPosition.y))).g * 0.5, 1.3, 1.65);\n" +
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
            "}\n";
    }
}