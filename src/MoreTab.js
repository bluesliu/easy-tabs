/**
 * Created by blues on 2019-04-02.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classname from "classnames";
import ReactDOM from "react-dom";

export default class MoreTab extends Component {

    static KEY = Symbol('MoreTab');

    static propTypes = {
        className : PropTypes.string,
        onClick : PropTypes.func,
        onDidMount : PropTypes.func,
    };

    static defaultProps = {};

    constructor(props){
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidMount() {
        const {onDidMount} = this.props;
        if(onDidMount) {
            const ele = ReactDOM.findDOMNode(this);
            const rect = ele.getBoundingClientRect();
            onDidMount.call(this, MoreTab.KEY, rect);
        }
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