var canvas, rawImage;
async function main2(){
    console.log('Loading the model')
    const model = await handpose.load();
    console.log('The model has been loaded');

    rawImage = document.getElementById('canvasimg');
    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = rawImage.height;
    canvas.width = rawImage.width;
    ctx.drawImage(rawImage,30,30);
    const data = ctx.getImageData(60,60,200,100);
    //tf.browser.fromPixels(image)
    const predictions = await model.estimateHands(canvas);
    console.log(predictions)
    if(predictions.length>0){
        for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].landmarks;
 
            // Log hand keypoints.
            for (let i = 0; i < keypoints.length; i++) {
                const [x, y, z] = keypoints[i];
                console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            }
        }
    }
    
}
main2();