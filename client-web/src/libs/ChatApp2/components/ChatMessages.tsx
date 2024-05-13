import React from "react"
import { ModelChat } from "../models"

import "./ChatMessages.scss"

interface Props {
    chat: ModelChat
}

interface ScrollParams {
    top: number;
    height: number;
}

interface State {
    isDragging: boolean;
}

export default class ChatMessages extends React.Component<Props> {
    private scrollTimeout = 0;
    private scrollParams: ScrollParams | null = null;

    state: State;

    refChatMessages?: HTMLElement | null;
    refContent?: HTMLElement | null;


    constructor(props: Props) {
        super(props)

        this.state = {
            isDragging: false
        }
    }

    componentDidMount(): void {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        const content = this.refContent

        if (content) {
            const height = content.clientHeight
            const scrollHeight = content.scrollHeight

            if (scrollHeight > height) {
                content.scrollTop = scrollHeight - height
            }
        }
    }

    checkIfLoadMoreMessages = () => {
        this.getScrollParams()
    }

    getScrollParams = (): ScrollParams | null => {
        const content = this.refContent

        if (!content) {
            return null
        }

        return {
            top: content.scrollTop,
            height: content.scrollHeight
        }
    }

    render() {
        const messages = this.props.chat.messages

        let items;

        if (messages.length > 0) {
            items = messages.map((message, index) => {

            })
        }

        return (
            <div className="ChatMessages" ref={(el) => this.refChatMessages = el }>
                ChatMessages
            </div>
        )
    }
}