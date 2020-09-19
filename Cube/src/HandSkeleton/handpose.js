var canvas, rawImage,artist,artist3d;
var model, webcam, canvas, ctx, video;
let isPredicting = false;
async function init(){
    console.log('Loading the model')
    model = await handpose.load();
    console.log('The model has been loaded');

    console.log('Loading Webcam');
    webcam = new Webcam(document.getElementById('video'));
    await webcam.setup();
    console.log('Webcame is loaded');

    console.log('loading canvas');
    canvas = document.getElementById('output');
    video = document.getElementById('video');
    canvas.width = video.width;
    canvas.height = video.height;
    ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,video.width, video.height);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red'; 
    ctx.translate(canvas.width, 0);
    ctx.scale(-1,1);

    artist = new Artist(canvas);

    artist3d = new Atrist3D(document.getElementById('scatter-gl-container'),
        video.width,video.height);
    
    stats3d = new Stats3d();
}


init();

async function predict(){
    while(isPredicting){
        const img = webcam.capture();
        const drawResult = await tf.browser.toPixels(img,canvas)
        const predictions =  await model.estimateHands(img);

        if(predictions.length>0){
            const result = predictions[0].landmarks;
            artist.drawKeypoints(result,predictions[0].annotations)
            artist3d.renderPointCloud(result);
            
            var meanCoord = await stats3d.getMean(result,0).data();
            artist.drawPoint(meanCoord[1]-2, meanCoord[0]-2,3);
        }
        img.dispose();
        await tf.nextFrame();
    }
}
function startPredicting(){
    isPredicting = true;
    predict();
}

function stopPredicting(){
    isPredicting = false;
    predict();
}