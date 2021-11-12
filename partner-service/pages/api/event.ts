import axios from "axios";

// 서버로 부터 받아오는 데이터 1건에 대한 타입
export interface EventItemResponse {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  keyword: string;
  price: string;
  clinic: string;
}

export interface EventItemRequest {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  keyword: string;
  price: string;
  clinic: string;
}

// 서버하고 데이터 연동하는 api처리 목록을 별도의 객체로 작성
// process.env.변수명
const eventApi = {
  fetch: () =>
    axios.get<EventItemResponse[]>(
      `${process.env.NEXT_PUBLIC_API_BASE}/events`
    ),

  // axios.post<응답타입>(요청URL, 요청객체(json바디))
  // POST 요청 URL HTTP/1.1 {...}
  add: (eventItem: EventItemRequest) =>
    axios.post<EventItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/events`,
      eventItem
    ),
  // axios.delete<응답타입>(요청URL);
  // DELETE 요청URL HTTP/1.1
  remove: (id: number) =>
    axios.delete<boolean>(`${process.env.NEXT_PUBLIC_API_BASE}/events/${id}`),

  // axios.PUT<응답타입>(요청URL, 요청객체(JSON바디));
  // PUT 요청URL HTTP/1.1  {...}
  modify: (id: number, eventItem: EventItemRequest) =>
    axios.put<EventItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/events/${id}`,
      eventItem
    ),
};

export default eventApi;
