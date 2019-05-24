import './css/style.css';
import {} from 'babylonjs';
import {} from 'babylonjs-loaders';
import CreateCanvas from './js/CreateCanvas';
import Growth from './js/Growth';
import './js/showFPS';

let objGrowth;
let baseURL = '/src/';
var canvas = CreateCanvas();
window.addEventListener('DOMContentLoaded', function(){

    if (/*BABYLON.Engine.isSupported()*/true) {
        // get the canvas DOM element


        // load the 3D engine
        var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new BABYLON.Scene(engine);

            var assetsManager = new BABYLON.AssetsManager(scene);
            // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
            // var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 20, -50), scene);
            var camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 0.5, new BABYLON.Vector3(0, 20, -20), scene);
            // camera.setPosition(new BABYLON.Vector3(0, 20, -20));
            // camera.lowerRadiusLimit = camera.radius;
            // camera.upperRadiusLimit = 5;
            camera.setTarget(new BABYLON.Vector3(0, 10, 0));
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
            // light.intensity = 5.0;
            // var lightdir = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 10, -10), scene);
            // lightdir.intensity = 5.0;
            //
            // var lightspot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 10, -20), new BABYLON.Vector3(0, 0, 1), 2.0, 2, scene);
            // lightspot.intensity = 1000;
            // var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('/src/assets/textures/hdri_cube_radiance.dds', scene);
            // var hdrTexture = new BABYLON.HDRCubeTexture('/src/assets/textures/hdri.hdr', scene, 1024, false, false);
            // var hdrTexture = new BABYLON.CubeTexture("studio.env", scene);
            var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', baseURL + 'assets/textures/environmentSpecular.env');
            // var taskEnvTexture = assetsManager.addCubeTextureTask('studioEnv', '/src/assets/textures/environmentSpecularHDR.dds');
            taskEnvTexture.onSuccess = function(task) {
                scene.environmentTexture = task.texture;
                scene.environmentTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
                scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            };

            //HDR_110_Tunnel_Env.hdr
            // var taskHdrTexture = assetsManager.addHDRCubeTextureTask('studioHDR', baseURL + 'assets/textures/HDR_110_Tunnel_Env.hdr', 512, false, false);
            // taskHdrTexture.onSuccess = function(task) {
            //     scene.environmentTexture = task.texture;
            //     scene.createDefaultSkybox(task.texture, true, 1000, 0.005);
            // };

            // scene.environmentTexture = hdrTexture;
            // scene.createDefaultSkybox(hdrTexture, true, 1000, 0.005);


            let sproutsMaterial = new BABYLON.PBRMaterial('myMaterial', scene);
            sproutsMaterial.albedoColor = new BABYLON.Color3(1.0, 1.0, 1.0);
            sproutsMaterial.environmentTexture = scene.environmentTexture;

            var sphereLeft = BABYLON.MeshBuilder.CreateSphere('sphereLeft', {diameter: 0.1, diameterX: 0.1}, scene);
            sphereLeft.position.x = -10;
            sphereLeft.position.y = 10;
            sphereLeft.position.z = -3;
            sphereLeft.material = sproutsMaterial;
            var sphereRight = BABYLON.MeshBuilder.CreateSphere('sphereRight', {diameter: 0.1, diameterX: 0.1}, scene);
            sphereRight.position.x = -sphereLeft.position.x;
            sphereRight.position.y = sphereLeft.position.y;
            sphereRight.position.z = sphereLeft.position.z;
            sphereRight.material = sproutsMaterial;

            // create a built-in 'ground' shape;
            // var ground = BABYLON.Mesh.CreateGround('ground1', 60, 60, 2, scene);
            // ground.material = sproutsMaterial.clone();
            // ground.material.metallic = 0.5;
            // ground.material.roughness = 0.25;

            BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === 'gltf' && plugin instanceof BABYLON.GLTFFileLoader) {
                    plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

            let tubeMaterial = new BABYLON.PBRMaterial('tubeMaterial', scene);
            tubeMaterial.metallic = 0.0;
            tubeMaterial.roughness = 0.0;
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
            };

            let numTubes = 1;
            let sectionPoints = 3;
            let numSegmentPerPoint = 4;
            let numPointsperInterval = 4;
            let dotIterationStep = 1;
            let intervalTime = 0.0;
            let distanceSprouts = 0.42;
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

            // var meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/', 'bell_out.glb');
            //
            // meshTaskBell.onSuccess = function (task) {
            //     // task.loadedMeshes[0].position = new BABYLON.Vector3(0,10,0);
            //     task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.005,0.005,0.005);
            //     task.loadedMeshes[0].setEnabled(false);
            //     // task.loadedMeshes[0].material.environmentTexture = scene.environmentTexture.clone();
            //     // task.loadedMeshes[0].material.environmentTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
            //
            //     for (let i = 0; i < 3; i++) {
            //         for (let j = 0; j < 5; j++) {
            //             let obj = task.loadedMeshes[0].clone();
            //             obj.position = new BABYLON.Vector3(j * 5 - 10, i * 5 + 5,0);
            //         }
            //     }
            // };

            let meshTask = assetsManager.addMeshTask('leaf', '', baseURL + 'assets/models/', 'leaf.glb');

            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].setEnabled(false);
                task.loadedMeshes[0]._children[0].material.metallic = 0.01;
                task.loadedMeshes[0]._children[0].material.roughness = 0.1;
                task.loadedMeshes[0]._children[0].material.environmentTexture = scene.environmentTexture;
                objGrowth.setLeaf(task.loadedMeshes[0]);
            };

            scene.registerBeforeRender(function () {
                let deltaTime = scene.getEngine().getDeltaTime()*0.01;
                objGrowth.update(deltaTime);
                if (objGrowth.ended) {
                    objGrowth.startGrowth();
                }
            });

            scene.actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
                        parameter: 'w'
                    },
                    function (evt) {
                        objGrowth.startGrowth();
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
        scene.executeWhenReady(function(){
            objGrowth.startGrowth();
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