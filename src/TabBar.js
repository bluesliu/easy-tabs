/**
 * Created by blues on 2019-04-01.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import Tab from "./Tab";

export default class TabBar extends Component {
    static propTypes = {
        showCloseButton: PropTypes.bool,
        selectedKey : PropTypes.string,
        tabs : PropTypes.array,
        onChange : PropTypes.func,
        onClose : PropTypes.func
    };

    static defaultProps = {
        showCloseButton : false,
        tabs : []
    };

    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
        this.onTabClose = this.onTabClose.bind(this);
    }

    render() {

        return (
           <div className="easy-tabs-tabBar">
               {this.renderTabs()}
           </div>
        )
    }

    renderTabs() {
        const {tabs, selectedKey, showCloseButton, onChange, onClose} = this.props;
        if(!tabs){
            return null;
        }
        const list = [];
        for (let i = 0; i < tabs.length; i++) {
            const {key, title} = tabs[i];
            list[i] = <Tab key={i}
                           data-key={key}
                           title={title}
                           showCloseButton={showCloseButton}
                           selected={key === selectedKey}
                           onClick={this.onTabClick}
                           onClose={this.onTabClose}/>;
        }
        return list;
    }

    onTabClick(key) {
        const {onChange, selectedKey} = this.props;
        if(key !== selectedKey || onChange){
            onChange.call(this, key);
        }
    }

    onTabClose(key) {
        const {onClose} = this.props;
        if(onClose){
            onClose.call(this, key);
        }
    }
}