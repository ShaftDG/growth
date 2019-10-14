#ifdef GL_ES
        precision highp float;
        precision highp int;
#endif

#define PI 3.141592653589793238462643383279

uniform vec3 lineColor;
uniform vec3 lineColor2;
uniform vec3 backgroundColor;
uniform float time;
uniform float antialias;
uniform float antialias2;
uniform float antialiasX;
uniform float rotationSpeed;
uniform float lineThickness;
uniform float lineThickness2;
uniform float lineThicknessX;
uniform float factor;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

    float uvOffsetY = vUv.y + 0.25;
        float uvGradientY = sin( uvOffsetY * 2.0 * PI * 1.0 );

        vec3 color = backgroundColor;

        if( uvGradientY < lineThickness ) {
            color = lineColor;
        } else if( uvGradientY < lineThickness + antialias ) {
            color = mix( lineColor, backgroundColor, (uvGradientY - lineThickness) / antialias );
        }

        float uvOffsetX = vUv.x - 0.75 - factor;
        float uvGradientX = sin( uvOffsetX * 2.0 * PI * 1.0 );

        vec3 colorX = backgroundColor;

        if( uvGradientX < lineThicknessX * factor ) {
            colorX = lineColor;
        } else if( uvGradientX < lineThicknessX  * factor + antialiasX ) {
            colorX = mix( lineColor, backgroundColor, (uvGradientX - lineThicknessX * factor) / antialiasX );
        }
    ///////////////////////////////////////////////
        float uvOffsetY2 = vUv.y + 0.25;
        float uvGradientY2 = sin( uvOffsetY2 * 2.0 * PI * 1.0 );

        vec3 color2 = backgroundColor;

        if( uvGradientY2 < lineThickness2 ) {
            color2 = lineColor2;
        } else if( uvGradientY < lineThickness2 + antialias2 ) {
            color2 = mix( lineColor2, backgroundColor, (uvGradientY - lineThickness2) / antialias2 );
        }
        color += color2 * 3.5;
    ///////////////////////////////////////////////
        if (vUv.x < factor) {
//            color2 *= colorX;
//            color *= colorX;
        } else {
            color = backgroundColor;
        }

        gl_FragColor = vec4( color * 2.0, 1.0 );
}