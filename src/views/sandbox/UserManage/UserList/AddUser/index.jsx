import React, { Component } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import axios from 'axios';

const { Option } = Select;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


export default class AddUser extends Component {

    state = {
        // Modal框是否显示
        visible: false,
        // Select是否被禁用
        isdisable: false,
        roleList: [],
        regionList: [],
        // 当前登录的用户
        loginUser: []
    }

    formRef = React.createRef();

    onFinish = (values) => {

        axios.post('/users',
            {
                ...values,
                'roleState': true,
                'default': false
            })

        this.setState({ visible: false })
        this.props.updata()
    };


    componentDidMount() {
        const { roleId, region} = JSON.parse(localStorage.getItem('token'))[0]
        this.setState({ loginUser: {roleId, region }})
        
        axios.get('/regions').then((response) => {
            this.setState({ regionList: response.data })
        })
        axios.get('/roles').then((response) => {
            this.setState({ roleList: response.data })
        })
    }


    render() {
        const { region, roleId } = this.state.loginUser
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        this.setState({ visible: true })
                    }}
                >
                    添加用户
                </Button>
                <Modal
                    visible={this.state.visible}
                    title="添加用户"
                    footer={null}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish} >

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
                                        return <Option value={item.value} key={item.id}
                                            disabled={roleId === 1 ? false : (
                                                region === item.value ? false : true
                                            )}
                                        >{item.title}</Option>
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
                                        this.formRef.current.setFieldsValue({
                                            region: ''
                                        })
                                    } else {
                                        this.setState({ isdisable: false })
                                    }


                                }}
                            >
                                {
                                    this.state.roleList.map((item) => {
                                        return <Option value={item.id} key={item.id}
                                        disabled={this.state.loginUser.roleId===1?false:(item.id===3?false:true)}
                                        >{item.roleName}</Option>
                                    })
                                }

                            </Select>
                        </Form.Item>


                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                            <Button htmlType="button" onClick={() => this.setState({ visible: false })}>
                                取消
                            </Button>

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
