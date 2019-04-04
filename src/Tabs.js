import React,{Component} from "react";
import PropTypes from "prop-types";

import "./easy-tabs.css";
import TabPane from "./TabPane";
import TabNav from "./TabNav";
import Tab from "./Tab";
import TabInfo from "./TabInfo";

export default class Tabs extends Component {
    static propTypes = {
        selectedKey : PropTypes.string,
        onChange : PropTypes.func
    };

    static defaultProps = {
        selectedKey : ""
    };

    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.onTabClose = this.onTabClose.bind(this);

        const newChildren = this.mapChildren(this.props.children);
        const tabs = this.parseTabs(newChildren);

        this.state = {
            selectedKey : this.props.selectedKey,
            tabs : tabs
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const newChildren = this.mapChildren(nextProps.children);
        this.state.tabs = this.parseTabs(newChildren);
        this.state.selectedKey = nextProps.selectedKey;
    }

    mapChildren(children){
        return React.Children.map(children, (element, index) => {
            if (!element) {
                return null;
            }
            const { type:elementType } = element;
            if (elementType !== TabPane ) {
                console.warn("警告: Tabs 的子组件类型必须是 Tabs.TabPane");
                return null;
            }
            return element;
        });
    }

    parseTabs(children) {
        const tabs = [];
        const {className} = this.props;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            const {children:content, title, ...oldProps} = element.props;
            let key = parseKey(element);
            if(!key){
                key = i.toString();
            }
            const newProps = {
                key : key,
                className : className,
                content : content
            };
            const mergeProps = Object.assign({}, oldProps, newProps);
            // const tab = {title: mergeProps.title, key: mergeProps.key};
            const tab = new TabInfo(key, title);
            tabs.push(tab);
        }
        return tabs;
    }




    render() {
        const {selectedKey, tabs} = this.state;
        return (
            <div className="easy-tabs">
                <TabNav selectedKey={selectedKey}
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

    onTabClose(selectedKey, tabInfoList) {
        this.setState({
            ...this.state,
            tabs : tabInfoList,
            selectedKey : selectedKey
        });
        const {onChange} = this.props;
        if(onChange){
            onChange.call(this, selectedKey, tabInfoList);
        }
    }
}


let parseKey = (element)=>{
    const keyStr = element['key'];
    if(!keyStr || keyStr.length===0){
        return null;
    }
    if(keyStr.substr(0,2)==='.$'){
        return keyStr.substr(2);
    }
    return keyStr;
};