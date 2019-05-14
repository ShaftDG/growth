import { Curve3, Path3D, Scalar } from 'babylonjs';

export default class GrowthPath3D {
    constructor(beginPoint, endPoint, numSegment, distanceSprouts, intervalTime, scene) {
       this.numSegment = numSegment || 7;
       this.beginPoint = beginPoint || new BABYLON.Vector3(0, 0, 0);
       this.endPoint = endPoint || new BABYLON.Vector3(0, 50, 0);
       this.distanceSprouts = distanceSprouts || 0.3;
       this.enableSprouts = false;
       this.moveSprouts = false;
       this.scene = scene;
       this.start = false;
       this.reverse = false;
       this.index = 0;
       this.time = 0;
       this.intervalTime = intervalTime || 0.15;
       this.resetGrowth();
    }

    getPath() {
        return this.curve
    }

    resetGrowth() {
        let l = this.endPoint.subtract(this.beginPoint).length();
        let pathDirection = new Path3D([this.beginPoint, this.endPoint]);
        var tgtsDirection = pathDirection.getTangents();
        var binormsDirection = pathDirection.getBinormals();

        let vv = [];

        var matrix1 = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
        var v1 = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0].scale(l * 0.075).add(binormsDirection[0].scale(l * Scalar.RandomRange(0.04, 0.08))), matrix1).add(this.beginPoint);
        vv.push(v1);
        let num = 7;
        let k = (1 / (num)).toFixed(2);
        for (let i = 1; i < num; i++) {
            var matrix = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
            var v = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0]
                .scale(l * i * k)
                .add(binormsDirection[0]
                    .scale(l * Scalar.RandomRange(0.015, 0.03))), matrix)
                .add(this.beginPoint);
            vv.push(v)
        }

        var matrix8 = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
        var v8 = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0].scale(l * 0.95).add(binormsDirection[0].scale(l * Scalar.RandomRange(0.04, 0.08))), matrix8).add(this.beginPoint);
        vv.push(v8);

        // let vcTgt0 = BABYLON.Mesh.CreateLines("tgt", [this.beginPoint, this.endPoint], this.scene);
        // let vcTgt = BABYLON.Mesh.CreateLines("tgt", [tgtsDirection[0].scale(l * 0.2), v1], this.scene);
        // let vcTgt1 = BABYLON.Mesh.CreateLines("tgt", [tgtsDirection[0].scale(l * 0.4), v2], this.scene);
        // vcTgt.color = BABYLON.Color3.Blue();
        // vcTgt1.color = BABYLON.Color3.Green();
        // vcTgt0.color = BABYLON.Color3.Black();

        this.totalLength = 0;

        let p = [
            this.beginPoint,
            ...vv,
            this.endPoint
        ];

        let ww = [];
        ww.push(this.beginPoint)
        for (let j = 1; j < p.length; j++) {
            ww.push(this.beginPoint)
        }
        // this.totalLength += (num + 2.5) * 0.1;

        var catmullRom = Curve3.CreateCatmullRomSpline(ww, this.numSegment);

        var catmullRomTemplate = Curve3.CreateCatmullRomSpline(p, this.numSegment);

        this.points = catmullRom.getPoints();

        this.pointsTemplate = catmullRomTemplate.getPoints();

        this.path3d = new Path3D(this.points);
        this.path3dTemplate = new Path3D(this.pointsTemplate);

        // let x = this.path3dTemplate.getCurve();
        for (let j = 1; j < this.pointsTemplate.length; j++) {
            this.totalLength += this.pointsTemplate[j-1].subtract(this.pointsTemplate[j]).length();
        }

        this.curve = this.path3d.getCurve();
        this.index = 1;
        this.start = false;
    }

    startGrowth() {
        this.resetGrowth();
        this.start = true;
        this.moveSprouts = true;
    }

    updatePath(deltaTime) {
        if (this.start) {
            var tgtsTemplate = this.path3dTemplate.getTangents();
            if (this.index < this.pointsTemplate.length - 1) {
                if (this.intervalTime > 0.15) {
                    let lTemplate = this.pointsTemplate[this.index].subtract(this.pointsTemplate[this.index-1]).length();
                    let l = this.points[this.index].subtract(this.points[this.index-1]).length();
                    if (this.index > 3 && this.index < this.points.length - 4) {
                        let ll = this.points[this.index].subtract(this.points[this.index - 1]).length();
                        if (ll > this.distanceSprouts) {
                            this.enableSprouts = true;
                        } else {
                            this.enableSprouts = false;
                        }
                    }
                    if (l < lTemplate) {
                        let tempVector = this.points[this.index].add(tgtsTemplate[this.index].normalize().scale(deltaTime));
                        let lNext = tempVector.subtract(this.points[this.index-1]).length();
                        if (lNext < lTemplate) {
                            console.log(tempVector)
                            for (var i = this.index; i < this.points.length; i++) {
                                this.points[i].addInPlace(tgtsTemplate[this.index].normalize().scale(deltaTime));
                            }
                        } else {
                            for (var i = this.index; i < this.points.length; i++) {
                                this.points[i] = this.pointsTemplate[this.index].clone();
                            }
                        }
                    } else {
                        if (this.index < this.pointsTemplate.length - 1) {
                            this.index++;
                            // if (this.index % 2 === 0) {
                                this.enableSprouts = false;
                            // }
                        }
                    }
                } else {
                    for (var i = this.index; i < this.points.length; i++) {
                        this.points[i] = this.pointsTemplate[this.index].clone();
                    }
                    if (this.time < this.intervalTime) {
                        this.time += deltaTime;
                        this.enableSprouts = false;
                    } else {
                        this.index++;
                        this.time = 0;
                        if (this.index > 6 && this.index < this.points.length - 7) {
                                this.enableSprouts = true;
                        } else {
                            this.enableSprouts = false;
                        }
                    }
                }
            } else {
                this.start = false;
                this.reverse = true;
                this.points.reverse();
                this.index = 1;
            }

            this.curve = this.points;
        }
    }

    updatePathReverse(deltaTime) {
        if (this.reverse) {
            var tgtsTemplate = this.path3dTemplate.getTangents();
            if (this.index < this.pointsTemplate.length - 1) {
                if (this.intervalTime > 0.15) {
                    // let lTemplate = this.pointsTemplate[this.index].subtract(this.pointsTemplate[this.index-1]).length();
                    // let l = this.points[this.index].subtract(this.points[this.index-1]).length();
                    // if (this.index > 3 && this.index < this.points.length - 4) {
                    //     let ll = this.points[this.index].subtract(this.points[this.index - 1]).length();
                    //     if (ll > this.distanceSprouts) {
                    //         this.enableSprouts = true;
                    //     } else {
                    //         this.enableSprouts = false;
                    //     }
                    // }
                    // if (l < lTemplate) {
                    //     let tempVector = this.points[this.index].add(tgtsTemplate[this.index].normalize().scale(deltaTime));
                    //     let lNext = tempVector.subtract(this.points[this.index-1]).length();
                    //     if (lNext < lTemplate) {
                    //         console.log(tempVector)
                    //         for (var i = this.index; i < this.points.length; i++) {
                    //             this.points[i].addInPlace(tgtsTemplate[this.index].normalize().scale(deltaTime));
                    //         }
                    //     } else {
                    //         for (var i = this.index; i < this.points.length; i++) {
                    //             this.points[i] = this.pointsTemplate[this.index].clone();
                    //         }
                    //     }
                    // } else {
                    //     if (this.index < this.pointsTemplate.length - 1) {
                    //         this.index++;
                    //         // if (this.index % 2 === 0) {
                    //         this.enableSprouts = false;
                    //         // }
                    //     }
                    // }
                } else {
                    for (var i = this.points.length - 1; i > this.points.length - this.index; i--) {
                        this.points[i] = this.pointsTemplate[this.index].clone();
                    }

                    if (this.time < this.intervalTime) {
                        this.time += deltaTime;
                        // this.enableSprouts = false;
                    } else {
                        this.index++;
                        this.time = 0;
                    }
                }
            } else {
                this.reverse = false;
            }

            this.curve = this.points;
        }
    }
}