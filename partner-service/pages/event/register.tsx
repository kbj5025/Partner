import Layout from "../../components/layout";
import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { useRef } from "react";
import { EventItem, addEvent } from "../../provider/modules/event";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../provider";
import { requestAddEvent } from "../../middleware/modules/event";

const Register = () => {
  const router = useRouter();
  const eventData = useSelector((state: RootState) => state.event.data);
  const dispatch = useDispatch<AppDispatch>();

  const titleInput = useRef<HTMLInputElement>(null);
  const desc = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const priceInput = useRef<HTMLInputElement>(null);
  const clinicInput = useRef<HTMLInputElement>(null);
  const keywordSelect = useRef<HTMLSelectElement>(null);

  const handleAddClick = () => {
    if (fileInput.current?.files?.length) {
      const imageFile = fileInput.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const item: EventItem = {
          id: eventData.length > 0 ? eventData[0].id + 1 : 1,
          title: titleInput.current ? titleInput.current.value : "",
          photoUrl: reader.result ? reader.result.toString() : "",
          description: desc.current?.value,
          clinic: clinicInput.current ? clinicInput.current.value : "",
          price: priceInput.current ? priceInput.current.value : "",
          keyword: keywordSelect.current ? keywordSelect.current.value : "",
        };
        //redux
        //dispatch(addEvent(item));

        // saga action
        dispatch(requestAddEvent(item));

        router.push("/event");
      };
      reader.readAsDataURL(imageFile);
    }
  };
  return (
    <Layout>
      <article className="d-flex justify-content-center">
        <section>
          <div className="d-flex justify-content-center">
            <h2 style={{ fontWeight: "bold" }}>📌이벤트 등록📌</h2>
          </div>
          <Card style={{ width: "500px", height: "240px" }}>
            <div className="border border dark">
              <div className="row g-3 align-items-center">
                <div style={{ width: "150px" }}>
                  <label className="col-form-label">이벤트이미지 : </label>
                </div>
                <div className="col-auto">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    style={{ height: "33px" }}
                    ref={fileInput}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-label">병원명 : </label>
              </div>
              <div className="col-auto">
                <input type="text" className="form-control" ref={clinicInput} />
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-label">이벤트명 : </label>
              </div>
              <div className="col-auto">
                <input className="form-control" type="text" ref={titleInput} />
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-label">이벤트상세설명 :</label>
              </div>
              <div className="col-auto">
                <input className="form-control" ref={desc} />
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-labelclient">금액 :</label>
              </div>
              <div className="col-auto">
                <input className="form-control" type="text" ref={priceInput} />
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-label">시술키워드 :</label>
              </div>
              {/* <select className="client_cos">
                <option>1</option>
                <option>2</option>
              </select> */}
              <div className="col-auto">
                <select className="client_cos" ref={keywordSelect}>
                  <option>..</option>
                  <option>눈</option>
                  <option>코</option>
                  <option>턱</option>
                  <option>이마</option>
                  <option>주름</option>
                  <option>그 외</option>
                </select>
              </div>
            </div>
          </Card>
        </section>
      </article>
      <br></br>
      <br></br>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-dark"
          style={{ margin: "auto 0" }}
          onClick={() => {
            handleAddClick();
          }}
        >
          + 이벤트 등록하기
        </button>
      </div>
    </Layout>
  );
};

export default Register;
