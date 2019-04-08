/**
 * Created by blues on 2019-04-01.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import closeImg from "./close.svg";


export default class CloseButton extends Component {
    static propTypes = {
        onClick : PropTypes.func,
        className : PropTypes.string
    };

    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        const {className} = this.props;

        return (
            <i
                className={classname("easy-tabs","closeBtn", {[className]:className!==null})}
                aria-label="图标：close" tabIndex="-1"
                onClick={this.onClickHandler}
                onMouseDown={(e)=>{e.stopPropagation(); e.preventDefault()}}>
                <img src={closeImg} alt=""/>
            </i>
        )
    }

    /**
     * 点击关闭
     */
    onClickHandler(e) {
        e.stopPropagation();
        const {onClick} = this.props;
        if(onClick){
            onClick.call(this);
        }
    }
}