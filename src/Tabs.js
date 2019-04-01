import React,{Component} from "react";
import PropTypes from "prop-types";

import "./easy-tabs.css";
import TabBar from "./TabBar";

export default class Tabs extends Component {
    static propTypes = {
        selectedKey : PropTypes.string,
        tabs : PropTypes.array
    };

    static defaultProps = {
        selectedKey : "",
        tabs : []
    };

    constructor(props) {
        super(props);

        this.onTabChange = this.onTabChange.bind(this);
        this.onTabClose = this.onTabClose.bind(this);

        this.state = {
            selectedKey : this.props.selectedKey,
            tabs : this.props.tabs
        }
    }

    render() {
        const {selectedKey, tabs} = this.state;
        return (
            <div className="easy-tabs">
                <TabBar selectedKey={selectedKey}
                        showCloseButton={true}
                        tabs={tabs}
                        onChange={this.onTabChange}
                        onClose={this.onTabClose}/>
                <div>
                    content
                </div>
            </div>
        )
    }

    onTabChange(key) {
        this.setState({
            ...this.state,
            selectedKey : key
        });
    }

    onTabClose(key) {
        let {tabs, selectedKey} = this.state;
        for (let i = tabs.length-1; i >= 0; i--) {
            const tab = tabs[i];
            if(tabs[i].key === key){
                 tabs.splice(i, 1);
                if(tab.key === selectedKey){
                    if(tabs[i-1]){
                        selectedKey = tabs[i-1].key;
                    }
                    else if(tabs[i]){
                        selectedKey = tabs[i].key;
                    }
                    else{
                        selectedKey = "";
                    }
                }
                break;
            }
        }
        this.setState({
            ...this.state,
            tabs : tabs,
            selectedKey : selectedKey
        })
    }
}