import Layout from "../../components/layout";
import Sidebar from "../../components/event/sidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../provider";
import event from "../../provider/modules/event";
import router, { useRouter } from "next/router";

interface ReserveData {
  id: number;
  rezName: string;
  rezPhone: string;
  seeDate: string;
  seeTime: string;
  eventId: string;
  eventName: string;
}

interface IndexProp {
  reserves: ReserveData[];
}

const Reservemain = ({ reserves }: IndexProp) => {
  return (
    <Layout>
      <br></br>
      <br></br>
      <section>
        <div className="d-flex justify-content-center">
          <Sidebar />
          <div style={{ width: "65vw" }} className="mx-auto">
            <br></br>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">이벤트 Id</th>
                  <th scope="col">이름</th>
                  <th scope="col">연락처</th>
                  <th scope="col">예약날짜</th>
                  <th scope="col">예약시간</th>
                  <th className="text-nowrap" scope="col">
                    예약순서
                  </th>
                </tr>
              </thead>
              {reserves.map((reserves: any, index: any) => (
                <tbody key={index}>
                  <tr>
                    <td>{reserves.eventId}</td>
                    <td>{reserves.rezName}</td>
                    <td>{reserves.rezPhone}</td>
                    <td>{reserves.seeDate}</td>
                    <td>{reserves.seeTime}</td>

                    <td>{reserves.id}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
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
