import React, { Component } from 'react'
import { Card, Col, Row, Avatar, List, Drawer,Tabs  } from 'antd';
import { Pie } from '@ant-design/plots';
import { EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios'
import _ from 'lodash'
import "@ant-design/flowchart/dist/index.css"

const { Meta } = Card;
const { TabPane } = Tabs;

export default class Home extends Component {

    state = {
        viewList: [],
        starList: [],
        dataAll: [],
        dataMy: [],
        visible: false
    }

    showDrawer = () => {
        this.setState({ visible: true })
    }

    onClose = () => {
        this.setState({ visible: false })
    }

    componentDidMount() {
        // 请求观看最多列表
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(
            (res) => {
                this.setState({ viewList: res.data })
            }
        )
        // 请求点赞最多列表
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(
            (res) => {
                this.setState({ starList: res.data })
            }
        )
        //   请求发表的所有新闻
        axios.get(`/news?publishState=2&_expand=category`).then(
            (res) => {
                const middleData = []
                // 将返回的键值对数据转换成antd要求的数组集合形式
                const newsList = _.countBy(res.data, item => item.category.title)
                for (const key in newsList) {
                    middleData.push({ 'type': key, 'value': newsList[key] })
                }
                this.setState({ dataAll: middleData })
            }
        )
        //   请求当前人发表的所有新闻
        const { username } = JSON.parse(localStorage.getItem('token'))[0]
        axios.get(`/news?author=${username}&publishState=2&_expand=category`).then(
            (res) => {
                const middleData = []
                // 将返回的键值对数据转换成antd要求的数组集合形式
                const newsList = _.countBy(res.data, item => item.category.title)
                for (const key in newsList) {
                    middleData.push({ 'type': key, 'value': newsList[key] })
                }
                this.setState({ dataMy: middleData })
            }
        )
    }

    render() {
        const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))[0]
        return (
            <div className="site-card-wrapper">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="用户最常浏览" bordered={false}>
                            <List
                                size="large"
                                bordered={false}
                                dataSource={this.state.viewList}
                                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户点赞最多" bordered={false}>
                            <List
                                size="large"
                                bordered={false}
                                dataSource={this.state.starList}
                                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            style={{ width: '100% ' }}
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <PieChartOutlined key="edit" onClick={this.showDrawer} />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={username}
                                description={<div>
                                    <b>{region === "" ? '全球' : region}</b>&nbsp;
                                    {roleName}
                                </div>}
                            />
                        </Card>
                    </Col>
                </Row>
                <Drawer title="新闻数据分析" placement="right" onClose={this.onClose} visible={this.state.visible} width={'70%'}>

                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="全部新闻" key="1">
                        <Pie appendPadding={10}
                                data={this.state.dataAll}
                                angleField='value'
                                colorField='type'
                                radius={0.8}
                                label={{
                                    type: 'outer',
                                    content: '{name} {percentage}',
                                }}
                                interactions={[
                                    {
                                        type: 'pie-legend-active',
                                    },
                                    {
                                        type: 'element-active',
                                    },

                                ]} legend={{
                                    layout: 'horizontal',
                                    position: 'top'
                                }} padding={[100, 0, 0, 0]}></Pie>
                        </TabPane>
                        <TabPane tab="个人新闻" key="2">
                        <Pie appendPadding={10}
                                data={this.state.dataMy}
                                angleField='value'
                                colorField='type'
                                radius={0.8}
                                label={{
                                    type: 'outer',
                                    content: '{name} {percentage}',
                                }}
                                interactions={[
                                    {
                                        type: 'pie-legend-active',
                                    },
                                    {
                                        type: 'element-active',
                                    },

                                ]} legend={{
                                    layout: 'horizontal',
                                    position: 'top'
                                }} padding={[100, 0, 0, 0]}></Pie>
                        </TabPane>
                    </Tabs>
                </Drawer>
            </div>
        )
    }
}
