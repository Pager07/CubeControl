/**
 * This class keeps tracks n set of points`
 */
 class Tracker{
     constructor(queSize){
        var queSize = queSize;
        var deque = require("collections/deque");
        var stats3d = new Stats3d();
     }
     
     /**
      * 
      * @param {Object[]} vec - A list containing the vector coordinates 
      * Updates the queue such that only the 'queSize' recent vector is in the queue
      */
     updateQue(vec){
        if(this.deque.length < this.queSize){
            this.deque.unshift(vec);
        }
        else{
            this.deque.pop();
            this.deque.unshift(vec);
        }
     }

     /**
      * 
      * @param {Object[]} vec - A list containing a vector coordinates
      * Returns the directional vector from the first vector in the deque
      * Returns null if the deque does not hold atleast 2 vectors
      */
     getDirectionalVector(vec){
        this.updateQue(vec);
        if(this.deque.length < this.queSize){
            return null
        }
        else{
            return stats3d.getDirectionalVector(this.deque.peek(), this.deque.peekBack());
        }
     }
     
     
 }