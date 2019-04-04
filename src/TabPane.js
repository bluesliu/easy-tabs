/**
 * Created by blues on 2019-04-03.
 * 这是一个抽象类，不渲染，只用于给 Tabs 提供参数
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class TabPane extends Component {
    static propTypes = {
        title : PropTypes.string
    };

    static defaultProps = {
        title : ""
    };

    constructor(props) {
        super(props);
    }

    render() {
        return null;
    }
}