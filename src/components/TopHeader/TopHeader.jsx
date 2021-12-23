import React, { Component } from 'react'
import { Layout, Menu, Dropdown,Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { withRouter } from 'react-router';
import { trigger } from '../../redux/actions/trigger';
import { connect } from 'react-redux';

const { Header } = Layout;



class TopHeader extends Component {

    state = {
       
    };

    toggle = () => {
        this.props.trigger()
    };

    exit = () => {
        localStorage.removeItem('token');
        this.props.history.replace('/login')
    }



    render() {
        const {username,role} = JSON.parse(localStorage.getItem('token'))[0]

        const menu = (
            <Menu>
                <Menu.Item key='1'>
                    <div target="_blank" rel="noopener noreferrer">
                        {role.roleName}
                    </div>
                </Menu.Item>
                
                <Menu.Item danger key='3'>
                    <div target="_blank" rel="noopener noreferrer" onClick={this.exit}>
                        退出
                    </div>
                </Menu.Item>
            </Menu>
        );
        return (
            <Header className="site-layout-background" style={{ padding: '0 16px' }}>
                {React.createElement(this.props.reduxState.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: this.toggle,
                })}
                <span>首页</span>
                <span style={{ float: 'right'}}>
                    欢迎<span style={{color:'rgb(16, 139, 255)'}}>&nbsp;{username}&nbsp;</span>回来&nbsp;
                    <Dropdown overlay={menu}  arrow>
                        <Avatar icon={<UserOutlined />} />
                    </Dropdown>
                </span>
            </Header>
        )
    }
}

export default withRouter(connect(
    state => ({reduxState:state}),
    {
        trigger:trigger
    }
)(TopHeader));




