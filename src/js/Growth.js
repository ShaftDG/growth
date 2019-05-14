import GrowthPath3D from "./GrowthPath3D";

export default class Growth {
    this.numTubes = 3;
    let numSegmentPerPoint = 8;
    // let numPoints = 6 * numSegmentPerPoint;

    for (let i = 0; i < numTubes; i++) {
    let randomX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
    let randomY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
    let randomZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();

    let randomXX = (Math.random() < 0.5 ? -1 : 1) * Math.random();
    let randomYY = (Math.random() < 0.5 ? -1 : 1) * Math.random();
    let randomZZ = (Math.random() < 0.5 ? -1 : 1) * Math.random();

    let objCurve = new GrowthPath3D(
        sphereLeft.position.subtract(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomX,randomY,randomZ).scale(0.75)),
        sphereRight.position.add(new BABYLON.Vector3(1.5, 0, 0)).add(new BABYLON.Vector3(randomXX,randomYY,randomZZ).scale(0.75)),
        numSegmentPerPoint,
        0.1,
        scene);
    objectsCurve.push(objCurve);
    let curve = objCurve.getPath();

    var tube = BABYLON.Mesh.CreateTube('tube_' + i, curve, 0.1, 8, null, BABYLON.Mesh.NO_CAP, scene, true, BABYLON.Mesh.FRONTSIDE,);
    objCurve.diameter = BABYLON.Scalar.RandomRange(0.015, 0.035);
    objCurve.deltaMoveSprouts = 0.015;
    objCurve.tube = tube;
    objCurve.sprouts = [];
    tube.material = tubeMaterial;
}
}