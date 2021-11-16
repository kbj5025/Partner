import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Head from "next/dist/shared/lib/head";
import Sidebar from "../../components/event/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../provider";
import { useEffect } from "react";
import { requestFetchEvents } from "../../middleware/modules/event";

const Index = () => {
  const event = useSelector((state: RootState) => state.event);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 컴포넌트가 마운팅되는 시점에 실행
  useEffect(() => {
    if (!event.isFetched) {
      // 서버에서 데이터를 받아오는 action을 디스패치함
      dispatch(requestFetchEvents());
    }
  }, [dispatch, event.isFetched]);

  return (
    <Layout>
      <section>
        <div className="d-flex justify-content-center">
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
          <div className="d-flex flex-wrap">
            {event.data.map((item, index) => (
              <Card
                key={`event-item-${index}`}
                className="d-flex"
                style={{
                  width: "calc((100% - 3rem) / 4)",
                  marginLeft: index % 4 === 0 ? "0" : "1rem",
                  marginTop: index > 3 ? "1rem" : "0",
                }}
                onClick={() => {
                  router.push(`/event/detail/${item.id}`);
                }}
              >
                <Card.Body>
                  <Card.Img
                    className="me-3"
                    src={item.photoUrl}
                    alt={item.title}
                    style={{ width: "80px", height: "50px," }}
                  />

                  <div style={{ margin: "auto 0" }}>
                    <div className="my-3">
                      <Card.Title
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {item.title}
                      </Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          <br></br>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
