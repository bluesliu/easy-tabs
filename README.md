# easy-collapse

使用 `React` 实现的折叠面板。


## Install

```bash
$ npm i easy-collapse
```


## Demo

```jsx
import React,{Component} from 'react';
import Collapse from "easy-collapse";

export default class App extends Component {
    render() {
        return (
            <div>
                <Collapse>
                    <Collapse.Panel title={"Panel 1"}>
                        content
                    </Collapse.Panel>
                    <Collapse.Panel title={"Panel 2"}>
                        content
                    </Collapse.Panel>
                </Collapse>
            </div>
        )
    }
}
```

![easy-collapse](https://ws1.sinaimg.cn/large/006tKfTcgy1g1hh917palg30bn07btaj.gif)

## Update

| 版本  | 更新内容                                                     |
| ----- | ------------------------------------------------------------ |
| 0.0.5 | 修复无法配置样式的BUG。 |
| 0.0.4 | 样式可配置。 |
| 0.0.2 | 修复箭头加载错误的问题。 |
| 0.0.1 | 实现基础功能。 |