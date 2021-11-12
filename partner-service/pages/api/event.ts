import axios from "axios";
import { createAxiosInstance } from "./_request";

export interface EventPagingReponse {
  content: EventItemResponse[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 서버로 부터 받아오는 데이터 1건에 대한 타입
export interface EventItemResponse {
  id: number;
  title: string;
  description: string;
  eventPhotoUrl: string;
  fileType: string;
  fileName: string;
  createdTime: number;
  clinic: string;
  price: string;
  keyword: string;
}

export interface EventItemRequest {
  title: string;
  description?: string;
  PhotoUrl: string;
}

// 서버하고 데이터 연동하는 api처리 목록을 별도의 객체로 작성
// process.env.변수명
const EventApi = {
  get: (id: number) =>
    createAxiosInstance().get<EventItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/Events/${id}`
    ),
  // axios.get<응답데이터의타입>(요청URL);
  // GET 요청URL HTTP/1.1
  fetch: () =>
    createAxiosInstance().get<EventItemResponse[]>(
      `${process.env.NEXT_PUBLIC_API_BASE}/events`
    ),

  fetchPaging: (page: number, size: number) =>
    createAxiosInstance().get<EventPagingReponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/Events/paging?page=${page}&size=${size}`
    ),

  // axios.post<응답타입>(요청URL, 요청객체(JSON바디));
  // POST 요청URL HTTP/1.1  {...}
  add: (EventItem: EventItemRequest) =>
    createAxiosInstance().post<EventItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/Events`,
      EventItem
    ),
  // axios.delete<응답타입>(요청URL);
  // DELETE 요청URL HTTP/1.1
  remove: (id: number) =>
    createAxiosInstance().delete<boolean>(
      `${process.env.NEXT_PUBLIC_API_BASE}/Events/${id}`
    ),

  // axios.PUT<응답타입>(요청URL, 요청객체(JSON바디));
  // PUT 요청URL HTTP/1.1  {...}
  modify: (id: number, EventItem: EventItemRequest) =>
    createAxiosInstance().put<EventItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/Events/${id}`,
      EventItem
    ),
};

export default EventApi;
