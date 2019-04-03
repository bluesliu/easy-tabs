import React, {Component} from "react";
import Tabs from "../src";

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
                <Tabs selectedKey={"1"} tabs={tabs}/>
            </div>
        )
    }
}

