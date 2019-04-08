import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classname from "classnames";

import CloseButton from "./CloseButton";

class Tab extends Component{
    static propTypes = {
        tabKey : PropTypes.string,
        className : PropTypes.string,
        style : PropTypes.object,
        title : PropTypes.string,
        onClose : PropTypes.func,
        onDown : PropTypes.func,
        onDidMount : PropTypes.func,
        opacity : PropTypes.number,
        selected : PropTypes.bool,
        showCloseButton : PropTypes.bool
    };

    static defaultProps = {
        opacity : 1,
        selected : false
    };

    constructor(props){
        super(props);

        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.onDownHandler = this.onDownHandler.bind(this);
    }

    render() {
        const {className, opacity, selected, title} = this.props;
        const classNames = classname("easy-tabs","tab",
            {"tab-sel": selected},
            {"tab-unSel": !selected},
            {[className]: className!==undefined});
        const style = {...this.props.style, opacity: opacity};

        return (
            <div className={classNames}
                 onClick={this.onClickHandler}
                 onMouseDown={this.onDownHandler}
                 style={style}>
                {title}
                {this.renderClose()}
            </div>
        )
    }

    componentDidMount() {
        const {onDidMount, tabKey} = this.props;
        if(onDidMount){
            onDidMount.call(this, tabKey, ReactDOM.findDOMNode(this).getBoundingClientRect());
        }
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
            onClose.call(this, this.props.tabKey);
        }
    }

    onDownHandler(e) {
        const position = this.getMousePosition(e);
        const {onDown} = this.props;
        if(onDown){
            onDown.call(this, this.props.tabKey, position);
        }
    }

    getMousePosition(e) {
        const position = {};
        position.globalX = e.pageX;
        position.globalY = e.pageY;
        const dom = ReactDOM.findDOMNode(this);
        if (dom) {
            const rect = dom.getBoundingClientRect();
            position.localX = e.pageX - rect.x + document.documentElement.scrollLeft;
            position.localY = e.pageY - rect.y + document.documentElement.scrollTop;
        }
        return position;
    }
}

export default Tab;