
import {Axis, Mesh, Scalar, TransformNode, Vector3} from '@babylonjs/core';
import AnimationScalePulse from "./AnimationScalePulse";
import AnimationStopReels from "./AnimationStopReels";

export default class CreateReel {
    constructor(symbols, angles, radius, section, numSymbolPerReel, positionReel, scene) {
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
            for (var i = 0; i < 5; i++) {
                let CoTSector = new TransformNode("CoTSector");
                let CoTSector_child = new TransformNode("CoTSector_child");
                CoTSector_child.parent = CoTSector;
                // for (let j = 0; j < symbols.length; j++) {
                    let obj = symbols[/*Math.round(Scalar.RandomRange(0, 6))*/7].clone();
                    let z = radius * Math.cos(this.angles[i]);
                    let y = radius * Math.sin(this.angles[i]);
                    obj.rotate(Axis.X, this.angles[i], Mesh.WORLD);
                    obj.position = new Vector3(positionReel.x, y, z);
                    obj.parent = CoTSector_child;
                    // obj.setEnabled(false);
                // }
                // let randomIndexSymbol = Math.round(BABYLON.Scalar.RandomRange(0, 6));
                // CoTSector._children[randomIndexSymbol].setEnabled(true);
                CoTSector.parent = this.CoT;
                this.meshes.push(CoTSector);
            }
            this.meshes[0].setEnabled(false);
            this.meshes[4].setEnabled(false);
        this.endRotate = false;
        this.rotateSlots = false;
    }

    setVisibleSymbol(object, indexSymbol) {
        object._children.map(g => {
            g.setEnabled(false);
        });
        object._children[indexSymbol].setEnabled(true);
    }

    replaceSymbol(object, index, indexSymbol) {

        object._children[0]._children[0].animation = [];
        object._children[0]._children[0].dispose();

        let obj = this.symbols[indexSymbol].clone();
        let z = this.radius * Math.cos(this.angles[index]);
        let y = this.radius * Math.sin(this.angles[index]);
        obj.rotate(Axis.X, this.angles[index], Mesh.WORLD);
        obj.position = new Vector3(this.positionReel.x, y, z);
        obj.parent = object._children[0];
    }
    setVisibleSymbol(object, indexSymbol) {
        object._children.map(g => {
            g.setEnabled(false);
        });
        object._children[indexSymbol].setEnabled(true);
    }

    setVisibleSymbols(arrayObects, indexMiddleSymbol, reelCombination) {
        this.indexUp = indexMiddleSymbol + 1 <= 4 ? indexMiddleSymbol + 1 : 0;
        this.indexDown = indexMiddleSymbol - 1 >= 0 ? indexMiddleSymbol - 1 : 4;


        this.replaceSymbol(arrayObects[this.indexUp], this.indexUp, reelCombination[0]);
        this.replaceSymbol(arrayObects[indexMiddleSymbol], indexMiddleSymbol, reelCombination[1]);
        this.replaceSymbol(arrayObects[this.indexDown], this.indexDown, reelCombination[2])
        // this.setVisibleSymbol(arrayObects[indexUp], reelCombination[0]);
        // this.setVisibleSymbol(arrayObects[indexMiddleSymbol], reelCombination[1]);
        // this.setVisibleSymbol(arrayObects[indexDown], reelCombination[2]);
    }

    startRotate (rotateSlots, stopSymbols) {
        this.rotateSlots = rotateSlots;
        this.meshes.map(v => {
            v.setEnabled(true);
            // let randomIndexSymbol = Math.round(BABYLON.Scalar.RandomRange(0, 6));
            // v._children.map(g => {
            //     g.setEnabled(false);
            // });
            // v._children[randomIndexSymbol].setEnabled(true);
        });
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

    setAnimationMoveWinSymbol (index, callback) {
        this.moveWinS = true;
        let that = this;
        function stopedCallback() {
            that.moveWinS = false;
            callback()
        }
        // this.meshes[index]._children[0].translate(Axis.Z, 20, Space.WORLD);
        let invertParentWorldMatrix = this.meshes[index].getWorldMatrix().clone();
        invertParentWorldMatrix.invert();
        let absolutePosition = this.meshes[index]._children[0].getAbsolutePosition();
        let worldPosition = new Vector3(absolutePosition.x, absolutePosition.y, absolutePosition.z - 2);
        let position = Vector3.TransformCoordinates(worldPosition, invertParentWorldMatrix);
        console.log( this.meshes[index]._children[0]._children[0].id)
        AnimationScalePulse.call(this.meshes[index]._children[0],
            new Vector3(-0.1,-0.1,-0.1),
            position,
            60,
            stopedCallback,
            this.scene
        );
    }

    moveWinSymbols (winArray, callback) {
        if (!this.rotateSlots && this.stoped) {

            // console.log(winArray)
            // winArray.map((v, i) => {
               if (winArray[0] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexUp, callback);
               } else if (winArray[1] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexMiddleSymbol, callback);
               } else if (winArray[2] > 0) {
                   this.setAnimationMoveWinSymbol(this.indexDown, callback);
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
        }

        if (this.CoT.rotation.x > Math.PI * 2) {
            this.CoT.rotation.x -= Math.PI * 2;
        }
    }
}