export default class TimerHelper {

    /**
     *
     * @param handler
     * @param thisObj
     * @param time
     * @param args
     * @returns {number}
     */
    static setTimeout(handler, thisObj, time, ...args){
        handler = handler.bind(thisObj);
        return setTimeout(handler, time, ...args);
    }
}
