import React,{Component} from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill"
import Menu from "easy-context-menu";

import "./easy-tabs.css";
import TabPane from "./TabPane";
import TabNav from "./TabNav";
import TabContent from "./TabContent";
import MoreTab from "./MoreTab";
import getBoundingClientRect from "./getBoundingClientRect";

export default class Tabs extends Component {
    static propTypes = {
        customStyle : PropTypes.string,
        activeKey : PropTypes.string,
        editable : PropTypes.bool,
        draggable : PropTypes.bool,
        onChange : PropTypes.func,
        onClose : PropTypes.func,
        onAdd : PropTypes.func,
        onSequenceChange : PropTypes.func
    };

    static defaultProps = {
        activeKey : "",
        editable : true,
        draggable : false
    };

    constructor(props) {
        super(props);

        this.panes = [];
        /**
         * 由 TabNav 的 onMoreTab 传过来
         * @type {Map}
         */
        this.tabRectMap = null;
        /**
         * 由 TabNav 的 onMoreTab 传过来
         * @type {Array}
         */
        this.hideKeys = null;

        this.onTabChange = this.onTabChange.bind(this);
        this.onTabClose = this.onTabClose.bind(this);
        this.onTabAdd = this.onTabAdd.bind(this);
        this.onTabSequenceChange = this.onTabSequenceChange.bind(this);
        this.onMoreTab = this.onMoreTab.bind(this);
        this.onClickMenu = this.onClickMenu.bind(this);
    }

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(() => {
            this.setState({});
        });
        this.resizeObserver.observe(ReactDOM.findDOMNode(this));
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    render() {
        const {customStyle, activeKey, editable, draggable} = this.props;
        this.panes.length = 0;
        const list = React.Children.map(this.props.children, (element, index) => {
            if (!element) {
                return null;
            }
            const {type: elementType} = element;
            if (elementType !== TabPane) {
                console.warn("警告: Tabs 的子组件类型必须是 Tabs.TabPane");
                return null;
            }

            const {key} = element;
            const newProps = {
                tabKey: key
            };
            const mergeProps = Object.assign({}, element.props, newProps);
            this.panes.push({key:key, tabKey:key, title:mergeProps.title, content:mergeProps.children});

            return React.cloneElement(element, mergeProps);
        });

        const names = classNames("easy-tabs",
            "easy-tabs-tabs",
            {[customStyle]: customStyle !== undefined});
        return (
            <div className={names}>
                <TabNav activeKey={activeKey}
                        draggable={draggable}
                        showCloseButton={editable}
                        onChange={this.onTabChange}
                        onClose={this.onTabClose}
                        onSequenceChange={this.onTabSequenceChange}
                        onMoreTab={this.onMoreTab}
                        panes={list}/>
                <TabContent>
                    {this.renderContent()}
                </TabContent>
            </div>
        )
    }

    renderContent() {
        const {activeKey} = this.props;
        const contents = this.panes.filter((pane)=>{return pane.key===activeKey}, this);
        if(!contents[0]){
            return null;
        }
        return contents[0].content;
    }

    onTabChange(key) {
        const {onChange} = this.props;
        if(onChange){
            onChange.call(this, key);
        }
    }

    onTabClose(key) {
        const {onClose} = this.props;
        if(onClose){
            onClose.call(this, key);
        }
    }

    onTabAdd(key) {
        const {onAdd} = this.props;
        if(onAdd){
            onAdd.call(this, key);
        }
    }

    onTabSequenceChange(oldIndex, newIndex) {
        const {onSequenceChange} = this.props;
        if(onSequenceChange){
            onSequenceChange.call(this, oldIndex, newIndex);
        }
    }

    onMoreTab(hideTabs, rectMap) {
        const {customStyle} = this.props;
        this.hideKeys = hideTabs;
        this.tabRectMap = rectMap;
        const moreRect = rectMap.get(MoreTab.KEY);
        const names = classNames(
            'easy-tabs-menu',
            {[`${customStyle}-menu`]: customStyle !== undefined}
        );

        const menu = (
            <Menu className={names}
                  onClick={this.onClickMenu}>
                {this.getMenuItems()}
            </Menu>
        );
        console.log(moreRect)
        Menu.Popup(menu, moreRect.x, moreRect.bottom);
    }

    onClickMenu(key) {
        const {onChange} = this.props;
        if(onChange){
            const hideRect = this.tabRectMap.get(key);
            const moreRect = this.tabRectMap.get(MoreTab.KEY);
            const selfRect = getBoundingClientRect(this);
            let oldIdx = this.getPaneIndex(key);
            // let selPane = this.panes[oldIdx];
            let insertIdx = -1;
            for (let i = 0; i < this.panes.length; i++) {
                const {key} = this.panes[i];
                if(this.hideKeys.indexOf(key)===-1){
                    const tabRect = this.tabRectMap.get(key);
                    if(selfRect.width - tabRect.x - moreRect.width >= hideRect.width){
                        insertIdx = i;
                    }
                }
            }
            if(insertIdx !== -1 && oldIdx !== -1){
                // this.panes.splice(oldIdx, 1);
                // this.panes.splice(insertIdx, 0, selPane);
                if(this.props.onSequenceChange){
                    this.props.onSequenceChange.call(this, oldIdx, insertIdx);
                }
            }
            onChange.call(this, key);
        }
    }

    getMenuItems() {
        const hideKeys = this.hideKeys;
        const list = [];
        for (let i = 0; i < hideKeys.length; i++) {
            const {key, title} = hideKeys[i];
            list.push(
                <Menu.Item key={key}>
                    {title}
                </Menu.Item>
            )
        }
        return list;
    }

    getPaneIndex(key) {
        const {panes} = this;
        for (let i = 0; i < panes.length; i++) {
            if(panes[i].key===key){
                return i;
            }
        }
        return -1;
    }
}