/**
 * Created by blues on 2019-04-01.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class CloseButton extends Component {
    static propTypes = {
        onClick : PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        return (
            <i
                className="easy-tabs-closeBtn"
                aria-label="图标：close" tabIndex="-1"
                onClick={this.onClickHandler}
                onMouseDown={(e)=>{e.stopPropagation(); e.preventDefault()}}>
                {/*<img src={closeImg} alt=""/>*/}
                <svg width="7px" height="7px" viewBox="0 0 7 7">
                    <path fill="#A8A8A8" stroke="none" d="M 4.55 3.55 L 7.55 0.5 6.45 -0.55 3.45 2.45 0.5 -0.5 -0.55 0.55 2.4 3.5 -0.5 6.45 0.6 7.5 3.5 4.6 6.4 7.5 7.45 6.45 4.55 3.55 Z"/>
                </svg>
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