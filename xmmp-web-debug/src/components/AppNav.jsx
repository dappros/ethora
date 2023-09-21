import {Link } from "react-router-dom";
import styles from "./AppNav.module.css"

import {useStore} from "../store/index"

export default function AppNav() {
  const xmppUser = useStore((state) => state.xmppUser)
  return (
    <div className={styles.nav}>
      {xmppUser.username}
      <Link to="/signIn">sign in</Link>
      <Link to="/dashboard">dashboard</Link>
      <Link to="/chat-login">chat login</Link>
      <Link to="/chats">chats</Link>
      <Link to="/debug">debug</Link>
    </div>
  );
}
