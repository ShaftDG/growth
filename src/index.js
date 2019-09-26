// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";

import './css/style.css';
// import { Engine } from '@babylonjs/core/Engines';
// import { Scene } from '@babylonjs/core/scene';
// import { AssetsManager } from '@babylonjs/core/Misc/assetsManager';
// import { ArcRotateCamera } from '@babylonjs/core/Cameras';
// import { Vector3 } from '@babylonjs/core/Maths';
// import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
// import { PBRMaterial } from '@babylonjs/core/Materials/PBR';
// import { Texture } from '@babylonjs/core/Materials/Textures';
// import { Color3 } from '@babylonjs/core/Maths';
// import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
// import { Axis } from '@babylonjs/core/Maths';
// import { Mesh } from '@babylonjs/core/Meshes';
// import { ActionManager } from '@babylonjs/core/Actions';
// import { ExecuteCodeAction } from '@babylonjs/core/Actions';
// import { DirectionalLight } from '@babylonjs/core/Lights';
// import { HemisphericLight } from '@babylonjs/core/Lights';
// import { CubeTexture } from '@babylonjs/core/Materials/Textures';

import {
    Engine,
    Scene,
    // Animation,
    // ParticleHelper,
    // GlowLayer,
    AssetsManager,
    ArcRotateCamera,
    Vector3,
    // Color3,
    SceneLoader,
    // PBRMaterial,
    // Texture,
    // Color3,
    // MeshBuilder,
    // Axis,
    // Mesh,
    ActionManager,
    ExecuteCodeAction,
    Camera,
    Constants,
    // StandardRenderingPipeline,
    // DefaultRenderingPipeline,
    // ImageProcessingConfiguration,
    // DirectionalLight,
    // HemisphericLight,
    // StandardMaterial
    // CubeTexture
} from '@babylonjs/core';
import {
    GUI3DManager,
} from '@babylonjs/gui'
import {GLTFFileLoader,GLTFLoaderAnimationStartMode} from '@babylonjs/loaders';
// import {StandardRenderingPipeline} from '@babylonjs/post-processes';
import CreateCanvas from './js/CreateCanvas';
// import Growth from './js/Growth';
import './js/showFPS';
// import AnimationLeafDeath from "./js/AnimationLeafDeath";
// import AnimationEmissiveColor from "./js/AnimationEmissiveColor";
// import CustomPBRmaterial from "./js/CustomPBRmaterial";
// import AnimationStopReels from "./js/AnimationStopReels";
import CreateReel from "./js/CreateReel";
import GenerateWinCombination from "./js/GenerateWinCombination";
// import ParticlesSquare from './js/ParticlesSquare';
import ChangeCustomVertexParticles from './js/changeCustomVertexParticles';

import MakeButton from './js/MakeButton';

// import Fire from './js/FireParticles';
import FireHelper from './js/FireParticlesHelper';
import {NoiseProceduralTexture, Scalar} from "@babylonjs/core/index";
// import {EngineStore} from "@babylonjs/core/Engines/engineStore";
// import {Logger} from "@babylonjs/core/Misc/logger";

// let objGrowth;
let baseURL = document.location.href + 'src/';
Constants.PARTICLES_BaseAssetsUrl = baseURL + 'assets';
// let baseURL = '/src/';
// console.log(document.location.href)

let canvas = CreateCanvas();

