import axios from "axios";

// 서버로 부터 받아오는 데이터 1건에 대한 타입
export interface ApplyItemResponse {
  id: number;
  clinicName: string;
  clinicSector: string;
  clinicLocate: string;
  registrationNumber: string;
  dateOfEstablishment: string;
  phone: string;
  email: string;
  applicantName: string;
  admissionApplicationDate: string;
}

export interface ApplyItemRequest {
  id: number;
  clinicName: string;
  clinicSector: string;
  clinicLocate: string;
  registrationNumber: string;
  dateOfEstablishment: string;
  phone: string;
  email: string;
  applicantName: string;
  admissionApplicationDate: string;
}

// 서버하고 데이터 연동하는 api처리 목록을 별도의 객체로 작성
// process.env.변수명
const applyApi = {
  fetch: () =>
    axios.get<ApplyItemResponse[]>(
      `${process.env.NEXT_PUBLIC_API_BASE}/applys`
    ),

  // axios.post<응답타입>(요청URL, 요청객체(json바디))
  // POST 요청 URL HTTP/1.1 {...}
  add: (applyItem: ApplyItemRequest) =>
    axios.post<ApplyItemResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE}/applys`,
      applyItem
    ),
};

export default applyApi;
