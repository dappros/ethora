import cn from 'classnames'
import styles from './index.module.css'
import profileImg from '../../../assets/images/profilepic.png'

export function Message(props) {
    const {message} = props
    return (
        <div className={cn(styles.message, {[styles.incomming]: true})}>
            <div className={styles['avatar-wrapper']}>
                <img className={styles.avatar} src={profileImg} />
            </div>
            <div className={styles['content-wrapper']}>
                <div className={styles.content}>
                    <span className={styles.author}>
                        <strong>
                            {`${message.senderFirstName} ${message.senderLastName}`}
                        </strong>
                    </span>
                    <div>
                        {message.text}
                    </div>
                </div>
            </div>
        </div>
    )
}