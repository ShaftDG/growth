
import {
    AnimationGroup,
    Axis,
    Mesh,
    // Material,
    Scalar,
    TransformNode,
    Vector3,
    MeshBuilder,
    PBRMaterial,
    Color3,
    // StandardMaterial,
    // Color3
} from '@babylonjs/core';
import AnimationScalePulse from "./AnimationScalePulse";
import AnimationStopReels from "./AnimationStopReels";

export default class _CreateReel {
    constructor(symbols, skeletons, animationsGroups, angles, radius, section, numSymbolPerReel, positionReel, ins, scene) {
        this.symbols = symbols;
        this.radius = radius;
        this.positionReel = positionReel;
        this.scene = scene;
        this.CoT = new TransformNode("CoT");
        this.CoT.position.y = 10;
        this.section = section;
        this.indexSymbol = 0;
        this.indexSection = 1;
        this.numSymbolPerReel = numSymbolPerReel;
        this.indexUp = 3;
        this.indexMiddleSymbol = 2;
        this.indexDown = 1;
        this.meshes = [];
        this.stoped = true;
        this.moveWinS = false;
        this.beginStop = false;
        this.angles = angles;
        this.indexLineWin = 0;
        this.endIncrementIndexLineWin = false;
        let iiii = ins + 0;

            for (var i = 0; i < 5; i++) {
                let CoTSector = new TransformNode("CoTSector");
                let CoTSector_child = new TransformNode("CoTSector_child");
                CoTSector_child.parent = CoTSector;
                for (let j = 0; j < symbols.length; j++) {
                    let obj = symbols[j].clone();

                    // console.log("_________________________________________________");
                    if (skeletons[j]) {
                        let bones = [];
                        obj._children[0]._children[0].skeleton = skeletons[j].clone("Armature_" + i + "_" + j, "Skeleton_" + i + "_" + j);

                        // obj._children[0]._children[0].skeleton._transformMatrices = skeletons[j].getTransformMatrices();
                        // obj._children[0]._children[0].skeleton._transformMatrixTexture = skeletons[j].getTransformMatrixTexture();
                        // obj._children[0]._children[0].skeleton._numBonesWithLinkedTransformNode = skeletons[j]._numBonesWithLinkedTransformNode;
                        // obj._children[0]._children[0].skeleton.sortBones();
                        // obj._children[0]._children[0].skeleton.overrideMesh = obj;
                        // obj._children[0]._children[0].skeleton.needInitialSkinMatrix = false;
                        // obj._children[0]._children[0].skeleton.useTextureToStoreBoneMatrices = false;
                        // obj._children[0]._children[0].applySkeleton(obj._children[0]._children[0].skeleton);

                        // bones.push(...obj._children[0]._children[0].skeleton.bones);
                        // console.log(obj._children[0]._children[0].skeleton, skeletons[j]);

                        // obj._children[0]._children[0].skeleton.bones[0]._linkedTransformNode = obj._children[0];
                        // obj._children[0]._children[0].skeleton.bones[1]._linkedTransformNode = obj._children[0]._children[1];

                        // console.log( scene.animationGroups )
                        console.log(obj._children[0]._children[0].skeleton, skeletons[j])
                   /*     let orignalAnimation = scene.getAnimationGroupByName("drop");
                        let animationClone = new AnimationGroup("clonedAnimationsGroups_" + i + "_" + j);


                        for (let i = 0; i < orignalAnimation._targetedAnimations.length; i++) {

                            let targetedAnimation = orignalAnimation._targetedAnimations[i];
                            let target = null;
                            function getNode(array, nameTarget) {
                                let _target = null;
                                for (let k = 0; k < array.length; k++) {
                                    if (array[k]._children) {
                                        _target = getNode(array[k]._children, nameTarget)
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

                            target = getNode(obj._children[0]._children[1]._children, orignalAnimation._targetedAnimations[i].target.name);
                            if ( target ) {
                                // obj._children[0]._children[0].skeleton.bones[
                                //     obj._children[0]._children[0].skeleton.getBoneIndexByName(orignalAnimation._targetedAnimations[i].target.name)
                                //     ].linkTransformNode(target);
                                animationClone.addTargetedAnimation(targetedAnimation.animation.clone(), target);
                            }
                          /!*  for (let j = 0; j < targetedAnimation.target.length; j++) {
                                if (targetedAnimation.target[j]._skeleton == null) {
                                    //console.log(targetedAnimation.target[j]);
                                    targetedAnimation.target.splice(j,1);
                                }
                            }
                            let targets = [];
                            for (let j = 0; j < targetedAnimation.target.length; j++) {
                                if (targetedAnimation.target[j]._skeleton) {
                                    let targetSkeleton = obj._children[0]._children[0].skeleton;
                                    let boneId = targetSkeleton.getBoneIndexByName(targetedAnimation.target[j].name);
                                    if (boneId != -1) {
                                        targets.push(targetSkeleton.bones[boneId]);
                                    } else {
                                        console.log(boneId);
                                    }
                                }
                            }
                            // console.log(targetedAnimation.target, targets);
                            let nameTarget = targetedAnimation.target.name;
                            let _target = null;
                            obj._children[0]._children[1]._children.map(v => {
                                if (v.name.split('.')[3] === nameTarget) {
                                    v.animations = targetedAnimation.target.animations;
                                    console.log(v.name.split('.')[3])
                                    _target = v
                                }
                            });
                            if (_target) {
                                animationClone.addTargetedAnimation(targetedAnimation.animation.clone(), _target);
                            }
                            animationClone.start(true);*!/
                        }*/

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
                        for (let f = 0; f < obj._children[0]._children[0].skeleton.bones.length; f++) {
                            let target = linkBones(obj._children, obj._children[0]._children[0].skeleton.bones[f].name);
                            // console.log( target.name, obj._children[0]._children[0].skeleton.bones[f].name )
                            obj._children[0]._children[0].skeleton.bones[f].linkTransformNode(target);
                            let cylinder = MeshBuilder.CreateSphere("cylinder", {diameter: 0.1}, scene);
                            cylinder.position = target.getAbsolutePosition();
                            let materialCilynder = new PBRMaterial("materialCilynder", scene);
                            materialCilynder.albedoColor = new Color3(1.0,0.0,0.0);
                            cylinder.material = materialCilynder;
                        }
                        // animationClone.start(true);
                   /*     let children = obj.getChildMeshes();
                        let sourceChildren = symbols[j].getChildMeshes();

                        let bones = [];
                        let sourceBones = [];

                        for (var index = 0; index < children.length; index++) {
                            var child = children[index];
                            var sourceChild = sourceChildren[index];

                            if (sourceChild.skeleton) {
                                sourceBones.push(...sourceChild.skeleton.bones);
                                child.skeleton = sourceChild.skeleton.clone();
                                bones.push(...child.skeleton.bones);
                            }
                        }
*/

                        // bones.map( v => {
                        //     function iterationTransformNode(array, idTarget) {
                        //         let node = null;
                        //         for (let k = 0; k < array.length; k++) {
                        //             if (array[k]._children) {
                        //                 node = iterationTransformNode(array[k]._children, idTarget)
                        //             }
                        //
                        //             if (!node) {
                        //                 let stringArray = array[k].name.split('.');
                        //                 if (stringArray[stringArray.length - 1] === idTarget) {
                        //                     console.log(stringArray[stringArray.length - 1])
                        //                     return array[k]
                        //                 }
                        //             }
                        //         }
                        //         console.log(node ? node.name : null)
                        //         return node
                        //     }
                        //     v._linkedTransformNode = iterationTransformNode(obj._children, v.id);
                        // });

                        // AnimationGroup.prototype.clone = function (newName, targetConverter) {
                        //     var newGroup = new AnimationGroup(newName || this.name, this._scene);
                        //     for (var _i = 0, _a = this._targetedAnimations; _i < _a.length; _i++) {
                        //         var targetAnimation = _a[_i];
                        //         // console.log(targetAnimation.animation, targetAnimation.target.id, targetConverter(targetAnimation.target).id);
                        //         newGroup.addTargetedAnimation(targetAnimation.animation.clone(), targetConverter ? targetConverter(targetAnimation.target) : targetAnimation.target);
                        //     }
                        //     return newGroup;
                        // };

                        let animationGroup = animationsGroups[j].clone("clonedAnimationsGroups_" + i + "_" + j, function (target) {

                            let nameTarget = target.name;

                            function AnimationClone(array, skeleton) {
                                    for (let k = 0; k < array.length; k++) {
                                        if (array[k]._children) {
                                            AnimationClone(array[k]._children, skeleton)
                                        }
                                        let stringArray = array[k].name.split('.');
                                        // console.log(stringArray)
                                        if (stringArray[stringArray.length - 1] === nameTarget /*&& nameTarget === "Joint_13"*/) {
                                            // console.log(bones[skeleton.getBoneIndexByName(target.name)].name, array[k].name)
                                            // skeleton.bones[skeleton.getBoneIndexByName(target.name)]._linkedTransformNode = array[k];
                                            // let idx = obj._children[0]._children[0].skeleton.getBoneIndexByName(target.name)
                                            // return obj._children[0]._children[0].skeleton.bones[idx]
                                            // array[k].animations = [...target.animations];
                                            target = array[k];
                                        }
                                    }

                            }
                            AnimationClone(obj._children[0]._children[1]._children, obj._children[0]._children[0].skeleton);
                            return target;
                        });
                        // console.log(obj._children[0]._children[0].skeleton, skeletons[j]);
                        // console.log(scene.animationGroups)
                        // animationsGroups[j].start(true);
                        animationGroup.start(true);
                        // animationGroup.addTargetedAnimation(animationGroup.targetedAnimations[0].animation, obj._children[0]._children[0].skeleton);

                        // scene.beginAnimation(obj.skeleton, 0, 30, true, 1.0);
                        // scene.beginAnimation(skeletons[j], 0, 100, true, 0.8);
                        // scene.animationGroups[1].start(true);
                    }
                    // console.log(obj._children[0].id, j)
                    // obj._children[0].material = symbols[j]._children[0].material.clone(symbols[j]._children[0].material.id + "_" + i + "_" + j );
// console.log(obj._children[0].material.id);
                  /*  let red = new StandardMaterial('red', scene);
                    red.emissiveColor = new Color3(1, 0, 0);
                    red.diffuseColor = new Color3(1, 0, 0);
                    red.sideOrientation = Material.ClockWiseSideOrientation;
                    obj._children[0].customOutline = obj._children[0].clone('outline_clone');
                    obj._children[0].customOutline.scaling  = new Vector3(1.1,1.1,1.1);
                    // obj.customOutline.sideOrientation = Mesh.BACKSIDE;
                    obj._children[0].customOutline.parent = obj;
                    obj._children[0].customOutline.material = red;*/

                    let z = radius * Math.cos(this.angles[i]);
                    let y = radius * Math.sin(this.angles[i]);
                    obj.rotate(Axis.X, this.angles[i], Mesh.WORLD);
                    // obj._children[0]._children[1].rotation = Math.PI / 2;
                    obj.position = new Vector3(positionReel.x, y, z);
                    obj.defaultScaling = new Vector3(obj.scaling.x, obj.scaling.y, obj.scaling.z);
                    obj.parent = CoTSector_child;
                    obj.setEnabled(false);
                }
                let randomIndexSymbol;
                if (iiii < 10) {
                    randomIndexSymbol = iiii/*Math.round(Scalar.RandomRange(0, 9))*/;
                    if (i > 0 && i < 4) {
                        iiii++
                    }
                } else {
                    randomIndexSymbol = Math.round(Scalar.RandomRange(0, 9));
                }
                CoTSector.visibleSymbol = CoTSector_child._children[randomIndexSymbol];
                CoTSector.visibleSymbol.setEnabled(true);
                CoTSector.parent = this.CoT;
                this.meshes.push(CoTSector);
            }
            this.meshes[0].setEnabled(false);
            this.meshes[4].setEnabled(false);
        this.endRotate = false;
        this.rotateSlots = false;
    }

