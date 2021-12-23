import React, { Component } from 'react'
import { Table, Button, Popconfirm, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'

export default class CharList extends Component {

    state = {
        // 默认权限编辑框是否显示
        isModalVisible: false,
        // 角色列表
        charList: [],
        // Table上方选项
        columns: [{
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {

                return <div>
                    <Popconfirm
                        title="确定要删除此角色吗?"
                        onConfirm={() => this.confirm(item)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                        disabled={item.id===1?true:false}
                    >
                        <Button danger disabled={item.id===1?true:false} shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                    &nbsp;



                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        this.setState({ isModalVisible: true })
                        this.setState({ currentList : item.rights})
                        this.setState({ currentId : item.id})
                    }} />




                </div>
            }
        }],
        // 每个人的权限列表
        treeData: [],
        // 保存当前选中的角色的权限列表
        currentList:[],
        // 选中的当前项的id
        currentId:0
    }

    confirm = (item) => {
        axios.delete(`/roles/${item.id}`)
        const charList = this.state.charList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({charList})
    }

    handleOk = () => {
        axios.patch(`/roles/${this.state.currentId}`,{
            rights:this.state.currentList
        })
        
        this.setState({ isModalVisible: false })
        this.componentDidMount()
    }
    
    handleCancel = () => {
        this.setState({ isModalVisible: false })
    }

    onCheck = (checkKeys) => {
        console.log(checkKeys)
        this.setState({currentList : checkKeys})
    }


    componentDidMount() {
        axios.get("/roles").then((response) => {
            this.setState({ charList: response.data })
        })
        axios.get("/rights?_embed=children").then((response) => {
            this.setState({ treeData: response.data })
        })
    }


    render() {
        return (
            <div>

                <Table className='scrollbarCh' dataSource={this.state.charList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item => item.id} />


                <Modal title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Tree
                        // 是否可选
                        checkable
                        // 受控
                        checkedKeys={this.state.currentList}
                        // 主体数据
                        treeData={this.state.treeData}
                        // 勾选之后的回调
                        onCheck={this.onCheck}
                        // 父子节点不关联
                        checkStrictly = {true}
                    />
                </Modal>
            </div>

        )
    }
}
