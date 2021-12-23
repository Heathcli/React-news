import React, { Component } from 'react'
import Home from '../../views/sandbox/Home/Home'
import NoPermission from '../../views/sandbox/NoPermission'
import CharList from '../../views/sandbox/PowerManage/CharList'
import PowerList from '../../views/sandbox/PowerManage/PowerList'
import UserList from '../../views/sandbox/UserManage/UserList'
import { Redirect, Route, Switch } from 'react-router'
import NewsAdd from '../../views/sandbox/NewsManage/NewsAdd'
import NewsDraft from '../../views/sandbox/NewsManage/NewsDraft'
import NewsCategory from '../../views/sandbox/NewsManage/NewsCategory'
import AuditNews from '../../views/sandbox/AuditManage/AuditNews'
import AuditList from '../../views/sandbox/AuditManage/AuditList'
import Unpublished from '../../views/sandbox/PublishManage/Unpublished'
import Published from '../../views/sandbox/PublishManage/Published'
import Sunset from '../../views/sandbox/PublishManage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/NewsManage/NewsPreview'
import NewsUpdata from '../../views/sandbox/NewsManage/NewsUpdata'
import{ Spin} from 'antd'
import { connect } from 'react-redux'
import { loading } from '../../redux/actions/loading'




const LocalRouteMap = {
    '/home':Home,
    '/user-manage/list':UserList,
    '/right-manage/role/list':CharList,
    '/right-manage/right/list':PowerList,
    '/news-manage/add':NewsAdd,
    '/news-manage/draft':NewsDraft,
    '/news-manage/category':NewsCategory,
    '/news-manage/preview/:id':NewsPreview,
    '/news-manage/update/:id':NewsUpdata,
    '/audit-manage/audit':AuditNews,
    '/audit-manage/list':AuditList,
    '/publish-manage/unpublished':Unpublished,
    '/publish-manage/published':Published,
    '/publish-manage/sunset':Sunset,
}



class SwitchRoute extends Component {

    state = {BackRouteList:[]}

    componentDidMount() {
        Promise.all([ 
               axios.get('/rights'),
               axios.get('/children')
            ]).then((res) => {
               this.setState({BackRouteList:[...res[0].data,...res[1].data]})
            })
    }

    checkRoute = (item) => {
        return (LocalRouteMap[item.key] && (item.pagepermisson || item.routepermisson))
    }
    checkUserPermission = (item) => {
        const { role:{rights:{checked}}} = JSON.parse(localStorage.getItem('token'))[0]
        return (checked.includes(item.key))
    }



    render() {

        return (
            <div>
                <Spin size="large" spinning={this.props.reduxState.isLoading}>
                <Switch>
                    {
                        this.state.BackRouteList.map((item) => {
                            if(this.checkRoute(item)&&this.checkUserPermission(item)) {
                                return <Route path={item.key} key={item.key} component={LocalRouteMap[item.key]} exact></Route>
                            }
                            return null

                            
                        })
                    }
                    <Redirect path="/" to="/home" exact />
                    {
                        this.state.BackRouteList.length>0 && <Route path="*" component={NoPermission}></Route>
                    }
                </Switch>
                </Spin>
            </div>
        )
    }
}

export default connect(
    state => ({reduxState:state}),
    {
        isLoading:loading
    }
)(SwitchRoute);
