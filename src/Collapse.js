import React, {Component} from "react";
import PropTypes from "prop-types";

import Panel from "./Panel";
import getClassName from "./getClassName";

export default class Collapse extends Component {

    static propTypes = {
        className : PropTypes.string
    };

    static defaultProps = {
        className : "easy-collapse"
    };

    render() {
        const {className} = this.props;
        return (
            <div className={getClassName(className)}>
                {this.renderPanels()}
            </div>
        )
    }

    renderPanels() {
        const {className} = this.props;
        const children = React.Children.map(this.props.children, (element, index) => {
            if (!element) {
                return null;
            }

            const { type:elementType } = element;
            if (elementType !== Panel ) {
                console.warn("警告: Collapse 的子组件类型必须是 Collapse.Panel");
                return null;
            }
            return element;
        });

        const list = [];
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            const {key, ...oldProps} = element.props;
            const newProps = {
                key : key===undefined?i:key,
                className : className
            };
            const mergeProps = Object.assign({}, oldProps, newProps);
            list.push(React.cloneElement(element, mergeProps));
        }

        return list;
    }
}