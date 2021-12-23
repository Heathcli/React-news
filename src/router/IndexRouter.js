import React, { Component } from 'react'
// 引入路由组件
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
// 引入Login组件
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
// 引入Sandbox组件
import NewsSandBox from '../views/sandbox/NewSandBox'

export default class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                {/* Switch匹配到第一个不再匹配 */}
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/news" component={News}/>
                    <Route path="/detail/:id" component={Detail}/>
                    {/* <Route path="/" component={NewsSandBox}/> */}
                    <Route path="/" render={() => 
                        localStorage.getItem("token")?
                        <NewsSandBox></NewsSandBox>:
                        <Redirect to="/login"/>
                    }/>
                </Switch>
            </HashRouter>
        )
    }
}
