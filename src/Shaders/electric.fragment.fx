#ifdef GL_ES
        precision highp float;
#endif

varying vec2 vUV;

uniform float time;

uniform sampler2D iTextureFlame;
uniform sampler2D iTextureAlpha;
uniform sampler2D iTextureBack;
/*const float count = 7.0;

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
}*/

void main( void ) {

	/*vec2 uv = vUV * 2.0 - 1.0;
	uv.x -= 1.5;
	uv.y -= 1.5;
	vec3 finalColor = vec3( 0.0 );

float iTime = time;
		float t = abs(0.7 / ((uv.x + 1.0 + fbm( uv*1.5 + floor(iTime*20.0) * 0.01)) * (5.0)));
//		float t1 = abs(0.2 / ((uv.y + fbm( uv*1.5 + floor(iTime)*30.0)) * (5.0)));
//		float t2 = abs(0.2 / ((uv.x + fbm( uv + 0.5 + iTime*10.0)) * (20.0)));
//		float t3 = abs(0.2 / ((uv.y + fbm( uv - 1.0 +  iTime*15.0)) * (10.0)));
//		finalColor += t3 * t3 * t3 * vec3( 0.375, 0.5, 1.5 )*10.0;
float t1 = abs(0.2 / ((uv.y + fbm( uv - 1.0 +  ceil(iTime*10.0) * 0.01)) * (5.0)));

		float t3 = abs((uv.y*0.125) / ((uv.x + fbm( uv - 1.0 +  floor(iTime*10.0) * 0.01)) * (5.0)));

		float t2 = abs((max(uv.x, uv.y)*0.125) / ((max(uv.x, uv.y) + fbm( uv - 1.0 + ceil(iTime*10.0) * 0.1)) * (5.0)));
        vec3 color3 = t2 * t2 * t2 * t3 * t3 * t3 * vec3( 0.375, 0.5, 1.5 ) * 10.0 *//** sin(iTime*1.5)*//*;

        vec3 color2 = t3 * t3 * t2 * t2 * vec3( 0.375, 0.5, 1.5 ) * 10.0 *//** sin(iTime*1.5)*//*;

        finalColor += max(color3, color2);

         vec2 uv1 =  vUV * 2.0 - 1.0;
float rim = 1.0-pow(
        smoothstep(0.0, 1.0, 1.0 - dot(1.0 - uv1.y, 1.0)),
        1.0
    );
float rim1 = pow(
        smoothstep(1.0, 0.0, 1.0 - dot(1.0 + uv1.y, 1.0)),
        1.0
    );

    float factor = clamp(rim * rim1, 0.0, 1.0);
	gl_FragColor = vec4( mix(finalColor, vec3(0.0), 1.0-factor), 1.0 );*/
        float iTime = time;
	    vec2 uv = vec2(vUV.y, vUV.x);
        uv = uv * 2. -1.;
//          uv.y *= 2.0;
        vec4 rndUp = texture2D(iTextureFlame, vec2(0.01 * uv.x + iTime * 1.6, 0.03 * uv.y + iTime * 0.8)); // (0.01 * uv) - детализация молнии (iTime * 0.1) - скорость вибрации //верх
        vec4 rndDown = texture2D(iTextureFlame, vec2(0.01 * uv.x + iTime * 1.6, 0.03 * uv.y + iTime * 0.8)); // (0.01 * uv) - детализация молнии (iTime * 0.5) - скорость вибрации //низ

        float intensity2 = mix(rndDown.y *3.7, rndUp.x *3.7, clamp(rndDown.y, rndUp.x, uv.y));//шум ветвей
        float intensity = mix(rndDown.y*7.5, rndUp.y*7.5, uv.y); //шум столба

        float ty = 0.1; // (uv.y * -uv.y) - фиксация хвостов молнии; (* 0.09) длина фиксированных хвостов; (+ 0.1) ширина столба
        float tx = 0.03;

        vec2 n0UvB = vUV;
        intensity = intensity * texture2D(iTextureBack, n0UvB*cos(iTime*5.)*0.35).x;
        intensity2 = intensity2 * texture2D(iTextureAlpha, n0UvB*cos(iTime*5.)*0.12).x;


        float x = abs(intensity2 * tx * (sin(iTime*10000.)*15.2 - cos(iTime*10000.)*15.5) + sin(iTime*10000.)*2.5);

        float y = abs(intensity * ty * (clamp(sin(iTime*35.), 1.5,5.5) - clamp(cos(iTime*35.), 3.5,4.5)) + uv.x*clamp(sin(iTime), 3.4,3.6));
        float k = min(x, y);
        float g = pow(k, clamp(sin(iTime*1000000.0)*0.25, 0.0, 0.55));

        //float h = pow(min(g, y), clamp(sin(iTime*12.0)*0.25, 0.0, 0.55));
        float f = pow(y, clamp(sin(iTime*1000000.0)*0.11, 0.09, 0.22));

        vec3 col = vec3(1.4, 1.4, 1.8);

        vec3 col1 = col * -f + col + 0.08;

        col = col * -g + col;
        //  col = col * -h + col;

        col1 = col1 * 1.5;

        gl_FragColor.rgb = col * col1 + col1 * 0.7 ;

        vec2 uv1 = vec2(vUV.y, vUV.x) * 2.0 - 1.0;
        float rim = 1.0-pow(
                        smoothstep(0.0, 1.0, 1.0 - dot(1.0 - uv1.y, 1.0)),
                        1.0
        );
        float rim1 = pow(
                        smoothstep(1.0, 0.0, 1.0 - dot(1.0 + uv1.y, 1.0)),
                        1.0
        );
        float factor = clamp(rim * rim1, 0.0, 1.0);
        gl_FragColor = vec4( mix(gl_FragColor.rgb, vec3(0.0), 1.0-factor), 1.0 );

        vec2 uv2 = vec2(vUV.x, vUV.y) * 2.0 - 1.0;
        float rim2 = 1.0-pow(
                       smoothstep(0.0, 1.0, 1.0 - dot(1.0 - uv2.y, 1.0)),
                       2.0
        );
        float rim3 = pow(
                       smoothstep(1.0, 0.0, 1.0 - dot(1.0 + uv2.y, 1.0)),
                       2.0
        );
        float factor1 = clamp(rim2 * rim3, 0.0, 1.0);
        gl_FragColor = vec4( mix(gl_FragColor.rgb, vec3(0.0), 1.0-factor1), 1.0 );

        gl_FragColor.w = ((col.r * col1.r * gl_FragColor.r) + (col.g * col1.g * gl_FragColor.g) + (col.b * col1.b * gl_FragColor.b))/* * clamp(tan(iTime*100000.0), 0.95, 1.0)*/;
           //     if ( gl_FragColor.w < 0.6 ) discard;
                //gl_FragColor.w = 1.0;
}