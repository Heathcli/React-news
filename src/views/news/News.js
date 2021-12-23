import React, { Component } from 'react'
import { PageHeader, Card, Col, Row,List } from 'antd'
import _ from 'lodash'
import axios from 'axios'

export default class News extends Component {

    state = { newsList: [] }

    componentDidMount() {
        axios.get('/news?publishState=2&_expand=category').then((res) => {

            this.setState({ newsList: Object.entries(_.groupBy(res.data, item => item.category.title)) })

        })
    }



    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    title="全球大新闻"
                    subTitle="查看新闻"
                />
                <div className="site-card-wrapper" style={{ width: '95%', margin: '0 auto' }}>
                    <Row gutter={[16, 16]}>
                        {
                            this.state.newsList.map((item) => {
                                return <Col span={8} key={item[0]}>
                                    <Card title={item[0]} bordered={false} hoverable={true} bodyStyle={{height:'220px'}}>
                                        <List
                                            size="small"
                                            pagination={
                                                {pageSize:3}
                                            }
                                            dataSource={item[1]}
                                            renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                        />
                                    </Card>
                                </Col>
                            })
                        }

                    </Row>
                </div>
            </div>
        )
    }
}
