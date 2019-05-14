export default BABYLON.Scene.prototype.showFPS = function showFPS(args){
    args = args || {};
    var ioSpeed = args.ioSpeed || 30;
    var location = args.location || 'tl';
    var offset = {};
    args.offset = args.offset || {};
    offset.x = args.offset.x || 0;
    offset.y = args.offset.y || 0;

    var font = args.font || "Arial";
    var color = args.color || 'rgba(180,180,180,0.65)';
    var size = args.size || '12px';
    var padding = args.padding || '0.2em;'
    var background = args.background || 'rgba(10,10,10,0.65)';
    var n = document.createElement('div');
    n.setAttribute('id', 'fps-block');
    n.setAttribute('style',
        'position:absolute;'+
        'right: 0;' +
        'top: 0;' +
        'display:block;'+
        'z-index:10001;'+
        'font-family:Arial, Helvetica, sans-serif;'+
        'pointer-events:none;'+
        'color:'+color+';'+
        'font-size:'+size+';'+
        'padding:'+padding+';'+
        'background-color:' + background + ';' +
        'transform:translate(' + offset.x + ',' + offset.y + ');' );

    n.innerHTML = "##&nbsp;fps";

    document.body.appendChild(n);

    var self = this;
    var pE = self._engine;
    function getFps() {
        var b = document.getElementById('fps-block');
        if (b) {
            b.innerHTML = pE.getFps().toFixed() + " fps";
            setTimeout(function () { getFps() }, 1000 / ioSpeed);
        }
    }

    getFps();


    return n;
}