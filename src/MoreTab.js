/**
 * Created by blues on 2019-04-02.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classname from "classnames";

export default class MoreTab extends Component {

    static KEY = Symbol('MoreTab');

    static propTypes = {
        className : PropTypes.string,
        onClick : PropTypes.func,
    };

    static defaultProps = {};

    constructor(props){
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        const {className} = this.props;
        const classNames = classname("easy-tabs-tab",
            {"easy-tabs-tab-unSel": true},
            {[className+'tab']: true},
            {[className+'tab-unSel']: true});
        return (
            <div className={classNames}
                 onClick={this.onClickHandler}>
                {">>"}
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