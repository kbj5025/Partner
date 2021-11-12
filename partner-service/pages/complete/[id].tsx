import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../provider";

const Complete = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const apply = useSelector((state: RootState) =>
    state.apply.data.find((item) => item.id === +id)
  );

  return (
    <Layout>
      <section>
        <div>
          <h2 className="title text-center">입점 신청이 완료 되었습니다 !!</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>병원명</th>
                <td>{apply && apply?.clinicName}</td>
              </tr>
              <tr>
                <th>병원업종</th>
                <td>{apply?.clinicSector}</td>
              </tr>
              <tr>
                <th>사업자등록번호</th>
                <td>{apply?.registrationNumber}</td>
              </tr>
              <tr>
                <th>병원위치</th>
                <td>{apply?.clinicLocate}</td>
              </tr>
              <tr>
                <th>설립일자</th>
                <td>{apply?.dateOfEstablishment}</td>
              </tr>
              <tr>
                <th>연락처</th>
                <td>{apply?.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{apply?.email}</td>
              </tr>
              <tr>
                <th>신청자명</th>
                <td>{apply?.applicantName}</td>
              </tr>
              <tr>
                <th>입점신청일</th>
                <td>{apply?.admissionApplicationDate}</td>
              </tr>
            </tbody>
          </table>

          <div className="btn-wrap d-flex">
            <div className="w-100 d-flex justify-content-center">
              <button
                className="btnSize btn btn-primary"
                onClick={() => {
                  router.push("/event");
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Complete;
