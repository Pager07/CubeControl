/**
 * A class that use ScatterGl library to render keypoints in 3D 
 */
class Atrist3D{
    /**
     * 
     * @param {HTMLDivElement} containerElement A HTMLDivElement representing
     * the div container that will hold the 3D plot 
     * @param {number} video_width - The width of video elemenet, used for setting
     * anchor points to allow the hand point cloud to resize accordingly to its
     * posistion in the input
     * @param {number} video_height - The height of video elemenet, used for setting
     * anchor points to allow the hand point cloud to resize accordingly to its
     */
    constructor(containerElement,video_width,video_height){
        this.containerElement = containerElement;
        this.VIDEO_HEIGHT = video_height;
        this.VIDEO_WIDTH = video_width
        this.scatterGL = new ScatterGL(this.containerElement,
            {'rotateOnStart': false, 'selectEnabled': false});
        this.fingerLookupIndices = {
            thumb: [0, 1, 2, 3, 4],
            indexFinger: [0, 5, 6, 7, 8],
            middleFinger: [0, 9, 10, 11, 12],
            ringFinger: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20]
            };  // for rendering each finger as a polyline
        
        this.ANCHOR_POINTS = [
            [0, 0, 0], [0, -this.VIDEO_HEIGHT, 0], [-this.VIDEO_WIDTH, 0, 0],
            [-this.VIDEO_WIDTH, -this.VIDEO_HEIGHT, 0]
        ];
        this.scatterGLHasInitialized = false;
        this.setContainerSize();
    }

    /**
     * Sets the size of the container div
     */
    setContainerSize(){
        document.querySelector('#scatter-gl-container').style =
        `width: ${this.VIDEO_WIDTH}px; height: ${this.VIDEO_HEIGHT}px;`;
    }
    /**
     * 
     * @param {Object[]} pointsData -  A list containing points.
     * Returns a ScatterGL.Dataset object
     */
    getDataset(pointsData){
        const dataset =
        new ScatterGL.Dataset([...pointsData, ...this.ANCHOR_POINTS]);
        return dataset
    
    }   
    
    /**
     * 
     * @param {Object[]} result - A list containing points.
     * Renders the points cloud.
     */
    renderPointCloud(result){
        const pointsData = result.map(point => {
            return [-point[0], -point[1], -point[2]];
            });
        var dataset = this.getDataset(pointsData);
        if (!this.scatterGLHasInitialized) {
            this.scatterGL.render(dataset);
    
            const fingers = Object.keys(this.fingerLookupIndices);
            
            //Sets sequences with which to render polylines
            this.scatterGL.setSequences(
                fingers.map(finger => ({indices: this.fingerLookupIndices[finger]})));
            
            //Sets a function to determine colors
            this.scatterGL.setPointColorer((index) => {
                if (index < pointsData.length) {
                return 'steelblue';
                }
                return 'white';  // Hide.
            });
            } else {
                this.scatterGL.updateDataset(dataset);
            }
            this.scatterGLHasInitialized = true; 
    }
    
}