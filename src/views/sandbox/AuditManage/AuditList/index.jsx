import axios from 'axios'
import React, { Component } from 'react'
import { Table, Tag, Button,notification } from 'antd'

export default class AuditList extends Component {

    state = {
        auditList :[],
        columns: [{
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                return <div>
                          {
                              auditState===1&&<Tag color={'orange'}>正在审核</Tag>
                          }
                          {
                              auditState===2&&<Tag color={'green'}>已通过</Tag>
                          }
                          {
                              auditState===3&&<Tag color={'red'}>未通过</Tag>
                          }
                </div>
            }
        },
        {
            // 删除操作
            title: '操作',
            render: (item) => {
                return <div>
                          {
                              item.auditState===1&&<Button type="primary" onClick={()=>this.stateOperate(item,1)}>撤销</Button>
                          }
                          {
                              item.auditState===2&&<Button type="primary" onClick={()=>this.stateOperate(item,2)}>发布</Button>
                          }
                          {
                              item.auditState===3&&<Button type="primary" onClick={()=>this.stateOperate(item,3)}>修改</Button>
                          }
                        </div>
            }
        }]
    }
    stateOperate = (item,stateCode) => {
        axios.patch(`/news/${item.id}`,{
            auditState:stateCode,
            publishState:stateCode===2?2:0,
            publishTime:Date.now()
        }).then(() => {
            notification.open({
                message: '通知',
                description:`${stateCode===2?'您的新闻已发布！可以在“发布管理”中查看。':'您的新闻已被退至草稿箱中。'}`,
                placement:'bottomRight'
              })
        })
        const auditList = this.state.auditList.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({auditList})
    }
    


    componentDidMount() {
        const {username} = JSON.parse(localStorage.getItem('token'))[0]
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
            this.setState({auditList:res.data})
        })
        
    }

    render() {
        return (
            <div className="scrollbarFa">

                <Table className='scrollbarCh' dataSource={this.state.auditList} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item=>item.id}/>
            </div>
        )
    }
}
