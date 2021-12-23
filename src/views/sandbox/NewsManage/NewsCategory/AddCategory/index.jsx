import React, { Component } from 'react'
import { Modal, Form, Input,Button } from 'antd'
import axios from 'axios';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


export default class AddCategory extends Component {

    state = {
        // Modal框是否显示
        visible: false,
        // Select是否被禁用
        isdisable: false,
    }

    formRef = React.createRef();

    onFinish = (values) => {

        axios.post('/categories',
            {
                'title': values.title,
                'value': values.title
            })

        this.setState({ visible: false })
        this.props.updata()
    };


    


    render() {
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        this.setState({ visible: true })
                    }}
                >
                    添加栏目
                </Button>
                <Modal
                    visible={this.state.visible}
                    title="添加栏目"
                    footer={null}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish} >

                        <Form.Item
                            name="title"
                            label="分类名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写此项！'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                            <Button htmlType="button" onClick={() => this.setState({ visible: false })}>
                                取消
                            </Button>

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
