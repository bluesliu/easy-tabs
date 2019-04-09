/**
 * Created by blues on 2019-04-01.
 */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import Tab from "./Tab";
import MoreTab from "./MoreTab";
import TimerHelper from "./TimerHelper";
import classname from "classnames";

export default class TabNav extends Component {
    static propTypes = {
        className : PropTypes.string,
        showCloseButton: PropTypes.bool,
        activeKey : PropTypes.string,
        panes : PropTypes.array,
        onChange : PropTypes.func,
        onClose : PropTypes.func,
        onSort : PropTypes.func,
        onMoreTab : PropTypes.func
    };

    static defaultProps = {
        showCloseButton : false,
        panes : []
    };

    constructor(props) {
        super(props);

        // 初始化
        this.rect = null;               //组件自身的rect
        this.lastX = 0;
        this.dragTimeId = 0;
        this.dragDelay = 200;
        this.tabSizeMap = new Map();
        this.tabRefMap = new Map();
        this.isFirst = true;

        this.state = {
            hideKeys : [],          // 隐藏的 panes
            drag : false,           // 当前是否处于拖拽中
        };

        this.onTabDown = this.onTabDown.bind(this);
        this.onTabClose = this.onTabClose.bind(this);

        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseUpHandler = this.onMouseUpHandler.bind(this);
    }

    componentDidMount() {
        this.isFirst = false;
        this.updateRect();
        this.updateHideKeys();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.isFirst = true;
        this.state.hideKeys = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 初次执行 render 结束后，所有的节点都能拿到
        if(this.isFirst){
            this.isFirst = false;
            this.updateRect();
            this.updateHideKeys();
        }
        else{
            // 更新 more tab 的位置
            const ref = this.getTabRef(MoreTab.KEY);
            if(!ref || !ref.current){
                return;
            }
            const rect = ReactDOM.findDOMNode(ref.current).getBoundingClientRect();
            this.tabSizeMap.set(MoreTab.KEY, rect);
        }
    }

    updateRect() {
        this.tabRefMap.forEach((ref, key)=>{
            if(ref.current){
                const rect = ReactDOM.findDOMNode(ref.current).getBoundingClientRect();
                this.tabSizeMap.set(key, rect);
            }
        },this);
    }

