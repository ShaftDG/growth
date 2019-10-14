
import {
    AnimationGroup,
    Axis,
    Mesh,
    Texture,
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
import {Observable} from "@babylonjs/core/Misc/observable";
import CustomPBRMaterial from "./CustomPBRMaterial";

export default class CreateReel {
    constructor(name, angles, radius, section, numSymbolPerReel, positionReel, ins, baseURL, assetsManager, scene, engine) {
        this.radius = radius;
        this.positionReel = positionReel;
        this.scene = scene;
        this.engine = engine;
        this.baseURL = baseURL;
        this.CoT = new TransformNode(name);
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
        this.angles = angles;
        let iiii = ins + 0;
        this.onMoveWinEndObservable = new Observable();
        this.onStopEndObservable = new Observable();
        for (var i = 0; i < 5; i++) {
            let CoTSector = new TransformNode("CoTSector");
            let CoTSector_child = new TransformNode("CoTSector_child");
            CoTSector_child.parent = CoTSector;


            // for (let j = 0; j < symbols.length; j++) {
            //     let obj = symbols[j].clone();
            //
            //     let z = radius * Math.cos(this.angles[i]);
            //     let y = radius * Math.sin(this.angles[i]);
            //     obj.rotate(Axis.X, this.angles[i], Mesh.WORLD);
            //     obj.position = new Vector3(positionReel.x, y, z);
            //     obj.defaultScaling = new Vector3(obj.scaling.x, obj.scaling.y, obj.scaling.z);
            //     obj.parent = CoTSector_child;
            //     obj.setEnabled(false);
            // }
            // CoTSector.visibleSymbol = CoTSector_child._children[randomIndexSymbol];
            // CoTSector.visibleSymbol.setEnabled(true);
            CoTSector._symbols = this._loadModels(positionReel, CoTSector_child, i, baseURL, assetsManager);
            CoTSector.parent = this.CoT;
            this.meshes.push(CoTSector);
        }
        this.meshes[0].setEnabled(false);
        this.meshes[4].setEnabled(false);
        this.endRotate = false;
        this.rotateSlots = false;
    }

    beginVisibleSymbol() {

        this.meshes.map(v => {
            let randomIndexSymbol = Math.round(Scalar.RandomRange(0, 9));
            v._symbols.map((n, i) => {
                n.loadedMeshes[0].parent = v._children[0];
                if (i === randomIndexSymbol) {
                    v.visibleSymbol = n.loadedMeshes[0];
                    n.loadedMeshes[0].setEnabled(true);
                }
            });

          /*  if (iiii < 10) {
                randomIndexSymbol = iiii/!*Math.round(Scalar.RandomRange(0, 9))*!/;
                if (i > 0 && i < 4) {
                    iiii++
                }
            } else {
                randomIndexSymbol = Math.round(Scalar.RandomRange(0, 9));
            }*/

        })
    }
    /*  setVisibleSymbol(object, indexSymbol) {
          object._children.map(g => {
              g.setEnabled(false);
          });
          object._children[indexSymbol].setEnabled(true);
      }*/

     _updateSettings(obj, positionReel, index, parent, scope) {
        let z = scope.radius * Math.cos(scope.angles[index]);
        let y = scope.radius * Math.sin(scope.angles[index]);
        obj.rotate(Axis.X, scope.angles[index], Mesh.WORLD);
        obj.scaling = new Vector3(4,4,-4);
        obj.position = new Vector3(positionReel.x, y, z);
        obj.defaultScaling = new Vector3(obj.scaling.x, obj.scaling.y, obj.scaling.z);
        // obj.parent = parent;
        obj.setEnabled(false);
    }

    _loadModels(position, parent, indexAngle, baseURL, assetsManager) {
        let _this = this;
        let symbols = new Array(10);
        let meshTaskBell = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'bell_final_anim_Draco.glb');
        symbols[0] = meshTaskBell;
        meshTaskBell.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskLemon = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'lemon_final_Draco.glb');
        symbols[1] = meshTaskLemon;
        meshTaskLemon.onSuccess = function (task) {
            task.loadedMeshes[0]._children[0].material.roughness = 0.35;
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskWild = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'wild_final_anim_Draco.glb');
        symbols[2] = meshTaskWild;
        meshTaskWild.onSuccess = function (task) {
       /*     let myPBRmaterial = new CustomPBRMaterial("mat", _this.scene);
            // myPBRmaterial.emissiveColor = new Color3(2.0,2.0,2.0);
            myPBRmaterial.metallic = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
            myPBRmaterial.roughness = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
            myPBRmaterial.backFaceCulling = false;
            myPBRmaterial.albedoTexture = task.loadedMeshes[0]._children[0]._children[0].material.albedoTexture;
            myPBRmaterial.metallicTexture = task.loadedMeshes[0]._children[0]._children[0].material.metallicTexture;
            myPBRmaterial.bumpTexture = task.loadedMeshes[0]._children[0]._children[0].material.bumpTexture;
            myPBRmaterial.emissiveTexture = task.loadedMeshes[0]._children[0]._children[0].material.emissiveTexture;
            myPBRmaterial.ambientTexture = task.loadedMeshes[0]._children[0]._children[0].material.ambientTexture;

            myPBRmaterial.gradientFireTexture = new Texture(baseURL + 'assets/textures/combustion/Fractal_fire.jpg', _this.scene);
            myPBRmaterial.customNoiseTexture = new Texture(baseURL + 'assets/textures/combustion/noiseCombustion.png', _this.scene);

            myPBRmaterial.environmentTexture = _this.scene.environmentTexture;
            myPBRmaterial.forceIrradianceInFragment = true;
            myPBRmaterial.useAmbientOcclusionFromMetallicTextureRed = true;
            myPBRmaterial.useAmbientInGrayScale = true;
            myPBRmaterial.useRoughnessFromMetallicTextureAlpha = false;
            myPBRmaterial.useRoughnessFromMetallicTextureGreen = true;
            myPBRmaterial.useMetallnessFromMetallicTextureBlue = true;

            let time = -2.0;
            myPBRmaterial.onBind = function () {
                myPBRmaterial._activeEffect.setFloat("time", time);
                  time += _this.scene.getEngine().getDeltaTime() * 0.0001;
            };

            task.loadedMeshes[0]._children[0]._children.map(v => {v.material = myPBRmaterial});*/
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskCherry = assetsManager.addMeshTask('cherry', '', baseURL + 'assets/models/tmp/', 'cherry_final_anim_Draco.glb');
        symbols[3] = meshTaskCherry;
        meshTaskCherry.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskGrapes = assetsManager.addMeshTask('grapes', '', baseURL + 'assets/models/tmp/', 'grape_final_anim_Draco.glb');
        symbols[4] = meshTaskGrapes;
        meshTaskGrapes.onSuccess = function (task) {
          /*  let myPBRmaterial = new CustomPBRMaterial("mat", _this.scene);
            myPBRmaterial.metallic = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
            myPBRmaterial.roughness = 1.0; // set to 1 to only use it from the metallicRoughnessTexture
            myPBRmaterial.backFaceCulling = false;
            myPBRmaterial.albedoTexture = task.loadedMeshes[0]._children[0]._children[0].material.albedoTexture;
            myPBRmaterial.metallicTexture = task.loadedMeshes[0]._children[0]._children[0].material.metallicTexture;
            myPBRmaterial.bumpTexture = task.loadedMeshes[0]._children[0]._children[0].material.bumpTexture;
            myPBRmaterial.emissiveTexture = task.loadedMeshes[0]._children[0]._children[0].material.emissiveTexture;
            myPBRmaterial.ambientTexture = task.loadedMeshes[0]._children[0]._children[0].material.ambientTexture;

            myPBRmaterial.gradientFireTexture = new Texture(baseURL + 'assets/textures/combustion/Fractal_fire.jpg', _this.scene);
            myPBRmaterial.customNoiseTexture = new Texture(baseURL + 'assets/textures/combustion/noiseCombustion.png', _this.scene);

            myPBRmaterial.environmentTexture = _this.scene.environmentTexture;
            myPBRmaterial.forceIrradianceInFragment = true;
            myPBRmaterial.useAmbientOcclusionFromMetallicTextureRed = true;
            myPBRmaterial.useAmbientInGrayScale = true;
            myPBRmaterial.useRoughnessFromMetallicTextureAlpha = false;
            myPBRmaterial.useRoughnessFromMetallicTextureGreen = true;
            myPBRmaterial.useMetallnessFromMetallicTextureBlue = true;

            let time = -2.0;
            myPBRmaterial.onBind = function () {
                myPBRmaterial._activeEffect.setFloat("time", time);
            };

            task.loadedMeshes[0].combustionMaterial = myPBRmaterial;
            task.loadedMeshes[0]._children[0]._children.map(v => {v.material = myPBRmaterial});*/
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
            // task.loadedAnimationGroups[0].start(true);
        };
        let meshTaskStar = assetsManager.addMeshTask('lemon', '', baseURL + 'assets/models/tmp/', 'star_final_Draco.glb');
        symbols[5] = meshTaskStar;
        meshTaskStar.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskOrange = assetsManager.addMeshTask('orange', '', baseURL + 'assets/models/tmp/', 'orange_final1_Draco.glb');
        symbols[6] = meshTaskOrange;
        meshTaskOrange.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskPlum = assetsManager.addMeshTask('plum', '', baseURL + 'assets/models/tmp/', 'plum_final_Draco.glb');
        symbols[7] = meshTaskPlum;
        meshTaskPlum.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskSeven = assetsManager.addMeshTask('seven', '', baseURL + 'assets/models/tmp/', 'seven_final_Draco.glb');
        symbols[8] = meshTaskSeven;
        meshTaskSeven.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        let meshTaskWatermelon = assetsManager.addMeshTask('watermelon', '', baseURL + 'assets/models/tmp/', 'watermelon_final_Draco.glb');
        symbols[9] = meshTaskWatermelon;
        meshTaskWatermelon.onSuccess = function (task) {
            _this._updateSettings(task.loadedMeshes[0], position, indexAngle, parent, _this);
        };
        return symbols
    }

   /* replaceSymbol(object, index, indexSymbol) {

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

    }*/

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

    startRotate (fire, spark) {
        if (fire) {
            fire.reset();
            fire.stop();
            spark.reset();
            spark.stop();
        }
        this.rotateSlots = true;

        this.meshes.map(v => {
            v.setEnabled(true);
            // let randomIndexSymbol = Math.round(BABYLON.Scalar.RandomRange(0, 6));
            // v._children.map(g => {
            //     g.setEnabled(false);
            // });
            // v._children[randomIndexSymbol].setEnabled(true);

            if (v.animationScalePulse) {
                v.animationScalePulse.animScale.stop();
                // v.animationScalePulse.animPosition.stop();
            }
            v.visibleSymbol.animations = [];
            v.visibleSymbol._children[0].animations = [];

            v.visibleSymbol._children[0].position = new Vector3(0,0,0);
            v.visibleSymbol._children[0].rotation = new Vector3(0,0,0);
            // v.visibleSymbol._children[0].scaling = v.visibleSymbol.defaultScaling.clone();
        });

        this.endRotate = false;
        this.stoped = false;
    }

    stopRotate (reelCombination) {

        if (this.rotateSlots) {
            this.rotateSlots = false;
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
            function dropSymbol() {
                thatMeshes.map(v => {
                    v._symbols[0].loadedAnimationGroups[0].start(false);
                    v._symbols[3].loadedAnimationGroups[0].start(false);
                    v._symbols[4].loadedAnimationGroups[0].start(false);

                    v._symbols[2].loadedAnimationGroups.map( g => {g.start(false, 1.18) });

                });
            }
            function unvisibleDown() {
                thatMeshes[lastIndex].setEnabled(false);
            }
            let that = this;
            function stopedCallback() {
                that.stoped = true;
                that.onStopEndObservable.notifyObservers(that);
            }

            AnimationStopReels.call(this.CoT,
                new Vector3(this.section * (this.indexSection - 1),0,0),
                150,
                unvisibleUp,
                unvisibleDown,
                dropSymbol,
                stopedCallback,
                this.scene
            );
        }
    }

    setAnimationMoveWinSymbol (index, fire, spark) {

        let that = this;
        function stopedCallback() {
            that.onMoveWinEndObservable.notifyObservers(true);
        }

        let invertParentWorldMatrix = this.meshes[index].getWorldMatrix().clone();
        invertParentWorldMatrix.invert();
        let absolutePosition = this.meshes[index].visibleSymbol.getAbsolutePosition();
        let worldPosition = new Vector3(absolutePosition.x, absolutePosition.y, absolutePosition.z);
        let position = Vector3.TransformCoordinates(worldPosition, invertParentWorldMatrix);

        if (this.meshes[index].visibleSymbol._children[0].name === "wild") {
            spark.setEmitterPosition(this.meshes[index].visibleSymbol);
            spark.start();
        } else {
            fire.setEmitterPosition(this.meshes[index].visibleSymbol);
            fire.start();
            if (this.meshes[index].visibleSymbol.combustionMaterial) {
                let time = -2.0;
                this.meshes[index].visibleSymbol.combustionMaterial.onBind = function () {
                    that.meshes[index].visibleSymbol.combustionMaterial._activeEffect.setFloat("time", time);
                    time += that.scene.getEngine().getDeltaTime() * 0.003;
                };
            }
        }
        this.meshes[index].animationScalePulse = AnimationScalePulse.call(this.meshes[index].visibleSymbol,
            new Vector3(0.0,0.0,0.0),
            position,
            70,
            stopedCallback,
            this.scene
        );
    }

    moveWinSymbols (winArray, fire, spark) {
        if (!this.rotateSlots /*&& this.stoped*/) {
            if (winArray[0] > 0) {
                this.setAnimationMoveWinSymbol(this.indexUp, fire, spark);
            } else if (winArray[1] > 0) {
                this.setAnimationMoveWinSymbol(this.indexMiddleSymbol, fire, spark);
            } else if (winArray[2] > 0) {
                this.setAnimationMoveWinSymbol(this.indexDown, fire, spark);
            } else {
                this.onMoveWinEndObservable.notifyObservers(true);
            }
        }
    }

    updated () {
        let _this = this;
        this.scene.registerBeforeRender(function () {
            let deltaTime = _this.scene.getEngine().getDeltaTime() * 0.01;
            if (_this.rotateSlots) {
                _this.CoT.rotation.x += deltaTime;
            }

            if (!_this.endRotate && _this.CoT.rotation.x >= _this.section * _this.indexSection) {
                // console.time();
                let angle = _this.section * ((_this.numSymbolPerReel - _this.angles.length + 1) + _this.indexSymbol) - _this.CoT.rotation.x;
                let deltaA = _this.CoT.rotation.x - _this.section * _this.indexSection;
                _this.meshes[_this.indexSymbol].rotation.x = angle + deltaA;
                if (_this.indexSymbol < 4) {
                    _this.indexSymbol++;
                } else {
                    _this.indexSymbol = 0;
                }
                if (_this.indexSection < _this.numSymbolPerReel) {
                    _this.indexSection++;
                } else {
                    _this.indexSection = 1;
                }
                // console.timeEnd();
            }

            if (_this.CoT.rotation.x > Math.PI * 2) {
                _this.CoT.rotation.x -= Math.PI * 2;
            }
        })
    }
}