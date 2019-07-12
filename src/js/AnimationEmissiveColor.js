import {Animation,CubicEase,EasingFunction} from '@babylonjs/core';

export default function AnimationEmissiveColor(target, duration, loop, scene)
{
    var object = this;

    var animationEmissiveColor = new Animation("animationEmissiveColor", "emissiveColor", 1.0, Animation.ANIMATIONTYPE_COLOR3, Animation.ANIMATIONLOOPMODE_CYCLE);

    // the object destination position
    var nextPos = target;
    var tempColor = object.emissiveColor.clone();

    // Animation keys
    var keysTorus = [];
    keysTorus.push({ frame: 0, value: object.emissiveColor });
    keysTorus.push({ frame: 30, value: nextPos });
    keysTorus.push({ frame: 60, value: tempColor });
    animationEmissiveColor.setKeys(keysTorus);

    // Adding an easing function
    // You can use :
    //1.	CircleEase()
    //2.	BackEase(amplitude)
    //3.	BounceEase(bounces, bounciness)
    //4.	CubicEase()
    //5.	ElasticEase(oscillations, springiness)
    //6.	ExponentialEase(exponent)
    //7.	PowerEase(power)
    //8.	QuadraticEase()
    //9.	QuarticEase()
    //10.	QuinticEase()
    //11.	SineEase()
    // And if you want a total control, you can use a Bezier Curve animationForward
    //12.   BezierCurveEase(x1, y1, x2, y2)
    var easingFunction = new CubicEase();

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    animationEmissiveColor.setEasingFunction(easingFunction);

    object.animations = [];
    object.animations.push(animationEmissiveColor);

    var anim = scene.beginAnimation(object, 0, 60, loop, duration);

    return anim;
};