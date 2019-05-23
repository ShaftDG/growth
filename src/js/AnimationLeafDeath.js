import {} from 'babylonjs';

export default function AnimationLeafDeath(target, duration, scene)
{
    var object = this;

    var animationLeafDeath = new BABYLON.Animation("animationLeafDeath", "albedoColor", 1.0, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // the object destination position
    var nextPos = target;

    // Animation keys
    var keysTorus = [];
    keysTorus.push({ frame: 0, value: object.albedoColor });
    keysTorus.push({ frame: 30, value: nextPos });
    animationLeafDeath.setKeys(keysTorus);

    // var easingFunction = new BABYLON.CubicEase();

    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // Adding easing function to my animation
    // animationLeafDeath.setEasingFunction(easingFunction);

    object.animations = [];
    object.animations.push(animationLeafDeath);

    var anim = scene.beginAnimation(object, 0, 30, false, duration);

    return anim;
};