
import './css/style.css';
import {
    Engine,
    Scene,
    AssetsManager,
    ArcRotateCamera,
    Vector3,
    SceneLoader,
    PBRMaterial,
    Texture,
    Color3,
    MeshBuilder,
    Axis,
    Mesh,
    ActionManager,
    ExecuteCodeAction
} from '@babylonjs/core';
import {GLTFFileLoader,GLTFLoaderAnimationStartMode} from '@babylonjs/loaders';
import CreateCanvas from './js/CreateCanvas';
import Growth from './js/Growth';
import './js/showFPS';
// import AnimationLeafDeath from "./js/AnimationLeafDeath";
// import AnimationEmissiveColor from "./js/AnimationEmissiveColor";
// import CustomPBRmaterial from "./js/CustomPBRmaterial";
// import AnimationStopReels from "./js/AnimationStopReels";
import CreateReel from "./js/CreateReel";
import GenerateWinCombination from "./js/GenerateWinCombination";

let objGrowth;
let baseURL = '/dist/';
let canvas = CreateCanvas();

window.addEventListener('DOMContentLoaded', function(){

    if (/*BABYLON.Engine.isSupported()*/true) {
        // get the canvas DOM element


        // load the 3D engine
        var engine = new Engine(canvas, true, /*{preserveDrawingBuffer: false, stencil: false}*/null, false);

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new Scene(engine);

            var assetsManager = new AssetsManager(scene);
            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -50), scene);
            var camera = new ArcRotateCamera('Camera', 0, 0, 0.5, new Vector3(0, 8, 45), scene);
            // camera.fov = 0.6;
            // camera.setPosition(new BABYLON.Vector3(0, 20, -20));
            // camera.lowerRadiusLimit = camera.radius;
            // camera.upperRadiusLimit = 5;
            camera.setTarget(new Vector3(0, 9, 0));
            // target the camera to scene origin
            // camera.setTarget(BABYLON.Vector3.Zero());

            // attach the camera to the canvas
            camera.attachControl(canvas, false);
            scene.showFPS();

            // var pipeline = new BABYLON.StandardRenderingPipeline(
            //     "standard", // The name of the pipeline
            //     scene, // The scene instance
            //     1.0, // The rendering pipeline ratio
            //     null, // The original post-process that the pipeline will be based on
            //     [camera] // The list of cameras to be attached to
            // );
            // pipeline.exposure = 10;
            // create a basic light, aiming 0,1,0 - meaning, to the sky
            // var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, -10), scene);
            // light.intensity = 1;
            // var lightdir = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(50, 50, -500), scene);
            // lightdir.intensity = 0.25;
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

            // var taskEnvTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('/src/assets/textures/hdri_cube_radiance.dds', scene);
            // var taskEnvTexture = new BABYLON.HDRCubeTexture('/src/assets/textures/Orange1.hdr', scene, 1024, false, false);
            // var taskEnvTexture = new BABYLON.CubeTexture("studio.env", scene);
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/studio.env');
            var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/environmentExp.env');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/mainEnvironment.env');
            taskEnvTexture.onSuccess = function(task) {
                task.texture.rotationY = Math.PI;
                // task.texture.rotationY = -1.2;
                scene.environmentTexture = task.texture;
                // scene.environmentTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;

                // scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
                // scene.environmentTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
            };

            // var taskBRDFTexture = assetsManager.addTextureTask('studioEnv', '/src/assets/textures/hdrBrdf.dds');
            // taskBRDFTexture.onSuccess = function(task) {
            //     scene.environmentBRDFTexture = task.texture;
            // };

            //HDR_110_Tunnel_Env.hdr
            // Main_Game-Zborka_v02.hdr
            // var taskHdrTexture = assetsManager.addHDRCubeTextureTask('studioHDR', baseURL + 'assets/textures/panorama.hdr', 8, false, true, true, true);
            // taskHdrTexture.onSuccess = function(task) {
            //     scene.environmentTexture = task.texture;
            //     scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            // };

            // scene.environmentTexture = hdrTexture;
            // scene.createDefaultSkybox(hdrTexture, true, 1000, 0.005);

            SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === 'gltf' && plugin instanceof GLTFFileLoader) {
                    plugin.animationStartMode = GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

            let tubeMaterial = new PBRMaterial('tubeMaterial', scene);
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
            );

            // var motionblur = new BABYLON.MotionBlurPostProcess(
            //     "mb", // The name of the effect.
            //     scene, // The scene containing the objects to blur according to their velocity.
            //     1.0, // The required width/height ratio to downsize to before computing the render pass.
            //     camera // The camera to apply the render pass to.
            // );
            // motionblur.motionStrength = 2;
            // motionblur.motionBlurSamples = 16;

            // var paralaxTexture = new BABYLON.Texture(baseURL + 'assets/textures/nornallll.png', scene);

            let symbols = [];

            var meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/', 'bell_.glb');
            meshTaskBell.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].rotate(Axis.Z, -0.4, Mesh.WORLD);
                task.loadedMeshes[0].scaling = new Vector3(0.04,0.04,0.04);
                // task.loadedMeshes[0].scaling = new Vector3(4,4,4);
                // task.loadedMeshes[0]._children[0].material.environmentIntensity = 0.75;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.emissiveColor = new BABYLON.Color3(2,2,2);
                // task.loadedMeshes[0]._children[0].material.useParallax = true;
                // task.loadedMeshes[0]._children[0].material.useParallaxOcclusion = true;
                // task.loadedMeshes[0]._children[0].material.parallaxScaleBias = 0.01;
                task.loadedMeshes[0].receiveShadows = true;
                // task.loadedMeshes[0].position = new BABYLON.Vector3(0,10,30);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskCherry = assetsManager.addMeshTask('cherry', '', baseURL + 'assets/models/', 'cherry.glb');
            meshTaskCherry.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(0.04,0.04,0.04);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskGrapes = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/', 'grapes.glb');
            meshTaskGrapes.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.5;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0].scaling = new Vector3(0.04,0.04,0.04);
                symbols.push(task.loadedMeshes[0]);
            };
            // var meshTaskLemon = assetsManager.addMeshTask('lemon', '', baseURL + 'assets/models/', 'lemon.glb');
            // meshTaskLemon.onSuccess = function (task) {
            //     // task.loadedMeshes[0].setEnabled(false);
            //     task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.07,0.07,0.07);
            //     symbols.push(task.loadedMeshes[0]);
            // };
            var meshTaskOrange = assetsManager.addMeshTask('orange', '', baseURL + 'assets/models/', 'orange.glb');
            meshTaskOrange.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.75;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.metallic = 0;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0]._children[0]._children[0]._children[0].rotate(Axis.X, -1.6, Mesh.LOCAL);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].rotate(Axis.Y, 2.6, Mesh.LOCAL);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].rotate(Axis.Z, -0.6, Mesh.LOCAL);
                task.loadedMeshes[0].scaling = new Vector3(0.04,0.04,0.04);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskPlum = assetsManager.addMeshTask('plum', '', baseURL + 'assets/models/', 'plum.glb');
            meshTaskPlum.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.5;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0]._children[0]._children[0]._children[0].rotate(Axis.Z, -0.6, Mesh.WORLD);
                task.loadedMeshes[0].scaling = new Vector3(0.04,0.04,0.04);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskSeven = assetsManager.addMeshTask('seven', '', baseURL + 'assets/models/', 'seven.glb');
            meshTaskSeven.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new Vector3(0.035,0.035,0.035);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskWatermelon = assetsManager.addMeshTask('watermelon', '', baseURL + 'assets/models/', 'watermelon.glb');
            meshTaskWatermelon.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].rotate(Axis.Z, 0.2, Mesh.WORLD);
                task.loadedMeshes[0].rotate(Axis.Y, 0.6, Mesh.WORLD);
                task.loadedMeshes[0].scaling = new Vector3(0.0375,0.0375,0.0375);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };

            let cylinder = MeshBuilder.CreateCylinder("cylinder", {diameterBottom: 26, diameterTop: 26, height: 40, tessellation: 16}, scene);
            cylinder.position.y = 10;
            cylinder.rotation.z = Math.PI / 2;
            let materialCilynder = new PBRMaterial("materialCilynder", scene);
            materialCilynder.albedoColor = new Color3(0.0,0.0,0.0);
            materialCilynder.metallic = 1;
            materialCilynder.roughness = 0.5;
            // materialCilynder.cameraExposure = 1.5;
            // materialCilynder.cameraContrast = 1.25;
            cylinder.material = materialCilynder;
            // cylinder.material.unlit = true;

            let meshTask = assetsManager.addMeshTask('leaf', '', baseURL + 'assets/models/', 'leaf.glb');

            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0]._children[0].material.metallic = 0.01;
                task.loadedMeshes[0]._children[0].material.roughness = 0.25;
                task.loadedMeshes[0]._children[0].material.environmentTexture = scene.environmentTexture;
                objGrowth.setLeaf(task.loadedMeshes[0]);
            };

            let meshTaskMain = assetsManager.addMeshTask('main', '', baseURL + 'assets/models/', 'main1.glb');
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
                task.loadedMeshes[0].position.x = -0.25;
                task.loadedMeshes[0].position.y = 8.5;
                task.loadedMeshes[0].position.z = 16.5;
                // task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.105,0.105,0.105);
                task.loadedMeshes[0].scaling = new Vector3(0.0304,0.0304,-0.0304);
                task.loadedMeshes[0]._children[0]._children[2]._children[0].material.unlit = true;
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
            };

            let generateWinCombination = new GenerateWinCombination(5,3,7);

            let numSymbolPerReel = 20;
            let section = (Math.PI * 2) / numSymbolPerReel;
            let angles = [
                section * (numSymbolPerReel - 2),
                section * (numSymbolPerReel - 1),
                0,
                section * 1,
                section * 2
            ];
            let radius = 16;
            let reels = [];
            let stopIndex = 0;
            let enableEndRotateAnimation = false;
            let forceStop = undefined;
            scene.executeWhenReady(function() {
                for (var j = 0; j < 5; j++) {
                    let reel = new CreateReel(symbols, angles, radius, section, numSymbolPerReel, new Vector3(12.8 - j * 6.4, 0, 0), scene);
                    reels.push(reel);
                }
                objGrowth.setPoints([
                    new Vector3(12,10,20),
                    new Vector3(10,10,20),
                    new Vector3(5,15,20),
                    new Vector3(0,10,20),
                    new Vector3(-5,15,20),
                    new Vector3(-10,10,20),
                    new Vector3(-12,10,20),
                ]);

                // for (var i = 0; i < scene.meshes.length; i++) {
                //     shadowGenerator.addShadowCaster(scene.meshes[i]);
                //     // shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
                //     scene.meshes[i].receiveShadows = true;
                // }
                // for (var i = 0; i < scene.materials.length; i++) {
                //     scene.materials[i].enableSpecularAntiAliasing = true;
                // }

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
            });
            let blob = new Blob()

            let indexLineWin = 0;
            let numWinSymbols = 0;
            let numReels = 0;
            scene.registerBeforeRender(function () {
// console.time();
                let deltaTime = scene.getEngine().getDeltaTime()*0.006;
                reels.map(v => {
                    v.update(deltaTime);
                });

                if (enableEndRotateAnimation && reels[stopIndex].stoped) {
                    if (stopIndex < 4) {
                        stopIndex++;
                        reels[stopIndex].stopRotate(false, generateWinCombination.arrayCombination[stopIndex]);
                    } else {
                        stopIndex = 0;
                        enableEndRotateAnimation = false;

                        function switchReels() {
                            if (numReels < 4) {
                                numReels++;
                            } else {
                                numReels = 0;
                                numWinSymbols = 0;
                                if (indexLineWin < generateWinCombination.winLineNum-1) {
                                    indexLineWin++;
                                    generateWinCombination.moveArray[indexLineWin].map((v, i) => {
                                        reels[i].moveWinSymbols(v, switchReels)
                                    })
                                } else {
                                    indexLineWin = 0;
                                    numWinSymbols = 0;
                                    generateWinCombination.gettingWinnings();

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
                            }
                        }

                        generateWinCombination.moveArray[indexLineWin].map((v, i) => {
                            reels[i].moveWinSymbols(v, switchReels)
                        })
                        // generateWinCombination.gettingWinnings();

                  /*      generateWinCombination.generate();

                            if (reels[reels.length - 1].stoped) {
                                reels.map(v => {
                                    v.startRotate(true);
                                });
                                forceStop = undefined;
                            }

                        setTimeout(function () {
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
                        }, 1000);*/

                    }
                }


// console.timeEnd();
                objGrowth.update(deltaTime);
                // if (objGrowth.ended) {
                //     objGrowth.startGrowth();
                // }
            });

            scene.actionManager = new ActionManager(scene);

            scene.actionManager.registerAction(
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
                        parameter: 'w'
                    },
                    function (evt) {
                        // objGrowth.startGrowth();
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
            );
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