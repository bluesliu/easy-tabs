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
            {key:"2", title: "title 2", content: <div>content 2</div>},
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
                <br/>
                <br/>
                <br/>
                <Tabs activeKey={this.state.activeKey}
                      onChange={this.onTabsChange}
                      onClose={this.onTabsClose}
                      onSort={this.onTabsSort}
                      className="my-easy-tabs">
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
        const tabs = this.state.panes;
        const idx = tabs.length + 1;
        tabs.push({title:"title "+idx, key:idx.toString(), content:<div>{"content "+idx}</div>});
        this.setState({panes:tabs});
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

