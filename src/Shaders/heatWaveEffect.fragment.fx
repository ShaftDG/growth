varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 screenSize;

uniform sampler2D noiseRef0;

uniform float time;


void main(void){

    vec2 unit = vUV/screenSize;
    unit*=16.0+(sin(time*0.01)*50.0);
    vec2 pos = vUV*0.05;
//    pos.x += sin(time*0.005);
    pos.y -= time*0.05;
    vec2 r = ((texture2D(noiseRef0, pos*2.0).rb)*2.0-1.0)*unit;


    vec4 c = texture2D(textureSampler, vec2(vUV.x, vUV.y + r.y));
//    c.a = 1.0 - c.a;
    vec4 c_ = texture2D(textureSampler, vUV);
    vec4 c_c = texture2D(textureSampler, vUV);
    c_c.a = 1.0-c_c.a;
    vec4 cx = texture2D(textureSampler, vUV);
vec4 c1 = texture2D(noiseRef0, vUV + r);


  vec4 f = c_c - c_;
//  f.a = 1.0 - f.a;
//  gl_FragColor = (c_c/* - c - c_*/) ;
//    gl_FragColor = f + c;
    gl_FragColor.rgb = c_.rgb;
    gl_FragColor.a = c_.a;
}