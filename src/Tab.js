import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classname from "classnames";

import CloseButton from "./CloseButton";

class Tab extends Component{
    static propTypes = {
        className : PropTypes.string,
        style : PropTypes.object,
        onClose : PropTypes.func,
        onDown : PropTypes.func,
        onDidMount : PropTypes.func,
        opacity : PropTypes.number,
        selected : PropTypes.bool,
        showCloseButton : PropTypes.bool,
        info : PropTypes.any
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
        const {className, opacity, info, selected} = this.props;
        const classNames = classname("easy-tabs-tab",
            {"easy-tabs-tab-sel": selected},
            {"easy-tabs-tab-unSel": !selected},
            {[className + '-tab']: className!==undefined},
            {[className + 'tab-sel']: selected && className!==undefined},
            {[className + 'tab-unSel']: !selected && className!==undefined});
        const style = {...this.props.style, opacity: opacity};

        return (
            <div className={classNames}
                 onClick={this.onClickHandler}
                 onMouseDown={this.onDownHandler}
                 style={style}>
                {info.title}
                {this.renderClose()}
            </div>
        )
    }

    componentDidMount() {
        this.updateRect();
        this.props.info.addEventListener('updateRect', ()=>{
            this.updateRect();
        }, this);
    }

    componentWillUnmount() {
        this.props.info.removeAll();
    }

    updateRect() {
        const ele = ReactDOM.findDOMNode(this);
        this.props.info.rect = ele.getBoundingClientRect();
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
            onClose.call(this, this.dataKey);
        }
    }

    onDownHandler(e) {
        const position = this.getMousePosition(e);
        const {onDown} = this.props;
        if(onDown){
            onDown.call(this, this.dataKey, position);
        }
    }

    get dataKey() {
        return this.props.info.key;
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