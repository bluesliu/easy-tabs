/**
 * Created by blues on 2019-04-02.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import arrowImg from "./arrow_line_2.svg";
import closeImg from "./close.svg";

export default class MoreTab extends Component {

    static KEY = Symbol('MoreTab');

    static propTypes = {
        onClick : PropTypes.func,
    };

    static defaultProps = {};

    constructor(props){
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        const names = classNames("easy-tabs-tab","easy-tabs-tab-unSel","easy-tabs-moreTab");
        return (
            <div className={names}
                 onClick={this.onClickHandler}>
                <img src={arrowImg} alt=""/>
            </div>
        )
    }

    onClickHandler() {
        const {onClick} = this.props;
        if(onClick){
            onClick.call(this, MoreTab.KEY);
        }
    }
}