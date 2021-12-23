import React, { Component } from 'react'
import { Table, Tag, Button, Popconfirm, message,Popover,Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'



export default class PowerList extends Component {

    // 定义状态，保存从后端传过来的权限列表
    state = {
        powerList: [],
        columns: [{
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color='orange'>{key}</Tag>
            }
        },
        {
            // 删除操作
            title: '操作',
            render: (item) => {
                
                return <div>
                    <Popconfirm
                        title="确定要删除此权限吗?"
                        onConfirm={() => this.confirm(item)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <Button danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                    &nbsp;

                    <Popover content={<div style={{textAlign:'center'}}>
                        <Switch checked={item.pagepermisson} onClick={()=>this.changePower(item)}></Switch>
                    </div>} title="Title" trigger={item.pagepermisson!==undefined?'click':''}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined} />    
                    </Popover>
                    
                </div>
            }
        }]
    }

    // 删除操作
    deletePower = (item) => {
        if (item.grade === 1) {
            axios.delete(`/rights/${item.id}`);
            const powerList = this.state.powerList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({powerList})
        } else {
            axios.delete(`/children/${item.id}`);
            const powerList = this.state.powerList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({powerList})
        }
        
    }

    confirm = (item) => {
        this.deletePower(item);
        message.success('删除成功');
    }

    cancel = () => {
        return
    }

    changePower = (item) => {
        if(item.grade === 1){
            axios.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson?0:1
            })
            console.log(item);
            const powerList = this.state.powerList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({powerList})
        }else{
            axios.patch(`/children/${item.id}`)
            const powerList = this.state.powerList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({powerList})
        }
        
    }

    componentDidMount() {
        axios.get("/rights?_embed=children").then((response) => {
            response.data.map((item) => {
                return item.children.length === 0 ?
                    item.children = '' :
                    null
            })
            this.setState({ powerList: response.data })

        })
    }
    // 更新页面获取改变后的数据
    // UNSAFE_componentWillUpdate() {
    //     axios.get("/rights?_embed=children").then((response) => {
    //         response.data.map((item) => {
    //             return item.children.length === 0 ?
    //                 item.children = '' :
    //                 null
    //         })
    //         this.setState({ powerList: response.data })
    //     })
    // }




    render() {

        return (
            <div className="scrollbarFa">

                <Table className='scrollbarCh' dataSource={this.state.powerList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} />
            </div>
        )
    }
}