    updateHideKeys() {
        this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const {tabSizeMap} = this;
        const {panes} = this.props;
        const hideKeys = [];
        for (let i = 0; i < panes.length; i++) {
            const {tabKey} = panes[i].props;
            const tabRect = tabSizeMap.get(tabKey);
            let right = this.rect.right;
            if(i<panes.length-1){
                right = this.rect.right - tabSizeMap.get(MoreTab.KEY).width;
            }
            if(tabRect.right > right){
                hideKeys.push(tabKey);
            }
        }

        // 与之前的 hideKeys 比较
        const oldHideKeys = this.state.hideKeys.concat();
        oldHideKeys.sort((keyA, keyB)=>{return keyA<keyB?-1:1});
        hideKeys.sort((keyA, keyB)=>{return keyA<keyB?-1:1});
        let needUpdate = false;
        if(hideKeys.length === oldHideKeys.length){
            for (let i = 0; i < hideKeys.length; i++) {
                if(hideKeys[i] !== oldHideKeys[i]){
                    needUpdate = true;
                    break;
                }
            }
        }
        else{
            needUpdate = true;
        }
        if(needUpdate){
            this.setState({
                hideKeys : hideKeys
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMoveHandler);
        document.removeEventListener('mouseup', this.onMouseUpHandler);
    }

    render() {
        const {className} = this.props;
        const classNames = classname("easy-tabs","tabNav",
            {[`${className}`]: className!==undefined});
        return (
           <div className={classNames}>
               {this.renderTabs()}
               {this.renderMoreTab()}
               {this.renderFloatTab()}
           </div>
        )
    }

    renderFloatTab() {
        const {activeKey, showCloseButton, panes, className} = this.props;
        const {drag} = this.state;
        if(!drag){
            return;
        }
        let paneTitle;
        let paneRect;
        for (let i = 0; i < panes.length; i++) {
            const {title, tabKey} = panes[i].props;
            if(tabKey === activeKey){
                paneTitle = title;
                paneRect = this.tabSizeMap.get(activeKey);
                break;
            }
        }
        if(!paneRect){
            return;
        }
        const style = {};
        style.position = "fixed";
        style.filter = "drop-shadow(0px 0px 3px black)";
        style.zIndex = 100;
        style.height = paneRect.height + "px";
        style.top = paneRect.y;
        style.left = Math.max(paneRect.x, this.rect.x);
        style.left = Math.min(style.left, this.rect.width-paneRect.width+this.rect.x);
        style.cursor = 'grabbing';
        return <Tab className={className} style={style} title={paneTitle} selected={true} showCloseButton={showCloseButton}/>
    }

    renderMoreTab() {
        const {className} = this.props;
        const {hideKeys} = this.state;
        if (!this.tabSizeMap.get(MoreTab.KEY) || hideKeys.length > 0) {
            return <MoreTab ref={this.getTabRef(MoreTab.KEY)}
                            className={className}
                            onClick={this.onTabDown}/>
        }
        return null;
    }

    renderTabs() {
        const {activeKey, showCloseButton, panes, className} = this.props;
        const {hideKeys, drag} = this.state;

        const list = [];
        for (let i = 0; i < panes.length; i++) {
            const {title, tabKey} = panes[i].props;
            if (hideKeys.indexOf(tabKey) !== -1) {
                continue;
            }
            list[i] = <Tab ref={this.getTabRef(tabKey)}
                           key={tabKey}
                           tabKey={tabKey}
                           title={title}
                           className={className}
                           showCloseButton={showCloseButton}
                           selected={tabKey === activeKey}
                           onDown={this.onTabDown}
                           onClose={this.onTabClose}
                           opacity={activeKey === tabKey && drag ? 0 : 1}
            />;
        }
        return list;
    }

    onTabDown(key, position) {
        // 点击了扩展tab
        if(key === MoreTab.KEY){
            const {onMoreTab, panes} = this.props;
            const {hideKeys} = this.state;
            if(onMoreTab){
                const hideList = [];
                for (let i = 0; i < panes.length; i++) {
                    const {tabKey, title} = panes[i].props;
                    if(hideKeys.indexOf(tabKey) !== -1){
                        hideList.push({title:title, key:tabKey});
                    }
                }
                onMoreTab.call(this, hideList, this.tabSizeMap.get(key));
            }
            return;
        }

        const {onChange, activeKey} = this.props;
        if(key !== activeKey && onChange){
            onChange.call(this, key);
        }

        //计时判断拖拽
        document.addEventListener('mouseup', this.onMouseUpHandler);
        clearTimeout(this.dragTimeId);
        this.dragTimeId = TimerHelper.setTimeout(()=>{
            this.onTabDrag(position);
        }, this, this.dragDelay);
    }

    onTabDrag(position) {
        document.addEventListener('mousemove', this.onMouseMoveHandler);
        this.lastX = position.globalX;
        this.setState({
            drag : true
        });
    }

    onMouseMoveHandler(e) {
        const dx = e.pageX - this.lastX;

        const {activeKey, panes} = this.props;
        const newPanes = panes.concat();
        this.tabSizeMap.get(activeKey).x += dx;
        this.setState({
            drag : true
        });
        this.lastX = e.pageX;

        newPanes.sort((paneA, paneB)=>{
            const keyA = paneA.props.tabKey;
            const keyB = paneB.props.tabKey;
            const rectA = this.tabSizeMap.get(keyA);
            const rectB = this.tabSizeMap.get(keyB);
            if(rectA && rectB){
                return rectA.x<rectB.x?-1:1;
            }
            else if(rectA && !rectB){
                return -1;
            }
            else if(rectB && !rectA){
                return 1;
            }
            else{
                return 0;
            }
        });

        //对比是否发生变化
        let isSort = false;
        for (let i = 0; i < panes.length; i++) {
            const orgKey = panes[i].props.tabKey;
            const newKey = newPanes[i].props.tabKey;
            if(orgKey !== newKey){
                isSort = true;
                break;
            }
        }
        if(isSort){
            const {onSort} = this.props;
            if(onSort){
                const list = [];
                for (let j = 0; j < newPanes.length; j++) {
                    const {tabKey, title, children} = newPanes[j].props;
                    list[j] = {key:tabKey, title:title, content:children};
                }
                onSort.call(this, list);
            }
        }
    }

    onMouseUpHandler() {
        clearTimeout(this.dragTimeId);
        document.removeEventListener('mousemove', this.onMouseMoveHandler);
        document.removeEventListener('mouseup', this.onMouseUpHandler);

        this.updateRect();
        this.setState({
            drag : false
        });
    }

    onTabClose(key) {
        const {onClose} = this.props;
        if(onClose){
            onClose.call(this, key);
        }
    }

    getTabRef(key) {
        let ref = this.tabRefMap.get(key);
        if(!ref){
            ref = React.createRef();
            this.tabRefMap.set(key, ref);
        }
        return ref;
    }
}