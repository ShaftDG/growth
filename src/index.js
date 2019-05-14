import './css/style.css';
import {} from 'babylonjs';
import {} from 'babylonjs-loaders';
import CreateCanvas from './js/CreateCanvas';
import GrowthPath3D from './js/GrowthPath3D';
import showFPS from './js/showFPS';

let objectsCurve = [];

window.addEventListener('DOMContentLoaded', function(){

    if (/*BABYLON.Engine.isSupported()*/true) {
        // get the canvas DOM element
        var canvas = CreateCanvas();

        // load the 3D engine
        var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

        // createScene function that creates and return the scene
        var createScene = function () {
            // create a basic BJS Scene object
            var scene = new BABYLON.Scene(engine);

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
            // create a basic light, aiming 0,1,0 - meaning, to the sky
            var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

            var sphereLeft = BABYLON.MeshBuilder.CreateSphere('sphereLeft', {diameter: 1, diameterX: 1}, scene);
            sphereLeft.position.x = -10;
            sphereLeft.position.y = 10;
            sphereLeft.position.z = 0;
            var sphereRight = BABYLON.MeshBuilder.CreateSphere('sphereRight', {diameter: 1, diameterX: 1}, scene);
            sphereRight.position.x = -sphereLeft.position.x;
            sphereRight.position.y = sphereLeft.position.y;
            sphereRight.position.z = sphereLeft.position.z;

            // create a built-in 'ground' shape;
            var ground = BABYLON.Mesh.CreateGround('ground1', 60, 60, 2, scene);

            let sproutsMaterial = new BABYLON.StandardMaterial('myMaterial', scene);
            sproutsMaterial.diffuseColor = new BABYLON.Color3(0.125, 2.0, 0.25);

            let tubeMaterial = new BABYLON.PBRMaterial('tubeMaterial', scene);
            tubeMaterial.metallic = 0.5;
            tubeMaterial.roughness = 0.5;
            // tubeMaterial.albedoColor = new BABYLON.Color3(0.125, 2.0, 0.25);
            // tubeMaterial.useMicroSurfaceFromReflectivityMapAlpha = true;

            var assetsManager = new BABYLON.AssetsManager(scene);

            var textureAlbedo = assetsManager.addTextureTask('textureAlbedo', '/src/assets/textures/stem_baseColor.png');
            textureAlbedo.onSuccess = function(task) {
                tubeMaterial.albedoTexture = task.texture;
                tubeMaterial.albedoTexture.uScale = 2;
                tubeMaterial.albedoTexture.vScale = 10;

                tubeMaterial.albedoTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.albedoTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            };

            var textureBump = assetsManager.addTextureTask('textureBump', '/src/assets/textures/stem_normal.png');
            textureBump.onSuccess = function(task) {
                tubeMaterial.bumpTexture = task.texture;
                tubeMaterial.bumpTexture.uScale = 2;
                tubeMaterial.bumpTexture.vScale = 10;

                tubeMaterial.bumpTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.bumpTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
            };

            var textureORM = assetsManager.addTextureTask('textureBump', '/src/assets/textures/stem_ORM.png');
            textureORM.onSuccess = function(task) {
                tubeMaterial.metallicRoughnessTexture  = task.texture;
                tubeMaterial.metallicRoughnessTexture.uScale = 2;
                tubeMaterial.metallicRoughnessTexture.vScale = 10;

                tubeMaterial.metallicRoughnessTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
                tubeMaterial.metallicRoughnessTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;

                tubeMaterial.useRoughnessFromMetallicTextureGreen = true;
                tubeMaterial.useMetallnessFromMetallicTextureBlue = true;
            };

            BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
                if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
                    plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                    plugin.compileShadowGenerators = true;
                }
            });

            var meshTask = assetsManager.addMeshTask('leaf', '', '/src/assets/models/', 'leaf.glb');
            let leaf;
            meshTask.onSuccess = function (task) {
                task.loadedMeshes[0].position = new BABYLON.Vector3(0,10,0);
                leaf = task.loadedMeshes[0];
                leaf.setEnabled(false);
            }

            let numTubes = 3;
            let numSegmentPerPoint = 8;

            for (let i = 0; i < numTubes; i++) {
                let randomX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
                let randomY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
                let randomZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();

                let randomXX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
                let randomYY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
                let randomZZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();

                let objCurve = new GrowthPath3D(
                    sphereLeft.position.subtract(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomX,randomY,randomZ).scale(0.75)),
                    sphereRight.position.add(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomXX,randomYY,randomZZ).scale(0.75)),
                    numSegmentPerPoint,
                    0.01,
                    0.01,
                    scene);
                objectsCurve.push(objCurve);
                let curve = objCurve.getPath();

                var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, 0.1, 8, null, BABYLON.Mesh.NO_CAP, scene, true, BABYLON.Mesh.FRONTSIDE,);
                objCurve.diameter = BABYLON.Scalar.RandomRange(0.015, 0.035);
                objCurve.deltaMoveSprouts = 0.015;
                objCurve.tube = tube;
                objCurve.sprouts = [];
                tube.material = tubeMaterial;
            }

            scene.registerBeforeRender(function () {
                let deltaTime = scene.getEngine().getDeltaTime()*0.01;
                objectsCurve.map((v, i) => {
                    if (v.start) {
                        v.updatePath(deltaTime);
                        if (v.enableSprouts) {
                            v.enableSprouts = false;
                            let sphere = leaf.clone();
                            let index = v.index-1;
                            var manager = new BABYLON.MorphTargetManager();
                            sphere._children[0].morphTargetManager = manager;

                            let target = new BABYLON.MorphTarget('_' + (v.sprouts.length - 1), 1);
                            target.setPositions(...leaf._children[0].morphTargetManager._targets[0]._positions);
                            target.setNormals(...leaf._children[0].morphTargetManager._targets[0]._normals);
                            target.setTangents(...leaf._children[0].morphTargetManager._targets[0]._tangents);
                            manager.addTarget(target);

                            let scale = BABYLON.Scalar.RandomRange(0.15, 0.5);
                            sphere.scaling = new BABYLON.Vector3(scale,scale,scale);
                            sphere.position = v.points[index].clone();
                            sphere.lookAt(v.points[index-1].clone());
                            sphere.rotate(BABYLON.Axis.X, -BABYLON.Scalar.RandomRange(0.25, 0.5), BABYLON.Mesh.LOCAL);
                            sphere.rotate(BABYLON.Axis.Y, -BABYLON.Scalar.RandomRange(0.1, 0.25), BABYLON.Mesh.LOCAL);
                            sphere.rotate(BABYLON.Axis.Z, Math.random() * 100, BABYLON.Mesh.LOCAL);
                            sphere.directionIndex = index;
                            sphere._children[0].material = leaf._children[0].material.clone();
                            sphere._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(0.75, 1.0), BABYLON.Scalar.RandomRange(0.5, 1.25), BABYLON.Scalar.RandomRange(0.25, 0.5))
                            sphere._children[0].material.albedoColor = sphere._children[0].material.albedoColor.scale(BABYLON.Scalar.RandomRange(0.5, 2));
                            v.sprouts.push(sphere);

                            sphere.animationGroup = new BABYLON.AnimationGroup('animationGroupLeaves_'+(v.sprouts.length - 1));
                            let animation = scene.animationGroups[0].targetedAnimations[0].animation.clone();
                            let targetAnimation = sphere._children[0].morphTargetManager.getTarget(0);
                            animation.name += '_' + (v.sprouts.length - 1);

                            sphere.animationGroup.addTargetedAnimation(animation, targetAnimation);
                            sphere.animationGroup.start(false, BABYLON.Scalar.RandomRange(deltaTime * 15, deltaTime * 20), 0, 2);
                        }

                        let curve = v.getPath();
                        let obj = scene.getMeshByName('tube_' + i);
                        if (obj) {
                            obj.dispose();
                        }

                        var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, v.diameter, 8, function(i, distance) {
                            if (distance <= v.totalLength / 10) {
                                return distance * v.diameter;
                            } else if (distance > v.totalLength / 10 && distance <= v.totalLength / 1.1) {
                                return (v.totalLength / 10) * v.diameter;
                            } else {
                                return (v.totalLength - distance) * v.diameter
                            }
                        }, BABYLON.Mesh.NO_CAP, scene, true, BABYLON.Mesh.FRONTSIDE,);
                        v.tube = tube;
                        tube.material = tubeMaterial;
                    } else if (v.reverse) {
                        v.updatePathReverse(deltaTime);
                        let curve = v.getPath();
                        let obj = scene.getMeshByName('tube_' + i);
                        if (obj) {
                            obj.dispose();
                        }

                        var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, v.diameter, 8, function(i, distance) {
                            if (distance <= v.totalLength / 10) {
                                return distance * v.diameter;
                            } else if (distance > v.totalLength / 10 && distance <= v.totalLength / 1.1) {
                                return (v.totalLength / 10) * v.diameter;
                            } else {
                                return (v.totalLength - distance) * v.diameter
                            }
                        }, BABYLON.Mesh.NO_CAP, scene, true, BABYLON.Mesh.FRONTSIDE,);
                        v.tube = tube;
                        tube.material = tubeMaterial;

                        if (v.sprouts[v.index-1]) {
                                if (!v.sprouts[v.index-1].animationGroup.isPlaying) {
                                    v.sprouts[v.index-1].animationGroup.start(false, -BABYLON.Scalar.RandomRange(deltaTime * 25, deltaTime * 35), 2, 0);
                                    v.sprouts[v.index-1]._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(5.5, 7.5), BABYLON.Scalar.RandomRange(0.75, 1), BABYLON.Scalar.RandomRange(0.35, 0.5));
                                    tubeMaterial.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(1.5, 2.5), BABYLON.Scalar.RandomRange(0.75, 0.8), BABYLON.Scalar.RandomRange(0.35, 0.5));
                                } else {
                                    v.sprouts[v.index-1].animationGroup.dispose();
                                }
                        }
                    }

                    if (v.moveSprouts) {
                        v.sprouts.map(g => {
                            if (g.directionIndex && g.directionIndex < v.points.length - 1) {
                                let dir = v.points[g.directionIndex + 1].subtract(v.points[g.directionIndex]).normalize();

                                let lTemplate = v.points[g.directionIndex + 1].subtract(v.points[g.directionIndex]).length();
                                let l = g.position.subtract(v.points[g.directionIndex]).length();

                                if (l < lTemplate) {
                                    if (v.start) {
                                        g.position.addInPlace(dir.scale(deltaTime * v.deltaMoveSprouts));
                                    } else {
                                        if (v.deltaMoveSprouts > 0) {
                                            v.deltaMoveSprouts -= deltaTime * 0.00005;
                                            g.position.addInPlace(dir.scale(deltaTime * v.deltaMoveSprouts));
                                        } else {
                                            v.moveSprouts = false;
                                            v.deltaMoveSprouts = 0.015;
                                            // objectsCurve.map(v => {
                                            //     v.sprouts.map((g, i) => {
                                            //         g.dispose();
                                            //         g.animationGroup.dispose();
                                            //     });
                                            //     v.sprouts = [];
                                            //     v.startGrowth();
                                            // });
                                        }
                                    }
                                } else {
                                    if (g.directionIndex < v.points.length - 1) {
                                        g.directionIndex++
                                    }
                                }
                            }
                        });
                    }
                });
            });

            scene.actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
                        parameter: 'w'
                    },
                    function (evt) {
                        objectsCurve.map(v => {
                            v.sprouts.map((g, i) => {
                                g.dispose();
                                g.animationGroup.dispose();
                            });
                            v.sprouts = [];
                            v.startGrowth();
                        });
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
            objectsCurve.map(v => {
                v.startGrowth();
            });
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