import {
    PBRMaterial,
    Vector3,
    Color3
} from '@babylonjs/core';
export default class FateLine {
    constructor(options, scene) {
        var arrayObjectLines = [];
        for (var j = 0; j < options.maskWinLine.length; j++) {
            var points = [];
            for (var i = 0; i < options.maskWinLine[j].length; i++) {
                var x = options.distanceBetweenSymbolRow * i - options.halfLengthRow;
                var y = options.distanceBetweenSymbolColl * (options.maskWinLine[j][i] + 0.001) - options.halfLengthColl;
                points = [...points, new Vector3(-x, -y, options.z)];
            }
            var deltaY = 1.5;
            points = [
                new Vector3(points[0].x + options.deltaBeginEnd,
                    j === 3 || j == 4 || j === 7 ? points[0].y - deltaY : j === 5 || j == 6 || j === 8 ? points[0].y + deltaY : points[0].y,
                    points[0].z),
                new Vector3(points[0].x + options.deltaBeginEnd * 0.75, points[0].y, points[0].z),
                ...points,
                new Vector3(points[points.length - 1].x - options.deltaBeginEnd * 0.75, points[points.length - 1].y, points[points.length - 1].z),
                new Vector3(points[points.length - 1].x - options.deltaBeginEnd,
                    j === 3 || j == 4 || j === 7 ? points[points.length - 1].y - deltaY : j === 5 || j == 6 || j === 8 ? points[points.length - 1].y + deltaY : points[points.length - 1].y,
                    points[points.length - 1].z)
            ];
            var myMaterial = new PBRMaterial("myMaterial", scene);
            //  myMaterial.albedoTexture = new BABYLON.Texture("textures/chain.png", scene);
            // myMaterial.environmentIntensity = 0.25;
            myMaterial.metallic = 0.0;
            //   myMaterial.albedoTexture.uScale = 1.2;
            //    myMaterial.albedoTexture.vScale = 1.0;
            //   myMaterial.albedoTexture.uOffset = 0.625;
            //   myMaterial.albedoTexture.hasAlpha = true;
            myMaterial.albedoColor = new Color3(1.0, 0.75, 0.25);
            myMaterial.emissiveColor = new Color3(1.0, 0.75, 0.25);
            myMaterial.emissiveIntensity = 2.0;
            // myMaterial.alpha = 0.5;
            var line = Line2D("line", {path: points, width: 0.15, standardUV: false}, scene);
            line.material = myMaterial;
            // line.renderingGroupId = 1;
            arrayObjectLines = [...arrayObjectLines, line];
            line.setEnabled(false);
            // line.renderingGroupId = 0;
        }
        return arrayObjectLines;
    }
}