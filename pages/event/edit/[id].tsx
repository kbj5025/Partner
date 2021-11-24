import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../provider";
import { modifyEvent, EventItem } from "../../../provider/modules/event";
import { requestModifyEvent } from "../../../middleware/modules/event";

const EventEdit = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const eventItem = useSelector((state: RootState) =>
    state.event.data.find((item) => item.id === +id)
  );

  const dispatch = useDispatch<AppDispatch>();

  const [url, setUrl] = useState<string | undefined>(eventItem?.photoUrl);

  const desc = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const keyword = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const clinic = useRef<HTMLInputElement>(null);

  const changeFile = () => {
    if (file.current?.files?.length) {
      const imageFile = file.current.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setUrl(reader.result?.toString());
      };
      reader.readAsDataURL(imageFile);
    }
  };
  const handleSaveClick = () => {
    if (file.current?.files?.length) {
      const imageFile = file.current.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (eventItem) {
          // 기존데이터 카피
          const item = { ...eventItem };
          // 변경할 속성만 대입
          item.title = title.current ? title.current.value : "";
          item.description = desc.current?.value;
          item.photoUrl = reader.result ? reader.result.toString() : "";
          item.keyword = keyword.current ? keyword.current.value : "";
          item.clinic = clinic.current ? clinic.current.value : "";
          item.price = price.current ? price.current.value : "";
          item.fileType = imageFile.type;
          item.fileName = imageFile.name;
          // reducer로 state 수정 및 목록으로 이동
          saveItem(item);
        }
      };
      reader.readAsDataURL(imageFile);
    } else {
      if (eventItem) {
        // 기존데이터 카피
        const item = { ...eventItem };
        // 변경할 속성만 대입
        item.title = title.current ? title.current.value : "";
        item.description = desc.current?.value;

        item.keyword = keyword.current ? keyword.current.value : "";
        item.clinic = clinic.current ? clinic.current.value : "";
        item.price = price.current ? price.current.value : "";

        // reducer로 state 수정 및 목록으로 이동
        saveItem(item);
      }
    }
  };
  const saveItem = (item: EventItem) => {
    dispatch(requestModifyEvent(item));
    router.push("/event");
  };

  return (
    <Layout>
      <article className="d-flex justify-content-center">
        <section>
          <div className="d-flex justify-content-center">
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
                  <img src={url} alt={eventItem?.title} width={"20%"} />
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    style={{ height: "33px" }}
                    ref={file}
                    onChange={() => {
                      changeFile();
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>이벤트명</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={eventItem?.title}
                    ref={title}
                  />
                </td>
              </tr>
              <tr>
                <th>병원명</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={eventItem?.clinic}
                    ref={clinic}
                  />
                </td>
              </tr>
              <tr>
                <th>시술키워드</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={eventItem?.keyword}
                    ref={keyword}
                  />
                </td>
              </tr>
              <tr>
                <th>시술가격</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={eventItem?.price}
                    ref={price}
                  />
                </td>
              </tr>
              <tr>
                <th>이벤트상세설명</th>
                <td>
                  <textarea
                    className="form-control"
                    defaultValue={eventItem?.description}
                    ref={desc}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </article>

      <div className="btn-wrap d-flex">
        <div style={{ margin: "0 auto" }}>
          <button
            className="btnSize btn btn-secondary me-1"
            onClick={() => {
              router.push("/event");
            }}
          >
            이벤트 목록
          </button>
        </div>
        <div
          style={{ margin: "0 auto" }}
          className="d-flex justify-content-end"
        >
          <button
            className="btnSize btn btn-primary me-1"
            onClick={() => {
              handleSaveClick();
            }}
          >
            저장
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EventEdit;