window.addEventListener('DOMContentLoaded', function(){

    if (/*BABYLON.Engine.isSupported()*/true) {
        // get the canvas DOM element


        // load the 3D engine
        var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true}, false);

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new Scene(engine);
            // scene.debugLayer.show();
            // var gl = new GlowLayer("glow", scene);
            // gl.intensity = 1.0;
            var assetsManager = new AssetsManager(scene);
            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -50), scene);
            var camera = new ArcRotateCamera('Camera', 0, 0, 0.5, new Vector3(0, 8, 70), scene);
            camera.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
            // camera.fov = 0.5;
            // camera.setPosition(new BABYLON.Vector3(0, 20, -20));
            // camera.lowerRadiusLimit = camera.radius;
            // camera.upperRadiusLimit = 5;
            camera.setTarget(new Vector3(0, 8.5, 0));
            // target the camera to scene origin
            // camera.setTarget(BABYLON.Vector3.Zero());

            // attach the camera to the canvas
            // camera.attachControl(canvas, false);
            scene.showFPS();

         //   let startButton, autoPlay, maxBet;



            let fires = [];
            var noiseTexture = new NoiseProceduralTexture("perlin", 32, scene);
            noiseTexture.animationSpeedFactor = 10;
            noiseTexture.persistence = 0.8;
            noiseTexture.brightness = .5;
            noiseTexture.octaves = 8;

            let fireHelper = new FireHelper(scene, engine);

            new ChangeCustomVertexParticles();
            for (let i = 0; i < 5; i++) {
                // let fire = new Fire({
                //     engine: engine,
                //     scene: scene,
                //     sizeParticlesAddBlendMode: 7,
                //     sizeParticlesStandardBlendMode: 7,
                //     countParticlesAddBlendMode: 6,
                //     countParticlesStandardBlendMode: 3,
                //     noiseTexture: noiseTexture
                // });
                let fire = new FireHelper(scene, engine);
                fires.push(fire);
            }

            var textureNoiseCombustion = assetsManager.addTextureTask('textureNoiseCombustion', baseURL + 'assets/textures/fire/originFire.png', null, false);
            textureNoiseCombustion.onSuccess = function(task) {
                fires.map(v => {
                    v.setTextureNoiseCombustion(task.texture);
                })
            };

            var textureSpark = assetsManager.addTextureTask('textureNoiseCombustionAlpha', baseURL + 'assets/textures/fire/sparks.png', null, false);
            textureSpark.onSuccess = function(task) {
                fires.map(v => {
                    v.setTextureSpark(task.texture);
                })
            };


            var textureSparkStretched = assetsManager.addTextureTask('textureNoiseCombustionAlpha', baseURL + 'assets/textures/fire/sparkStretched.png', null, false);
            textureSparkStretched.onSuccess = function(task) {
                fires.map(v => {
                    v.setTextureSparkStretched(task.texture);
                })
            };

            var textureNoiseCombustion1 = assetsManager.addTextureTask('textureNoiseCombustion1', baseURL + 'assets/textures/fire/noiseTexture.png', null, false);
            textureNoiseCombustion1.onSuccess = function(task) {

                fires.map(v => {
                    v.setTextureNoiseCombustion1(task.texture);
                });
                fireHelper.setTextureNoiseCombustion1(task.texture);
            };

            // var textureFire = assetsManager.addTextureTask('textureFire', baseURL + 'assets/textures/fire/flare2.png', null, false);
            // textureFire.onSuccess = function(task) {
            //     fires.map(v => {
            //         v.setTextureFlame(task.texture);
            //     })
            //     // fire.setTextureFlame(task.texture);
            // };
            // var textureFireOrigin = assetsManager.addTextureTask('textureFireOrigin', baseURL + 'assets/textures/fire/flare4.png', null, false);
            // textureFireOrigin.onSuccess = function(task) {
            //     fires.map(v => {
            //         v.setTextureOrigin(task.texture);
            //     })
            //     // fire.setTextureOrigin(task.texture);
            // };
            // Set up new rendering pipeline
            // var pipeline = new DefaultRenderingPipeline("default", true, scene);

            // Tone mapping
            // scene.imageProcessingConfiguration.toneMappingEnabled = true;
            // scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
            // scene.imageProcessingConfiguration.exposure = 3;

            // Bloom
            // pipeline.bloomEnabled = true;
            // pipeline.bloomThreshold = 0.1;
            // pipeline.bloomWeight = 3;
            // pipeline.bloomKernel = 64;
            // pipeline.bloomScale = .5;
            // var pipeline = new StandardRenderingPipeline(
            //     "standard", // The name of the pipeline
            //     scene, // The scene instance
            //     1.0, // The rendering pipeline ratio
            //     null, // The original post-process that the pipeline will be based on
            //     [camera] // The list of cameras to be attached to
            // );
            // pipeline.exposure = 1.0;
            // pipeline.samples = 4;
            // pipeline.fxaaEnabled = true;
            // pipeline.bloomEnabled = true;
            // pipeline.bloomThreshold = 0.8;
            // pipeline.bloomWeight = 2.0;
            // pipeline.bloomKernel = 64;
            // pipeline.bloomScale = 0.5;
            // create a basic light, aiming 0,1,0 - meaning, to the sky
            // var light = new HemisphericLight('light1', new Vector3(0, 1, -10), scene);
            // light.intensity = 0.5;
            // var lightdir = new DirectionalLight("DirectionalLight", new Vector3(50, 50, -500), scene);
            // lightdir.intensity = 0.5;
            // lightdir.autoUpdateExtends = false;
            // var lightPoint = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 0, 100), scene);
            // lightPoint.intensity = 1000;
             //
            // var lightspot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(10, 10, 40), new BABYLON.Vector3(0.2, 0, -0.8), 20, 0.1, scene);
            // lightspot.intensity = 1000;
            // var lightspot1 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-10, 10, 40), new BABYLON.Vector3(-0.2, 0, -0.8), 20, 0.1, scene);
            // lightspot1.intensity = 1000;

            // var shadowGenerator = new BABYLON.ShadowGenerator(1024, lightdir);
            // shadowGenerator.usePoissonSampling = true;
            // shadowGenerator.bias = 0.00001;
            // shadowGenerator.normalBias = 0.02;
            // light.shadowMaxZ = 100;
            // light.shadowMinZ = 1;
            // shadowGenerator.useContactHardeningShadow = true;
            // shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
            // shadowGenerator.setDarkness(0.5);

            // var helper = scene.createDefaultEnvironment();
            // helper.setMainColor(BABYLON.Color3.White());

            // let hdrTexture = CubeTexture.CreateFromPrefilteredData('/src/assets/textures/righthdrSpecularHDR.dds', scene);
            // hdrTexture.gammaSpace = false;
            // hdrTexture.rotationY = Math.PI;
            // scene.environmentTexture = hdrTexture;

            // scene.environmentTexture.coordinatesMode = Texture.CUBIC_MODE;
            // var taskEnvTexture = new BABYLON.HDRCubeTexture('/src/assets/textures/Orange1.hdr', scene, 1024, false, false);
            // var taskEnvTexture = new BABYLON.CubeTexture("studio.env", scene);
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/studio.env');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/environmentExp.env');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/them/environmentSceneDarkest.env');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/righthdrSpecularHDR.dds');
           /* var taskEnvTexture1 = assetsManager.addCubeTextureTask('studioEnv1', baseURL + 'assets/textures/them/2.dds');
            taskEnvTexture1.onSuccess = function(task) {
                // task.texture.rotationY = Math.PI;
                task.texture.gammaSpace = false;
                // scene.environmentTexture = task.texture;
            }*/;
            var taskEnvTexture2 = assetsManager.addCubeTextureTask('studioEnv2', baseURL + 'assets/textures/them/3.dds');
            taskEnvTexture2.onSuccess = function(task) {
                // task.texture.rotationY = Math.PI;
                task.texture.gammaSpace = false;
                // task.texture.invertZ = true;
                // scene.environmentTexture = task.texture;
                // scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            };
            var taskEnvTexture3 = assetsManager.addCubeTextureTask('studioEnv3', baseURL + 'assets/textures/them/4SpecularHDR.dds');
            taskEnvTexture3.onSuccess = function(task) {
                // task.texture.rotationY = Math.PI;
                task.texture.gammaSpace = false;
                // task.texture.invertZ = true;
                scene.environmentTexture = task.texture;
            };

          /*  var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/them/environmentSceneDarkest.env');
            taskEnvTexture.onSuccess = function(task) {
                task.texture.rotationY = Math.PI;
                task.texture.gammaSpace = false;
                // scene.environmentTexture = task.texture;
                // scene.environmentTexture.coordinatesMode = Texture.CUBIC_MODE;

                // scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
                // scene.environmentTexture.samplingMode = Texture.NEAREST_SAMPLINGMODE;
            };*/

            // var taskBRDFTexture = assetsManager.addTextureTask('studioBRDF', baseURL + 'assets/textures/them/2Brdf.dds');
            // taskBRDFTexture.onSuccess = function(task) {
            //     scene.environmentBRDFTexture = task.texture;
            // };

            //HDR_110_Tunnel_Env.hdr
            // Main_Game-Zborka_v02.hdr
            var taskHdrTexture = assetsManager.addHDRCubeTextureTask('studioHDR', baseURL + 'assets/textures/them/hfq_4.hdr', 16, false, true, true, true);
            taskHdrTexture.onSuccess = function(task) {
                task.texture.rotationY = Math.PI;
                // task.texture.invertZ = true;
                // scene.environmentTexture = task.texture;
                // scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            };

            // scene.environmentTexture = hdrTexture;
            // scene.createDefaultSkybox(hdrTexture, true, 1000, 0.005);

            SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === 'gltf' && plugin instanceof GLTFFileLoader) {
                    plugin.animationStartMode = GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

         /*   let tubeMaterial = new PBRMaterial('tubeMaterial', scene);
            tubeMaterial.metallic = 0.0;
            tubeMaterial.roughness = 0.25;
            tubeMaterial.environmentTexture = scene.environmentTexture;


            var textureAlbedo = assetsManager.addTextureTask('textureAlbedo', baseURL + 'assets/textures/stem_baseColor.png');
            textureAlbedo.onSuccess = function(task) {
                tubeMaterial.albedoTexture = task.texture;
                tubeMaterial.albedoTexture.uScale = 2;
                tubeMaterial.albedoTexture.vScale = 10;

                tubeMaterial.albedoTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.albedoTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            };

            var textureBump = assetsManager.addTextureTask('textureBump', baseURL + 'assets/textures/stem_normal.png');
            textureBump.onSuccess = function(task) {
                tubeMaterial.bumpTexture = task.texture;
                tubeMaterial.bumpTexture.uScale = 2;
                tubeMaterial.bumpTexture.vScale = 10;

                tubeMaterial.bumpTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.bumpTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            };

            var textureORM = assetsManager.addTextureTask('textureBump', baseURL + 'assets/textures/stem_ORM.png');
            textureORM.onSuccess = function(task) {
                tubeMaterial.metallicRoughnessTexture  = task.texture;
                tubeMaterial.metallicRoughnessTexture.uScale = 2;
                tubeMaterial.metallicRoughnessTexture.vScale = 10;

                tubeMaterial.metallicRoughnessTexture.wrapU = Texture.WRAP_ADDRESSMODE;
                tubeMaterial.metallicRoughnessTexture.wrapV = Texture.WRAP_ADDRESSMODE;

                tubeMaterial.useRoughnessFromMetallicTextureGreen = true;
                tubeMaterial.useMetallnessFromMetallicTextureBlue = true;
                tubeMaterial.useAmbientOcclusionFromMetallicTextureRed = true;
            };

            var textureEmissive = assetsManager.addTextureTask('textureEmissive', baseURL + 'assets/textures/stem_emissive.png');
            textureEmissive.onSuccess = function(task) {
                tubeMaterial.emissiveTexture = task.texture;
                tubeMaterial.emissiveColor = new Color3(2,2,2);
                tubeMaterial.emissiveTexture.uScale = 2;
                tubeMaterial.emissiveTexture.vScale = 10;

                tubeMaterial.emissiveTexture.wrapU = Texture.WRAP_ADDRESSMODE;
                tubeMaterial.emissiveTexture.wrapV = Texture.WRAP_ADDRESSMODE;
            };
            let particles = new ParticlesSquare(5, 5, scene);
            particles.setCenter(12.6,9.75,17);
            var textureParticles = assetsManager.addTextureTask('textureParticles', baseURL + 'assets/textures/particle.png');
            textureParticles.onSuccess = function(task) {
               particles.setTexture(task.texture);
            };*/

            // let planeMaterial = new PBRMaterial('planeMaterial', scene);
            // planeMaterial.albedoColor = new Color3(0.75, 0.75, 0.25).scale(0.1);
            // planeMaterial.metallic = 1.0;
            // planeMaterial.roughness = 1.0;
            // let plane = MeshBuilder.CreatePlane("plane", { width: 10, height: 10}, scene);
            // plane.scaling = new Vector3(1,1,-1);
            // plane.rotation.z = Math.PI;
            // plane.position.y = 10;
            // plane.position.z = 20;
            // plane.material = planeMaterial;

     /*       var textureThreeOn = assetsManager.addTextureTask('textureThreeOn', baseURL + 'assets/textures/line/threeOn.png');
            textureThreeOn.onSuccess = function(task) {
                task.texture.vScale = -1;
            };

            var textureThreeOff = assetsManager.addTextureTask('textureThreeOff', baseURL + 'assets/textures/line/threeOff.png');
            textureThreeOff.onSuccess = function(task) {
                task.texture.vScale = -1;
                // planeMaterial.albedoTexture = task.texture;
            };

            let onoffEm = false;
            var textureThreeEm = assetsManager.addTextureTask('textureThreeEm', baseURL + 'assets/textures/line/three_emissive.png');
            textureThreeEm.onSuccess = function(task) {
                task.texture.vScale = -1;
                // planeMaterial.emissiveTexture = task.texture;
            };

            let numTubes = 2;
            let sectionPoints = 3;
            let numSegmentPerPoint = 4;
            let numPointsperInterval = 5;
            let dotIterationStep = 1;
            let intervalTime = 0.0;
            let distanceSprouts = 0.25;
            let offSetSprouts = 20;
            let deltaMoveSprouts = 0.01;
            let plantDyingOff = true;
            let plantDeath = false;
            let scale = 0.225;
            let diameter = 0.015;

            objGrowth = new Growth(
                [
                    new Vector3(12,10,30),
                    new Vector3(10,10,30),
                    new Vector3(5,15,30),
                    new Vector3(0,10,30),
                    new Vector3(-5,15,30),
                    new Vector3(-10,10,30),
                    new Vector3(-12,10,30),
                ],
                numTubes,
                sectionPoints,
                numSegmentPerPoint,
                numPointsperInterval,
                distanceSprouts,
                offSetSprouts,
                diameter,
                scale,
                intervalTime,
                deltaMoveSprouts,
                dotIterationStep,
                plantDyingOff,
                plantDeath,
                tubeMaterial,
                assetsManager,
                scene
            );*/

            // var motionblur = new BABYLON.MotionBlurPostProcess(
            //     "mb", // The name of the effect.
            //     scene, // The scene containing the objects to blur according to their velocity.
            //     1.0, // The required width/height ratio to downsize to before computing the render pass.
            //     camera // The camera to apply the render pass to.
            // );
            // motionblur.motionStrength = 2;
            // motionblur.motionBlurSamples = 16;

            // var paralaxTexture = new BABYLON.Texture(baseURL + 'assets/textures/nornallll.png', scene);



            // let symbols = new Array(10);
            // let skeletons = new Array(10);
            // let animationsGroups = new Array(10);

// gltf-pipeline -i grapes.glb -o tmp/grapesDraco.glb -d
      /*      let meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'bell_final_Draco.glb');
            meshTaskBell.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[0] = task.loadedMeshes[0];
            };
            let meshTaskLemon = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'lemon_final_Draco.glb');
            meshTaskLemon.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0]._children[0].material.roughness = 0.35;
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[1] = task.loadedMeshes[0];
            };
            let meshTaskWild = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'wild_final_Draco.glb');
            meshTaskWild.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[2] = task.loadedMeshes[0];
            };
            let meshTaskCherry = assetsManager.addMeshTask('cherry', '', baseURL + 'assets/models/tmp/', 'cherry_final_Draco.glb');
            meshTaskCherry.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[3] = task.loadedMeshes[0];
            };
            function cloneGLB(mesh, skeleton, animationGroup) {
                let obj = mesh.clone();
                console.log(obj)
                obj.position.y += 10;
                obj.position.z += 20;
                if (skeleton) {
                    let _skeleton = skeleton.clone("Armature_clone", "Skeleton_clone");
                    obj._children[0]._children[0].skeleton = _skeleton;
                    // obj._children[0]._children[0].skeleton.overrideMesh = obj;
                    obj._children[0]._children[0].applySkeleton(_skeleton);

                    function linkBones(array, nameTarget) {
                        let _target = null;
                        for (let k = 0; k < array.length; k++) {
                            if (array[k]._children) {
                                _target = linkBones(array[k]._children, nameTarget)
                            }
                            let stringArray = array[k].name.split('.');
                            if (stringArray[stringArray.length - 1] === nameTarget) {
                                _target = array[k]
                            }
                            if (_target) {
                                return _target
                            }
                        }
                        return _target
                    }
                    for (let f = 0; f < _skeleton.bones.length; f++) {
                        let target = linkBones(obj._children, _skeleton.bones[f].name);
                        _skeleton.bones[f].linkTransformNode(target);

                        let cylinder = MeshBuilder.CreateSphere("cylinder", {diameter: 0.1}, scene);
                        cylinder.position = target.getAbsolutePosition();
                        let materialCilynder = new PBRMaterial("materialCilynder", scene);
                        materialCilynder.albedoColor = new Color3(1.0,0.0,0.0);
                        cylinder.material = materialCilynder;
                    }

                    let _animationGroup = animationGroup.clone("clonedAnimationsGroups_clone", function (target) {

                        let nameTarget = target.name;

                        function AnimationClone(array, skeleton) {
                            for (let k = 0; k < array.length; k++) {
                                if (array[k]._children) {

                                    AnimationClone(array[k]._children, skeleton)
                                }
                                let stringArray = array[k].name.split('.');
                                if (stringArray[stringArray.length - 1] === nameTarget) {
                                    target = array[k];
                                }
                            }
                        }
                        AnimationClone(obj._children[0]._children[1]._children, _skeleton);

                        return target;
                    });
                    console.log(_animationGroup)
                    _animationGroup.start(true);
                }
            }
            let meshTaskGrapes = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/tmp/', 'grape_final_anim_Draco.glb');
            meshTaskGrapes.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0].position.x = -10;
                // task.loadedMeshes[0].rotate(Axis.X, 1.5, Mesh.WORLD);

                task.loadedMeshes[0].scaling = new Vector3(4,4,4);
                // task.loadedMeshes[0]._children[0]._children[1].dispose();
                skeletons[4] = task.loadedSkeletons[0];
                symbols[4] = task.loadedMeshes[0];
                animationsGroups[4] =  task.loadedAnimationGroups[0];
                console.log(task)
                scene.animationGroups[0].start(true);

                // cloneGLB(task.loadedMeshes[0], task.loadedSkeletons[0], task.loadedAnimationGroups[0])
            };
            let meshTaskStar = assetsManager.addMeshTask('lemon', '', baseURL + 'assets/models/tmp/', 'star_final_Draco.glb');
            meshTaskStar.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[5] = task.loadedMeshes[0];
            };
            let meshTaskOrange = assetsManager.addMeshTask('orange', '', baseURL + 'assets/models/tmp/', 'orange_final1_Draco.glb');
            meshTaskOrange.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                // task.loadedMeshes[0]._children[0].material.albedoColor = new Color3(1.5,0.5,1.0);
                symbols[6] = task.loadedMeshes[0];
            };
            let meshTaskPlum = assetsManager.addMeshTask('plum', '', baseURL + 'assets/models/tmp/', 'plum_final_Draco.glb');
            meshTaskPlum.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[7] = task.loadedMeshes[0];
            };
            let meshTaskSeven = assetsManager.addMeshTask('seven', '', baseURL + 'assets/models/tmp/', 'seven_final_Draco.glb');
            meshTaskSeven.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[8] = task.loadedMeshes[0];
            };
            let meshTaskWatermelon = assetsManager.addMeshTask('watermelon', '', baseURL + 'assets/models/tmp/', 'watermelon_final_Draco.glb');
            meshTaskWatermelon.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
                symbols[9] = task.loadedMeshes[0];
            };*/
// let arr = [];
//             for (var i = 0; i < 5; i++) {
//                 let meshTaskGrapes1 = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/tmp/', 'grape_final_anim_Draco.glb');
//                 arr.push(meshTaskGrapes1);
//                 // arr[arr.length - 1].scaling = new Vector3(0.04, 0.04, -0.04);
//                 // arr[arr.length - 1].position = new Vector3(12.6 - i * 6.3, 10, 20);
//                 // console.log(meshTaskGrapes1)
//                 let ii = i;
//                 arr[arr.length - 1].onSuccess = function (task) {
//                     // task.loadedMeshes[0].setEnabled(false);
//                     task.loadedMeshes[0].scaling = new Vector3(0.04, 0.04, -0.04);
//                     task.loadedMeshes[0].position = new Vector3(12.6 - ii * 6.3, 10, 20);
//                     task.loadedAnimationGroups[0].start(true);
//                     // console.log(task, scene.animationGroups)
//                     // skeletons[4] = task.loadedSkeletons[0];
//                     // symbols[4] = task.loadedMeshes[0];
//                     // animationsGroups[4] =  task.loadedAnimationGroups[0];
//                     // scene.animationGroups[i].start(true);
//                 };
//             }
//             console.log(arr)

            // let cylinder = MeshBuilder.CreateCylinder("cylinder", {diameterBottom: 20, diameterTop: 20, height: 40, tessellation: 16}, scene);
            // cylinder.position.y = 10;
            // cylinder.rotation.z = Math.PI / 2;
            // let materialCilynder = new PBRMaterial("materialCilynder", scene);
            // materialCilynder.albedoColor = new Color3(0.0,0.0,0.0);
            // materialCilynder.metallic = 1;
            // materialCilynder.roughness = 0.5;
            // // materialCilynder.cameraExposure = 1.5;
            // // materialCilynder.cameraContrast = 1.25;
            // cylinder.material = materialCilynder;
            // // cylinder.material.unlit = true;

        /*    let meshTask = assetsManager.addMeshTask('leaf', '', baseURL + 'assets/models/', 'leaf.glb');

            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0]._children[0].material.metallic = 0.01;
                task.loadedMeshes[0]._children[0].material.roughness = 0.25;
                task.loadedMeshes[0]._children[0].material.environmentTexture = scene.environmentTexture;
                objGrowth.setLeaf(task.loadedMeshes[0]);
            };*/

            let managerGUI = new GUI3DManager(scene);
            // let line3;
            let meshTaskMain = assetsManager.addMeshTask('main', '', baseURL + 'assets/models/tmp/', 'MainGame_Draco.glb');
            meshTaskMain.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0].material.metallic = 0.01;
                // task.loadedMeshes[0]._children[0].material.roughness = 0.25;
                // task.loadedMeshes[0]._children[0].material.environmentTexture = scene.environmentTexture;
                // objGrowth.setLeaf(task.loadedMeshes[0]);
                // task.loadedMeshes[0].rotation.y = Math.PI;
                // task.loadedMeshes[0]._children[0]._children[1]._children[0].setEnabled(false);
                // task.loadedMeshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Mesh.WORLD);
                // task.loadedMeshes[0].position.y = 10;
                // task.loadedMeshes[0].position.z = 12;
                // for (var i = 0; i <  task.loadedMeshes[0]._children[0]._children.length; i++) {
                    // scene.materials[i].enableSpecularAntiAliasing = !scene.materials[i].enableSpecularAntiAliasing;
                    // task.loadedMeshes[0]._children[0]._children[22]._children[22]._children[16]._children[0].material.unlit = true;
                    // console.log(task.loadedMeshes[0]._children[0]._children[22]._children[22]._children[16]._children[0])
                    // scene.materials[i].metallic = 1;
                // }
                // task.loadedMeshes[0].position.x = 0.1;
                // line3 = task.loadedMeshes[0]._children[0]._children[7]._children[0];
                // line3.material.albedoTexture = textureThreeOff.texture;
                // line3.material.albedoColor = new Color3(0.8, 0.8, 0);
                // line3.material.emissiveTexture = textureThreeEm.texture;
                // line3.material.metallic = 0;

                // task.loadedMeshes[0]._children.map((v, i) => {
                //     console.log(v.id, i);
                // });


                task.loadedMeshes[0].position.y = 10.05;
                task.loadedMeshes[0].position.z = 11;
                // task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.105,0.105,0.105);
                task.loadedMeshes[0].scaling = new Vector3(4.8,4.8,-4.8);
                task.loadedMeshes[0]._children[34].material.unlit = true;
                // task.loadedMeshes[0]._children[10].material.unlit = true;
                task.loadedMeshes[0]._children[4].material.unlit = true;

                // task.loadedMeshes[0]._children[31].material.unlit = true;
                // task.loadedMeshes[0]._children[0]._children[33]._children[0].material.unlit = true;
                // task.loadedMeshes[0]._children[0]._children[20]._children[0].material.roughness = 0.1;
                // task.loadedMeshes[0]._children[0]._children[20]._children[0].material.metallic = 1.1;
                // task.loadedMeshes[0]._children[0]._children[38]._children[0].material.roughness = 0.25;

                // task.loadedMeshes[0]._children[0]._children[30]._children[0].material.roughness = 0.1;
                // task.loadedMeshes[0]._children[0]._children[36]._children[0].material.roughness = 0.1;
                // task.loadedMeshes[0]._children[0]._children[1]._children[0].material.unlit = true;
                // console.log(task.loadedMeshes[0]._children[0]._children[3]._children[0])
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.isEnabled = true;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.intensity = 1; // 0-1 defaults to 1
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.roughness = 0; // 0-1 defaults to 0
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material._environmentIntensity = 0.25;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.texture = texture; // R is storing intensity and G roughness

                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.isTintEnabled = true;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.tintColor = Color3.Teal();
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.bumpTexture = texture; // dedicated bump texture for the coat

                let optionStartButton = {
                    deltaPush: new Vector3(0,0,-0.03)
                };

                function startMoveWinLines(reel) {
                    reel.onStopEndObservable.addOnce(function () {
                        if (generateWinCombination.getTotalRound() > 0) {
                            let index = generateWinCombination.numWinSymbline.indexOf(1);
                            generateWinCombination.moveArray[index].map((v, i) => {
                                reels[i].moveWinSymbols(v, fires[i]);
                            });

                            function iterationMoveWinEnd() {
                                reels[1].onMoveWinEndObservable.clear();
                                generateWinCombination.numWinSymbline[index] = 0;
                                index = generateWinCombination.numWinSymbline.indexOf(1);
                                if (index !== -1) {
                                    generateWinCombination.moveArray[index].map((v, i) => {
                                        reels[i].moveWinSymbols(v, fires[i]);
                                    });
                                    reels[1].onMoveWinEndObservable.addOnce(function () {
                                        iterationMoveWinEnd();
                                    });
                                }
                            }

                            reels[1].onMoveWinEndObservable.addOnce(function () {
                                iterationMoveWinEnd();
                            });
                        }
                    });
                }

                let startButton = new MakeButton("startButton", task.loadedMeshes[0]._children[31], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                startButton.pushButton.onPointerUpObservable.add(function () {

                    if (reels[reels.length - 1].rotateSlots && !reels[reels.length - 1].stoped) {
                        // reels.map((v, i) => {
                        //     if (!v.stoped) {
                        //         v.stopRotate(false, generateWinCombination.arrayCombination[i]);
                        //         v.onStopEndObservable.clear();
                        //         if (i === reels.length - 1) {
                        //             startMoveWinLines(v);
                        //         }
                        //     }
                        // });

                    } else if (reels[reels.length - 1].stoped && !reels[reels.length - 1].rotateSlots) {
                        reels[0].onMoveWinEndObservable.clear();

                        if (!generateWinCombination.gettedWinning) {
                            generateWinCombination.gettingWinnings();
                        }

                        generateWinCombination.generate();

                        if (reels[reels.length - 1].stoped) {
                            reels.map((v, i) => {
                                v.onStopEndObservable.clear();
                                v.startRotate(true, fires[i]);
                            });
                        }
                        let stopIndex = 0;
                        setTimeout(function () {
                            enableEndRotateAnimation = true;
                            reels[stopIndex].stopRotate(false, generateWinCombination.arrayCombination[stopIndex]);
                        }, 500);

                        function iterationStopEnd() {
                            reels[stopIndex].onStopEndObservable.clear();
                            if (stopIndex < 4) {
                                stopIndex++;
                                reels[stopIndex].stopRotate(false, generateWinCombination.arrayCombination[stopIndex]);
                                reels[stopIndex].onStopEndObservable.addOnce(function () {
                                    iterationStopEnd();
                                });
                            }
                        }

                        reels[stopIndex].onStopEndObservable.addOnce(function () {
                            iterationStopEnd();
                        });
                        startMoveWinLines(reels[reels.length - 1]);
                    }
                });

          /*      let autoPlay = new MakeButton("autoPlay", task.loadedMeshes[0]._children[32], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                autoPlay.pushButton.onPointerUpObservable.add(function () {
                    fires.map(v => {
                        v.stop();
                    })
                });

                let maxBet = new MakeButton("maxBet", task.loadedMeshes[0]._children[31], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                maxBet.pushButton.onPointerUpObservable.add(function () {
                    fires.map(v => {
                        v.start();
                    })
                });*/

                // startButton.setTexture(textureNoiseCombustion1.texture);
                // autoPlay.setTexture(textureNoiseCombustion1.texture);
                // maxBet.setTexture(textureNoiseCombustion1.texture);
            };

            let generateWinCombination = new GenerateWinCombination(5,3,10);

            let numSymbolPerReel = 16;
            let section = (Math.PI * 2) / numSymbolPerReel;
            let angles = [
                section * (numSymbolPerReel - 2),
                section * (numSymbolPerReel - 1),
                0,
                section * 1,
                section * 2
            ];
            let radius = 12.65;
            let reels = [];
            let stopIndex = 0;
            let enableEndRotateAnimation = false;
            let forceStop = undefined;

            for (var j = 0, i = 0; j < 5; j++, i += 3) {
                let reel = new CreateReel(angles, radius, section, numSymbolPerReel, new Vector3(12.6 - j * 6.3, 0, 0), i, baseURL, assetsManager, scene);
                // fires[j].setEmitter(reel.meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);
                reels.push(reel);
            }
            // fireHelper.setEmitter(reels[0].meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);

            scene.executeWhenReady(function() {
                for (var j = 0; j < 5; j++) {
                    reels[j].beginVisibleSymbol();
                    fires[j].setEmitter(reels[j].meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);
                }
                // scene.animationGroups.map(v => { v.start(true) });
                // fire.start();
                // particles.start();
               /* for (var j = 0, i = 0; j < 5; j++, i += 3) {
                    let reel = new _CreateReel(symbols, skeletons, animationsGroups, angles, radius, section, numSymbolPerReel, new Vector3(12.6 - j * 6.3, 0, 0), i, scene);
                    fires[j].setEmitter(reel.meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);
                    reels.push(reel);
                }
                fireHelper.setEmitter(reels[0].meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);*/
                // for (let i = 0; i < 5; i++) {
                //     fires[i].setEmitter(reels[i].meshes[Math.round(Scalar.RandomRange(1, 3))]._children[0]._children[0]);
                // }
                // fire.setEmitter(reels[0].meshes[2]._children[0]._children[0]._children[0]);
                /*   objGrowth.setPoints([
                       new Vector3(12,10,20),
                       new Vector3(10,10,20),
                       new Vector3(5,15,20),
                       new Vector3(0,10,20),
                       new Vector3(-5,15,20),
                       new Vector3(-10,10,20),
                       new Vector3(-12,10,20),
                   ]);*/

                // for (var i = 0; i < scene.meshes.length; i++) {
                //     shadowGenerator.addShadowCaster(scene.meshes[i]);
                //     // shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
                //     scene.meshes[i].receiveShadows = true;
                // }
                for (var i = 0; i < scene.materials.length; i++) {
                    scene.materials[i].enableSpecularAntiAliasing = false;
                }

                // generateWinCombination.generate();
                //
                // if (reels[reels.length - 1].stoped) {
                //     reels.map(v => {
                //         v.startRotate(true);
                //     });
                //     forceStop = undefined;
                // }
                //
                // setTimeout(function () {
                //     if (forceStop === undefined) {
                //         forceStop = false;
                //     } else {
                //         forceStop = true;
                //     }
                //
                //     if (forceStop) {
                //         reels.map((v, i) => {
                //             v.stopRotate(false, generateWinCombination.arrayCombination[i]);
                //         });
                //         forceStop = undefined;
                //     } else {
                //         enableEndRotateAnimation = true;
                //         reels[0].stopRotate(false, generateWinCombination.arrayCombination[0]);
                //     }
                // }, 1000);
                // shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;


                scene.registerBeforeRender(function () {
// console.time();
                    let deltaTime = scene.getEngine().getDeltaTime() * 0.01;
                    reels.map(v => {
                        v.update(deltaTime);
                    });

                    // if (enableEndRotateAnimation && reels[stopIndex].stoped) {
                    //     if (stopIndex < 4) {
                    //         stopIndex++;
                    //         reels[stopIndex].stopRotate(false, generateWinCombination.arrayCombination[stopIndex]);
                    //     } else {
                    //         stopIndex = 0;
                    //         enableEndRotateAnimation = false;
                    //
                    //         if (generateWinCombination.getTotalRound() > 0) {
                    //             let index = generateWinCombination.numWinSymbline.indexOf(1);
                    //             generateWinCombination.moveArray[index].map((v, i) => {
                    //                 reels[i].moveWinSymbols(v, fires[i]);
                    //             });
                    //             function iterationMoveWinEnd() {
                    //                 reels[0].onMoveWinEndObservable.clear();
                    //                 generateWinCombination.numWinSymbline[index] = 0;
                    //                 index = generateWinCombination.numWinSymbline.indexOf(1);
                    //                 if (index !== -1) {
                    //                     generateWinCombination.moveArray[index].map((v, i) => {
                    //                         reels[i].moveWinSymbols(v, fires[i]);
                    //                     });
                    //                     reels[0].onMoveWinEndObservable.addOnce(function () {
                    //                         iterationMoveWinEnd();
                    //                     });
                    //                 }
                    //             }
                    //             reels[0].onMoveWinEndObservable.addOnce(function () {
                    //                 iterationMoveWinEnd();
                    //             });
                    //         }
                    //         // generateWinCombination.gettingWinnings();
                    //
                    //         /*      generateWinCombination.generate();
                    //
                    //                   if (reels[reels.length - 1].stoped) {
                    //                       reels.map(v => {
                    //                           v.startRotate(true);
                    //                       });
                    //                       forceStop = undefined;
                    //                   }
                    //
                    //               setTimeout(function () {
                    //                   if (forceStop === undefined) {
                    //                       forceStop = false;
                    //                   } else {
                    //                       forceStop = true;
                    //                   }
                    //
                    //                   if (forceStop) {
                    //                       reels.map((v, i) => {
                    //                           v.stopRotate(false, generateWinCombination.arrayCombination[i]);
                    //                       });
                    //                       forceStop = undefined;
                    //                   } else {
                    //                       enableEndRotateAnimation = true;
                    //                       reels[0].stopRotate(false, generateWinCombination.arrayCombination[0]);
                    //                   }
                    //               }, 1000);*/
                    //
                    //     }
                    // }


// console.timeEnd();
//                 objGrowth.update(deltaTime);
                    // if (objGrowth.ended) {
                    //     objGrowth.startGrowth();
                    // }
                    // particles.motionUpdate(deltaTime);
                });
            });

            scene.actionManager = new ActionManager(scene);

            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'f'
                    },
                    function (evt) {
                        fires.map(v => {
                            v.start();
                        })
                        // fireHelper.start();
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'r'
                    },
                    function (evt) {
                        // fires.map(v => {
                        //     v.stop();
                        // })
                        fireHelper.stop();
                        fireHelper.reset();
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: '1'
                    },
                    function (evt) {
                        scene.environmentTexture = taskEnvTexture2.texture;
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: '2'
                    },
                    function (evt) {
                        scene.environmentTexture = taskEnvTexture3.texture;
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: '3'
                    },
                    function (evt) {
                        scene.environmentTexture = taskHdrTexture.texture;
                    }
                )
            );
     /*       scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'g'
                    },
                    function (evt) {
                        objGrowth.startGrowth();
                    }
                )
            );

            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'c'
                    },
                    function (evt) {
                        if (!onoffEm) {
                            // planeMaterial.albedoTexture = textureThreeOn.texture;
                            // planeMaterial.albedoColor = new Color3(1, 0, 0);
                            // planeMaterial.emissiveColor = new Color3(1, 1, 1);
                            line3.material.albedoTexture = textureThreeOn.texture;
                            line3.material.albedoColor = new Color3(2, 0, 0);
                            line3.material.emissiveColor = new Color3(1, 1, 1);
                            // line3.material.useEmissiveAsIllumination = true;
                            onoffEm = !onoffEm;
                        } else {
                            // planeMaterial.albedoTexture = textureThreeOff.texture;
                            // planeMaterial.albedoColor = new Color3(0.75, 0.75, 0.25).scale(0.1);
                            // planeMaterial.emissiveColor = new Color3(0, 0, 0);
                            line3.material.albedoTexture = textureThreeOff.texture;
                            line3.material.albedoColor = new Color3(0.8, 0.8, 0);
                            line3.material.emissiveColor = new Color3(0, 0, 0);
                            onoffEm = !onoffEm;
                        }
                    }
                )
            );

            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'q'
                    },
                    function (evt) {
                        for (var i = 0; i < scene.materials.length; i++) {
                            scene.materials[i].enableSpecularAntiAliasing = !scene.materials[i].enableSpecularAntiAliasing;
                        }
                        console.log("enableSpecularAntiAliasing", scene.materials[0].enableSpecularAntiAliasing)
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: '`'
                    },
                    function (evt) {
                        scene.environmentTexture = taskEnvTexture.texture;
                    }
                )
            );

            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: '4'
                    },
                    function (evt) {
                        scene.environmentTexture = taskHdrTexture.texture;
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'p'
                    },
                    function (evt) {
                        particles.start();
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'o'
                    },
                    function (evt) {
                        particles.stop();
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'w'
                    },
                    function (evt) {
                        // objGrowth.startGrowth();
                        if (!generateWinCombination.gettedWinning) {
                            generateWinCombination.gettingWinnings();
                        }

                        generateWinCombination.generate();

                        if (reels[reels.length - 1].stoped) {
                            reels.map(v => {
                                v.startRotate(true);
                            });
                            forceStop = undefined;
                        }

                        setTimeout(function () {
                            enableEndRotateAnimation = true;
                            reels[0].stopRotate(false, generateWinCombination.arrayCombination[0]);
                            forceStop = true;
                        }, 500);
                    }
                )
            );
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 's'
                    },
                    function (evt) {

                        if (forceStop === undefined) {
                            forceStop = false;
                        } else {
                            forceStop = true;
                        }

                        if (forceStop) {
                            reels.map((v, i) => {
                                v.stopRotate(false, generateWinCombination.arrayCombination[i]);
                            });
                            forceStop = undefined;
                        } else {
                            enableEndRotateAnimation = true;
                            reels[0].stopRotate(false, generateWinCombination.arrayCombination[0]);
                        }
                    }
                )
            );*/
            // return the created scene
            assetsManager.load();

            return scene;
        }

        // call the createScene function
        var scene = createScene();

        scene.executeWhenReady(function(){
            // objGrowth.startGrowth();

            engine.runRenderLoop(function(){
                scene.render();
            });
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
            engine.resize();
        });
    } else {
        window.alert('Browser not supported')
    }
});