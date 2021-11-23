import Layout from "../components/layout";
import Sidebar from "../components/event/sidebar";
import axios from "axios";

interface ApplyData {
  id: number;
  clinicName: string;
  clinicSector: string;
  clinicLocate: string;
  registrationNumber: string;
  dateOfEstablishment: string;
  phone: string;
  email: string;
  applicantName: string;
  admissionApplicationDate: string;
}

interface IndexProp {
  applys: ApplyData[];
}

const ApplyProfile = ({ applys }: IndexProp) => {
  return (
    <Layout>
      <br></br>
      <br></br>
      <div className="d-flex justify-content-center">
        <Sidebar />
        <div style={{ width: "70%" }}>
          <table className="table ms-5">
            {applys.map((applys: any, index: any) => (
              <tbody key={index}>
                <tr>
                  <th>병원명</th>
                  <td>{applys.clinicName}</td>
                </tr>
                <tr>
                  <th>병원업종</th>
                  <td>{applys.clinicSector}</td>
                </tr>
                <tr>
                  <th>사업자등록번호</th>
                  <td>{applys.clinicLocate}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.registrationNumber}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.dateOfEstablishment}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.phone}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.email}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.applicantName}</td>
                </tr>
                <tr>
                  <th>예약시간</th>
                  <td>{applys.admissionApplicationDate}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </Layout>
  );
};
export async function getServerSideProps() {
  const res = await axios.get<ApplyData[]>(`http://localhost:8080/applys`);
  const applys = res.data;

  return { props: { applys } };
}

export default ApplyProfile;
