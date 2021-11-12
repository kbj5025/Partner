import Layout from "../components/layout";
import router from "next/router";
import Image from "next/image";
import { Card } from "react-bootstrap";

const Index = () => {
  return (
    <Layout>
      <article className="d-flex justify-content-center">
        <section>
          <br></br>
          <h4 className="d-flex justify-content-center">
            ✨ 미남이시네요 튜토리얼✨
          </h4>
          <br></br>
          <br></br>

          <div>
            <Card style={{ width: "600px", height: "400px" }}>
              <div className="border border dark" />
              <a>
                <Image src="/example.png" alt="입점 신청 예제" layout="fill" />
              </a>
            </Card>
            <br></br>
            <br></br>
            <div>
              <a>미남이시네요는...</a>
              <br></br>
              <a>
                합리적 가격의 다양한 피부 시술 정보를 비교/공유할 수 있는 피부
                시술 정보 플랫폼입니다.
              </a>
            </div>
            <br></br>
            <br></br>

            <Card style={{ width: "600px", height: "400px" }}>
              <div className="border border dark" />
              <a>
                <Image src="/main.png" alt="설명1" layout="fill" />
              </a>
            </Card>
            <br></br>
            <div className="d-flex justify-content-center">
              <div style={{ margin: "auto 0" }}>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    router.push("/apply");
                  }}
                >
                  입점 신청하러가기
                </button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default Index;
