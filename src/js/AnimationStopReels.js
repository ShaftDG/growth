import {Animation,ElasticEase,EasingFunction,AnimationEvent} from '@babylonjs/core';

export default function AnimationStopReels(target, duration, callbackUp, callbackDown, stopedCalback, scene) {
    var object = this;

    //Create a Vector3 animationForward at 30 FPS
    var animationStopReels = new Animation("animationStopReels", "rotation", 1, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keysRotation = [];
    keysRotation.push({ frame: 0, value: object.rotation });
    keysRotation.push({ frame: 60, value: target });
    animationStopReels.setKeys(keysRotation);

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
    var easingFunction = new ElasticEase(1, 4);

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    animationStopReels.setEasingFunction(easingFunction);
//////////////////////////////////////////////

    object.animations = [];
    object.animations.push(animationStopReels);


    var eventAnimationUp = new AnimationEvent(10, function() {
        callbackUp();
    });
// Attach your event to your animation
    animationStopReels.addEvent(eventAnimationUp);

    var eventAnimationDown = new AnimationEvent(20, function() {
        callbackDown();
    });
// Attach your event to your animation
    animationStopReels.addEvent(eventAnimationDown);
// console.log(object)
    var anim = scene.beginAnimation(
        object,
        0,
        60,
        false,
        duration,
        stopedCalback
    );

    return anim;
}