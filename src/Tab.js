import React, {Component} from "react";
import PropTypes from "prop-types";
import classname from "classnames";

import CloseButton from "./CloseButton";


export default class Tab extends Component{
    static propTypes = {
        selected : PropTypes.bool,
        title : PropTypes.string,
        showCloseButton : PropTypes.bool,
        onClose : PropTypes.func,
        onClick : PropTypes.func,
        className : PropTypes.string
    };

    static defaultProps = {
        selected : false,
        title : "",
        showCloseButton : false,
    };

    constructor(props){
        super(props);
        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        const {title, className, selected} = this.props;
        const classNames = classname("easy-tabs-tab",
            {"easy-tabs-tab-sel": selected},
            {"easy-tabs-tab-unSel": !selected},
            {[className+'tab-sel']: selected},
            {[className+'tab-unSel']: !selected});
        return (
            <div className={classNames}
                 onClick={this.onClickHandler}>
                {title}
                {this.renderClose()}
            </div>
        )
    }

    renderClose() {
        const {showCloseButton} = this.props;
        if(!showCloseButton){
            return null;
        }
        return <CloseButton onClick={this.onCloseHandler}/>;
    }

    onCloseHandler() {
        const {onClose} = this.props;
        if(onClose){
            onClose.call(this, this.props["data-key"]);
        }
    }

    onClickHandler() {
        const {onClick} = this.props;
        if(onClick){
            onClick.call(this, this.props["data-key"]);
        }
    }
}