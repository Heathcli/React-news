import React, { Component } from 'react'
import { Table, Button, Popconfirm, notification } from 'antd'
import axios from 'axios'

export default class PublishManage extends Component {

    state = {
        newsList: [],
        columns: [{
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
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
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {

                return <div>
                    {
                        this.props.publishCode === 1 && <Button type='primary' onClick={()=>this.publish(item)}>发布</Button>
                    }
                    {
                        this.props.publishCode === 2 && (<Popconfirm
                            title="要下线此条新闻吗？"
                            onConfirm={() => this.offline(item)}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                        >
                            <Button danger >下线</Button>
                        </Popconfirm>)
                    }
                    {
                        this.props.publishCode === 3 && (<Popconfirm
                            title="要删除此条新闻吗？"
                            onConfirm={() => this.delete(item)}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                        >
                            <Button danger>删除</Button>
                        </Popconfirm>)
                    }
                </div>
            }
        }]
    }

    publish = (item) => {
        axios.patch(`/news/${item.id}`,{
            publishState:2
        }).then(() => {
            notification.open({
                message: '通知',
                description:'您的新闻已发布！可以在“发布管理”中查看。',
                placement:'bottomRight'
              })
        })
        const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({newsList})

    }
    offline = (item) => {
        axios.patch(`/news/${item.id}`,{
            publishState:3
        }).then(() => {
            notification.open({
                message: '通知',
                description:'您的新闻已下线！可以在【已下线】中查看。',
                placement:'bottomRight'
              })
        })
        const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({newsList})
    }
    delete = (item) => {
        axios.delete(`/news/${item.id}`).then(() => {
            notification.open({
                message: '通知',
                description:'词条新闻已删除。',
                placement:'bottomRight'
              })
        })
        const newsList = this.state.newsList.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({newsList})
    }

    

    cancel = () => {
        return
    }


    componentDidMount() {
        const { username } = JSON.parse(localStorage.getItem('token'))[0]
        axios.get(`/news?author=${username}&publishState=${this.props.publishCode}&_expand=category`).then((response) => {
            this.setState({ newsList: response.data })

        })
    }

    render() {
        return (
            <div className="scrollbarFa">

                <Table className='scrollbarCh' dataSource={this.state.newsList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item => item.id} />
            </div>
        )
    }
}
