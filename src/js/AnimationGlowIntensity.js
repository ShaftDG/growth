import {Animation,CircleEase,EasingFunction} from '@babylonjs/core';

export default function AnimationGlowIntensity(targetBlurKernelSize, targetIntensity, duration, loop, scene)
{
    var object = this;

    var animationGlowBlurKernelSize = new Animation("animationGlow", "blurKernelSize", 1.0, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // the object destination position
    var nextPos = targetBlurKernelSize;
    var tempBlurKernelSize = object.blurKernelSize;

    // Animation keys
    var keysTorus = [];
    keysTorus.push({ frame: 0, value: object.blurKernelSize });
    keysTorus.push({ frame: 30, value: nextPos });
    keysTorus.push({ frame: 60, value: tempBlurKernelSize });
    animationGlowBlurKernelSize.setKeys(keysTorus);

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
    var easingFunction = new CircleEase();

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    animationGlowBlurKernelSize.setEasingFunction(easingFunction);

    var animationGlowIntensity = new Animation("animationGlowIntensity", "intensity", 1.0, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // the object destination position
    var nextPos = targetIntensity;
    var tempIntensity = object.intensity;

    // Animation keys
    var keysTorus = [];
    keysTorus.push({ frame: 0, value: object.intensity });
    keysTorus.push({ frame: 30, value: nextPos });
    keysTorus.push({ frame: 60, value: tempIntensity });
    animationGlowIntensity.setKeys(keysTorus);

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
    var easingFunction = new CircleEase();

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    animationGlowIntensity.setEasingFunction(easingFunction);

    object.animations = [];
    object.animations.push(animationGlowIntensity);
    object.animations.push(animationGlowBlurKernelSize);

    var anim = scene.beginAnimation(object, 0, 60, loop, duration);

    return anim;
};