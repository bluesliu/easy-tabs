/**
 * Created by blues on 2019-04-08.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class TabContent extends Component {
    static propTypes = {
        className : PropTypes.string
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    render() {
        const {className, children} = this.props;
        console.log(children)
        const classNames = classnames("easy-tabs-content",{[`${className}-content`]:className!==undefined});
        return (
            <div className={classNames}>
                {children}
            </div>
        )
    }
}