import Layout from "../components/layout";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../provider";
import { addApply, ApplyItem } from "../provider/modules/apply";
import { Card } from "react-bootstrap";
import { requestAddApply } from "../middleware/modules/apply";

const Apply = () => {
  const router = useRouter();
  // 데이터 배열 가져오기
  const ApplyData = useSelector((state: RootState) => state.apply.data);
  // dispatch 함수 만들기
  const dispatch = useDispatch<AppDispatch>();

  // input ref객체
  const clinicNameInput = useRef<HTMLInputElement>(null);
  const clinicSectorInput = useRef<HTMLInputElement>(null);
  const clinicLocateInput = useRef<HTMLInputElement>(null);
  const registrationNumberInput = useRef<HTMLInputElement>(null);
  const dateOfEstablishmentInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const applicantNameInput = useRef<HTMLInputElement>(null);
  const admissionApplicationDateInput = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    const applyId = ApplyData[0] ? ApplyData[0].id + 1 : 1;

    const item: ApplyItem = {
      id: applyId,
      clinicName: clinicNameInput.current ? clinicNameInput.current.value : "",
      clinicSector: clinicSectorInput.current
        ? clinicSectorInput.current.value
        : "",
      clinicLocate: clinicLocateInput.current
        ? clinicLocateInput.current.value
        : "",
      registrationNumber: registrationNumberInput.current
        ? registrationNumberInput.current.value
        : "",
      dateOfEstablishment: dateOfEstablishmentInput.current
        ? dateOfEstablishmentInput.current.value
        : "",
      phone: phoneInput.current ? phoneInput.current.value : "",
      email: emailInput.current ? emailInput.current.value : "",
      applicantName: applicantNameInput.current
        ? applicantNameInput.current.value
        : "",
      admissionApplicationDate: admissionApplicationDateInput.current
        ? admissionApplicationDateInput.current.value
        : "",
    };

    //redux
    //dispatch(addApply(item));

    // saga action
    dispatch(requestAddApply(item));

    router.push(`/complete/${item.id}`);
  };

  return (
    <Layout>
      <article className="d-flex justify-content-center">
        <section>
          <br></br>
          <h3 className="d-flex justify-content-center">
            📜 입점 신청 페이지 📜
          </h3>
          <br></br>
          <div
            style={{
              display: "fixed",
            }}
          >
            {/* {!photoItem && (
          <div className="text-center my-5">데이터가 없습니다.</div>
        )} */}
            {/* {photoItem && ( */}

            <Card style={{ width: "370px", height: "350px" }}>
              <div className="border border dark">
                <div className="row g-3 align-items-center">
                  <div style={{ width: "150px" }}>
                    <label className="col-form-label">병원명 : </label>
                  </div>
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control"
                      ref={clinicNameInput}
                    />
                  </div>
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">병원업종 : </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={clinicSectorInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">사업자등록번호 : </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={registrationNumberInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">병원위치 :</label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={clinicLocateInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">설립일자 :</label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={dateOfEstablishmentInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">연락처 :</label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={phoneInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">Email : </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={emailInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">신청자명 : </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={applicantNameInput}
                  />
                </div>
              </div>
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">입점신청일 : </label>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    ref={admissionApplicationDateInput}
                  />
                </div>
              </div>
            </Card>

            <br></br>
            <div className="d-flex justify-content-center">
              <div style={{ margin: "auto 0" }}>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    handleAddClick();
                  }}
                >
                  + 입점 신청 하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default Apply;
