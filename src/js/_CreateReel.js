import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { Axis } from '@babylonjs/core/Maths/math.axis';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

import AnimationScalePulse from "./AnimationScalePulse";
import AnimationStopReels from "./AnimationStopReels";
import {Observable} from "@babylonjs/core/Misc/observable";

export default class _CreateReel {
    constructor(name, symbols, angles, radius, section, numSymbolPerReel, positionReel, ins, scene) {
        this.radius = radius;
        this.scene = scene;
        this.CoT = new TransformNode("CoT_" + name);
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
                CoTSector._symbols = [];
                let CoTSector_child = new TransformNode("CoTSector_child");
                CoTSector_child.parent = CoTSector;
                for (let j = 0; j < symbols.length; j++) {
                    let entry = this._duplicateModel(symbols[j].loadedContainer, name + "_" + j);
                    this._updateSettings(entry, positionReel, i, CoTSector_child);
                    CoTSector._symbols.push(entry);
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

    _duplicateModel(container, nameSymb) {
        let entries = container.instantiateModelsToScene(name => nameSymb + "-" + name, true);

        return entries
    };

    _updateSettings(entry, positionReel, index, parent) {
        for (var node of entry.rootNodes) {
            let z = this.radius * Math.cos(this.angles[index]);
            let y = this.radius * Math.sin(this.angles[index]);
            node.rotate(Axis.X, this.angles[index], Mesh.WORLD);
            node.scaling = new Vector3(4, 4, -4);
            node.position = new Vector3(positionReel.x, y, z);
            node.defaultScaling = new Vector3(node.scaling.x, node.scaling.y, node.scaling.z);
            node.parent = parent;
            node.setEnabled(false);
        }
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
                    v._symbols[0].animationGroups[0].start(false);
                    v._symbols[3].animationGroups[0].start(false);
                    v._symbols[4].animationGroups[0].start(false);

                    v._symbols[2].animationGroups.map( g => {g.start(false, 1.18) });

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

        if (this.meshes[index].visibleSymbol._children[0].name.split('-')[1] === "wild") {
            spark.setEmitterPosition(this.meshes[index].visibleSymbol.getChildMeshes()[0]);
            spark.start();
        } else {
            fire.setEmitterPosition(this.meshes[index].visibleSymbol.getChildMeshes()[0]);
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