import {Link } from "react-router-dom";
import styles from "./AppNav.module.css";

export default function AppNav() {
  return (
    <div className={styles.nav} style={{padding: '20px'}}>
      <Link to="/chat">chats</Link>
      <Link to="/">debug</Link>
    </div>
  );
}
