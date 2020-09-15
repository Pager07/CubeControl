var canvas, rawImage,artist,artist3d;

async function main2(){
    console.log('Loading the model')
    const model = await handpose.load();
    console.log('The model has been loaded');

    console.log('Loading Webcam');
    const webcam = new Webcam(document.getElementById('video'));
    await webcam.setup();
    console.log('Webcame is loaded');

    console.log('loading canvas');
    const canvas = document.getElementById('output');
    const video = document.getElementById('video');
    canvas.width = video.width;
    canvas.height = video.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,video.width, video.height);
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red'; 
    ctx.translate(canvas.width, 0);
    ctx.scale(-1,1);

    artist = new Artist(canvas);

    artist3d = new Atrist3D(document.getElementById('scatter-gl-container'),
        video.width,video.height);

    while(true){
        
        const img = webcam.capture();
        const drawResult = await tf.browser.toPixels(img,canvas)
        const predictions =  await model.estimateHands(img);

        if(predictions.length>0){
            const result = predictions[0].landmarks;
            artist.drawKeypoints(result,predictions[0].annotations)
            artist3d.renderPointCloud(result);
            //for (let i = 0; i < predictions.length; i++) {
                //const keypoints = predictions[i].landmarks;
                //artist.drawKeypoints(re)
                //// Log hand keypoints.
                //for (let i = 0; i < keypoints.length; i++) {
                    //const [x, y, z] = keypoints[i];
                    //console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                //}
            //}
        }
        img.dispose();
        await tf.nextFrame();
    }
    
    
}

main2();