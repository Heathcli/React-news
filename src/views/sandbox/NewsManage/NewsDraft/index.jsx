import React, { Component } from 'react'
import { Table,  Button, Popconfirm, message ,notification} from 'antd'
import axios from 'axios'
import { DeleteOutlined, VerticalAlignTopOutlined,FormOutlined } from '@ant-design/icons'

export default class NewsDraft extends Component {
      // 定义状态，保存从后端传过来的权限列表
    state = {
        newsList: [],
        columns: [{
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻名称',
            dataIndex: 'title',
            render:(title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render:(category) => {
                return category.title
            }
        },
        {
            // 删除操作
            title: '操作',
            render: (item) => {
                
                return <div>
                    <Popconfirm
                        title="确定要删除这条新闻吗?"
                        onConfirm={() => this.confirm(item)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <Button danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                    &nbsp;
                    <Button onClick={() => this.updata(item)} shape="circle" icon={<FormOutlined />} />
                    &nbsp;
                    <Popconfirm
                        title="确定要上传这条新闻吗?"
                        onConfirm={() => this.upload(item)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <Button shape="circle" icon={<VerticalAlignTopOutlined style={{color:'#1890ff'}}/>} />
                    </Popconfirm>
                    
                    
                    
                </div>
            }
        }]
    }
    // 上传
    upload = (item) => {
        axios.patch(`/news/${item.id}`,{
            auditState:1
        }).then(
            notification.open({
                message: '通知',
                description:`您可以到"审核列表"中查看新闻`,
                placement:'bottomRight'
              })
        )
        const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({newsList})
    }
    updata = (item) => {
        this.props.history.push(`/news-manage/update/${item.id}`)

    }

    // 删除操作
    deletePower = (item) => {
        axios.delete(`/news/${item.id}`);
        const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({newsList})
        
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
            const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({newsList})
        }else{
            axios.patch(`/children/${item.id}`)
            const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
            this.setState({newsList})
        }
        
    }

    componentDidMount() {
        const {username} = JSON.parse(localStorage.getItem('token'))[0]
        axios.get(`/news?auditState=0&author=${username}&_expand=category`).then((response) => {
            this.setState({ newsList: response.data })

        })
    }

    render() {
        return (
            <div className="scrollbarFa">

                <Table className='scrollbarCh' dataSource={this.state.newsList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item=>item.id}/>
            </div>
        )
    }
}
