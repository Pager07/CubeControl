/**
 * This class does math computations for set of points 
 */
class Stats3d{
    constructor(){
        
    }

    /**
     * 
     * @param {Object[]} result - A list containing points.
     * @param {Number} axis - A interger in [0,1]. 
     * Returns promise which when resolved returns tf.tensor will mean of the points
     */
    getMean(result, axis){
        const meanCoordTensor = tf.tidy(()=>{
            var keypointsTensor = null;
            for (let i = 0; i < result.length; i++) {
                if(i == 0){
                    keypointsTensor = tf.tensor2d([result[i]]);
                }else{
                    var tensor = tf.tensor2d([result[i]]);
                    keypointsTensor = tf.concat([keypointsTensor, tensor],axis)
                }
            }
            return keypointsTensor.mean(axis);
        });
        return meanCoordTensor
    }
    
    /**
     * 
     * @param {Object[]} point1 - A list containing vector coordinates 
     * @param {Object[]} point2  - A list containing vector coordinates
     * Returns a direction vector between 2 points
     */
     getVector(point1, point2){
         const vector = tf.tidy(()=>{
             point1, point2 = tf.tensor(point1), tf.tensor(point2)
             vec3 = point1.sub(point2);
             return vec3
        });
        return vector
    }

    getDirectionalVector(point1, point2){
        var vector = this.getVector(point1,point2);
        var unitVector = vector.div(tf.norm(vector))
        return unitVector;
    }

}
