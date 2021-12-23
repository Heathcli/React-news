import React, { Component } from "react";
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from "antd";
import axios from 'axios'
import "./index.css";
import PubSub from 'pubsub-js'
import NewsEditor from "../../../../components/NewsEditor";


const { Step } = Steps;
const { Option } = Select;

export default class NewsUpdata extends Component {


  state = {
    // 当前为第几步
    currentSteps: 0,
    // 储存从后端请求的分类列表
    categoryList: [],
    // 新闻主题内容
    newsContent:'',
    value:0,
    // 保存当前点击新闻的信息
    newsInfo: null
  };

  formRef = React.createRef();

  nextSteps = () => {
    const value = this.formRef.current.getFieldsValue('')


    // 新闻标题和分类不能为空
    if (value.title && value.category) {
      if(this.state.currentSteps === 1) {
        // 新闻主题内容不能为空
        if(this.state.newsContent ==='' || this.state.newsContent.trim() === '<p></p>'){
          message.warn('新闻内容不能为空')
        } else {
          this.setState({ currentSteps: this.state.currentSteps + 1 });
        }
      } else {
        this.setState({ currentSteps: this.state.currentSteps + 1 });
      }
    } else {
      this.formRef.current.validateFields()
    }
  };

  // 上一步
  preSteps = () => {
    this.setState({ currentSteps: this.state.currentSteps - 1 });
  };

  // 更新新闻主题内容状态
  updataNewsContent = (content) => {
    this.setState({newsContent:content})
  }

  saveNews = (auditState) => {
    const value = this.formRef.current.getFieldsValue('')
    const User = JSON.parse(localStorage.getItem('token'))[0]

    axios.patch(`/news/${this.props.match.params.id}`,{
      "title": value.title,
      "categoryId": this.state.value,
      "content":this.state.newsContent,
      "region": User.region===''?"全球":User.region,
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 1615778496314
    }).then(
      notification.open({
        message: '通知',
        description:`您可以到${auditState===0?'草稿箱':"审核列表"}中查看新闻`,
        placement:'bottomRight'
      }))
      this.props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
  }

  componentDidMount() {
    axios.get('/categories').then((res) => {
      this.setState({ categoryList: res.data })
    }).catch((err) => {
      alert(err)
    })
    axios.get(`/news?_expand=category&id=${this.props.match.params.id}`).then((res) => {
        // 此处和新闻编撰不一样，因为最后依靠状态的校验没有改变，要在这里请求最新的新闻信息储存在状态里，不然如果什么都不改变就是原始状态里的空值
        this.setState({ 
          newsInfo: res.data[0] ,
          value:res.data[0].categoryId,
          newsContent:res.data[0].content       
        },() => {
          PubSub.publish('getNewsInfo',{content:this.state.newsInfo.content})
        })
        this.formRef.current.setFieldsValue(res.data[0])
    }
    )
   
    
  }

  render() {
    const { currentSteps, categoryList,newsInfo } = this.state;
    return (
      <div>
        <PageHeader title="更新新闻" onBack={() => this.props.history.goBack()}/>
        <Steps current={currentSteps}>
          <Step title="基本信息" description="新闻标题、新闻分类" />
          <Step title="新闻内容" description="新闻主体内容" />
          <Step title="新闻提交" description="保存草稿或者提交审核" />
        </Steps>


        <div style={{ margin: '50px', padding: '10px 0 ' }}>
          <div className={currentSteps === 0 ? "" : "hide"}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={this.nextSteps}
              ref={this.formRef}
            >
              <Form.Item
                label="新闻标题"
                name="title"
                rules={[{ required: true, message: '请输入新闻标题！' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="新闻分类"
                name="category"
                rules={[{ required: true, message: '请选择新闻类别！' }]}
              >
                <Select labelInValue onSelect={value=>{this.setState({value:value.key})}}>
                  {
                    categoryList.map((item) => {
                      return <Option key={item.id} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form>
          </div>
          <div className={currentSteps === 1 ? "" : "hide"}>
            <NewsEditor content={newsInfo?.content} updataNewsContent={(content)=>this.updataNewsContent(content)}/>
          </div>
          <div className={currentSteps === 2 ? "" : "hide"}>

          </div>
        </div>


        {currentSteps === 2 && (
          <>
            <Button onClick={()=>this.saveNews(0)}>保存到草稿箱</Button>
          </>
        )
        }&nbsp;

        {currentSteps > 0 && <Button onClick={this.preSteps}>上一步</Button>}
        &nbsp;

        {currentSteps < 2 && (
          <Button type="primary" onClick={this.nextSteps}>
            下一步
          </Button>
        )}
      </div>
    );
  }
}
