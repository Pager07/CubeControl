var canvas, rawImage;
async function main2(){
    console.log('Loading the model')
    const model = await handpose.load();
    console.log('The model has been loaded');

    console.log('Loading Webcam')
    const webcam = new Webcam(document.getElementById('wc'));
    await webcam.setup();
    console.log('Webcame is loaded');
    while(true){
        //const predictions = tf.tidy(async ()=>{
            //const img = webcam.capture();
            //const predictions =  await model.estimateHands(img);
            //console.log(predictions)
            //return predictions;
        //});

        
        const img = webcam.capture();

        const predictions =  await model.estimateHands(img);

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
        img.dispose();
        await tf.nextFrame();
    }
    
    
}

main2();