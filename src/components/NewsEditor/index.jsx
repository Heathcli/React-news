import React, { Component } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PubSub from 'pubsub-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export default class NewsEditor extends Component {

    constructor(props) {
        super(props);
        this.state = { initNewsInfo: '', editorState: '' }
    }
    componentDidMount() {
        // 消息订阅父组件NewsUpdata获取当前的文本信息
        this.token = PubSub.subscribe('getNewsInfo', (_, stateObj) => {
            // 因为setState异步更新所以选择回调形式
            this.setState({ initNewsInfo: stateObj.content }, () => {
                const html = this.state.initNewsInfo;
                const contentBlock = htmlToDraft(html);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                    const editorState = EditorState.createWithContent(contentState)
                    this.setState({ editorState })
                }
            });
        })
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    }


    render() {

        const { editorState } = this.state

        return (
            <div>
                <Editor
                    // defaultContentState={this.props.editorState}
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={(editorState) => this.setState({ editorState })}
                    onBlur={() => {
                        this.props.updataNewsContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    }}
                />
            </div>
        )
    }
}
