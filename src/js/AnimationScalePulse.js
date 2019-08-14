import * as tslib_1 from 'tslib';
import {Animation,BackEase,EasingFunction} from '@babylonjs/core';
import {IEasingFunction} from "@babylonjs/core/Animations/easing";

export default function AnimationScalePulse(targetScale, targetPosition, duration, /*callbackUp, callbackDown,*/ stopedCalback, scene) {
    var object = this;

    //Create a Vector3 animationForward at 30 FPS
    var animationScalePulse = new Animation("animationScalePulse", "scaling", 1, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keysScale = [];
    keysScale.push({ frame: 0, value: object._children[0].scaling });
    // keysScale.push({ frame: 30, value: object.scaling.add(targetScale) });
    // keysScale.push({ frame: 29, value: object.scaling });
    // keysScale.push({ frame: 60, value: object.scaling.add(targetScale) });
    // keysScale.push({ frame: 59, value: object.scaling });
    keysScale.push({ frame: 90, value: object._children[0].scaling.add(targetScale) });
    // keysScale.push({ frame: 89, value: object.scaling });

    animationScalePulse.setKeys(keysScale);

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
    // var easingFunction = new BackEase(10);
    let FunnyEase = (function (_super) {
        tslib_1.__extends(FunnyEase, _super);
        function FunnyEase() {
            _super.apply(this, arguments);
            ;}
        FunnyEase.prototype.easeInCore = function (gradient) {
            // Here is the core method you should change to make your own Easing Function
            // Gradient is the percent of value change
            // return (Math.pow(Math.pow(gradient, 20), Math.pow(gradient, 20)) / Math.pow(Math.pow(gradient, 5), Math.pow(gradient, 5))) * Math.pow(Math.pow(gradient, 1.5), Math.pow(gradient, 1.5));
            return (Math.sin(Math.PI * ((gradient * 6) - 0.5))) + 2;

        };
        return FunnyEase;
    })(EasingFunction);

    let funnyEase = new FunnyEase();
    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    // easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    funnyEase.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    animationScalePulse.setEasingFunction(funnyEase);
//////////////////////////////////////////////
    var animationPositionPulse = new Animation("animationPositionPulse", "position", 1, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    let keysPosition = [];
    keysPosition.push({ frame: 0, value: object.position });
    keysPosition.push({ frame: 90, value: targetPosition });
    // keysPosition.push({ frame: 60, value: object.position });
    // keysPosition.push({ frame: 90, value: targetPosition });
    // keysPosition.push({ frame: 90, value: object.position });
    // keysPosition.push({ frame: 60, value: targetPosition });
    // keysPosition.push({ frame: 59, value: object.position });
    // keysPosition.push({ frame: 89, value: targetPosition });
    // keysPosition.push({ frame: 90, value: object.position });

    animationPositionPulse.setKeys(keysPosition);

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
    // let easingFunctionPosition = new BackEase(10);

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    // easingFunctionPosition.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    // animationPositionPulse.setEasingFunction(easingFunctionPosition);

    let FunnyEase1 = (function (_super) {
        tslib_1.__extends(FunnyEase, _super);
        function FunnyEase() {
            _super.apply(this, arguments);
            ;}
        FunnyEase.prototype.easeInCore = function (gradient) {
            // Here is the core method you should change to make your own Easing Function
            // Gradient is the percent of value change
            // return (Math.pow(Math.pow(gradient, 20), Math.pow(gradient, 20)) / Math.pow(Math.pow(gradient, 5), Math.pow(gradient, 5))) * Math.pow(Math.pow(gradient, 1.5), Math.pow(gradient, 1.5));
            return (Math.sin(Math.PI * ((gradient * 6) - 0.5))) + 2;

        };
        return FunnyEase;
    })(EasingFunction);

    let funnyEase1 = new FunnyEase1();
    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    funnyEase1.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    animationPositionPulse.setEasingFunction(funnyEase1);
//////////////////////////////////////////////

    object.animations = [];
    object._children[0].animations = [];
    object._children[0].animations.push(animationScalePulse);
    // object.animations.push(animationScalePulse);
    object.animations.push(animationPositionPulse);

    // var eventAnimationUp = new AnimationEvent(10, function() {
    //     callbackUp();
    // });
// Attach your event to your animation
//     animationScalePulse.addEvent(eventAnimationUp);
//
//     var eventAnimationDown = new AnimationEvent(30, function() {
//         callbackDown();
//     });
// Attach your event to your animation
//     animationScalePulse.addEvent(eventAnimationDown);
// console.log(object)
    let animScale = scene.beginAnimation(
        object._children[0],
        0,
        90,
        false,
        duration,
        // stopedCalback
    );
    let animPosition = scene.beginAnimation(
        object,
        0,
        90,
        false,
        duration,
        stopedCalback
    );

    return  {
        animScale: animScale,
        animPosition: animPosition
    }
}