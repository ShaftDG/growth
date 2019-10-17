import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { MeshButton3D } from '@babylonjs/gui/3D/controls/meshButton3D';

/*import {
    CustomHighLightLayer
} from './CustomHighLightLayer';*/
/*import {
    HeatWave
} from './HeatWave';*/
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Constants } from '@babylonjs/core/Engines/constants';

export default class MakeButton {
    constructor(name, object, linkToParent, options, manager, scene) {
        this.scene = scene;
        if (options.positionButton) {
            object.position = options.positionButton.clone();
        }
        var pos = object.position.clone();
        this.pushButton = new MeshButton3D(object, name);
        this.pushButton.enabled = true;
        this.pushButton.pos = pos;
        this.pushButton.options = options;
        this.hl = new HighlightLayer("hl", scene);
        this.hl.alphaBlendingMode = Constants.ALPHA_COMBINE;
        this.hl.mainTextureRatio = 1;
        this.hl.mainTextureFixedSize = 1;
        this.hl.time = 0;
        this.hl.blurHorizontalSize = 1.75;
        this.hl.blurVerticalSize = 1.75;

        this.hl.outerGlow = true;
        this.hl.innerGlow  = true;
        // console.log(this.hl);

        this.pushButton.pointerEnterAnimation = () => {
            if (this.pushButton.enabled) {
                this.hl.addMesh(object, new Color3(2.0, 0.25, 0), false);
                // object.material.albedoColor = new Color3(2.0,1.8,1.56);
                // object.scaling = new Vector3(1.04,1.04,1.0);
            }
        };
        this.pushButton.pointerOutAnimation = () => {
            this.hl.removeMesh(object);
            // object.material.albedoColor = new Color3(1,1,1);
            // object.scaling = new Vector3(1.0,1.0,1.0);
        };
        this.pushButton.pointerDownAnimation = () => {
            if (this.pushButton.enabled) {
                object.position.x = pos.x + options.deltaPush.x;
                object.position.y = pos.y + options.deltaPush.y;
                object.position.z = pos.z + options.deltaPush.z;
            }
        };
        this.pushButton.pointerUpAnimation = () => {
            if (this.pushButton.enabled) {
                object.position.x = pos.x;
                object.position.y = pos.y;
                object.position.z = pos.z;
            }
        };

        manager.addControl(this.pushButton);
        this.pushButton.linkToTransformNode(linkToParent);

        // return this.pushButton;
    }

    enableButton(button) {
        button.mesh.material.albedoColor = new Color3(1, 1, 1);
        button.enabled = true;
        button.mesh.position.x = button.pos.x;
        button.mesh.position.y = button.pos.y;
        button.mesh.position.z = button.pos.z;
    }

    unEnableButton (button) {
        button.mesh.material.albedoColor = new Color3(0.1, 0.1, 0.1);
        button.enabled = false;
        button.mesh.position.x = button.pos.x + button.options.deltaPush.x;
        button.mesh.position.y = button.pos.y + button.options.deltaPush.y;
        button.mesh.position.z = button.pos.z + button.options.deltaPush.z;
    }

    setTexture (texture) {
        // this.hl.setTextureNoise(texture)
        texture.wrapU = Texture.MIRROR_ADDRESSMODE;
        texture.wrapV = Texture.MIRROR_ADDRESSMODE;
        this.hl.noiseTexture0 = texture;

        var time = 0;
        var rate = 0.01;
        // Move the light with the camera
        let hl = this.hl;
        let scene = this.scene;
        this.scene.registerBeforeRender(function () {
            hl.time+=scene.getAnimationRatio()*rate;
        });
    }
}