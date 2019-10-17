import { Animation } from '@babylonjs/core/Animations/animation';

export default function AnimationDiameterStem(duration) {
    var object = this;

    //Create a Vector3 animationForward at 30 FPS
    var animationDiameterStem = new Animation("animationDiameterStem", "diameter", 1, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keysDiameter = [];
    keysDiameter.push({ frame: 0, value: object.diameter });
    keysDiameter.push({ frame: 60, value: 0 });
    animationDiameterStem.setKeys(keysDiameter);

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
    // var easingFunction = new BABYLON.ElasticEase(3, 10);

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    // Adding easing function to my animationForward
    // animationDiameterStem.setEasingFunction(easingFunction);
//////////////////////////////////////////////

    object.animations = [];
    object.animations.push(animationDiameterStem);

// console.log(object)
    var anim = object.scene.beginAnimation(object, 0, 60, false, duration);

    return anim;
}