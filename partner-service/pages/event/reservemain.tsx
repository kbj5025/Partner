import Layout from "../../components/layout";
import Sidebar from "../../components/event/sidebar";
export default function Reservemain() {
  return (
    <Layout>
      <section>
        <div className="d-flex justify-content-center">
          <h2 style={{ fontWeight: "bold" }}>💊상담 예약 관리💊</h2>
        </div>

        <div style={{ width: "50vw" }} className="mx-auto">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col" style={{ width: "20%" }}>
                  번호
                </th>
                <th scope="col" style={{ width: "22%" }}>
                  이름
                </th>
                <th scope="col" style={{ width: "22%" }}>
                  연락처
                </th>
                <th scope="col" style={{ width: "21%" }}>
                  예약날짜
                </th>
                <th scope="col">예약시간</th>
              </tr>
            </thead>
            <tbody>
              <td scope="col" style={{ margin: "0 auto" }}>
                <tr> 0</tr>
              </td>
              <td scope="col" style={{ margin: "0 auto" }}>
                <tr>고봉준</tr>
              </td>
              <td scope="col" style={{ margin: "0 auto" }}>
                <tr>01073664355</tr>
              </td>
              <td scope="col" style={{ margin: "0 auto" }}>
                <tr>2021-12-15</tr>
              </td>
              <td scope="col" style={{ margin: "0 auto" }}>
                <tr>14:00~15:00</tr>
              </td>
            </tbody>
          </table>
        </div>
        <Sidebar />
      </section>
    </Layout>
  );
}
