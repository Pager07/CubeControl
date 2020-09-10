/**
 * A class that draws keypoints to a canvas
 */
class Artist{
    /**
     * 
     * @param {HTMLCanvasElement} canvasElement A HTMLCanvasElement representing the canvas where keypoints need to be drawn 
     */
    constructor(canvasElement){
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.fingerLookupIndices = {
            thumb: [0, 1, 2, 3, 4],
            indexFinger: [0, 5, 6, 7, 8],
            middleFinger: [0, 9, 10, 11, 12],
            ringFinger: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20]
            };  // for rendering each finger as a polyline
    }

    /**
     * Draws a point in the canvas
     * @param {number} y - The y coordinate of the center point
     * @param {number} x - The coordinate of the center point 
     * @param {number} radius  - The radius of the circle 
     */
    drawPoint(y, x, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * 
     * @param {Object[]} points - A 2D list containing of points in a finger to plam center
     * @param {boolean} closePath  - A boolean indicating to draw line from current point to start of the sub-path
     */

    drawPath(points, closePath) {
        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            region.lineTo(point[0], point[1]);
        }
    
        if (closePath) {
            region.closePath();
        }
        this.ctx.stroke(region);
    }

    /**
     * 
     * @param {Object[]} keypoints - A 2D list containing points of all the fingers  
     */

    drawKeypoints(keypoints) {
        const keypointsArray = keypoints;

        for (let i = 0; i < keypointsArray.length; i++) {
            const y = keypointsArray[i][0];
            const x = keypointsArray[i][1];
            this.drawPoint(x - 2, y - 2, 3);
        }

        const fingers = Object.keys(this.fingerLookupIndices);
        for (let i = 0; i < fingers.length; i++) {
            const finger = fingers[i];
            const points = this.fingerLookupIndices[finger].map(idx => keypoints[idx]);
            this.drawPath(points, false);
        }
    }

    
}