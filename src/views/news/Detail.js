import React, { Component } from 'react'
import { PageHeader, Descriptions, message } from 'antd';
import axios from 'axios';
import moment from 'moment'

import { HeartTwoTone } from '@ant-design/icons';

export default class Detail extends Component {
    state = {
        newsInfo: null,
        star:true
        
    }


    star = () => {
        this.state.star?
        this.setState({newsInfo:{...this.state.newsInfo,star:this.state.newsInfo.star+1},star:false},() => {
            axios.patch(`/news/${this.props.match.params.id}`,{
                star:this.state.newsInfo.star
            })
        }):
        message.info('您已经点过赞了！');
    }
   

    componentDidMount() {
        axios.get(`/news?_expand=category&id=${this.props.match.params.id}`).then((res) => {
            const newsView = {...res.data[0],view:res.data[0].view +1}
            this.setState({ newsInfo:newsView })
            return res.data[0]
        }).then(
            (res) => {
                axios.patch(`/news/${this.props.match.params.id}`,{
                    view:res.view+1
                })
            }
        )
    }


    render() {
        const { newsInfo} = this.state;
        return (
            <div>
                <PageHeader
                    onBack={() => window.history.back()}
                    title={newsInfo?.title}
                    subTitle={<div>
                       {newsInfo?.category.title}
                       &nbsp;
                       <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>this.star()}/>
                    </div>}
                    
                >  
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo?.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
                        <Descriptions.Item label="访问数量">{newsInfo?.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{newsInfo?.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">0</Descriptions.Item>

                    </Descriptions>
                    <div dangerouslySetInnerHTML = {
                       {  __html:newsInfo?.content}
                    } style={{marginTop:'10px',padding:'10px',border:'1px solid #ccc',borderRadius:'10px'}}></div>
                </PageHeader>

            </div>
        )
    }
}
