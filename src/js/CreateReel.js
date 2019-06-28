
import {} from 'babylonjs';
import AnimationStopReels from "./AnimationStopReels";

export default class CreateReel {
    constructor(symbols, angles, radius, section, numSymbolPerReel, positionReel, scene) {
        this.scene = scene;
        this.CoT = new BABYLON.TransformNode("CoT");
        this.CoT.position.y = 10;
        this.section = section;
        this.indexSymbol = 0;
        this.indexSection = 1;
        this.numSymbolPerReel = numSymbolPerReel;
        this.meshes = [];
        this.stoped = true;
        this.beginStop = false;
        this.angles = angles;
            for (var i = 0; i < 5; i++) {
                let CoTSector = new BABYLON.TransformNode("CoTSector");
                // console.log(Math.round(BABYLON.Scalar.RandomRange(0, 6)));
                let obj = symbols[Math.round(BABYLON.Scalar.RandomRange(0, 6))].clone();
                // obj._children[0]._children[0]._children[0].material = task.loadedMeshes[0]._children[0]._children[0]._children[0].material.clone();
                // obj._children[0]._children[0]._children[0].material.albedoColor = new BABYLON.Color3(2, 2, 2);
                let z = radius * Math.cos(this.angles[i]);
                let y = radius * Math.sin(this.angles[i]);
                obj.rotate(BABYLON.Axis.X, this.angles[i], BABYLON.Mesh.WORLD);
                obj.position = new BABYLON.Vector3(positionReel.x, y, z);
                obj.parent = CoTSector;
                CoTSector.parent = this.CoT;
                this.meshes.push(CoTSector);
            }
            this.meshes[0].setEnabled(false);
            this.meshes[4].setEnabled(false);
        this.endRotate = false;
        this.rotateSlots = false;
    }

    stopedCallback() {
        this.stoped = true;
        console.log("!111111!!!!!", this.stoped);
    }

    startRotate (rotateSlots) {
        this.rotateSlots = rotateSlots;
        this.meshes.map(v => {
            v.setEnabled(true);
        });
        this.endRotate = false;
        this.stoped = false;
        this.beginStop = false;
    }
    stopRotate (rotateSlots) {
        this.rotateSlots = rotateSlots;
        if (!this.rotateSlots && !this.beginStop) {
            this.endRotate = true;
            this.CoT.rotation.x = this.section * (this.indexSection - 3);
            let firstIndex = this.indexSymbol - 1 < 0 ? 4 : this.indexSymbol - 1;
            let lastIndex = firstIndex + 1 > 4 ? 0 : firstIndex + 1;
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
                new BABYLON.Vector3(this.section * (this.indexSection - 1),0,0),
                150,
                unvisibleUp,
                unvisibleDown,
                stopedCallback,
                this.scene
            );
            this.beginStop = true;
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
            if (this.indexSection < 20) {
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