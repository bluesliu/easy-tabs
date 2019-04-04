import React, {Component} from "react";
import Tabs from "../src";

const TabPane = Tabs.TabPane;

export default class App extends Component {

    state = {
        tabs : []
    };

    constructor(props){
        super(props);
        this.addTab = this.addTab.bind(this)
        this.onTabsChange = this.onTabsChange.bind(this);
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
                <Tabs activeKey={"1"} onChange={this.onTabsChange}>
                    {this.renderTabs()}
                </Tabs>
            </div>
        )
    }

    onTabsChange(activeKey, tabs) {
        this.state.tabs = tabs;
    }

    addTab() {
        const tabs = this.state.tabs;
        const idx = tabs.length + 1;
        tabs.push({title:"title "+idx, key:idx.toString(), content:<div>{"content "+idx}</div>});
        this.setState({tabs:tabs});
    }


    renderTabs(){
        const {tabs} = this.state;
        const list = [];
        for (let i = 0; i < tabs.length; i++) {
            const {title, key, content} = tabs[i];
            list.push(
                <TabPane title={title} key={key}>
                    {content}
                </TabPane>
            )
        }
        return list;
    }
}

