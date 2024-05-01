type Props = {
    date: string
}

const ONE_DAY = 24 * 60 * 60 * 1000;

export const ChatDateDevider = ({date}: Props) => {
    return (
        <div>
            ChatDateDivider {date}
        </div>
    )
}