const isLoading = false;

export default function triggerReducer(preState=isLoading,action) {
    const {type,data} = action
    switch(type) {
    case 'change_loading':
       
        return data
    default:
        return preState
    }
}