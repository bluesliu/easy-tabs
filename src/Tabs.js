import React,{Component} from "react";
import classname from "classnames";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill"

import "./easy-tabs.css";
import TabPane from "./TabPane";
import TabNav from "./TabNav";
import TabContent from "./TabContent";

export default class Tabs extends Component {
    static propTypes = {
        className : PropTypes.string,
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
        const {className, activeKey, editable} = this.props;
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
                tabKey: key,
                className: className
            };
            const mergeProps = Object.assign({}, element.props, newProps);
            return React.cloneElement(element, mergeProps);
        });

        const classNames = classname("easy-tabs",
            {[className]: className !== undefined});
        return (
            <div className={classNames}>
                <TabNav className={className}
                        activeKey={activeKey}
                        showCloseButton={editable}
                        onChange={this.onTabChange}
                        onClose={this.onTabClose}
                        onSort={this.onTabSort}
                        panes={panes}/>
                <TabContent className={className}>
                    {panes.filter((pane)=>{return pane.props.tabKey===activeKey}, this)[0].props.children}
                </TabContent>
            </div>
        )
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
}