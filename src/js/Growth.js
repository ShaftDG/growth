import GrowthPath3D from "./GrowthPath3D";
import {} from 'babylonjs';
import AnimationDiameterStem from "./AnimationDiameterStem";
import AnimationLeafDeath from "./AnimationLeafDeath";
export default class Growth {
    constructor(
        points,
        numTubes,
        sectionPoints,
        numSegmentPerPoint,
        numPointsperInterval,
        distanceSprouts,
        offSetSprouts,
        diameter,
        scale,
        intervalTime,
        deltaMoveSprouts,
        dotIterationStep,
        plantDyingOff,
        plantDeath,
        tubeMaterial,
        assetsManager,
        scene
    ) {

        this.offSetSprouts = offSetSprouts || 20;
        this.scene = scene;
        this.numTubes = numTubes || 1;
        this.sectionPoints = sectionPoints || 3;
        this.numSegmentPerPoint = numSegmentPerPoint || 8;
        this.numPointsperInterval = numPointsperInterval || 7;
        this.intervalTime = intervalTime || 0.15;
        this.distanceSprouts = distanceSprouts || 0.01;
        this.deltaMoveSprouts = deltaMoveSprouts || 0.015;
        this.dotIterationStep = dotIterationStep || 1;
        this.plantDyingOff = plantDyingOff !== undefined ? plantDyingOff : true;
        this.plantDeath = plantDeath !== undefined ? plantDeath : true;
        this.started = false;
        this.ended = false;
        this.diameter = diameter || 0.02;
        this.scale = scale || 0.3;

        this.tubeMaterial = tubeMaterial;
        this.leaf = null;

        this.objectsCurve = [];
        
        for (let i = 0; i < this.numTubes; i++) {
            // let randomX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
            // let randomY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
            // let randomZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();
            //
            // let randomXX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
            // let randomYY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
            // let randomZZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();

            let objCurve = new GrowthPath3D(
                // beginPoint.subtract(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomX, randomY, randomZ).scale(0.75)),
                // endPoint.add(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomXX, randomYY, randomZZ).scale(0.75)),
                points,
                this.numSegmentPerPoint,
                this.numPointsperInterval,
                this.dotIterationStep,
                this.distanceSprouts,
                this.offSetSprouts,
                this.intervalTime,
                this.plantDyingOff,
                this.plantDeath,
                this.scale,
                this.scene);
            this.objectsCurve.push(objCurve);
            let curve = objCurve.getPath();

            var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, 0.1, this.sectionPoints, null, BABYLON.Mesh.NO_CAP, this.scene, true, BABYLON.Mesh.FRONTSIDE,);
            tube.setEnabled(false);
            objCurve.diameter = BABYLON.Scalar.RandomRange(this.diameter - 0.01, this.diameter + 0.01);
            objCurve.deltaMoveSprouts = this.deltaMoveSprouts;
            objCurve.tube = tube;
            tube.material = this.tubeMaterial;
        }
    }

    setLeaf (leaf) {
        this.objectsCurve.map(v => {
            v.setLeaf(leaf);
        });
    }

    startGrowth () {
        this.started = true;
        this.ended = false;

        this.objectsCurve.map(v => {
            v.start = false;
            v.reverse = false;
            v.plantDeath = false;
            v.tube.dispose();
            v.deltaMoveSprouts = this.deltaMoveSprouts;
            v.sprouts.map(g => {
                g.setEnabled(false);
                g.animationGroup.stop();
                g._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(0.75, 1.0), BABYLON.Scalar.RandomRange(0.5, 1.25), BABYLON.Scalar.RandomRange(0.25, 0.5))
                g._children[0].material.albedoColor = g._children[0].material.albedoColor.scale(BABYLON.Scalar.RandomRange(0.5, 2));
            });
            v.diameter = BABYLON.Scalar.RandomRange(this.diameter - 0.0025, this.diameter + 0.01);
            // v.animations = [];
            v.startGrowth();
        });
    }

    update (deltaTime) {
        let tempCount = 0;
        if (this.started) {
            this.objectsCurve.map((v, i) => {
                if (v.start) {
                    v.updatePath(deltaTime);
                    if (v.index > this.offSetSprouts && v.sprouts[v.index - (this.offSetSprouts + 1)]) {
                        let enableSprouts = true;
                        let ll = v.pointsTemplate[v.index-1].subtract(v.pointsTemplate[v.index]).length();
                        if (ll < this.distanceSprouts) {
                            enableSprouts = false;
                        }

                        if (enableSprouts) {
                            let scale = BABYLON.Scalar.RandomRange(this.scale - 0.075, this.scale + 0.075);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].setEnabled(true);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].scaling = new BABYLON.Vector3(scale, scale, scale);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].position = v.points[v.index - 1].clone();
                            v.sprouts[v.index - (this.offSetSprouts + 1)].lookAt(v.points[v.index-2].clone());
                            v.sprouts[v.index - (this.offSetSprouts + 1)].rotate(BABYLON.Axis.X, BABYLON.Scalar.RandomRange(0.25, 0.5), BABYLON.Mesh.LOCAL);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].rotate(BABYLON.Axis.Y, BABYLON.Scalar.RandomRange(3, 3.75), BABYLON.Mesh.LOCAL);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].rotate(BABYLON.Axis.Z, Math.random() * 100, BABYLON.Mesh.LOCAL);
                            v.sprouts[v.index - (this.offSetSprouts + 1)].directionIndex = v.index - 1;
                            if (v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                                v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.stop();
                            }
                            if (!v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                                v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.start(false, BABYLON.Scalar.RandomRange(deltaTime * 50, deltaTime * 60), 0, 2);
                            }
                        }
                    }

                    let curve = v.getPath();
                    let obj = this.scene.getMeshByName('tube_' + i);
                    if (obj) {
                        obj.dispose();
                    }

                    var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, v.diameter, this.sectionPoints, function (i, distance) {
                        if (distance <= v.totalLength / 10) {
                            return distance * v.diameter;
                        } else if (distance > v.totalLength / 10 && distance <= v.totalLength / 1.1) {
                            return (v.totalLength / 10) * v.diameter;
                        } else {
                            return (v.totalLength - distance) * v.diameter < 0 ? 0 : (v.totalLength - distance) * v.diameter
                        }
                    }, BABYLON.Mesh.NO_CAP, this.scene, true, BABYLON.Mesh.FRONTSIDE,);
                    v.tube = tube;
                    tube.material = this.tubeMaterial;
                } else if (v.reverse) {
                    v.updatePathReverse(deltaTime);
                    let curve = v.getPath();
                    let obj = this.scene.getMeshByName('tube_' + i);
                    if (obj) {
                        obj.dispose();
                    }

                    var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, v.diameter, this.sectionPoints, function (i, distance) {
                        if (distance <= (v.totalLength - v.tempLength)/ 10) {
                            return distance * v.diameter;
                        } else if (distance > (v.totalLength - v.tempLength) / 10 && distance <= (v.totalLength - v.tempLength) / 1.1) {
                            return ((v.totalLength - v.tempLength) / 10) * v.diameter;
                        } else {
                            return (v.totalLength  - v.tempLength - distance) * v.diameter
                        }
                    }, BABYLON.Mesh.NO_CAP, this.scene, true, BABYLON.Mesh.FRONTSIDE,);
                    v.tube = tube;
                    tube.material = this.tubeMaterial;

                    if (v.index > this.offSetSprouts && v.sprouts[v.index - (this.offSetSprouts + 1)]) {
                        if (v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                            v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.stop();
                        }
                        if (!v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                            v.sprouts[v.index - (this.offSetSprouts + 1)].animationGroup.start(false, -BABYLON.Scalar.RandomRange(deltaTime * 25, deltaTime * 35), 2, 0);
                            v.sprouts[v.index - (this.offSetSprouts + 1)]._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(5.5, 7.5), BABYLON.Scalar.RandomRange(0.75, 1), BABYLON.Scalar.RandomRange(0.35, 0.5));
                            this.tubeMaterial.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(1.5, 2.5), BABYLON.Scalar.RandomRange(0.75, 0.8), BABYLON.Scalar.RandomRange(0.35, 0.5));
                        }
                    }
                    if (v.index > this.offSetSprouts && v.sprouts[v.index + 1 - (this.offSetSprouts + 1)]) {
                        if (v.sprouts[v.index + 1 - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                            v.sprouts[v.index + 1 - (this.offSetSprouts + 1)].animationGroup.stop();
                        }
                        if (!v.sprouts[v.index + 1 - (this.offSetSprouts + 1)].animationGroup.isPlaying) {
                            v.sprouts[v.index + 1 - (this.offSetSprouts + 1)].animationGroup.start(false, -BABYLON.Scalar.RandomRange(deltaTime * 25, deltaTime * 35), 2, 0);
                            v.sprouts[v.index + 1 - (this.offSetSprouts + 1)]._children[0].material.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(5.5, 7.5), BABYLON.Scalar.RandomRange(0.75, 1), BABYLON.Scalar.RandomRange(0.35, 0.5));
                        }
                    }
                } else if (v.plantDeath) {
                    if (v.deathLeaf) {
                        v.sprouts.map(g => {
                            if (g.visibility) {
                                if (g.animationGroup.isPlaying) {
                                    g.animationGroup.stop();
                                }
                                if (!g.animationGroup.isPlaying) {
                                    g.animationGroup.start(false, -BABYLON.Scalar.RandomRange(deltaTime * 12.5, deltaTime * 17.5), 2, 0);
                                    AnimationLeafDeath.call(g._children[0].material,
                                        new BABYLON.Color3(BABYLON.Scalar.RandomRange(5.5, 7.5), BABYLON.Scalar.RandomRange(0.25, 0.5), BABYLON.Scalar.RandomRange(0.125, 0.5)),
                                        90,
                                        v.scene
                                    );
                                }
                            }
                        });
                        this.tubeMaterial.albedoColor = new BABYLON.Color3(BABYLON.Scalar.RandomRange(1.5, 2.5), BABYLON.Scalar.RandomRange(0.75, 0.8), BABYLON.Scalar.RandomRange(0.35, 0.5));

                        let animationDiameterStem = AnimationDiameterStem.call(v, 90);
                        animationDiameterStem.onAnimationEnd = function () {
                            animationDiameterStem.animationStarted = false;
                            v.ended = true;
                        };
                        v.deathLeaf = false;
                    }

                    if (v.deathStem) {
                        let curve = v.getPath();
                        let obj = this.scene.getMeshByName('tube_' + i);
                        if (obj) {
                            obj.dispose();
                        }

                        var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, v.diameter, this.sectionPoints, function (i, distance) {
                            if (distance <= v.totalLength / 10) {
                                return distance * v.diameter;
                            } else if (distance > v.totalLength / 10 && distance <= v.totalLength / 1.1) {
                                return (v.totalLength / 10) * v.diameter;
                            } else {
                                return (v.totalLength - distance) * v.diameter
                            }
                        }, BABYLON.Mesh.NO_CAP, this.scene, true, BABYLON.Mesh.FRONTSIDE,);
                        v.tube = tube;
                        tube.material = this.tubeMaterial;
                    }
                }

                if (v.moveSprouts) {
                    v.updateMoveSprouts(deltaTime);
                }
                if (v.ended) {
                    tempCount++;
                }
            });
            if (tempCount > this.numTubes - 1) {
                this.ended = true;
                this.started = false;
            }
        }

// console.log(this.objectsCurve[0].sprouts)

    }
}