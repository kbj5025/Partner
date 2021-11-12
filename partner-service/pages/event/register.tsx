import Layout from "../../components/layout";
import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { useRef } from "react";
import { EventItem, addEvent } from "../../provider/modules/event";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../provider";

const Register = () => {
  const router = useRouter();
  const reviewData = useSelector((state: RootState) => state.event.data);
  const dispatch = useDispatch<AppDispatch>();

  const title = useRef<HTMLInputElement>(null);
  const desc = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const clinic = useRef<HTMLInputElement>(null);
  const keyword = useRef<HTMLSelectElement>(null);

  const handleAddClick = () => {
    if (file.current?.files?.length) {
      const imageFile = file.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const item: EventItem = {
          id: reviewData.length > 0 ? reviewData[0].id + 1 : 1,
          title: title.current ? title.current.value : "",
          eventPhotoUrl: reader.result ? reader.result.toString() : "",
          description: desc.current?.value,
          clinic: clinic.current ? clinic.current.value : "",
          price: price.current ? price.current.value : "",
          keyword: keyword.current ? keyword.current.value : "",
        };

        dispatch(addEvent(item));
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
                    ref={file}
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
                <input type="text" className="form-control" ref={clinic} />
              </div>
            </div>
            <div className="row g-3 align-items-center">
              <div style={{ width: "250px" }}>
                <label className="col-form-label">이벤트명 : </label>
              </div>
              <div className="col-auto">
                <input className="form-control" type="text" ref={title} />
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
                <input className="form-control" type="text" ref={price} />
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
                <select className="client_cos" ref={keyword}>
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

// const Register = () => {
//   const router = useRouter();

//   return (
//     <Layout>
//       <article className="d-flex justify-content-center">
//         <section>
//           <div className="d-flex justify-content-center">
//             <h2 style={{ fontWeight: "bold" }}>📌이벤트 등록📌</h2>
//           </div>
//           <Card style={{ width: "500px", height: "240px" }}>
//             <div className="border border dark">
//               <div className="row g-3 align-items-center">
//                 <div style={{ width: "150px" }}>
//                   <label className="col-form-label">이벤트이미지 : </label>
//                 </div>
//                 <div className="col-auto">
//                   <input
//                     className="form-control"
//                     type="file"
//                     accept="image/*"
//                     style={{ height: "33px" }}
//                     onChange={() => {}}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="row g-3 align-items-center">
//               <div style={{ width: "250px" }}>
//                 <label className="col-form-label">병원명 : </label>
//               </div>
//               <div className="col-auto">
//                 <input className="form-control" />
//               </div>
//             </div>
//             <div className="row g-3 align-items-center">
//               <div style={{ width: "250px" }}>
//                 <label className="col-form-label">이벤트명 : </label>
//               </div>
//               <div className="col-auto">
//                 <input className="form-control" />
//               </div>
//             </div>
//             <div className="row g-3 align-items-center">
//               <div style={{ width: "250px" }}>
//                 <label className="col-form-label">이벤트상세설명 :</label>
//               </div>
//               <div className="col-auto">
//                 <input className="form-control" />
//               </div>
//             </div>
//             <div className="row g-3 align-items-center">
//               <div style={{ width: "250px" }}>
//                 <label className="col-form-labelclient">금액 :</label>
//               </div>
//               <div className="col-auto">
//                 <input className="form-control" />
//               </div>
//             </div>
//             <div className="row g-3 align-items-center">
//               <div style={{ width: "250px" }}>
//                 <label className="col-form-label">시술키워드 :</label>
//               </div>
//               {/* <select className="client_cos">
//                 <option>1</option>
//                 <option>2</option>
//               </select> */}
//               <div className="col-auto">
//                 <select className="client_cos">
//                   <option>..</option>
//                   <option>눈</option>
//                   <option>코</option>
//                   <option>턱</option>
//                   <option>이마</option>
//                   <option>주름</option>
//                   <option>그 외</option>
//                 </select>
//               </div>
//             </div>
//           </Card>
//         </section>
//       </article>
//       <br></br>
//       <br></br>

//       <div className="d-flex justify-content-center">
//         <button
//           className="btn btn-dark"
//           style={{ margin: "auto 0" }}
//           onClick={() => {
//             router.push(`/event`);
//           }}
//         >
//           + 이벤트 등록하기
//         </button>
//       </div>
//     </Layout>
//   );
// };

// export default Register;