  /*  setVisibleSymbol(object, indexSymbol) {
        object._children.map(g => {
            g.setEnabled(false);
        });
        object._children[indexSymbol].setEnabled(true);
    }*/

    loadModels(baseURL, assetsManager) {
        let symbols = new Array(10);
        let meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'bell_final_Draco.glb');
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
        let meshTaskGrapes = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/tmp/', 'grape_final_anim_Draco.glb');
        meshTaskGrapes.onSuccess = function (task) {
            task.loadedMeshes[0].setEnabled(false);
            task.loadedMeshes[0].scaling = new Vector3(4,4,-4);
            symbols[4] = task.loadedMeshes[0];
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
        };
        return symbols;
    }

    replaceSymbol(object, index, indexSymbol) {

        object._children[0].animations = [];
        object._children[0]._children[0].animation = [];
        object._children[0]._children[0].dispose();


        let obj = this.symbols[indexSymbol].clone();
        let z = this.radius * Math.cos(this.angles[index]);
        let y = this.radius * Math.sin(this.angles[index]);
        obj.rotate(Axis.X, this.angles[index], Mesh.WORLD);
        obj.position = new Vector3(this.positionReel.x, y, z);
        obj.defaultScaling = new Vector3(obj.scaling.x, obj.scaling.y, obj.scaling.z);
        obj.parent = object._children[0];

    }

    setVisibleSymbol(object, indexSymbol) {
        object._children[0]._children.map(g => {
            g.setEnabled(false);
        });
        object.visibleSymbol = object._children[0]._children[indexSymbol];
        object.visibleSymbol.setEnabled(true);
    }

    setVisibleSymbols(arrayObects, indexMiddleSymbol, reelCombination) {
        this.indexUp = indexMiddleSymbol + 1 <= 4 ? indexMiddleSymbol + 1 : 0;
        this.indexDown = indexMiddleSymbol - 1 >= 0 ? indexMiddleSymbol - 1 : 4;

        // this.replaceSymbol(arrayObects[this.indexUp], this.indexUp, reelCombination[0]);
        // this.replaceSymbol(arrayObects[indexMiddleSymbol], indexMiddleSymbol, reelCombination[1]);
        // this.replaceSymbol(arrayObects[this.indexDown], this.indexDown, reelCombination[2])
        //

        this.setVisibleSymbol(arrayObects[this.indexUp], reelCombination[0]);
        this.setVisibleSymbol(arrayObects[indexMiddleSymbol], reelCombination[1]);
        this.setVisibleSymbol(arrayObects[this.indexDown], reelCombination[2]);
    }

    startRotate (rotateSlots, fire, stopSymbols) {
        if (fire) {
            fire.reset();
            fire.stop();
        }
        this.rotateSlots = rotateSlots;

        this.meshes.map(v => {
            v.setEnabled(true);
            // let randomIndexSymbol = Math.round(BABYLON.Scalar.RandomRange(0, 6));
            // v._children.map(g => {
            //     g.setEnabled(false);
            // });
            // v._children[randomIndexSymbol].setEnabled(true);

            if (v.animationScalePulse) {
                v.animationScalePulse.animScale.stop();
                v.animationScalePulse.animPosition.stop();
            }
            v._children[0].animations = [];
            v._children[0]._children[0].animations = [];
            v._children[0].position = new Vector3(0,0,0);
            v._children[0]._children[0].scaling = v._children[0]._children[0].defaultScaling.clone();
        });

        this.moveWinS = false;
        this.endRotate = false;
        this.stoped = false;
        this.beginStop = false;
        this.endIncrementIndexLineWin = false;
    }

    stopRotate (rotateSlots, reelCombination) {
        this.rotateSlots = rotateSlots;
        if (!this.rotateSlots && !this.beginStop) {
            this.indexMiddleSymbol = this.indexSymbol + 2 <= 4 ? this.indexSymbol + 2 : this.indexSymbol + 2 - 4 - 1;
            this.endRotate = true;
            this.CoT.rotation.x = this.section * (this.indexSection - 3);
            let firstIndex = this.indexSymbol - 1 < 0 ? 4 : this.indexSymbol - 1;
            let lastIndex = firstIndex + 1 > 4 ? 0 : firstIndex + 1;

            this.setVisibleSymbols(this.meshes, this.indexMiddleSymbol, reelCombination);

            let thatMeshes = this.meshes;
            function unvisibleUp() {
                thatMeshes[firstIndex].setEnabled(false);
            }
            function unvisibleDown() {
                thatMeshes[lastIndex].setEnabled(false);
            }
            let that = this;
            function stopedCallback() {
                that.stoped = true;
            }

            AnimationStopReels.call(this.CoT,
                new Vector3(this.section * (this.indexSection - 1),0,0),
                150,
                unvisibleUp,
                unvisibleDown,
                stopedCallback,
                this.scene
            );

            this.beginStop = true;
        }
    }

    incrementIndexLineWin (callback) {
        if (this.indexLineWin < 2) {
            this.indexLineWin++;
            console.log(222222222222)
        } else {
            this.indexLineWin = 0;
            this.endIncrementIndexLineWin = true;
            // callback()
        }
    }

    setAnimationMoveWinSymbol (index, indexReelCombination, callback, fire) {
        this.moveWinS = true;
        let that = this;
        function stopedCallback() {
            that.moveWinS = false;
            fire.stop();
            callback()
        }

        let invertParentWorldMatrix = this.meshes[index].getWorldMatrix().clone();
        invertParentWorldMatrix.invert();
        let absolutePosition = this.meshes[index].visibleSymbol.getAbsolutePosition();
        let worldPosition = new Vector3(absolutePosition.x, absolutePosition.y, absolutePosition.z);
        let position = Vector3.TransformCoordinates(worldPosition, invertParentWorldMatrix);
        fire.setEmitterPosition(this.meshes[index].visibleSymbol);
        fire.start();
        this.meshes[index].animationScalePulse = AnimationScalePulse.call(this.meshes[index].visibleSymbol,
            new Vector3(0.0,0.0,0.0),
            position,
            70,
            stopedCallback,
            this.scene
        );
    }

    moveWinSymbols (winArray, reelCombination, callback, fire) {
        if (!this.rotateSlots && this.stoped) {

            // console.log(winArray)
            // winArray.map((v, i) => {
               if (winArray[0] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexUp, reelCombination[0], callback, fire);
               } else if (winArray[1] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexMiddleSymbol, reelCombination[1], callback, fire);
               } else if (winArray[2] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexDown, reelCombination[2], callback, fire);
               } else {
                   callback()
               }


               /*else if (!this.endIncrementIndexLineWin) {
                   this.incrementIndexLineWin(callback);
                   this.moveWinSymbols(winArray, callback);
               }*/
            // });

        }
    }

    update (deltaTime) {

        if (this.rotateSlots) {
            this.CoT.rotation.x += deltaTime;
        }

        if (!this.endRotate && this.CoT.rotation.x >= this.section * this.indexSection) {
            console.time();
            let angle = this.section * ((this.numSymbolPerReel - this.angles.length + 1) + this.indexSymbol) - this.CoT.rotation.x;
            let deltaA = this.CoT.rotation.x - this.section * this.indexSection;
            this.meshes[this.indexSymbol].rotation.x = angle + deltaA;
            if (this.indexSymbol < 4) {
                this.indexSymbol++;
            } else {
                this.indexSymbol = 0;
            }
            if (this.indexSection < this.numSymbolPerReel) {
                this.indexSection++;
            } else {
                this.indexSection = 1;
            }
            console.timeEnd();
        }

        if (this.CoT.rotation.x > Math.PI * 2) {
            this.CoT.rotation.x -= Math.PI * 2;
        }

    }
}