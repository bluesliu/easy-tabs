import {EventDispatcher, Event} from "easy-event";
import React from "react";

export default class TabInfo extends EventDispatcher{

    /**
     *
     * @param {string} key
     * @param {string} title
     */
    constructor(key, title){
        super();

        this.key = key;
        this.title = title;
        this.rect = null;
    }

    /**
     *
     * @returns {TabInfo}
     */
    clone() {
        const info = new TabInfo(this.key, this.title);
        info.rect = this.rect;
        return info;
    }

    updateRect() {
        this.dispatchEvent(new Event('updateRect'));
    }
}