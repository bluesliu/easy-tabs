/**
 * Created by blues on 2019-04-08.
 */
import React, {Component} from "react";

export default class TabContent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {children} = this.props;
        return (
            <div className="easy-tabs-content">
                {children}
            </div>
        )
    }
}