import axios from 'axios'
import React, { Component } from 'react'
import { Table, Button,Modal, Form, Input,Popconfirm  } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import AddCategory from './AddCategory'

export default class AuditList extends Component {

    state = {
        currentCategory:null,
        editVisible:false,
        categoryList: [],
        columns: [{
            title: 'id',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
        },
        {

            title: '操作',
            render: (item) => {
                return <div>
                    <Button shape='circle' onClick={() => {
                        setTimeout(() => {
                            this.setState({ editVisible: true })
                            this.setState({ currentCategory: item })
                            this.editFormRef.current.setFieldsValue(item)
                        }, 0);
                    }} type='primary' icon={<EditOutlined />}></Button>
                    &nbsp;
                    <Popconfirm
                        title="确定要删除此分类吗?"
                        onConfirm={() => this.confirm(item)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <Button shape='circle'danger icon={<DeleteOutlined />} ></Button>
                    </Popconfirm>
                    

                </div>
            }
        }]
    }

    editFormRef = React.createRef();

    updata = () => {
        this.componentDidMount()
    }

    confirm = (item) => {
        axios.delete(`/categories/${item.id}`)
        const categoryList = this.state.categoryList.filter((newItem) => { return (newItem.id !== item.id) })
        this.setState({ categoryList })
    }
    cancel = () => {
        return
    }

    changeEditVisible = () => {
        this.setState({editVisible: false})
    }

    onFinish = (value) => {
        axios.patch(`/categories/${this.state.currentCategory.id}`,{
            title:value.title,
            value:value.title
        })
        this.setState({editVisible: false})
        this.componentDidMount()
    }


    componentDidMount() {
        axios.get(`/categories`).then((res) => {
            this.setState({ categoryList: res.data })
        })

    }

    render() {
        return (
            <div className="scrollbarFa">
                <AddCategory updata={() => this.updata()}></AddCategory>
                <Modal
                    visible={this.state.editVisible}
                    title="更新用户"
                    footer={null}
                    onCancel={() => this.changeEditVisible()}
                >
                    <Form ref={this.editFormRef} name="control-ref" onFinish={this.onFinish} >

                        <Form.Item
                            name="title"
                            label="栏目名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                更新
                            </Button>
                            <Button htmlType="button" onClick={() => this.changeEditVisible()}>
                                取消
                            </Button>

                        </Form.Item>

                    </Form>
                </Modal>
                <Table className='scrollbarCh' dataSource={this.state.categoryList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item => item.id} />
            </div>
        )
    }
}
