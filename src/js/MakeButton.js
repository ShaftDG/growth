import {
    HighlightLayer,
    Color3,
    Vector3
} from '@babylonjs/core'

import {
    MeshButton3D,
} from '@babylonjs/gui'

export default class MakeButton {
    constructor(name, object, linkToParent, options, manager, scene) {
        if (options.positionButton) {
            object.position = options.positionButton.clone();
        }
        var pos = object.position.clone();
        var pushButton = new MeshButton3D(object, name);
        pushButton.enabled = true;
        pushButton.pos = pos;
        pushButton.options = options;
        var hl = new HighlightLayer("hl", scene);
        hl.blurHorizontalSize = 0.5;
        hl.blurVerticalSize = 0.5;
        pushButton.pointerEnterAnimation = () => {
            if (pushButton.enabled) {
                // hl.addMesh(object, new Color3(2.0, 1.0, 0.5));
                object.material.albedoColor = new Color3(2.0,1.8,1.56);
                object.scaling = new Vector3(1.04,1.04,1.0);
            }
        };
        pushButton.pointerOutAnimation = () => {
            // hl.removeMesh(object);
            object.material.albedoColor = new Color3(1,1,1);
            object.scaling = new Vector3(1.0,1.0,1.0);
        };
        pushButton.pointerDownAnimation = () => {
            if (pushButton.enabled) {
                object.position.x = pos.x + options.deltaPush.x;
                object.position.y = pos.y + options.deltaPush.y;
                object.position.z = pos.z + options.deltaPush.z;
            }
        };
        pushButton.pointerUpAnimation = () => {
            if (pushButton.enabled) {
                object.position.x = pos.x;
                object.position.y = pos.y;
                object.position.z = pos.z;
            }
        };

        manager.addControl(pushButton);
        pushButton.linkToTransformNode(linkToParent);

        return pushButton;
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
}