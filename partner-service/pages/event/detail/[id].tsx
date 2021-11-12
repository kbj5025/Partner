import router, { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../provider";
import { removeEvent } from "../../../provider/modules/event";

const EventDetail = () => {
  const router = useRouter();

  const id = router.query.id as string;

  let eventItem = useSelector((state: RootState) =>
    state.event.data.find((item) => item.id === +id)
  );

  const dispatch = useDispatch<AppDispatch>();

  return (
    <Layout>
      <section>
        <div>
          <h2 className="title text-center">My Event</h2>
        </div>

        {/* {!photoItem && (
          <div className="text-center my-5">데이터가 없습니다.</div>
        )} */}
        {/* {photoItem && ( */}
        <table className="table">
          <tbody>
            <tr>
              <th>이벤트이미지</th>
              <td>
                <img
                  src={eventItem?.photoUrl}
                  alt={eventItem?.title}
                  width={"20%"}
                />
              </td>
            </tr>
            <tr>
              <th>이벤트명</th>
              <td>{eventItem?.title}</td>
            </tr>
            <tr>
              <th>병원명</th>
              <td>{eventItem?.clinic}</td>
            </tr>
            <tr>
              <th>시술키워드</th>
              <td>{eventItem?.keyword}</td>
            </tr>
            <tr>
              <th>시술가격</th>
              <td>{eventItem?.price}</td>
            </tr>
            <tr>
              <th>이벤트상세설명</th>
              <td>{eventItem?.description}</td>
            </tr>
          </tbody>
        </table>
        {/* )} */}
        <div className="btn-wrap d-flex">
          <div style={{ width: "50%" }}>
            <button
              className="btnSize btn btn-secondary me-1"
              onClick={() => {
                router.push("/event");
              }}
            >
              이벤트 목록
            </button>
          </div>
          <div style={{ width: "50%" }} className="d-flex justify-content-end">
            <button
              className="btnSize btn btn-primary me-1"
              onClick={() => {
                router.push(`/event/edit/${id}`);
              }}
            >
              수정
            </button>
            <button
              className="btnSize btn btn-danger"
              onClick={() => {
                dispatch(removeEvent(+id));
                router.push("/event");
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
