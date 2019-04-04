import React, {Component} from "react";
import Tabs from "../src";

const TabPane = Tabs.TabPane;

export default class App extends Component {
    render() {
        const tabs = [{title:"title 1", key:"0"},
            {title:"title: 2", key:"1"},
            {title:"title: 3", key:"2"},
            {title:"title: 4", key:"3"}
            ];

        return (
            <div>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Tabs selectedKey={"tab1"}>
                    <TabPane title={"title 1"} key="tab1">
                        <div>content 1</div>
                    </TabPane>
                    <TabPane title={"title 2"} key="tab2">
                        content 2
                    </TabPane>
                    <TabPane title={"title 3"} key="tab3">
                        content 3
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

