/**
 * Created by blues on 2019-04-02.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

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
                <svg width="10px"
                     height="7px"
                     viewBox="0 0 10 7">
                    <path fill="#A8A8A8" d="M 5.5 8 L 10.05 3.5 5.5 -1.05 4.45 0 7.95 3.5 4.45 6.95 5.5 8 M 0.5 8 L 5.05 3.5 0.5 -1.05 -0.55 0 2.95 3.5 -0.55 6.95 0.5 8 Z"/>
                </svg>
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