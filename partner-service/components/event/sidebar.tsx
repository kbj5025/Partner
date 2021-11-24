import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <div className="d-flex">
      <nav className={styles.nav}>
        <input className={styles.input} placeholder="Search..." />
        <Link href="/applyprofile">
          <a>입점 프로필</a>
        </Link>
        <br></br>
        <Link href="/event">
          <a>이벤트 관리</a>
        </Link>
        <br></br>
        <Link href="/event/reservemain">
          <a>상담 예약 관리</a>
        </Link>
        <br></br>
        <Link href="/eventchart">
          <a>현황</a>
        </Link>
      </nav>
    </div>
  );
}
