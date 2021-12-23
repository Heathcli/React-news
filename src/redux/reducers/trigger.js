const isCollapsed = false;

export default function triggerReducer(preState=isCollapsed,action) {
    const {type} = action
    switch(type) {
    case 'trigger':
        return !preState
    default:
        return preState
    }
}