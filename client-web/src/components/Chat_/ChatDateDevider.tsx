import {DateTime} from 'luxon'
import styles from "./ChatDateDevider.module.css"

type Props = {
    date: string
}

const dateFormatter = (date: DateTime) => {
    return date.toFormat('cccc, dd LLLL yyyy')
}

const isTheSameDate = (d1: DateTime, d2: DateTime) => {
    return ( d1.hasSame(d2, 'day') && d1.hasSame(d2, 'month') && d1.hasSame(d2, 'year') )
}

export const ChatDateDevider = (props: Props) => {
    const date = DateTime.fromMillis(Number(props.date))
    const today = DateTime.now()
    const yesterday = DateTime.now().minus({days: 1})

    let text = dateFormatter(date);

    if (isTheSameDate(date, today)) {
        text = "Today"
    }

    if (isTheSameDate(date, yesterday)) {
        text = "Yesterday"
    }

    return (
        <div className={styles.devider}>
            <span>{ text }</span>
        </div>
    )
}