import axios from 'axios'
import React, { Component } from 'react'
import { Table, Button,notification } from 'antd'
import { CheckOutlined, CloseOutlined} from '@ant-design/icons'


export default class AuditNews extends Component {

    state = {
        auditNews:[],
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
            title: '操作',
            render: (item) => {
                return <div>
                          <Button onClick={()=>this.agree(item)} shape="circle" color={'green'} icon={<CheckOutlined style={{color:'green'}}/>}></Button>
                         &nbsp;
                          <Button onClick={()=>this.disagree(item)} shape="circle" color={'red'}  icon={<CloseOutlined style={{color:'red'}}/>}></Button>
                        </div>
            }
        }]
    }

    agree = (item) => {
        axios.patch(`/news/${item.id}`,{
            auditState:2,
            publishState:1
        }).then(() => {
            notification.open({
                message: '通知',
                description:'已批准此条新闻',
                placement:'bottomRight'
              })
        })
        const auditNews = this.state.auditNews.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({auditNews})
    }
    disagree = (item) => {
        axios.patch(`/news/${item.id}`,{
            auditState:3,
            publishState:0
        }).then(() => {
            notification.open({
                message: '通知',
                description:'未批准此条新闻',
                placement:'bottomRight'
              })
        })
        const auditNews = this.state.auditNews.filter((newItem)=>{return (newItem.id !== item.id)})
        this.setState({auditNews})
    }

    componentDidMount(){
        const {roleId,region} = JSON.parse(localStorage.getItem('token'))[0]
        axios.get(`/news?auditState=1&publishState_lte=1&_expand=category`).then((res) => {
            if(roleId===1){
                this.setState({auditNews:res.data})
            }else if(roleId===2) {
                const newNews = res.data.filter((item)=>{return (item.roleId!==1&&item.region===region)})
                this.setState({auditNews:newNews})
            }
        })
    }

    render() {
        return (
            <div className="scrollbarFa">

                <Table className='scrollbarCh' dataSource={this.state.auditNews} columns={this.state.columns} pagination={{
                    pageSize: 5
                }} rowKey={item=>item.id}/>
            </div>
        )
    }
}
