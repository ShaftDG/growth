import './css/style.css';
import {} from 'babylonjs';
import {} from 'babylonjs-loaders';
import CreateCanvas from './js/CreateCanvas';
import Growth from './js/Growth';
import './js/showFPS';
import AnimationLeafDeath from "./js/AnimationLeafDeath";
import AnimationEmissiveColor from "./js/AnimationEmissiveColor";
import CustomPBRmaterial from "./js/CustomPBRmaterial";
import AnimationStopReels from "./js/AnimationStopReels";
import CreateReel from "./js/CreateReel";

let objGrowth;
let baseURL = '/src/';
var canvas = CreateCanvas();
var meshes = [];
let sproutsMaterial;
window.addEventListener('DOMContentLoaded', function(){

    if (/*BABYLON.Engine.isSupported()*/true) {
        // get the canvas DOM element


        // load the 3D engine
        var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: false, stencil: false});

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new BABYLON.Scene(engine);

            var assetsManager = new BABYLON.AssetsManager(scene);
            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -50), scene);
            var camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 0.5, new BABYLON.Vector3(0, 8, 45), scene);
            // camera.fov = 0.6;
            // camera.setPosition(new BABYLON.Vector3(0, 20, -20));
            // camera.lowerRadiusLimit = camera.radius;
            // camera.upperRadiusLimit = 5;
            camera.setTarget(new BABYLON.Vector3(0, 9, 0));
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
            var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, -10), scene);
            light.intensity = 0.25;
            var lightdir = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 50, -500), scene);
            lightdir.intensity = 5;
            // var lightPoint = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 0, 100), scene);
            // lightPoint.intensity = 1000;
             //
            // var lightspot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(10, 10, 40), new BABYLON.Vector3(0.2, 0, -0.8), 20, 0.1, scene);
            // lightspot.intensity = 1000;
            // var lightspot1 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-10, 10, 40), new BABYLON.Vector3(-0.2, 0, -0.8), 20, 0.1, scene);
            // lightspot1.intensity = 1000;

            // var shadowGenerator = new BABYLON.ShadowGenerator(1024, lightspot);
            // shadowGenerator.useContactHardeningShadow = true;
            // shadowGenerator.contactHardeningLightSizeUVRatio = 0.0075;
            // shadowGenerator.setDarkness(0.75);
            // shadowGenerator.usePoissonSampling = true;

            // shadowGenerator.useBlurExponentialShadowMap = true;
            // shadowGenerator.useKernelBlur = true;
            // shadowGenerator.blurKernel = 64;

            // var helper = scene.createDefaultEnvironment();
            // helper.setMainColor(BABYLON.Color3.White());

            // var taskEnvTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('/src/assets/textures/hdri_cube_radiance.dds', scene);
            // var taskEnvTexture = new BABYLON.HDRCubeTexture('/src/assets/textures/Orange1.hdr', scene, 1024, false, false);
            // var taskEnvTexture = new BABYLON.CubeTexture("studio.env", scene);
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/studio.env');
            var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', '/src/assets/textures/hdrSpecularHDR.dds');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', '/src/assets/textures/environment.dds');
            taskEnvTexture.onSuccess = function(task) {
                task.texture.rotationY = Math.PI / 1.8 ;
                scene.environmentTexture = task.texture;
                // scene.environmentTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
                scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
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
                // scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            // };

            // scene.environmentTexture = hdrTexture;
            // scene.createDefaultSkybox(hdrTexture, true, 1000, 0.005);

            BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === 'gltf' && plugin instanceof BABYLON.GLTFFileLoader) {
                    plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

            // sproutsMaterial = new CustomPBRmaterial('myMaterial', scene);
            // sproutsMaterial.albedoColor = new BABYLON.Color3(1, 1, 1);
            // sproutsMaterial.metallic = 0;
            // sproutsMaterial.roughness = 1;
            // sproutsMaterial.environmentTexture = scene.environmentTexture;
            // sproutsMaterial.backFaceCulling = false;

            // var textureMoss = assetsManager.addTextureTask('textureMoss', baseURL + 'assets/textures/PirateTreasureMapScroll_diffuse.jpg');
            // textureMoss.onSuccess = function(task) {
            //     sproutsMaterial.albedoTexture = task.texture;
            // };
            //
            // var textureNoise = assetsManager.addTextureTask('textureNoise', baseURL + 'assets/textures/noiseCombustion.png');
            // textureNoise.onSuccess = function(task) {
            //     sproutsMaterial.customNoiseTexture = task.texture;
            //     sproutsMaterial.customNoiseTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
            //     sproutsMaterial.customNoiseTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            // };
            //
            // var textureFire = assetsManager.addTextureTask('textureFire', baseURL + 'assets/textures/Fractal_fire.jpg');
            // textureFire.onSuccess = function(task) {
            //     sproutsMaterial.gradientFireTexture = task.texture;
            //     sproutsMaterial.gradientFireTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
            //     sproutsMaterial.gradientFireTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            // };

            let tubeMaterial = new BABYLON.PBRMaterial('tubeMaterial', scene);
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

                tubeMaterial.metallicRoughnessTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.metallicRoughnessTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;

                tubeMaterial.useRoughnessFromMetallicTextureGreen = true;
                tubeMaterial.useMetallnessFromMetallicTextureBlue = true;
                tubeMaterial.useAmbientOcclusionFromMetallicTextureRed = true;
            };

            var textureEmissive = assetsManager.addTextureTask('textureEmissive', baseURL + 'assets/textures/stem_emissive.png');
            textureEmissive.onSuccess = function(task) {
                tubeMaterial.emissiveTexture = task.texture;
                tubeMaterial.emissiveColor = new BABYLON.Color3(2,2,2);
                tubeMaterial.emissiveTexture.uScale = 2;
                tubeMaterial.emissiveTexture.vScale = 10;

                tubeMaterial.emissiveTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.emissiveTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            };

            // create a built-in 'ground' shape;
            // var ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 2, scene);
            // ground.material = sproutsMaterial;

            var sphereLeft = BABYLON.MeshBuilder.CreateSphere('sphereLeft', {diameter: 0.1, diameterX: 0.1}, scene);
            sphereLeft.position.x = -10;
            sphereLeft.position.y = 10;
            sphereLeft.position.z = -3;
            // sphereLeft.material = sproutsMaterial;
            sphereLeft.setEnabled(false);
            var sphereRight = BABYLON.MeshBuilder.CreateSphere('sphereRight', {diameter: 0.1, diameterX: 0.1}, scene);
            sphereRight.position.x = -sphereLeft.position.x;
            sphereRight.position.y = sphereLeft.position.y;
            sphereRight.position.z = sphereLeft.position.z;
            // sphereRight.material = sproutsMaterial;
            sphereRight.setEnabled(false);

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
                    new BABYLON.Vector3(-12,10,-3),
                    sphereLeft.position,
                    new BABYLON.Vector3(-5,15,-3),
                    new BABYLON.Vector3(0,10,-3),
                    new BABYLON.Vector3(5,15,-3),
                    sphereRight.position,
                    new BABYLON.Vector3(12,10,-3),
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



            let symbols = [];

            var meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/', 'bell.glb');
            meshTaskBell.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].rotate(BABYLON.Axis.Z, -0.4, BABYLON.Mesh.WORLD);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.04,0.04,0.04);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.75;
                task.loadedMeshes[0].receiveShadows = true;
                // task.loadedMeshes[0].position = new BABYLON.Vector3(0,10,30);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskCherry = assetsManager.addMeshTask('cherry', '', baseURL + 'assets/models/', 'cherry.glb');
            meshTaskCherry.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.04,0.04,0.04);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskGrapes = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/', 'grapes.glb');
            meshTaskGrapes.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.5;
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.04,0.04,0.04);
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
                // task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.5;
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.04,0.04,0.04);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskPlum = assetsManager.addMeshTask('plum', '', baseURL + 'assets/models/', 'plum.glb');
            meshTaskPlum.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.roughness = 1.5;
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                task.loadedMeshes[0].rotate(BABYLON.Axis.Z, -0.6, BABYLON.Mesh.WORLD);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.04,0.04,0.04);
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskSeven = assetsManager.addMeshTask('seven', '', baseURL + 'assets/models/', 'seven.glb');
            meshTaskSeven.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.025,0.025,0.025);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };
            var meshTaskWatermelon = assetsManager.addMeshTask('watermelon', '', baseURL + 'assets/models/', 'watermelon.glb');
            meshTaskWatermelon.onSuccess = function (task) {
                // task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0].rotate(BABYLON.Axis.Z, 0.2, BABYLON.Mesh.WORLD);
                task.loadedMeshes[0].rotate(BABYLON.Axis.Y, 0.6, BABYLON.Mesh.WORLD);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.0375,0.0375,0.0375);
                task.loadedMeshes[0]._children[0]._children[0]._children[0].material.environmentIntensity = 0.25;
                symbols.push(task.loadedMeshes[0]);
            };

            let cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {diameterBottom: 26, diameterTop: 26, height: 40, tessellation: 16}, scene);
            cylinder.position.y = 10;
            cylinder.rotation.z = Math.PI / 2;
            let materialCilynder = new BABYLON.PBRMaterial("materialCilynder", scene);
            materialCilynder.albedoColor = new BABYLON.Color3(0.0,0.0,0.0);
            materialCilynder.metallic = 1;
            materialCilynder.roughness = 0.5;
            // materialCilynder.cameraExposure = 1.2;
            // materialCilynder.cameraContrast = 1.9;
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
                task.loadedMeshes[0].position.y = 8.5;
                task.loadedMeshes[0].position.z = 16.5;
                // task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.105,0.105,0.105);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.0304,0.0304,-0.0304);
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.isEnabled = true;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.intensity = 1; // 0-1 defaults to 1
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.roughness = 0; // 0-1 defaults to 0
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material._environmentIntensity = 0.25;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.texture = texture; // R is storing intensity and G roughness


                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.isTintEnabled = true;
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.tintColor = Color3.Teal();
                // task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clearCoat.bumpTexture = texture; // dedicated bump texture for the coat
            };

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
                    let reel = new CreateReel(symbols, angles, radius, section, numSymbolPerReel, new BABYLON.Vector3(12.8 - j * 6.4, 0, 0), scene);
                    reels.push(reel);
                }
                // for (var i = 0; i < scene.meshes.length; i++) {
                    // shadowGenerator.addShadowCaster(scene.meshes[i]);
                    // shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
                    // scene.meshes[i].receiveShadows = true;
                // }
            });

            scene.registerBeforeRender(function () {
// console.time();
                let deltaTime = scene.getEngine().getDeltaTime()*0.006;
                reels.map(v => {
                    v.update(deltaTime);
                });

                if (enableEndRotateAnimation && reels[stopIndex].stoped) {
                    if (stopIndex < 4) {
                        stopIndex++;
                        reels[stopIndex].stopRotate(false);
                    } else {
                        stopIndex = 0;
                        enableEndRotateAnimation = false;
                    }
                }

// console.timeEnd();
                // objGrowth.update(deltaTime);
                // if (objGrowth.ended) {
                //     objGrowth.startGrowth();
                // }
            });

            scene.actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
                        parameter: 'w'
                    },
                    function (evt) {
                        // objGrowth.startGrowth();
                        // meshes.map(v => {
                        //     v.setEnabled(true);
                        // });
                        if (reels[reels.length - 1].stoped) {
                            reels.map(v => {
                                v.startRotate(true);
                            });
                            forceStop = undefined;
                        }
                    }
                )
            );
            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
                        parameter: 's'
                    },
                    function (evt) {
                        if (forceStop === undefined) {
                            forceStop = false;
                        } else {
                            forceStop = true;
                        }

                        if (forceStop) {
                            reels.map(v => {
                                v.stopRotate(false);
                            });
                            forceStop = undefined;
                        } else {
                            enableEndRotateAnimation = true;
                            reels[0].stopRotate(false);
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

        // run the render loop
        var newExplosion;
        scene.executeWhenReady(function(){
            // objGrowth.startGrowth();
            // newExplosion = new BABYLON.MeshExploder(meshes);
            // newExplosion.explode(2);

            // var time = 0;
            // var order = 0.0;
            // var start_time = Date.now();

            // sproutsMaterial.onBind = function () {
            //     sproutsMaterial._activeEffect.setFloat("time", time);
            //     order = (Date.now() - start_time) * 0.001;
            //     start_time = Date.now();
            //     time += order;
            //     if (time >= 3) {
            //         time = -0.5
            //         // sproutsMaterial.dispose(true, true);
            //     }
            // };
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