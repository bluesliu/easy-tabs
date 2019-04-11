# easy-drag-tabs

使用 `React` 实现的 Tabs 标签页组件。

![easy-tabs](https://ws1.sinaimg.cn/large/006tNc79gy1g1yjy2s8tlg308t09umyw.gif)


## Install

```bash
$ npm i easy-drag-tabs
```

## Demo

App.js

```jsx
import React, {Component} from "react";
import Tabs from "../src";
import "./my-easy-tabs.css";

const TabPane = Tabs.TabPane;
const TabsHelper = Tabs.TabsHelper;

export default class App extends Component {

    state = {
        activeKey: "1",
        panes: [
            {key: "1", title: "tab 1", content: <div>content 1</div>},
            {key: "2", title: "tab 2", content: <div>content 2</div>},
            {key: "3", title: "tab 3", content: <div>content 3</div>},
            {key: "4", title: "tab 4", content: <div>content 4</div>},
        ]
    };

    constructor(props) {
        super(props);
        this.addTab = this.addTab.bind(this)
        this.onTabsChange = this.onTabsChange.bind(this);
        this.onTabsClose = this.onTabsClose.bind(this);
        this.onSequenceChange = this.onSequenceChange.bind(this);
    }

    render() {
        return (
            <div>
                <button onClick={this.addTab}>添加tab</button>
                <Tabs activeKey={this.state.activeKey}
                      onChange={this.onTabsChange}
                      onClose={this.onTabsClose}
                      onSequenceChange={this.onSequenceChange}
                      customStyle="my-easy-tabs">
                    {this.renderTabs()}
                </Tabs>
            </div>
        )
    }

    renderTabs() {
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

    onTabsChange(activeKey) {
        console.log('onTabsChange')
        this.setState({activeKey: activeKey})
    }

    onTabsClose(closeKey) {
        console.log('onTabsClose')
        const newState = TabsHelper.tabClose(this.state, closeKey);
        this.setState(newState);
    }

    onSequenceChange(oldIndex, newIndex) {
        console.log('onSequenceChange', oldIndex, newIndex)
        TabsHelper.tabSwitch(this.state.panes, oldIndex, newIndex);
        this.setState({panes: this.state.panes});
    }

    addTab() {
        console.log('addTab', tabKey)
        const tabs = this.state.panes.concat();
        tabs.sort((tabA, tabB) => {
            return tabA.key < tabB.key ? 1 : -1
        });
        const maxTab = tabs[0];
        let tabKey;
        if (maxTab) {
            tabKey = parseInt(maxTab.key) + 1;
        } else {
            tabKey = 1;
        }
        this.state.panes.push({
            key: tabKey.toString(),
            title: "tab " + tabKey,
            content: <div>{"content " + tabKey}</div>
        });
        this.setState({
            panes: this.state.panes
        });
    }
}
```

my-easy-tabs.css

```css
.my-easy-tabs {
    --width: 300px;
    --height: 300px;

    --tabHeight: 25px;
    --tabMaxWidth: 180px;
    --tabMinWidth: 80px;
    --tabFontSize: 14px;
    --tabColor: #ffffff;
    --tabColor-unSel: #aaaaaa;

    --borderColor: #383838;
    --bgColor: #535353;
    --bgColor-unSel: #424242;
    --bgColor-unSel-hover: #4d4d4d;

    --contentColor: #ffffff;
    --contentFontSize: 14px;
}

.my-easy-tabs-menu {
    --minWidth: 100px;
    --maxWidth: 300px;
    --borderColor: #383838;
    --bgColor: #535353;
    --bgColor-hover: #777777;
    --titleColor: #ffffff;
    --titleColor-disabled: #aaaaaa;
    --dividerColor: #3c3c3c;
    --arrowColor: #ffffff;
    --fontSize: 14px;
    --shadow: 0 2px 8px rgba(0,0,0,0.3);

    --itemHeight: 22px;
    --itemPadding: 2px 8px;
}
```




## Update

| 版本  | 更新内容                |
| ----- | ----------------------- |
| 0.1.0 | 基本功能 |