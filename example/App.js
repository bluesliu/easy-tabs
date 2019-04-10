import React, {Component} from "react";
import Tabs from "../src";
import "./my-easy-tabs.css";

const TabPane = Tabs.TabPane;
const TabsHelper = Tabs.TabsHelper;

export default class App extends Component {

    state = {
        activeKey : "1",
        panes : [
            {key:"1", title: "title 1", content: <div>content 1<br/>content 1<br/>content 1<br/>content 1<br/>content 1<br/>content 1</div>},
            {key:"2", title: "Title 2", content: <div>content 2</div>},
            {key:"3", title: "title 3", content: <div>content 3</div>},
            {key:"4", title: "title 4", content: <div>content 4</div>},
            ]
    };

    constructor(props){
        super(props);
        this.addTab = this.addTab.bind(this)
        this.onTabsChange = this.onTabsChange.bind(this);
        this.onTabsClose = this.onTabsClose.bind(this);
        this.onTabsSort = this.onTabsSort.bind(this);
    }

    render() {
        return (
            <div>
                <button onClick={this.addTab}>添加tab</button>
                <br/>
                <br/>
                <Tabs activeKey={this.state.activeKey}
                      onChange={this.onTabsChange}
                      onClose={this.onTabsClose}
                      onSort={this.onTabsSort}
                      customStyle="my-easy-tabs">
                    {this.renderTabs()}
                </Tabs>
            </div>
        )
    }

    onTabsChange(activeKey) {
        console.log('onTabsChange')
        this.setState({activeKey:activeKey})
    }

    onTabsClose(closeKey) {
        console.log('onTabsClose')
        const newState = TabsHelper.tabClose(this.state, closeKey);
        this.setState(newState);
    }

    onTabsSort(panes) {
        console.log('onTabsSort')
        this.setState({panes:panes})
    }

    addTab() {
        console.log('addTab')
        const tabs = this.state.panes.concat();
        tabs.sort((tabA, tabB)=>{return tabA.key<tabB.key?1:-1});
        const maxTab = tabs[0];
        let tabKey;
        if(maxTab){
            tabKey = parseInt(maxTab.key) + 1;
        }else{
            tabKey = 1;
        }
        console.log(tabKey)
        this.state.panes.push({title:"title "+tabKey, key:tabKey.toString(), content:<div>{"content "+tabKey}</div>});
        this.setState({panes: this.state.panes});
    }


    renderTabs(){
        const {panes} = this.state;
        const list = [];
        for (let i = 0; i < panes.length; i++) {
            const {title, key, content} = panes[i];
            list.push(
                <TabPane title={title} key={key}>
                    {content}
                </TabPane>
            )
        }
        return list;
    }
}

