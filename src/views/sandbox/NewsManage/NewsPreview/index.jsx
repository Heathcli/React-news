import React, { Component } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment'
// const { Paragraph } = Typography;
export default class NewsPreview extends Component {
    state = {
        newsInfo: null,
        auditStateText: ['未审核', '正在审核', '已通过', '未通过'],
        publishStateText: ['未发布', '待发布', '已发布', '已下线']
    }

    stateColor = (item) => {
        switch (item) {
            case 0:
                return '#cf1322'

            case 1:

                return '#fa8c16'
            case 2:

                return '#7cb305'
            case 3:

                return '#cf1322'
            default:
                return '#cf1322'
        }
    }

    componentDidMount() {
        axios.get(`/news?_expand=category&id=${this.props.match.params.id}`).then((res) => {
            this.setState({ newsInfo: res.data[0] })
        }
        )
    }


    render() {
        const { newsInfo, auditStateText, publishStateText } = this.state;
        return (
            <div>
                <PageHeader
                    onBack={() => window.history.back()}
                    title={newsInfo?.title}
                    subTitle={newsInfo?.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo?.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态" contentStyle={{color:this.stateColor(newsInfo?.auditState)}}>{auditStateText[newsInfo?.auditState]}</Descriptions.Item>
                        <Descriptions.Item label="发布状态" contentStyle={{color:this.stateColor(newsInfo?.publishState)}}>{publishStateText[newsInfo?.publishState]}</Descriptions.Item>
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
