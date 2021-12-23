import React, { Component } from 'react'
import { Switch, Table, Popconfirm, Button, Modal, Form, Select, Input } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import AddUser from './AddUser'



const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const { Option } = Select;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};



export default class UserList extends Component {


    state = {
        // 若为全球管理员则禁用区域选项
        isdisable: false,
        // 编辑对话框隐藏弹出状态
        editVisible: false,
        // 当前选中的用户
        currentUser: [],
        // 当前登录的用户
        loginUser:[{}],
        // 渲染在页面的用户
        userList: [],
        // 动态生成的角色选项卡
        roleList: [],
        // 动态生成的地区选项卡
        regionList: [],
        columns: [{
            title: '区域',
            dataIndex: 'region',
            filters: [
                { text: '全球', value: '' },
                { text: '亚洲', value: '亚洲' },
                { text: '欧洲', value: '欧洲' },
                { text: '北美洲', value: '北美洲' },
                { text: '南美洲', value: '南美洲' },
                { text: '大洋洲', value: '大洋洲' },
                { text: '非洲', value: '非洲' },
                { text: '南极洲', value: '南极洲' },
              ],

            onFilter: (value, item) => item.region===value,
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <div>{role.roleName}</div>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (username) => {
                return <div>{username}</div>
            }
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onClick={() => this.changeRoleState(item)}></Switch>
            }
        },
        {
            // 删除操作
            title: '操作',
            render: (item) => {

                return <div>
                    {/* 如果item.default为真，则不添加点击事件 */}
                    {item.default ?

                        <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} /> :
                        <Popconfirm
                            title="确定要删除这位用户吗?"
                            onConfirm={() => this.confirm(item)}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                        >
                            <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} />
                        </Popconfirm>
                    }&nbsp;

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => {
                        setTimeout(() => {
                            
                            this.setState({ editVisible: true })
                            this.setState({ currentUser: item })

                            // 每次点击检测当前角色
                            if(this.state.currentUser.roleId === 1||this.state.loginUser.roleId!==1){
                                this.setState({ isdisable: true })
                            }else{
                                this.setState({ isdisable: false })
                            }
                                
                               
                            
                            this.editFormRef.current.setFieldsValue(item)
                        }, 0);
                    }} />


                </div>
            }
        }]
    }



    editFormRef = React.createRef();



    // 点击Switch改变当前角色状态并重新渲染
    changeRoleState = (item) => {
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState ? false : true
        })
        const userList = this.state.userList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({userList})
    }

    confirm = (item) => {
        axios.delete(`/users/${item.id}`)
        const userList = this.state.userList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({userList})
    }

    cancel = () => {
        return
    }

    onFinish = (values) => {

        axios.patch(`/users/${this.state.currentUser.id}`,
            {
                ...values,
                'roleState': true,
                'default': false
            })

        this.setState({ editVisible: false })
        this.componentDidMount()
    };

    changeEditVisible = () => {

        this.setState({ editVisible: false })
    
    }

    updata = () => {
        this.componentDidMount()
    }

    checkIsdisable = (item) => {
        console.log(item);
    }

    componentDidMount() {
        const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))[0]
        this.setState({loginUser:{roleId,region,username}})
        axios.get('/users?_expand=role').then((response) => {

            // 用户管理界面，除了全球管理员其他人智能看到低于自己等级的人和自己
            this.setState({userList:roleId===1?response.data:[
                ...response.data.filter(item =>item.username===username),
                ...response.data.filter(item =>item.roleId === 3 && item.region === region)
            ]})

            
        })
        axios.get('/regions').then((response) => {
            this.setState({ regionList: response.data })
        })
        axios.get('/roles').then((response) => {
            this.setState({ roleList: response.data })
        })


    }


    render() {
        return (
            <div className="scrollbarFa">

                <AddUser updata={()=>this.updata()}/>

                <Modal
                    visible={this.state.editVisible}
                    title="更新用户"
                    footer={null}
                    onCancel={() => this.changeEditVisible()}
                >
                    <Form {...layout} ref={this.editFormRef} name="control-ref" onFinish={this.onFinish} >

                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="region"
                            label="地区"
                            rules={[
                                {
                                    required: this.state.isdisable ? false : true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                disabled={this.state.isdisable}
                            >
                                {
                                    this.state.regionList.map((item) => {
                                        return <Option value={item.value} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="roleId"
                            label="角色"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Select
                                placeholder="选择角色"
                                allowClear
                                onChange={(value) => {
                                    if (value === 1) {
                                        this.setState({ isdisable: true })
                                        this.editFormRef.current.setFieldsValue({
                                            region: ''
                                        })
                                    } else {
                                        this.setState({ isdisable: false })
                                    }
                                }}
                                disabled={this.state.loginUser.roleId === 1?false:true}
                            >
                                {
                                    this.state.roleList.map((item) => {
                                        return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                                    })
                                }

                            </Select>
                        </Form.Item>


                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                更新
                            </Button>
                            <Button htmlType="button" onClick={() => this.changeEditVisible()}>
                                取消
                            </Button>

                        </Form.Item>

                    </Form>
                </Modal>

                <Table className='scrollbarCh' dataSource={this.state.userList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item => item.id} />
            </div>
        )
    }
}
