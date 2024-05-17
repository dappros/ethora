import Avatar from 'react-avatar'
import { sha256 } from 'js-sha256'

import "./Ava.scss"

function pickColor(name: string) {
    const defaultColors = [
        '#A62A21',
        '#7e3794',
        '#0B51C1',
        '#3A6024',
        '#A81563',
        '#B3003C'
    ];

    return defaultColors[(parseInt(sha256(name).slice(0, 2), 16) % 6)]

}

interface Props {
    name: string
}

export function Ava({ name }: Props) {
    const color = pickColor(name)
    return (
        <div className="Ava">
            <Avatar size='42px' color={color} round name={name} />
        </div>
    )
}