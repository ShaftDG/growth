import { Curve3, Path3D, Scalar } from 'babylonjs';

export default class GrowthPath3D {
    constructor(pointsInner, numSegment, numPointsperInterval, distanceSprouts, offSetSprouts, intervalTime, plantDyingOff, plantDeath, scale, scene) {
       this.offSetSprouts = offSetSprouts || 20;
       this.numSegment = numSegment || 7;
       this.numPointsperInterval = numPointsperInterval || 7;
       // this.beginPoint = beginPoint || new BABYLON.Vector3(0, 0, 0);
       // this.endPoint = endPoint || new BABYLON.Vector3(0, 50, 0);
       this.pointsInner = pointsInner;
       this.distanceSprouts = distanceSprouts || 0.3;
       this.moveSprouts = false;
       this.scene = scene;
       this.start = false;
       this.reverse = false;
       this.plantDyingOff = plantDyingOff !== undefined ? plantDyingOff : true;
       this.plantDeath = plantDeath !== undefined ? plantDeath : true;
       this.deathLeaf = false;
       this.deathStem = false;
       this.index = 0;
       this.time = 0.001;
       this.intervalTime = intervalTime || 0.15;
       this.ended = false;
       this.started = false;
       this.scale = scale || 0.3;
       this.sprouts = [];
       this.tempLength = 0;
       this.resetGrowth();
    }

