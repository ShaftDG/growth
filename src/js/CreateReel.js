
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
import {Observable} from "@babylonjs/core/Misc/observable";

export default class CreateReel {
    constructor(angles, radius, section, numSymbolPerReel, positionReel, ins, baseURL, assetsManager, scene) {
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
        this.beginStop = false;
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
        let meshTaskWild = assetsManager.addMeshTask('bell', '', baseURL + 'assets/models/tmp/', 'wild_final_Draco.glb');
        symbols[2] = meshTaskWild;
        meshTaskWild.onSuccess = function (task) {
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
            v.visibleSymbol.animations = [];
            v.visibleSymbol._children[0].animations = [];

            v.visibleSymbol._children[0].position = new Vector3(0,0,0);
            v.visibleSymbol._children[0].rotation = new Vector3(0,0,0);
            // v.visibleSymbol._children[0].scaling = v.visibleSymbol.defaultScaling.clone();
        });

        this.moveWinS = false;
        this.endRotate = false;
        this.stoped = false;
        this.beginStop = false;
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
            function dropSymbol() {
                thatMeshes.map(v => {
                    v._symbols[0].loadedAnimationGroups[0].start(false);
                    v._symbols[3].loadedAnimationGroups[0].start(false);
                    v._symbols[4].loadedAnimationGroups[0].start(false);
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

            this.beginStop = true;
        }
    }

    setAnimationMoveWinSymbol (index, fire) {

        let that = this;
        function stopedCallback() {
            that.onMoveWinEndObservable.notifyObservers(true);
            fire.stop();
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

    moveWinSymbols (winArray, fire) {
        if (!this.rotateSlots && this.stoped) {
            if (winArray[0] > 0) {
                this.setAnimationMoveWinSymbol(this.indexUp, fire);
            } else if (winArray[1] > 0) {
                this.setAnimationMoveWinSymbol(this.indexMiddleSymbol, fire);
            } else if (winArray[2] > 0) {
                this.setAnimationMoveWinSymbol(this.indexDown, fire);
            } else {
                this.onMoveWinEndObservable.notifyObservers(true);
            }
        }
    }

    update (deltaTime) {

        if (this.rotateSlots) {
            this.CoT.rotation.x += deltaTime;
        }

        if (!this.endRotate && this.CoT.rotation.x >= this.section * this.indexSection) {
            // console.time();
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
            // console.timeEnd();
        }

        if (this.CoT.rotation.x > Math.PI * 2) {
            this.CoT.rotation.x -= Math.PI * 2;
        }

    }
}