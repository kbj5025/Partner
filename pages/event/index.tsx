import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import EventsStyles from "../../styles/Event.module.css";
import Sidebar from "../../components/event/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../provider";
import { useEffect } from "react";
import { requestFetchEvents } from "../../middleware/modules/event";
import { getTimeString } from "../../lib/string";

const Index = () => {
  const event = useSelector((state: RootState) => state.event);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 컴포넌트가 마운팅되는 시점에 실행
  useEffect(() => {
    // 서버에서 데이터를 받아오는 action을 디스패치함
    dispatch(requestFetchEvents());
  }, [dispatch]);

  return (
    <Layout>
      <div className="d-flex justify-content-end mb-2">
        <h2 style={{ fontWeight: "bold", width: "50%" }}>🎁이벤트 관리🎁</h2>
        <div className="d-flex justify-content-end" style={{ width: "50%" }}>
          <div style={{ margin: "auto 0" }}>
            <button
              className="btn btn-dark"
              onClick={() => {
                router.push("/event/register");
              }}
            >
              + 이벤트 등록하기
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <Sidebar />
        <div className={EventsStyles.events}>
          {event.data.map((item, index) => (
            <Card
              key={`event-item-${index}`}
              className="d-flex"
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/event/detail/${item.id}`);
              }}
            >
              <Card.Body
                className="me-3"
                style={{ width: "20%", height: "20%" }}
              >
                <Card.Img
                  className="me-3"
                  src={item.photoUrl}
                  alt={item.title}
                  style={{ width: "150px", height: "150px," }}
                />

                <div className={EventsStyles.title}>
                  <div className="my-3">
                    <Card.Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Card.Text>
                    <Card.Text>{item.description}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
        <br></br>
      </div>
    </Layout>
  );
};

export default Index;
