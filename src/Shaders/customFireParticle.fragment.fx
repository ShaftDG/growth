#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUV;
varying vec4 vColor;
varying vec2 vSize;
varying vec3 vPosition;
uniform sampler2D diffuseSampler;
uniform sampler2D customNoiseSamplerParticles;
uniform float time;
float fbm(vec2 uv, float speedFactor)
        {
            float f;
            mat2 m = mat2( 1.4,  1.2, -1.2,  1.4 );
            f  = 0.5000*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;
            f += 0.2500*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;
            f += 0.1250*texture2D( customNoiseSamplerParticles, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;
            f += 0.0625*texture2D( diffuseSampler, vec2(uv.x*speedFactor + sin(time * 0.25)*speedFactor, uv.y*0.525 + time * speedFactor) ).r; uv = m*uv;
            f = 0.5 + 0.5*f;
            return f;
        }
float fbm2(vec2 uv, float speedFactor)
        {
            float f;
            mat2 m = mat2( 2.6,  1.2, -2.2,  1.4 );
            f  = 1.000*texture2D( diffuseSampler, vec2(uv.x * 1.00 - sin(time * 0.15 * speedFactor), uv.y * 0.80 - time * speedFactor) * 1.0000).r; uv = m*uv;
            f += 0.500*texture2D( diffuseSampler, vec2(uv.x * 0.25 - sin(time * 0.25 * speedFactor), uv.y * 0.70 - time * speedFactor) * 0.5000).r; uv = m*uv;
            f += 0.250*texture2D( customNoiseSamplerParticles, vec2(uv.x * 1.00 + sin(time * 0.15 * speedFactor), uv.y * 0.80 - time * speedFactor) * 0.2500).r; uv = m*uv;
            f += 0.125*texture2D( diffuseSampler, vec2(uv.x * 0.25 + sin(time * 0.25 * speedFactor), uv.y * 0.70 - time * speedFactor) * 0.1250).r; uv = m*uv;
            f = 0.25 + 0.75*f;
            return f;
        }
void main(void) {
        if (vUV.x <= 0.3 || vUV.x >= 0.8 || vUV.y <= 0.05 || vUV.y >= 0.9) discard;
        gl_FragColor = vColor;
        float speedFactor = clamp(normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(vPosition.y)).r, 0.1, 0.65);
        float distortFlameFactor = clamp(vColor.a * vSize.x * normalize(vSize.y) * texture2D( customNoiseSamplerParticles, vec2(abs(vPosition.y))).g * 0.5, 1.0, 1.2);
        vec2 q = vUV;
        vec2 uv = vUV;
        float strength = floor(q.x+1.0);
        float T3 = max(3.,1.25*strength) * time * speedFactor;
        float T3_a = max(3.,1.25*strength) * time * speedFactor;
        q.x -= 0.5;
        q.y -= 0.225 * distortFlameFactor;
        float n = fbm(strength * vec2(q.x * distortFlameFactor, q.y * distortFlameFactor * 0.95) - vec2(0.5,T3), speedFactor);
        float n2 = fbm2(strength * vec2(q.x * distortFlameFactor, q.y * distortFlameFactor * 0.95) - vec2(0.5,T3_a), speedFactor);
        float c = 1.0 - 8.0 * pow(
            //  max( 0.0, length(q*vec2(2.2+q.y*4.25,0.175)) - n * max( 0.35, q.y+.05 ) ),
            max( 0.0, length(q*vec2(1.4+q.y*2.25,0.875)) - n * max( 0.25, q.y+.25 ) ),
            1.0 //contrast
        );
        float c_a = 1. - 16.0 * pow(
            max( 0.0, length(q*vec2(1.0+q.y*2.25,1.2)) - n2 * max( 0.0, q.y+.25 ) ),
            1.2 //contrast
        );
        float c1 = n * c * (1.5-pow(1.0*uv.y,2.0));
        float c2 = n2 * c_a * (1.5-pow(1.0*uv.y,2.0));
        c1=clamp(c1,0.,1.);
        c2=clamp(c2,0.,1.);
        vec3 col = vec3(1.05*c1, 1.05*c1*c1*c1, c1*c1*c1*c1*c1*c1*c1*c1);
        vec3 col2 = vec3(1.05*c2, 1.05*c2*c2*c2, c2*c2*c2*c2*c2*c2*c2*c2);
        float a = c2 * c1 / (pow(uv.y,-0.0005));
        float mixing = mix(mix(col.r, col.g, a), col.b, a);
        if ( mixing < 0.2 ) discard;
        gl_FragColor *= vec4( (mix(vec3(0.0),col * col2,a) ) * 1.75 * distortFlameFactor, 1.0);
        gl_FragColor.a = mix(c2,  c1, gl_FragColor.g * gl_FragColor.r) * vColor.a * a * 1.8 * speedFactor;
}