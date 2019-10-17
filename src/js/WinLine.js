import WinLinePath from "./WinLinePath";
import Line2D from './Line2D';
import { Observable } from "@babylonjs/core/Misc/observable";
import SparksParticles from "./SparksParticles";
import { Color3 } from '@babylonjs/core/Maths/math.color';
export default class WinLine {
    constructor(
        points,
        options,
        noiseTexture,
        material,
        assetsManager,
        scene,
        engine
    ) {
        this.reverse = options.reverse !== undefined ? options.reverse : false;
        this.points = points;
        this.scene = scene;
        this.numTubes = options.numTubes || 1;
        this.intervalTime = options.intervalTime || 0.15;
        this.started = false;
        this.diameter = options.diameter || 0.02;
        this.tempDiameter = options.diameter || 0.02;

        this._material = material;

        this.objectsCurve = [];
        this.lines = [];
        this.particleSystems = [];
        for (let i = 0; i < this.numTubes; i++) {
            let objCurve = new WinLinePath(
                this.points.length ? this.points[i] : this.points,
                this.intervalTime.length ? this.intervalTime[i] : this.intervalTime,
                this.reverse,
                this.scene
            );

            this.objectsCurve.push(objCurve);
            let curve = objCurve.getPath();
            objCurve.resetGrowth();
            let line = new Line2D('line_' + i, {path: curve, width: this.diameter, standardUV: false}, this.scene);
            line.customMesh.material = this._material;

            let sparks = new SparksParticles({
                engine: engine,
                scene: scene,
                size: 0.55,
                noiseTexture: noiseTexture
            });
            this.particleSystems.push(sparks);
            this.lines.push(line);
        }

        this.onEndObservable = new Observable();
    }

    enableReverse() {
        this.started = true;
        this.reverse = true;
        this.objectsCurve.map(v => {
            v.start = false;
            v.ended = false;
            v.index = v.pointsTemplate.length - 1;
            v.indexLine = v.pointsLength - 1;
            v.startGrowthReverse();
        });

    }
    setTextureSparkStretchedToParticles(texture) {
        this.particleSystems.map(v => {
            v.setTextureSparkStretched(texture);
        })
    }

    setTextureSparkWeldingToParticles(texture) {
        this.particleSystems.map(v => {
            v.setTextureSparkWelding(texture);
        })
    }

    startParticles() {
        this.particleSystems.map(v => {
            v.start();
        })
    }

    stopParticles() {
        this.particleSystems.map(v => {
            v.stop();
        })
    }

    resetParticles() {
        this.particleSystems.map(v => {
            v.reset();
        })
    }

    setPoints (points) {
        this.points = points;

        this.objectsCurve.map(v => {
            v.setPointsInner(this.points);
            v.resetGrowth();
        });
    }

    updateWidth (diameter) {
        this.lines.map((v, i) => {
            v.UpdateLine2D('line_' + i, {path: this.objectsCurve[i].getPath(), width: diameter, standardUV: false}, this.scene);
        })
    }

    startGrowth () {
        this.diameter = this.tempDiameter;
        this.started = true;
        this._material.emissiveColor = new Color3(1.0, 0.5, 0.25);
        let _this = this;
        this.objectsCurve.map((v, i) => {
            _this.lines[i].customMesh.setEnabled(true);
            v.start = false;
            v.reverse = this.reverse;
            v.startGrowth();
        });
    }

    update (deltaTime) {
        let tempCount = 0;
        if (this.started) {
            this.objectsCurve.map((v, i) => {
                if (v.start) {
                    v.updatePath(deltaTime);
                    let curve = v.getPath();
                    this.lines[i].UpdateLine2D('line_' + i, {path: curve, width: this.diameter, standardUV: false}, this.scene);
                } else if (v.reverse) {
                    v.updatePathReverse(deltaTime);
                    let curve = v.getPath();
                    this.lines[i].UpdateLine2D('line_' + i, {path: curve, width: this.diameter, standardUV: false}, this.scene);
                }

                if (v.ended) {
                    if (v.reverse) {
                        this.lines[i].customMesh.setEnabled(false);
                    }
                    tempCount++;
                }
            });
            // console.log(this.started, tempCount)
            if (tempCount > this.numTubes - 1) {
                this.objectsCurve.map((v, i) => {
                    this.particleSystems[i].setEmitter(this.lines[i].customMesh, v.getPoints());
                });

                this.onEndObservable.notifyObservers(this);
                this.started = false;
            }
        }
    }
}