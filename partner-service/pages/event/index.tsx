import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Head from "next/dist/shared/lib/head";
import Sidebar from "../../components/event/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../provider";

const Event = () => {
  const event = useSelector((state: RootState) => state.event);
  const router = useRouter();

  return (
    <Layout>
      <section>
        <div className="d-flex">
          <Head>
            <title>미남이시네요</title>
          </Head>
        </div>
        <div className="d-flex justify-content-center">
          <h2 style={{ fontWeight: "bold" }}>🎁이벤트 관리🎁</h2>
        </div>
        <Sidebar />

        {event.data.map((item, index) => (
          <Card
            key={`event-item-${index}`}
            className="d-flex"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`/event/detail/${item.id}`);
            }}
          >
            <Card.Body>
              <Card.Img
                className="me-3"
                src={item.eventPhotoUrl}
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
        <br></br>
        <div className="d-flex justify-content-center">
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
      </section>
    </Layout>
  );
};

// interface photosProp {
//   photos: Photos[];
// }

// interface Photos {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// }

// const Index = ({ photos }: photosProp) => {
//   return (
//     <Layout>
//       <section>
//         <div className="d-flex">
//           <Head>
//             <title>미남이시네요</title>
//           </Head>
//         </div>
//         <div className="d-flex justify-content-center">
//           <h2 style={{ fontWeight: "bold" }}>🎁이벤트 관리🎁</h2>
//         </div>

//         <Sidebar />
//         {photos.map((photos: any, index: any) => (
//           <Card
//             key={index}
//             className="d-flex"
//             style={{ cursor: "pointer" }}
//             onClick={() => {
//               router.push(`/event/detail/${photos.id}`);
//             }}
//           >
//             <Card.Body>
//               <Card.Img
//                 className="me-3"
//                 src={photos.thumbnailUrl}
//                 alt={photos.title}
//                 style={{ width: "80px", height: "50px," }}
//               />

//               <div style={{ margin: "auto 0" }}>
//                 <div className="my-3">
//                   <Card.Title
//                     style={{
//                       fontWeight: "bold",
//                     }}
//                   >
//                     아이웰 남자 눈 성형
//                   </Card.Title>
//                   <Card.Text>아이웰 남자눈_남자니까남자담게!</Card.Text>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         ))}
//         <br></br>
//         <div className="d-flex justify-content-center">
//           <div style={{ margin: "auto 0" }}>
//             <button
//               className="btn btn-dark"
//               onClick={() => {
//                 router.push("/event/register");
//               }}
//             >
//               + 이벤트 등록하기
//             </button>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export const getServerSideProps = async () => {
//   const res = await fetch(
//     `https://jsonplaceholder.typicode.com/photos?_start=0&_end=1`
//   );
//   const photos = await res.json();

//   return {
//     props: {
//       photos,
//     },
//   };
// };

export default Event;
