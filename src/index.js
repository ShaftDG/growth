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
    Tools,
    // Animation,
    // ParticleHelper,
    GlowLayer,
    AssetsManager,
    ArcRotateCamera,
    StandardMaterial,
    MultiMaterial,
    Vector3,
    Color3,
    SceneLoader,
    ShaderMaterial,
    // PBRMaterial,
    // Texture,
    // Color3,
    // MeshBuilder,
    // Axis,
    Mesh,
    ActionManager,
    ExecuteCodeAction,
    Camera,
    Constants,
    StandardRenderingPipeline,
    // DefaultRenderingPipeline,
    // ImageProcessingConfiguration,
    DirectionalLight,
    HemisphericLight,
    // StandardMaterial
    // CubeTexture
} from '@babylonjs/core';
import {
    GUI3DManager,
} from '@babylonjs/gui'
import {GLTFFileLoader,GLTFLoaderAnimationStartMode} from '@babylonjs/loaders';
// import {StandardRenderingPipeline} from '@babylonjs/post-processes';
import CreateCanvas from './js/CreateCanvas';
import WinLine from './js/WinLine';
import './js/showFPS';
// import AnimationLeafDeath from "./js/AnimationLeafDeath";
import AnimationEmissiveColor from "./js/AnimationEmissiveColor";
import AnimationGlowIntensity from "./js/AnimationGlowIntensity";
import AnimationWidthLine from "./js/AnimationWidthLine";
// import CustomPBRMaterial from "./js/CustomPBRMaterial";
// import AnimationStopReels from "./js/AnimationStopReels";
import CreateReel from "./js/CreateReel";
import GenerateWinCombination from "./js/GenerateWinCombination";
// import ParticlesSquare from './js/ParticlesSquare';
import ChangeCustomVertexParticles from './js/changeCustomVertexParticles';

import MakeButton from './js/MakeButton';

// import Fire from './js/FireParticles';
import SparksParticles from './js/SparksParticles';
import SparkBackgroundParticles from './js/SparkBackgroundParticles';
import FireHelper from './js/FireParticlesHelper';
import {NoiseProceduralTexture, PBRMaterial, Scalar, Texture} from "@babylonjs/core/index";
// import {EngineStore} from "@babylonjs/core/Engines/engineStore";
// import {Logger} from "@babylonjs/core/Misc/logger";
// import Line2D from './js/Line2D';
let baseURL = document.location.href + 'src/';
Constants.PARTICLES_BaseAssetsUrl = baseURL + 'assets';
// let baseURL = '/src/';
// console.log(document.location.href)


