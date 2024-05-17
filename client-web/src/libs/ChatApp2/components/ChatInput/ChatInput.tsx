import React from 'react'
import { ModelChat } from "../../models"

import "./ChatInput.scss"
import { actionPostMessage } from '../../actions';
import SendFileButton from '../SendFileButton/SendFileButton';

const MAX_MESSAGE_LENGTH = 1000;
const TEXTAREA_PADDINGS = 20;
const TEXTAREA_LINE_HEIGHT = 20;
const TEXTAREA_CONTAINER_MARGINS = 40;


interface Props {
    chatId: string;
    chat: ModelChat;
    visible: boolean;
    check_before_unload: boolean;
    on_input_resize: (next_height_value?: number) => void;
}

const drafts: {
    [key: string]: string;
} = {};

export default class ChatInput extends React.Component<Props> {
    static defaultProps = {
        check_before_unload: true,
    };

    ref_root: HTMLDivElement | null;
    ref_textarea: HTMLTextAreaElement | null;
    rows_num: number;

    state = {
        input: '',
        is_action_menu_visible: false,
    };

    constructor(props: Props) {
        super(props);

        this.rows_num = 1;
    }

    componentDidMount() {
        this.load_draft();

        this.focus();
        this.props.on_input_resize();
    }

    componentDidUpdate(prev_props: Props) {
        if (this.props.visible && this.props.visible !== prev_props.visible) {
            this.focus();
        }
    }

    render() {
        return (
            <div className="ChatInput" ref={ (root) => this.ref_root = root }>
                { this.render_actions_desktop() }
                <textarea rows={ 1 } className="ChatInput__textarea" ref={ textarea => this.ref_textarea = textarea }
                    value={ this.state.input }
                    placeholder="Write message..."
                    onChange={ this.on_textarea_change }
                    onKeyDown={ this.on_textarea_keydown }
                />
                { this.state.input && (
                    <span
                        className="ChatInput__send-button"
                        title="Отправить"
                        onClick={ this.on_send_button_click }
                    />
                ) }
            </div>
        )
    }

    render_actions_desktop = (): JSX.Element => {
        return (
            <div className="ChatInput__actions">
                <SendFileButton
                    class_name="ChatInput__action-button ChatInput__file"
                    on_file_upload={ this.on_file_change }
                    accept_mime={ 'image/*' }
                />
            </div>
        );
    }

    on_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('upload file')
    }

    
    on_textarea_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.set_input(e.target.value);
    }

    on_textarea_keydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.keyCode !== 13) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if ((e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) && this.ref_textarea) {
            const cursor_position = this.ref_textarea.selectionStart;
            const input = this.state.input.substr(0, cursor_position) + '\n' + this.state.input.substr(cursor_position);
            this.set_input(input, cursor_position + 1);

        } else {
            this.on_send_button_click();
        }
    }

    on_send_button_click = () => {
        const input = trim_input(this.state.input);
        if (!input) {
            return;
        }

        this.set_input('');

        actionPostMessage(this.props.chatId, input);
    }

    focus() {
        if (this.ref_textarea && this.ref_root) {
            if (this.ref_root.clientWidth > 414) {
                this.ref_textarea.focus();
            }
        }
    }

    load_draft = () => {
        const chatId = this.props.chatId;

        const draft = drafts[ chatId ];
        if (draft) {
            this.set_input(draft);
        }
    }

    set_input = (input: string, cursor_position?: number) => {
        input = input.substr(0, MAX_MESSAGE_LENGTH);

        drafts[ this.props.chatId ] = input;

        this.setState(
            {
                input: input,
            },
            () => {
                this.adjust_textarea_size();

                if (cursor_position != null) {
                    window.setTimeout(() => {
                        if (this.ref_textarea) {
                            this.ref_textarea.selectionStart = cursor_position;
                            this.ref_textarea.selectionEnd = cursor_position;
                        }
                    }, 0);
                }
            },
        );
    }

    
    adjust_textarea_size = () => {
        const textarea = this.ref_textarea;
        if (textarea) {
            textarea.rows = 1;
            const current_scroll_height = textarea.scrollHeight;

            const next_rows_num = get_rows_num(current_scroll_height);
            textarea.rows = get_rows_num(current_scroll_height);

            if (next_rows_num !== this.rows_num) {
                this.rows_num = next_rows_num;
                this.props.on_input_resize(current_scroll_height + TEXTAREA_CONTAINER_MARGINS);
            }
        }
    }
}

function get_rows_num(scrollHeight: number): number {
    return Math.floor((scrollHeight - TEXTAREA_PADDINGS) / TEXTAREA_LINE_HEIGHT);
}

function trim_input(input: string) {
    return input
        .replace(/^\s*/, '')
        .replace(/\s*$/, '');
}
