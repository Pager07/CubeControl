import {g_xTranslate,g_yTranslate,g_zTranslate} from 'cube.js'
/**
 * This class applies transformation to a webgl poylgon
 */
class Transformer{
    constructor(){
    }

    translation(directionVec,magnitude){
        g_xTranslate += directionVec[0]*magnitude;
        g_yTranslate += directionVec[1] * magnitude;
        g_zTranslate += directionVec[2] * magnitude;

    }
}