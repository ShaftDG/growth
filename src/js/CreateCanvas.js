export default function CreateCanvas() {
    var canvas = document.createElement('canvas');
    canvas.id = 'renderCanvas';
    document.body.appendChild(canvas);
    return canvas
}