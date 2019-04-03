/**
 * Created by blues on 2019-04-01.
 */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill"

import Tab from "./Tab";
import MoreTab from "./MoreTab";
import TabInfo from "./TabInfo";
import TimerHelper from "./TimerHelper";

export default class TabNav extends Component {
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

        // 初始化
        this.rect = null;
        this.moreTabRect = null;
        this.lastX = 0;
        this.dragTimeId = 0;
        this.dragDelay = 200;
        this.needUpdateRect = false;

        const tabInfoList = [];
        for (let i = 0; i < this.props.tabs.length; i++) {
            tabInfoList.push(new TabInfo(
                this.props.tabs[i].key,
                this.props.tabs[i].title,
                ));
        }

        this.state = {
            tabInfoList : tabInfoList,
            hideKeys : [],          // 隐藏的 tabs
            drag : false,           // 当前是否处于拖拽中
        };

        this.onTabDown = this.onTabDown.bind(this);
        this.onTabClose = this.onTabClose.bind(this);
        // this.onTabDragStart = this.onTabDragStart.bind(this);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseUpHandler = this.onMouseUpHandler.bind(this);
        this.onMoreTabDidMount = this.onMoreTabDidMount.bind(this);
        this.resizeObserver = new ResizeObserver(() => {
                this.onResize();
        });
    }

    componentDidMount() {
        this.resizeObserver.observe(ReactDOM.findDOMNode(this));
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMoveHandler);
        document.removeEventListener('mouseup', this.onMouseUpHandler);
        this.resizeObserver.disconnect();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.needUpdateRect){
            this.needUpdateRect = false;
            const {hideKeys, tabInfoList} = this.state;
            for (let i = 0; i < tabInfoList.length; i++) {
                if(hideKeys.indexOf(tabInfoList[i].key)===-1){
                    tabInfoList[i].updateRect();
                }
            }
            this.onResize();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // 同步 tabInfoList
        const {tabs} = nextProps;
        const tabInfoList = this.state.tabInfoList.concat();
        // 删除多余的tab
        for (let i = tabInfoList.length-1; i >= 0; i--) {
            let find = false;
            for (let j = 0; j < tabs.length; j++) {
                if(tabs[j].key === tabInfoList[i].key){
                    find = true;
                    break;
                }
            }
            if(!find){
                tabInfoList.splice(i,1);
            }
        }
        // 创建新的tab
        let lastIdx = -1;
        for (let i = 0; i < tabs.length; i++) {
            let find = false;
            for (let j = 0; j < tabInfoList.length; j++) {
                if(tabs[i].key===tabInfoList[j].key){
                    find = true;
                    lastIdx = j;
                    break;
                }
            }
            if(!find){
                lastIdx += 1;
                tabInfoList.splice(lastIdx, 0, new TabInfo(tabs[i].key, tabs[i].title))
            }
        }
        this.state.tabInfoList = tabInfoList;
        this.state.hideKeys.length = 0;
        this.needUpdateRect = true;
    }

    render() {
        return (
           <div className="easy-tabs-tabNav">
               {this.renderTabs()}
               {this.renderMoreTab()}
               {this.renderFloatTab()}
           </div>
        )
    }

    renderFloatTab() {
        const {selectedKey, showCloseButton} = this.props;
        const {drag} = this.state;
        if(!drag){
            return;
        }

        const info = this.getTab(selectedKey).clone();
        const style = {};
        style.position = "fixed";
        style.filter = "drop-shadow(0px 0px 3px black)";
        style.zIndex = 100;
        style.height = info.rect.height + "px";
        style.top = info.rect.y;
        style.left = Math.max(info.rect.x, this.rect.x);
        style.left = Math.min(style.left, this.rect.width-info.rect.width+this.rect.x);
        style.cursor = 'grabbing';
        return <Tab style={style} info={info} selected={true} showCloseButton={showCloseButton}/>
    }

    renderMoreTab() {
        const {hideKeys} = this.state;
        if (hideKeys.length > 0) {
            return <MoreTab onDidMount={this.onMoreTabDidMount}
                            onClick={this.onTabDown}/>
        }
        return null;
    }

    renderTabs() {
        const {selectedKey, showCloseButton} = this.props;
        const {hideKeys, tabInfoList, drag} = this.state;

        const list = [];
        for (let i = 0; i < tabInfoList.length; i++) {
            const tabInfo = tabInfoList[i];
            if (hideKeys.indexOf(tabInfo.key) !== -1) {
                continue;
            }
            list[i] = <Tab key={tabInfo.key}
                           info={tabInfo}
                           showCloseButton={showCloseButton}
                           selected={tabInfo.key === selectedKey}
                           onDown={this.onTabDown}
                           onClose={this.onTabClose}
                           opacity={selectedKey === tabInfo.key && drag ? 0 : 1}
            />;
        }
        return list;
    }

    onTabDown(key, position) {
        // 点击了扩展tab
        if(key === MoreTab.KEY){
            return;
        }

        const {onChange, selectedKey} = this.props;
        if(key !== selectedKey || onChange){
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
            ...this.state,
            drag : true
        });
    }

    onMouseMoveHandler(e) {
        const dx = e.pageX - this.lastX;

        const tabInfoList = this.state.tabInfoList.concat();
        const {selectedKey} = this.props;
        const downTab = this.getTab(selectedKey);
        downTab.rect.x += dx;
        tabInfoList.sort((tabA, tabB)=>{return (tabA.rect.x < tabB.rect.x) ? -1 : 1});

        //对比是否发生变化
        for (let i = 0; i < tabInfoList.length; i++) {
            if(tabInfoList[i].key !== this.state.tabInfoList[i].key){
                this.needUpdateRect = true;
                break;
            }
        }

        if(this.needUpdateRect){
            this.setState({
                ...this.state,
                drag : true,
                tabInfoList : tabInfoList
            });
        }
        else{
            this.setState({
                ...this.state,
                drag : true
            });
        }

        this.lastX = e.pageX;
    }

    onMouseUpHandler() {
        clearTimeout(this.dragTimeId);
        document.removeEventListener('mousemove', this.onMouseMoveHandler);
        document.removeEventListener('mouseup', this.onMouseUpHandler);

        // const {tabInfoList, hideKeys} = this.state;
        // for (let i = 0; i < tabInfoList.length; i++) {
        //     if(hideKeys.indexOf(tabInfoList[i].key)!==-1){
        //         tabInfoList[i].updateRect();
        //     }
        // }
        this.needUpdateRect = true;
        this.setState({
            ...this.state,
            drag : false
        });
    }

    onTabClose(key) {
        const {onClose} = this.props;
        if(onClose){
            onClose.call(this, key);
        }
    }

    onMoreTabDidMount(key, rect) {
        this.moreTabRect = rect;
    }

    /**
     * div 大小改变
     */
    onResize() {
        this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const divRect = this.rect;
        // 检查 tabs 的宽度是否大于 width
        const {tabInfoList} = this.state;
        const hideKeys = [];
        for (let i = 0; i < tabInfoList.length; i++) {
            let {key, rect:tabRect} = tabInfoList[i];
            let right = 0;
            if(this.state.hideKeys.length>0){
                right = divRect.right - this.moreTabRect.width;
            }else{
                right = divRect.right;
            }
            if(tabRect.right > right){
                hideKeys.push(key);
            }
        }
        this.setState({
            ...this.state,
            hideKeys: hideKeys
        })
    }

    /**
     *
     * @param key
     * @returns {TabInfo}
     */
    getTab(key){
        const {tabInfoList} = this.state;
        for (let i = 0; i < tabInfoList.length; i++) {
            if(key === tabInfoList[i].key){
                return tabInfoList[i];
            }
        }
        return null;
    }

    removeTab(key){
        const {tabInfoList} = this.state;
        for (let i = 0; i < tabInfoList.length; i++) {
            if(key === tabInfoList[i].key){
                tabInfoList.splice(i,1);
            }
        }
    }
}