import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <div className="d-flex">
      <nav className={styles.nav}>
        <input className={styles.input} placeholder="Search..." />
        <Link href="/">
          <a>파트너 정보</a>
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

        <Link href="/">
          <a>현황</a>
        </Link>
        <br></br>
      </nav>
    </div>
  );
}
