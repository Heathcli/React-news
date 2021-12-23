import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router';
import "./SideNav.css"
import { connect } from 'react-redux';
import axios from 'axios';
// import {

//     UserOutlined,
//     UploadOutlined,
// } from '@ant-design/icons';
// import Item from 'antd/lib/list/Item';
const { Sider } = Layout;
const { SubMenu } = Menu;


class SideNav extends Component {



    state = {
        MenuList: []
    }

    componentDidMount() {

        axios.get("/rights?_embed=children").then((response) => {
            // console.log(response.data);
            this.setState({ MenuList: response.data })
        })
    }

    render() {
        const selectKeys = this.props.history.location.pathname;
        const openKeys = ['/' + selectKeys.split('/')[1]]
        return (
            <Sider trigger={null} collapsible collapsed={this.props.reduxState.isCollapsed}>
                <div className="scrollbarFa">
                    <div className="logo" >{this.props.reduxState.isCollapsed?'新闻':'全球新闻发布管理系统'}</div>
                    <div className="scrollbarCh">
                        <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                            {/* 动态获取导航栏列表 */}
                            {
                                this.state.MenuList.map((item) => {
                                    // 若有子项 且 权限包括 就渲染
                                    if (item.children.length !== 0 && 
                                        // 因为更改过权限的角色的JSON下rigths下会多一个checked，不知道那些是更改过的，做一个判断
                                        (JSON.parse(localStorage.getItem('token'))[0].role.rights.checked ? 
                                        JSON.parse(localStorage.getItem('token'))[0].role.rights.checked.includes(item.key) : 
                                        JSON.parse(localStorage.getItem('token'))[0].role.rights.includes(item.key))
                                        ) {
                                        // 有下拉框的侧边栏

                                        return (<SubMenu key={item.key} title={item.title}>
                                            {

                                                item.children.map((child) => {
                                                    // 若有子项 且 为侧边栏 且 子项权限包括 就渲染
                                                    return (child.pagepermisson === 1&&(JSON.parse(localStorage.getItem('token'))[0].role.rights.checked ? 
                                                    JSON.parse(localStorage.getItem('token'))[0].role.rights.checked.includes(child.key) : 
                                                    JSON.parse(localStorage.getItem('token'))[0].role.rights.includes(child.key))) ?
                                                        <Menu.Item key={child.key} onClick={() => {
                                                            // 点击跳转到相应的模块
                                                            this.props.history.push(child.key)
                                                        }}>{child.title}</Menu.Item> :
                                                        null

                                                })
                                            }
                                        </SubMenu>)
                                    } else {
                                        // 若无下拉框且包括
                                        // 无下拉框的侧边栏
                                        return (item.pagepermisson === 1 && 
                                            (JSON.parse(localStorage.getItem('token'))[0].role.rights.checked ? 
                                            JSON.parse(localStorage.getItem('token'))[0].role.rights.checked.includes(item.key) : 
                                            JSON.parse(localStorage.getItem('token'))[0].role.rights.includes(item.key))
                                            ) ?
                                            (<Menu.Item key={item.key} onClick={() => {
                                                this.props.history.push(item.key)
                                            }}>
                                                {item.title}
                                            </Menu.Item>) :
                                            null
                                    }
                                })
                            }
                        </Menu>
                    </div>
                </div>
            </Sider>
        )
    }
}


export default withRouter(connect(
    state => ({reduxState:state})
)(SideNav))