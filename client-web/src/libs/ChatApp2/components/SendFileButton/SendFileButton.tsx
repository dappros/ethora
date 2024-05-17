import * as React from 'react';
import cn from 'classnames';

import './SendFileButton.scss';

interface Props {
    on_file_upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept_mime?: string;
    class_name?: string;
    children?: React.ReactNode
}

export function SendFileButton(props: Props) {
    const { class_name, on_file_upload, accept_mime, children } = props;
    return (
        <label className={cn('SendFileButton', class_name)} htmlFor="file">
            <input className="SendFileButton__input" id="file"
                type="file"
                multiple
                accept={accept_mime || 'image/*'}
                onChange={on_file_upload}
            />
            {children}
        </label>
    );
}

export default SendFileButton;
