/**
 * Created by blues on 2019-04-08.
 */

export default class TabsHelper {

    /**
     *
     * @param state
     * @param closeKey
     * @returns {{panes: Array, activeKey: string}}
     */
    static tabClose(state, closeKey) {
        const {activeKey, panes} = state;
        const newPanes = [];
        let newActiveKey = activeKey;
        for (let i = 0; i < panes.length; i++) {
            if(closeKey === panes[i].key){
                if(closeKey === activeKey){
                    if(i+1<panes.length){
                        newActiveKey = panes[i+1].key;
                    }
                    else{
                        if(newPanes.length>0){
                            newActiveKey = newPanes[newPanes.length-1].key;
                        }
                        else{
                            newActiveKey = '';
                        }
                    }
                }
            }
            else{
                newPanes.push(panes[i]);
            }
        }
        return {
            panes : newPanes,
            activeKey : newActiveKey
        }
    }
}