    setLeaf (leaf) {
        for (let j = this.offSetSprouts + 1; j < this.pointsTemplate.length - this.offSetSprouts; j++) {
            let sphere = leaf.clone();
            var manager = new BABYLON.MorphTargetManager();
            sphere._children[0].morphTargetManager = manager;

            let target = new BABYLON.MorphTarget('_' + (this.sprouts.length - 1), 1);
            target.setPositions(...leaf._children[0].morphTargetManager._targets[0]._positions);
            target.setNormals(...leaf._children[0].morphTargetManager._targets[0]._normals);
            target.setTangents(...leaf._children[0].morphTargetManager._targets[0]._tangents);
            manager.addTarget(target);

            sphere._children[0].material = leaf._children[0].material.clone();
            sphere._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(0.75, 1.0), BABYLON.Scalar.RandomRange(0.5, 1.25), BABYLON.Scalar.RandomRange(0.25, 0.5))
            sphere._children[0].material.albedoColor = sphere._children[0].material.albedoColor.scale(BABYLON.Scalar.RandomRange(0.5, 2));

            sphere.animationGroup = new BABYLON.AnimationGroup('animationGroupLeaves_' + (this.sprouts.length - 1));
            let animation = this.scene.animationGroups[0].targetedAnimations[0].animation.clone();
            let targetAnimation = sphere._children[0].morphTargetManager.getTarget(0);
            animation.name += '_' + (this.sprouts.length - 1);

            sphere.animationGroup.addTargetedAnimation(animation, targetAnimation);
            sphere.setEnabled(false);
            this.sprouts.push(sphere);
        }
    }

    getPath() {
        return this.curve
    }

    resetGrowth() {
        let vv = [];
        for (let k = 1; k <  this.pointsInner.length; k++) {
            let l = this.pointsInner[k-1].subtract(this.pointsInner[k]).length();
            let pathDirection = new Path3D([this.pointsInner[k-1], this.pointsInner[k]]);
            var tgtsDirection = pathDirection.getTangents();
            var binormsDirection = pathDirection.getBinormals();

            var matrix1 = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
            var v1 = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0].scale(l * 0.075).add(binormsDirection[0].scale(l * Scalar.RandomRange(0.06, 0.1))), matrix1).add(this.pointsInner[k-1]);
            vv.push(v1);
            let num = this.numPointsperInterval;
            let f = (1 / (num)).toFixed(2);
            for (let i = 1; i < num; i++) {
                var matrix = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
                var v = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0]
                    .scale(l * i * f)
                    .add(binormsDirection[0]
                        .scale(l * Scalar.RandomRange(0.025, 0.035))), matrix)
                    .add(this.pointsInner[k-1]);
                vv.push(v)
            }

            var matrix8 = BABYLON.Matrix.RotationAxis(tgtsDirection[0], Math.random() * 100);
            var v8 = BABYLON.Vector3.TransformCoordinates(tgtsDirection[0].scale(l * 0.95).add(binormsDirection[0].scale(l * Scalar.RandomRange(0.1, 0.14))), matrix8).add(this.pointsInner[k-1]);
            vv.push(v8);
        }
        // let vcTgt0 = BABYLON.Mesh.CreateLines("tgt", [this.beginPoint, this.endPoint], this.scene);
        // let vcTgt = BABYLON.Mesh.CreateLines("tgt", [tgtsDirection[0].scale(l * 0.2), v1], this.scene);
        // let vcTgt1 = BABYLON.Mesh.CreateLines("tgt", [tgtsDirection[0].scale(l * 0.4), v2], this.scene);
        // vcTgt.color = BABYLON.Color3.Blue();
        // vcTgt1.color = BABYLON.Color3.Green();
        // vcTgt0.color = BABYLON.Color3.Black();

        this.totalLength = 0;
        this.tempLength = 0;
        let p = [
            this.pointsInner[0],
            ...vv,
            this.pointsInner[this.pointsInner.length - 1]
        ];

        let ww = [];
        ww.push(this.pointsInner[0])
        for (let j = 1; j < p.length; j++) {
            ww.push(this.pointsInner[0])
        }
        // this.totalLength += (num + 2.5) * 0.1;

        var catmullRom = Curve3.CreateCatmullRomSpline(ww, this.numSegment);

        var catmullRomTemplate = Curve3.CreateCatmullRomSpline(p, this.numSegment);

        this.points = catmullRom.getPoints();
        this.tempPoints = catmullRom.getPoints();

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
        this.started = true;
        this.ended = false;
    }

    updatePath(deltaTime) {
        if (this.start) {
            var tgtsTemplate = this.path3dTemplate.getTangents();
            if (this.index < this.pointsTemplate.length - 1) {
                if (this.intervalTime > 0.15) {
                    let lTemplate = this.pointsTemplate[this.index].subtract(this.pointsTemplate[this.index-1]).length();
                    let l = this.points[this.index].subtract(this.points[this.index-1]).length();
                    if (l < lTemplate) {
                        let tempVector = this.points[this.index].add(tgtsTemplate[this.index].normalize().scale(deltaTime));
                        let lNext = tempVector.subtract(this.points[this.index-1]).length();
                        if (lNext < lTemplate) {
                            for (var i = this.index; i < this.points.length; i++) {
                                this.points[i].addInPlace(tgtsTemplate[this.index].normalize().scale(deltaTime));
                            }
                        } else {
                            for (var i = this.index; i < this.points.length; i++) {
                                this.points[i] = this.pointsTemplate[this.index].clone();
                                this.tempPoints[i] = this.pointsTemplate[this.index].clone();
                            }
                        }
                    } else {
                        if (this.index < this.pointsTemplate.length - 1) {
                            this.index++;
                            this.enableSprouts = false;
                        }
                    }
                } else {
                    for (var i = this.index; i < this.points.length; i++) {
                        this.points[i] = this.pointsTemplate[this.index].clone();
                    }
                    if (this.time < this.intervalTime) {
                        this.time += deltaTime;
                    } else {
                        this.index++;
                        this.time = 0.001;
                    }
                }
            } else {
                this.start = false;
                if (this.plantDyingOff) {
                    this.reverse = true;
                } else if (this.plantDeath) {
                    this.deathStem = true;
                    this.deathLeaf = true;
                } else {
                    this.started = false;
                    this.ended = true;
                }

                this.index = 1;
            }

            this.curve = this.points;
        }
    }

    updatePathReverse (deltaTime) {
        if (this.reverse) {
            if (this.index < this.pointsTemplate.length - 1) {
                this.tempLength += this.pointsTemplate[this.index - 1].subtract(this.pointsTemplate[this.index]).length();
                for (var i = 0; i <= this.index; i++) {
                    this.points[i] = this.pointsTemplate[this.index].clone();
                }

                    if (this.time < this.intervalTime) {
                        this.time += deltaTime;
                    } else {
                        this.index++;
                        this.time = 0.001;
                    }
            } else {
                this.reverse = false;
                this.started = false;
                this.ended = true;
            }

            this.curve = this.points;
        }
    }

    // updateDeath (deltaTime) {
    //     if (this.reverse) {
    //         // var tgtsTemplate = this.path3dTemplate.getTangents();
    //         if (this.index < this.pointsTemplate.length - 1) {
    //             for (var i = this.points.length - 1; i > this.points.length - this.index; i--) {
    //                 this.points[i] = this.pointsTemplate[this.index].clone();
    //             }
    //
    //             if (this.time < this.intervalTime) {
    //                 this.time += deltaTime;
    //             } else {
    //                 this.index++;
    //                 this.time = 0.001;
    //             }
    //         } else {
    //             this.reverse = false;
    //             this.started = false;
    //             this.ended = true;
    //         }
    //
    //         this.curve = this.points;
    //     }
    // }

    updateMoveSprouts (deltaTime) {
        this.sprouts.map(g => {
            if (g.directionIndex && g.directionIndex < this.points.length - 1) {
                let p = [...this.points];
                if (this.reverse) {
                    p.reverse();
                }
                let dir = p[g.directionIndex + 1].subtract(p[g.directionIndex]).normalize();

                let lTemplate = p[g.directionIndex + 1].subtract(p[g.directionIndex]).length();
                let l = g.position.subtract(p[g.directionIndex]).length();

                // g.position.addInPlace(dir.scale(deltaTime * this.deltaMoveSprouts));
                if (l < lTemplate) {
                    if (this.start) {
                        g.position.addInPlace(dir.scale(deltaTime * this.deltaMoveSprouts));
                    } else /*if (!this.reverse)*/ {
                        if (this.deltaMoveSprouts > 0) {
                            this.deltaMoveSprouts -= deltaTime * 0.00005;
                            g.position.addInPlace(dir.scale(deltaTime * this.deltaMoveSprouts));
                        } else {
                            this.moveSprouts = false;
                        }
                    }
                } else {
                    if (g.directionIndex < this.points.length - 1) {
                        g.directionIndex++
                    }
                }
            }
        });
    }
}