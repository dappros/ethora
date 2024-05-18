import "./Emoji.scss"

interface Props {
    code: string
}

export function Emoji({code}: Props) {
    let className = `emoji-chatapp emojisprite emoji-${code}`
    return (
        <span className={className}></span>
    )
}