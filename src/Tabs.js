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

export default class Tabs extends Component {
    static propTypes = {
        customStyle : PropTypes.string,
        activeKey : PropTypes.string,
        editable : PropTypes.bool,
        onChange : PropTypes.func,
        onClose : PropTypes.func,
        onAdd : PropTypes.func,
        onSort : PropTypes.func
    };

    static defaultProps = {
        activeKey : "",
        editable : true
    };

    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.onTabClose = this.onTabClose.bind(this);
        this.onTabAdd = this.onTabAdd.bind(this);
        this.onTabSort = this.onTabSort.bind(this);
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
        const {customStyle, activeKey, editable} = this.props;
        let panes = React.Children.map(this.props.children, (element, index) => {
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
            return React.cloneElement(element, mergeProps);
        });

        const names = classNames("easy-tabs",
            "easy-tabs-tabs",
            {[customStyle]: customStyle !== undefined});
        return (
            <div className={names}>
                <TabNav activeKey={activeKey}
                        showCloseButton={editable}
                        onChange={this.onTabChange}
                        onClose={this.onTabClose}
                        onSort={this.onTabSort}
                        onMoreTab={this.onMoreTab}
                        panes={panes}/>
                <TabContent>
                    {this.renderContent(panes)}
                </TabContent>
            </div>
        )
    }

    renderContent(panes) {
        const {activeKey} = this.props;
        const contents = panes.filter((pane)=>{return pane.props.tabKey===activeKey}, this);
        if(!contents[0] || !contents[0].props){
            return null;
        }
        return contents[0].props.children;
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

    onTabSort(panes) {
        const {onSort} = this.props;
        if(onSort){
            onSort.call(this, panes);
        }
    }

    onMoreTab(hideTabs, rect) {
        const menu = (
            <Menu onClick={this.onClickMenu}>
                {this.getMenuItems(hideTabs)}
            </Menu>
        );
        Menu.Popup(menu, rect.x, rect.bottom);
    }

    onClickMenu(key) {
        const {onChange} = this.props;
        console.log(this)
        if(onChange){
            onChange.call(this, key);
        }
    }

    getMenuItems(hideTabs) {
        const list = [];
        for (let i = 0; i < hideTabs.length; i++) {
            const {key, title} = hideTabs[i];
            list.push(
                <Menu.Item key={key}>
                    {title}
                </Menu.Item>
            )
        }
        return list;
    }
}