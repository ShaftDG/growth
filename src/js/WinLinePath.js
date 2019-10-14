import {
    Path3D,
    Color3,
    Matrix,
    Vector3,
    MeshBuilder
} from '@babylonjs/core';
import {PBRMaterial} from "@babylonjs/core/index";

export default class WinLinePath {
    constructor(
        pointsInner,
        intervalTime,
        reverse,
        scene
    ) {
        this.pointsInner = pointsInner;
        this.scene = scene;
        this.start = false;
        this.reverse = reverse !== undefined ? reverse : false;
        this.index = 1;
        this.indexLine = 1;
        this.intervalTime = intervalTime || 0.15;
        this.ended = false;
        this.started = false;
        this.tempLength = 0;
        this.resetGrowth();
    }

    getPath() {
        this.points = this.curve;
        return this.curve
    }

    getPoints() {
        return this.pointsTemplate
    }

    setPointsInner (pointsInner) {
        this.pointsInner = pointsInner;
    }

    resetGrowth() {
        let vv = [];
        for (let k = 1; k <  this.pointsInner.length; k++) {
            let l = this.pointsInner[k-1].subtract(this.pointsInner[k]).length();
            let pathDirection = new Path3D([this.pointsInner[k-1], this.pointsInner[k]]);
            var tgtsDirection = pathDirection.getTangents();
            var v1 = this.pointsInner[k-1];
            vv.push(v1);
            let f = l * this.intervalTime;
            let num = l / f;
            for (let i = 1; i < num; i++) {
                var matrix = Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
                var v = Vector3.TransformCoordinates(tgtsDirection[0]
                    .scale(i * f), matrix)
                    .add(this.pointsInner[k-1]);

                // let sphere = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, this.scene);
                // sphere.position = v;
                // let sphereMaterial = new PBRMaterial('tubeMaterial', this.scene);
                // sphereMaterial.emissiveColor = new Color3(1.0, 0.5, 0.25);
                // sphere.material = sphereMaterial;

                vv.push(v)
            }
        }

        this.tempLength = 0;
        let p = [
            ...vv,
            this.pointsInner[this.pointsInner.length - 1]
        ];

        let ww = [];
        ww.push(this.pointsInner[0]);
        for (let j = 1; j < this.pointsInner.length; j++) {
            ww.push(this.pointsInner[0])
        }
        this.points = ww;
        this.pointsLength = ww.length;

        this.pointsTemplate = p;

        this.curve = new Path3D(this.points).getCurve();
        this.index = 1;
        this.indexLine = 1;
        this.start = false;
    }

    startGrowth() {
        this.started = true;
        this.ended = false;
        // this.resetGrowth();
        this.start = true;
    }

    startGrowthReverse() {
        this.started = true;
        this.ended = false;
        this.reverse = true;
    }

    updatePath() {
        if (this.start) {
            if (this.index < this.pointsTemplate.length) {
                    for (var i = this.indexLine; i < this.pointsLength; i++) {
                        this.points[i] = this.pointsTemplate[this.index].clone();
                    }
                    this.index++;
                    if (this.pointsInner[this.indexLine].equals(this.points[this.indexLine])) {
                        this.indexLine++;
                    }
            } else {
                this.start = false;
                this.index = this.pointsTemplate.length - 1;
                this.indexLine = this.pointsLength - 1;
                if (!this.reverse) {
                    this.started = false;
                    this.ended = true;
                    this.index = 1;
                    this.indexLine = 1;
                }
            }
            this.curve = this.points;
        }
    }

    updatePathReverse () {
        if (this.reverse) {
            if (this.index > 0) {
                for (var i = this.indexLine; i < this.pointsLength; i++) {
                    this.points[i] = this.pointsTemplate[this.index].clone();
                }
                this.index--;

                if (this.pointsInner[this.indexLine-1].equals(this.points[this.indexLine])) {
                    this.indexLine--;
                }
            } else {
                this.started = false;
                this.ended = true;
                this.index = 1;
                this.indexLine = 1;
            }

            this.curve = this.points;
        }
    }
}