window.addEventListener('DOMContentLoaded', function(){

    if (Engine.isSupported()) {
        // get the canvas DOM element
        let canvas = CreateCanvas();

        // load the 3D engine
        var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true}, false);

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new Scene(engine);
            // scene.debugLayer.show();
            var gl = new GlowLayer("glow", scene);
            gl.intensity = 2.0;
            // gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            //     if (mesh.name === "D") {
            //         mesh.material.emissiveColor = new Color3(2.0,2.0,2.0);
            //         gl.addIncludedOnlyMesh(mesh)
            //     } else {
            //         result.set(0, 0, 0, 0);
            //     }
            // }
            var assetsManager = new AssetsManager(scene);
            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -50), scene);
            var camera = new ArcRotateCamera('Camera', 0, 0, 0.5, new Vector3(0, 8.7, 65), scene);
            camera.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
            // camera.fov = 0.5;
            // camera.setPosition(new BABYLON.Vector3(0, 20, -20));
            // camera.lowerRadiusLimit = camera.radius;
            // camera.upperRadiusLimit = 5;
            camera.setTarget(new Vector3(0, 8.7, 0));
            // target the camera to scene origin
            // camera.setTarget(BABYLON.Vector3.Zero());

            // attach the camera to the canvas
            camera.attachControl(canvas, false);
            scene.showFPS();

         //   let startButton, autoPlay, maxBet;
            let points = [new Vector3(14.9, 7.5, 13), new Vector3(10, 7.5, 13), new Vector3(10, 2.5, 13), new Vector3(15, 2.5, 13), new Vector3(15, 7.4, 13)];
            var myMaterial = new PBRMaterial("myMaterial", scene);
            // myMaterial.albedoTexture = new Texture(baseURL + 'assets/textures/grass.jpg', scene);
            //  myMaterial.albedoTexture = new BABYLON.Texture("textures/chain.png", scene);
            // myMaterial.environmentIntensity = 0.25;
            // myMaterial.metallic = 0.0;
            //   myMaterial.albedoTexture.uScale = 1.2;
            //    myMaterial.albedoTexture.vScale = 1.0;
            //   myMaterial.albedoTexture.uOffset = 0.625;
            //   myMaterial.albedoTexture.hasAlpha = true;
            // myMaterial.albedoColor = new Color3(1.0, 0.75, 0.25);
            myMaterial.emissiveColor = new Color3(1.0, 0.5, 0.25);
            // myMaterial.emissiveIntensity = 2.0;
            // myMaterial.alpha = 0.5;
            // var line = new Line2D("line", {path: points, width: 0.5, standardUV: false}, scene).getMesh();
            // line.material = myMaterial;

            var fireMaterial = new ShaderMaterial("fire", scene, {
                    vertexElement: "fire",
                    fragmentElement: "fire"
                },
                {
                    needAlphaBlending: true,
                    needAlphaTesting: true,
                    attributes: ["position", "uv", "normal"],
                    uniforms: [
                        "lineColor",
                        "lineColor2",
                        "backgroundColor",
                        "antialias",
                        "antialias2",
                        "antialiasX",
                        "lineThickness",
                        "lineThickness2",
                        "lineThicknessX",
                        "time",
                        "factor",

                        "world",
                        "view",
                        "projection",
                        "worldView",
                        "worldViewProjection",
                        "cameraPosition"
                    ],
                    samplers: [
                        "iTextureFlame",
                        "iTextureAlpha",
                        "iTextureBack",
                    ]
                });

            fireMaterial.setFloat("time", 0);
            fireMaterial.setFloat("antialias", 2.4);
            fireMaterial.setFloat("antialias2", 1.0);
            fireMaterial.setFloat("antialiasX", 0.1);
            fireMaterial.setFloat("lineThickness", -1.33);
            fireMaterial.setFloat("lineThickness2", -1.85);
            fireMaterial.setFloat("lineThicknessX", 0.6);
            fireMaterial.setFloat("factor", 0.5);

            fireMaterial.setColor3("lineColor", new Color3(1.0,0.62,0.21));
            fireMaterial.setColor3("lineColor2", new Color3.FromHexString("#ffffff"));
            fireMaterial.setColor3("backgroundColor", new Color3.FromHexString("#000000"));

            fireMaterial.alphaMode = Engine.ALPHA_ADD;
           /* let time = 0.0;
            fireMaterial.onBind = function () {
                fireMaterial.setFloat("time", time);
                time += scene.getEngine().getDeltaTime() * 0.0002;
            };*/
            // line.material = fireMaterial;

            let fires = [];
            var noiseTexture = new NoiseProceduralTexture("perlin", 32, scene);
            noiseTexture.animationSpeedFactor = 10;
            noiseTexture.persistence = 0.8;
            noiseTexture.brightness = .5;
            noiseTexture.octaves = 8;

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

            let sparksBackground = [];
            for (let i = 0; i < 5; i++) {
                let sparkBackgroundParticles = new SparkBackgroundParticles(baseURL, scene, engine);
                sparksBackground.push(sparkBackgroundParticles);
            }

            var textureNoiseCombustion = assetsManager.addTextureTask('textureNoiseCombustion', baseURL + 'assets/textures/fire/originFire.png', null, false);
            textureNoiseCombustion.onSuccess = function(task) {
                fires.map(v => {
                    v.setTextureNoiseCombustion(task.texture);
                });
            };



          /*  var cloudMaterial = new ShaderMaterial("electric", scene, {
                    vertexElement: "electric",
                    fragmentElement: "electric"
                },
                {
                    needAlphaBlending: true,
                    needAlphaTesting: true,
                    attributes: ["position", "uv", "normal"],
                    uniforms: [
                        "time",
                        "world",
                        "view",
                        "projection",
                        "worldView",
                        "worldViewProjection",
                        "cameraPosition"
                    ],
                    samplers: [
                        "iTextureFlame", "iTextureBack", "iTextureAlpha"
                    ]
                });
            cloudMaterial.setFloat("time", 0);
            cloudMaterial.setTexture("iTextureFlame", new Texture(baseURL + 'assets/textures/lightning/noise_1.png', scene));
            cloudMaterial.setTexture("iTextureBack", new Texture(baseURL + 'assets/textures/lightning/noise_2.png', scene));
            cloudMaterial.setTexture("iTextureAlpha", new Texture(baseURL + 'assets/textures/lightning/noise_3.png', scene));


            let time2 = 0.0;
            cloudMaterial.onBind = function () {
                cloudMaterial.setFloat("time", time2);
                time2 += scene.getEngine().getDeltaTime() * 0.0002;
            };


            var sphere = Mesh.CreatePlane("Sphere0", 20, scene);
            sphere.position.z -= 30;
            sphere.material = cloudMaterial;*/

            var textureSpark = assetsManager.addTextureTask('textureNoiseCombustionAlpha', baseURL + 'assets/textures/fire/sparks.png', null, false);
            textureSpark.onSuccess = function(task) {
                sparksBackground.map(v => {
                    v.setTextureGlow(task.texture);
                })
                fires.map(v => {
                    v.setTextureSpark(task.texture);
                });

            };

            var textureSparkBackground = assetsManager.addTextureTask('textureNoiseCombustionAlpha', baseURL + 'assets/textures/sparkBackground/spark.png', null, false);
            textureSparkBackground.onSuccess = function(task) {
                objWinLine.setTextureSparkWeldingToParticles(task.texture);
                objWinLine1.setTextureSparkWeldingToParticles(task.texture);
                sparksBackground.map(v => {
                    v.setTextureSpark(task.texture);
                })
            };

            var textureSparkStretched = assetsManager.addTextureTask('textureNoiseCombustionAlpha', baseURL + 'assets/textures/fire/sparkStretched.png', null, false);
            textureSparkStretched.onSuccess = function(task) {
                objWinLine.setTextureSparkStretchedToParticles(task.texture);
                objWinLine1.setTextureSparkStretchedToParticles(task.texture);
                fires.map(v => {
                    v.setTextureSparkStretched(task.texture);
                })
            };

            var textureNoiseCombustion1 = assetsManager.addTextureTask('textureNoiseCombustion1', baseURL + 'assets/textures/fire/noiseTexture.png', null, false);
            textureNoiseCombustion1.onSuccess = function(task) {
                fires.map(v => {
                    v.setTextureNoiseCombustion1(task.texture);
                });
            };

            // Set up new rendering pipeline
            // Tone mapping
            // scene.imageProcessingConfiguration.toneMappingEnabled = true;
            // scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
            // scene.imageProcessingConfiguration.exposure = 3;

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
            // pipeline.BloomEnabled = true;
            // pipeline.brightThreshold = 1.2;
            // pipeline.blurWidth = 128;
            // pipeline.horizontalBlur = false;

            // create a basic light, aiming 0,1,0 - meaning, to the sky
            // var light = new HemisphericLight('light1', new Vector3(0, 1, -10), scene);
            // light.intensity = 0.5;
            // var lightdir = new DirectionalLight("DirectionalLight", new Vector3(50, 50, -500), scene);
            // lightdir.intensity = 0.5;
            // lightdir.autoUpdateExtends = false;

            var taskEnvTexture2 = assetsManager.addCubeTextureTask('studioEnv2', baseURL + 'assets/textures/them/3.dds');
            taskEnvTexture2.onSuccess = function(task) {
                task.texture.gammaSpace = false;
            };
            var taskEnvTexture3 = assetsManager.addCubeTextureTask('studioEnv3', baseURL + 'assets/textures/them/4SpecularHDR.dds');
            taskEnvTexture3.onSuccess = function(task) {
                task.texture.gammaSpace = false;
                scene.environmentTexture = task.texture;
            };

            var taskHdrTexture = assetsManager.addHDRCubeTextureTask('studioHDR', baseURL + 'assets/textures/them/hfq_4.hdr', 16, false, true, true, true);
            taskHdrTexture.onSuccess = function(task) {
                task.texture.rotationY = Math.PI;
            };

            SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === 'gltf' && plugin instanceof GLTFFileLoader) {
                    plugin.animationStartMode = GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

            let tubeMaterial = new PBRMaterial('tubeMaterial', scene);
            tubeMaterial.albedoColor = new Color3(1.0, 0.5, 0.25);
            tubeMaterial.emissiveColor = new Color3(1.0, 0.5, 0.25);
            // tubeMaterial.alpha = 0.0;
            tubeMaterial.metallic = 0.0;
            tubeMaterial.roughness = 1.0;
            // tubeMaterial.environmentTexture = scene.environmentTexture;

            let tubeMaterial1 = new PBRMaterial('tubeMaterial1', scene);
            tubeMaterial1.albedoColor = new Color3(1.0, 0.5, 0.25);
            tubeMaterial1.emissiveColor = new Color3(1.0, 0.5, 0.25);
            // tubeMaterial1.alpha = 0.0;
            tubeMaterial1.metallic = 0.0;
            tubeMaterial1.roughness = 1.0;
            // tubeMaterial1.environmentTexture = scene.environmentTexture;

            // let particles = new ParticlesSquare(5, 5, scene);
            // particles.setCenter(12.6,9.75,17);
          /*  var textureParticles = assetsManager.addTextureTask('textureParticles', baseURL + 'assets/textures/particle.png');
            textureParticles.onSuccess = function(task) {
               particles.setTexture(task.texture);
            };*/

            let factorSpeed = 1.0;
            let options = {
                numTubes: 3,
                intervalTime: [0.061 * factorSpeed, 0.015 * factorSpeed, 0.03 * factorSpeed], // the smaller the slower
                diameter: 0.15,
                reverse: false
            };
            let objWinLine = new WinLine([
                    [
                        new Vector3(3.0, 7.85, 16),
                        new Vector3(3.0, 2.85, 14),
                        new Vector3(14.4, 2.85, 14),
                        new Vector3(14.4, 7.85, 16),
                        new Vector3(2.9, 7.85, 16)
                    ],
                    [
                        new Vector3(9.0, 7.85, 16),
                        new Vector3(9.0, 2.85, 14)
                    ],
                    [
                        new Vector3(3.038, 7.75, 16),
                        new Vector3(1.2, 9.3, 16),
                        new Vector3(-14.4, 9.3, 16)
                    ],
                ],
                options,
                noiseTexture,
                tubeMaterial,
                assetsManager,
                scene,
                engine
            );

            objWinLine.onEndObservable.add(function (object) {
                object.startParticles();
                // object.enableReverse();
                AnimationEmissiveColor.call(object._material, new Color3(1.0, 0.7, 0.7), 150, false, scene);
                AnimationGlowIntensity.call(gl, 40.0, 4.0, 200, false, scene);
                AnimationWidthLine.call(object, 0, 200, false,
                    function (diameter) {
                        object.updateWidth(diameter)
                    },
                    function () {
                        object.lines.map(v => {
                           v.customMesh.setEnabled(false);
                        });
                        objWinLine1.startGrowth();
                    },
                    scene);
                // setTimeout(function () {
                //     objWinLine.startGrowth();
                // }, 1000)
            });

            let factorSpeed1 = 1.0;
            let options1 = {
                numTubes: 3,
                intervalTime: [0.061 * factorSpeed1, 0.015 * factorSpeed1, 0.03 * factorSpeed1], // the smaller the slower
                diameter: 0.15,
                reverse: false
            };
            let objWinLine1 = new WinLine([
                    [
                        new Vector3(3.0, 11.85 + 0.32, 16),
                        new Vector3(3.0, 16.85 + 0.32, 14),
                        new Vector3(14.4, 16.85 + 0.32, 14),
                        new Vector3(14.4, 11.85 + 0.32, 16),
                        new Vector3(2.9, 11.85 + 0.32, 16),
                    ],
                    [
                        new Vector3(9.0, 11.85 + 0.32, 16),
                        new Vector3(9.0, 16.85 + 0.32, 14)

                    ],
                    [
                        new Vector3(3.04, 11.85 + 0.45, 16),
                        new Vector3(1.2, 10.3 + 0.45, 16),
                        new Vector3(-14.4, 10.3 + 0.45, 16)
                    ],
                ],
                options1,
                noiseTexture,
                tubeMaterial1,
                assetsManager,
                scene,
                engine
            );

            objWinLine1.onEndObservable.add(function (object) {
                object.startParticles();
                AnimationEmissiveColor.call(object._material, new Color3(1.0, 0.7, 0.7), 100, false, scene);
                AnimationGlowIntensity.call(gl, 40.0, 4.0, 100, false, scene);
                AnimationWidthLine.call(object, 0, 150, false,
                    function (diameter) {
                        object.updateWidth(diameter)
                    },
                    function () {
                        object.lines.map(v => {
                            v.customMesh.setEnabled(false);
                        })
                        objWinLine.startGrowth();
                    },
                    scene);
                // setTimeout(function () {
                //     objWinLine1.startGrowth();
                // }, 1000)
            });
// gltf-pipeline -i grapes.glb -o tmp/grapesDraco.glb -d

            let managerGUI = new GUI3DManager(scene);
            let meshTaskMain = assetsManager.addMeshTask('main', '', baseURL + 'assets/models/tmp/', 'MainGame_Draco.glb');
            meshTaskMain.onSuccess = function (task) {
                task.loadedMeshes[0].position.y = 10.05;
                task.loadedMeshes[0].position.z = 11;
                task.loadedMeshes[0].scaling = new Vector3(4.8,4.8,-4.8);
                task.loadedMeshes[0]._children[34].material.unlit = true;
                task.loadedMeshes[0]._children[4].material.unlit = true;
                let optionStartButton = {
                    deltaPush: new Vector3(0,0,-0.03)
                };

                function startMoveWinLines(callback) {
                        let index = generateWinCombination.numWinSymbline.indexOf(1);
                        if (index !== -1) {
                            generateWinCombination.moveArray[index].map((v, i) => {
                                reels[i].moveWinSymbols(v, fires[i], sparksBackground[i]);
                            });

                            function iterationMoveWinEnd() {
                                reels[0].onMoveWinEndObservable.clear();
                                generateWinCombination.numWinSymbline[index] = 0;
                                index = generateWinCombination.numWinSymbline.indexOf(1);
                                if (index !== -1) {
                                    generateWinCombination.moveArray[index].map((v, i) => {
                                        reels[i].moveWinSymbols(v, fires[i], sparksBackground[i]);
                                    });
                                    reels[0].onMoveWinEndObservable.addOnce(iterationMoveWinEnd);
                                } else if (callback) {
                                    callback()
                                }
                            }

                            reels[0].onMoveWinEndObservable.addOnce(iterationMoveWinEnd);
                        } else if (callback) {
                            callback()
                        }
                }

                function startRotateSlot(autoPlay) {
                    if (reels[reels.length - 1].rotateSlots && !reels[reels.length - 1].stoped) {

                        for (let j = 0; j < reels.length; j++) {
                            reels[j].stopRotate(generateWinCombination.arrayCombination[j]);
                            reels[j].onStopEndObservable.clear();
                            reels[j].onMoveWinEndObservable.clear();
                        }
                        reels[reels.length - 1].onStopEndObservable.addOnce(function () {
                            setTimeout(function () {
                                if (!autoPlay) {
                                    startMoveWinLines(null);
                                } else {
                                    startMoveWinLines(function () {
                                        startRotateSlot(true)
                                    });
                                }
                            }, 350);
                        });

                    } else if (reels[reels.length - 1].stoped && !reels[reels.length - 1].rotateSlots) {

                        if (!generateWinCombination.gettedWinning) {
                            generateWinCombination.gettingWinnings();
                        }

                        generateWinCombination.generate();

                        if (reels[reels.length - 1].stoped) {
                            reels.map((v, i) => {
                                v.startRotate(fires[i], sparksBackground[i]);
                                v.onStopEndObservable.clear();
                                v.onMoveWinEndObservable.clear();
                            });
                        }

                        setTimeout(function () {
                            stopIndex = 0;
                            reels[stopIndex].stopRotate(generateWinCombination.arrayCombination[stopIndex]);

                            function iterationStopEnd() {
                                reels[stopIndex].onStopEndObservable.clear();
                                if (stopIndex < 4) {
                                    stopIndex++;
                                    reels[stopIndex].stopRotate(generateWinCombination.arrayCombination[stopIndex]);
                                    reels[stopIndex].onStopEndObservable.addOnce(iterationStopEnd);
                                } else {
                                    setTimeout(function () {
                                        if (!autoPlay) {
                                            startMoveWinLines(null);
                                        } else {
                                            startMoveWinLines(function () {
                                                startRotateSlot(true)
                                            });
                                        }
                                    }, 500);
                                }
                            }
                            reels[stopIndex].onStopEndObservable.addOnce(iterationStopEnd);
                        }, 500);
                    }
                }
                let stopIndex = 0;
                let startButton = new MakeButton("startButton", task.loadedMeshes[0]._children[31], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                startButton.pushButton.onPointerUpObservable.add(function () {
                    startRotateSlot();
                });

                let autoPlay = new MakeButton("autoPlay", task.loadedMeshes[0]._children[32], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                autoPlay.pushButton.onPointerUpObservable.add(function () {
                    startRotateSlot(true);
                });

                let isfullScreen = false;

                let fullscreen = new MakeButton("fullscreen", task.loadedMeshes[0]._children[30], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
                fullscreen.pushButton.onPointerUpObservable.add(function () {
                    if (!isfullScreen) {
                        isfullScreen = true;
                        Tools.RequestFullscreen(canvas);
                    } else {
                        isfullScreen = false;
                        Tools.ExitFullscreen();
                    }
                });

                /*let maxBet = new MakeButton("maxBet", task.loadedMeshes[0]._children[31], task.loadedMeshes[0], optionStartButton, managerGUI, scene);
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

            for (var j = 0, i = 0; j < 5; j++, i += 3) {
                let reel = new CreateReel("CoT_" + j, angles, radius, section, numSymbolPerReel, new Vector3(12.6 - j * 6.3, 0, 0), i, baseURL, assetsManager, scene, engine);
                reel.updated();
                reels.push(reel);
            }

            scene.executeWhenReady(function() {
                for (var j = 0; j < 5; j++) {
                    reels[j].beginVisibleSymbol();
                    fires[j].setEmitter(reels[j].meshes[Math.round(Scalar.RandomRange(1, 3))].visibleSymbol);
                }

                for (var i = 0; i < scene.materials.length; i++) {
                    scene.materials[i].enableSpecularAntiAliasing = false;
                }
                objWinLine1.startGrowth();
                scene.registerBeforeRender(function () {
                    // let deltaTime = scene.getEngine().getDeltaTime() * 0.01;

                    objWinLine.update();
                    objWinLine1.update();
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
            scene.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnKeyDownTrigger,
                        parameter: 'g'
                    },
                    function (evt) {
                        // objWinLine.startGrowth();
                        objWinLine1.startGrowth();
                    }
                )
            );

            /*scene.actionManager.registerAction(
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
                        // objWinLine.startGrowth();
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