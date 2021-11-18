import Layout from "../../components/layout";
import Sidebar from "../../components/event/sidebar";
import axios from "axios";

interface ReserveData {
  id: number;
  rezName: string;
  rezPhone: string;
  seeDate: string;
  seeTime: string;
  eventId: string;
}

interface IndexProp {
  reserves: ReserveData[];
}

const Reservemain = ({ reserves }: IndexProp) => {
  return (
    <Layout>
      <section>
        <div className="d-flex justify-content-center">
          <h2 style={{ fontWeight: "bold" }}>💊상담 예약 관리💊</h2>

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
              {reserves.map((reserves: any, index: any) => (
                <tbody key={index}>
                  <tr>
                    <td>{reserves.id}</td>
                    <td>{reserves.rezName}</td>
                    <td>{reserves.rezPhone}</td>
                    <td>{reserves.seeDate}</td>
                    <td>{reserves.seeTime}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
        <Sidebar />
      </section>
    </Layout>
  );
};
export async function getServerSideProps() {
  const res = await axios.get<ReserveData[]>(`http://localhost:8080/reserves`);
  const reserves = res.data;

  return { props: { reserves } };
}

export default Reservemain;
