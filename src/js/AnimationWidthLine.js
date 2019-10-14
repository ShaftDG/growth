import {Animation,CubicEase,EasingFunction} from '@babylonjs/core';
import {AnimationEvent} from "@babylonjs/core/index";

export default function AnimationWidthLine(target, duration, loop, callback, callbackEnd, scene)
{
    var object = this;

    var animationWidth = new Animation("animationWidth", "diameter", 1.0, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // the object destination position
    var nextPos = target;
    var tempColor = object.diameter;
let step = object.diameter / 10;
    // Animation keys
    var keysTorus = [];
    keysTorus.push({ frame: 0, value: object.diameter });
    keysTorus.push({ frame: 30, value: nextPos });
    keysTorus.push({ frame: 60, value: 0 });
    animationWidth.setKeys(keysTorus);

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
    animationWidth.setEasingFunction(easingFunction);

    for(let i = 1; i < 11; i++) {
        var eventAnimationCurrent = new AnimationEvent(40 + i, function() {
            let d = tempColor - step * i;
            callback(d <= 0 ? 0.0001 : d);

        });
    // Attach your event to your animation
        animationWidth.addEvent(eventAnimationCurrent);
    }

    let eventAnimationEnd = new AnimationEvent(60, function() {
        callbackEnd();
    });
    // Attach your event to your animation
    animationWidth.addEvent(eventAnimationEnd);

    object.animations = [];
    object.animations.push(animationWidth);

    var anim = scene.beginAnimation(object, 0, 60, loop, duration);

    return anim;
};