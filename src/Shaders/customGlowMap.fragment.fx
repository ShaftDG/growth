varying vec2 vUV;
uniform sampler2D textureSampler;
//uniform sampler2D textureSamplerNoise;
#ifdef EMISSIVE
uniform sampler2D textureSampler2;
#endif

uniform float offset;
uniform float time;
uniform float screenWidth;
uniform float screenHeight;
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
//vec4 textureNoise=texture2D(textureSamplerNoise,vUV);
#ifdef EMISSIVE
baseColor+=texture2D(textureSampler2,vUV);
baseColor*=offset;
#else
baseColor.a=abs(offset-baseColor.a);
#ifdef STROKE
float alpha=smoothstep(.0,.1,baseColor.a);
baseColor.a=alpha;
baseColor.rgb=baseColor.rgb*alpha;
#endif
#endif
gl_FragColor.rgb=baseColor.rgb;
gl_FragColor.a = baseColor.a;
}