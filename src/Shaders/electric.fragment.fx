#ifdef GL_ES
        precision highp float;
#endif

varying vec2 vUV;

uniform float time;

const float count = 7.0;

float Hash( vec2 p, in float s ){
    return fract(sin(dot(vec3(p.xy,10.0 * abs(sin(s))),vec3(27.1,61.7, 12.4)))*273758.5453123);
}

float noise(in vec2 p, in float s)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
//    f *= f * (3.0-2.0*f);
    return mix(mix(Hash(i + vec2(0.,0.), s), Hash(i + vec2(1.,0.), s),f.x),mix(Hash(i + vec2(0.,1.), s), Hash(i + vec2(1.,1.), s),f.x),f.y) * s;
}

float fbm(vec2 p)
{
     float v = 0.0;
     v += noise(p*0.5, 1.35);
     v += noise(p*0.5, 1.25);
     v += noise(p*4., 0.125);
     v += noise(p*8., 0.0625);
     return v;
}

void main( void ) {

	vec2 uv = vUV * 2.0 - 1.0;
	uv.x -= 1.5;
	uv.y -= 1.5;
	vec3 finalColor = vec3( 0.0 );

		float t = abs(0.7 / ((uv.x + 1.0 + fbm( uv*1.5 + floor(time)*20.0)) * (5.0)));
//		float t1 = abs(0.2 / ((uv.y + fbm( uv*1.5 + floor(time)*30.0)) * (5.0)));
//		float t2 = abs(0.2 / ((uv.x + fbm( uv + 0.5 + time*10.0)) * (20.0)));
//		float t3 = abs(0.2 / ((uv.y + fbm( uv - 1.0 +  time*15.0)) * (10.0)));
//		finalColor += t3 * t3 * t3 * vec3( 0.375, 0.5, 1.5 )*10.0;
float t1 = abs(0.2 / ((uv.y + fbm( uv - 1.0 +  ceil(time*10.0))) * (5.0)));
        float t2 = abs(0.2 / ((uv.y + fbm( uv + 0.5 + floor(time*15.0))) * (5.0)));
		float t3 = abs(0.2 / ((uv.x + fbm( uv - 1.0 +  ceil(time*10.0))) * (5.0)));
        finalColor += t2 * t2 * t3 * t3 * t3 * vec3( 0.375, 0.5, 1.5 ) * 10.0 /** sin(time*1.5)*/;

	gl_FragColor = vec4( finalColor, t3 );

}