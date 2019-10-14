precision highp float;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

// Refs
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;

uniform float edgefalloff;
uniform float intensity;
uniform float ambient;
uniform vec3 color;
uniform float sunIntensity;

uniform float time;

void main(void) {
    vec4 Cs = vec4(color, 1.0);
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

    // Fresnel
	float fresnelTerm = dot(viewDirectionW, vNormalW);
	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);

//    gl_FragColor = vec4(color * fresnelTerm, 1.);

    float opac = fresnelTerm;
//    opac = abs(opac);
    opac = ambient + intensity*(1.0-pow(opac, edgefalloff));

    gl_FragColor = mix(Cs * (1.0-opac) * 1.75,
    texture2D(textureSampler, vec2(vUV.x * 0.5 + time * 0.002, vUV.y + time * 0.001)*7.0) *
    texture2D(textureSampler, vec2(vUV.x * 0.75  - time * 0.001, vUV.y - time * 0.0002)*3.0) * vec4(1.0,0.5,0.25,1.0) *
    texture2D(textureSampler, vec2(vUV.x * 1.0 - time * 0.001, vUV.y + time * 0.0002)*3.0) * vec4(1.0,0.5,0.25,1.0) *
    texture2D(textureSampler, vec2(vUV.x * 0.75 + time * 0.001, vUV.y - time * 0.0002)*3.0) * vec4(1.0,0.5,0.25,1.0) *
    sunIntensity,
    opac);
//    gl_FragColor = vec4(vec3(1.0-opac), 1.0);
    gl_FragColor.a = 1.0;
}