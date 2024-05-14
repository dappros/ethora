import React from "react"
import { ModelChat, ModelChatMessage } from "../models"

import "./ChatMessages.scss"
import { isTheSameDay } from "../utils/isTheSameDay";
import { DateTime } from "luxon";
import { ChatDateDivider } from "./ChatDateDivider";
import { ChatMessage } from "./ChatMessage/ChatMessage";
import getChatLastMessage from "../utils/getChatLastMessage";
import { blockScroll } from "../utils/blockScroll";
import { actionLoadMoreMessages } from "../actions";
import getChatFirstMessage from "../utils/getChatFirstMessage";

interface Props {
    chat: ModelChat
    visible: boolean
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

        if (this.props.visible) {
            this.blockScroll()
        }

        if (this.refChatMessages) {
            this.refChatMessages.addEventListener('scroll', this.onScroll, true)
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (
            (this.props.chat.id !== prevProps.chat.id) ||
            (getChatLastMessage(this.props.chat) !== getChatLastMessage(prevProps.chat)) || // TODO check this
            (this.props.chat.hasLoaded !== prevProps.chat.hasLoaded)
        ) {
            this.scrollToBottom()
        }

        if (this.props.chat.id === prevProps.chat.id) {
            if (getChatFirstMessage(this.props.chat) !== getChatFirstMessage(prevProps.chat)) {
                if (this.scrollParams) {
                    const scrollParams = this.getScrollParams()

                    if (scrollParams && this.refContent) {
                        const scrollTop = this.scrollParams.top + (scrollParams.height - this.scrollParams.height)
                        this.refContent.scrollTop = scrollTop
                    }

                    this.scrollParams = null
                }
            }
        }
    }

    checkIfLoadMoreMessages = () => {
        const params = this.getScrollParams()

        if (!params) {
            return
        }

        const chat = this.props.chat

        if (params.top < 100 && !chat.allLoaded) {
            this.scrollParams = this.getScrollParams()
            actionLoadMoreMessages(this.props.chat.id)
        }
    }

    onScroll = () => {
        window.clearTimeout(this.scrollTimeout);
        this.scrollTimeout = window.setTimeout(() => this.checkIfLoadMoreMessages(), 50);
    }



    blockScroll = () => {
        if (this.refContent) {
            blockScroll(this.refContent)
        }
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

    isMessageFirstOfDate = (message: ModelChatMessage, index: number): boolean => {
        const messages = this.props.chat.messages

        return index === 0 || !isTheSameDay(DateTime.fromMillis(Number(message.created)), DateTime.fromMillis(Number(messages[index - 1].created)))
    }

    onDragSomething = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()

        switch (e.type) {
            case 'dragover':
            case 'dragenter': {
                this.setState({
                    isDragging: true,
                });

                break;
            }

            case 'dragleave':
            case 'dragend':
            case 'drop': {
                this.setState({
                    isDragging: false,
                });

                break;
            }
        }
    }

    render() {
        const messages = this.props.chat.messages
        const chat = this.props.chat

        let items;

        if (messages.length > 0 && chat.hasLoaded) {
            items = messages.map((message, index) => {
                return (
                    <React.Fragment key={message.id}>
                        {this.isMessageFirstOfDate(message, index) && (
                            <ChatDateDivider key={message.created} date={message.created} />
                        )}
                        <ChatMessage key={message.id} />
                    </React.Fragment>
                )

            })
        }

        let content;
        if (items) {
            let className = 'ChatMessages__content'

            if (this.state.isDragging) {
                className += ' ChatMesssages__content_dragging'
            }

            content = (
                <div
                    className={className}
                    ref={(content) => this.refContent = content}
                    onDrag={this.onDragSomething}
                    onDragEnd={this.onDragSomething}
                    onDragLeave={this.onDragSomething}
                    onDragExit={this.onDragSomething}
                    onDragOver={this.onDragSomething}
                    onDragEnter={this.onDragSomething}
                    onDragStart={this.onDragSomething}
                >
                    {items}
                </div>
            )
        }

        return (
            <div className="ChatMessages" ref={(el) => this.refChatMessages = el}>
                {content}
            </div>
        )
    }
}