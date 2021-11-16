import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux store(리덕스 저장소)에 하나의 state를 관리하고 처리할 수 있는 모듈
// slice에는  state와 reducer가 있음
// reducer는 state르 변경하는 함수

export interface EventItem {
  id: number;
  title: string;
  description?: string;
  photoUrl: string;
  clinic: string;
  price: string;
  keyword: string;
  fileName: string;
  fileType: string;
}

// 백엔드 연동 고려해서 state 구조를 설계
export interface EventState {
  data: EventItem[]; // 포토 아이템 배열
  isFetched: boolean; // 서버에서 데이터를 받아왔는지에 대한 여부
  isAddCompleted?: boolean; // 데이터 추가가 완료되었는지 여부
  isRemoveCompleted?: boolean; // 데이터 삭제가 완료되었는지 여부
  isModifyCompleted?: boolean; // 데이터 수정이 완료되었는지 여부
}

const initialState: EventState = {
  data: [],
  isFetched: false,
};

// slice 생성
const eventSlice = createSlice({
  name: "event", // slice의 이름(state이름)
  initialState, // 이 slice의 state 초기값
  reducers: {
    // // PayloadAction<payload타입>
    // // Payload로 item객체를 받음
    addEvent: (state, action: PayloadAction<EventItem>) => {
      const event = action.payload;
      state.data.unshift(event);
      state.isAddCompleted = true; // 추가가 되었음으로 표시
    },

    removeEvent: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.data.splice(
        state.data.findIndex((item) => item.id === id),
        1
      );
      state.isRemoveCompleted = true; // 삭제 되었음을 표시
    },

    modifyEvent: (state, action: PayloadAction<EventItem>) => {
      // 생성해서 넘긴 객체
      const modifyItem = action.payload;
      // state에 있는 객체
      const eventItem = state.data.find((item) => item.id === modifyItem.id);
      // state에 있는 객체의 속성을 넘김 객체의 속성으로 변경
      if (eventItem) {
        eventItem.title = modifyItem.title;
        eventItem.description = modifyItem.description;
        eventItem.photoUrl = modifyItem.photoUrl;
        eventItem.clinic = modifyItem.clinic;
        eventItem.price = modifyItem.price;
        eventItem.keyword = modifyItem.keyword;
        eventItem.fileName = modifyItem.fileName;
        eventItem.fileType = modifyItem.fileType;
      }
      state.isModifyCompleted = true; // 변경되었음을 표시
    },
    // payload값으로 state를 초기화하는 reducer 필요함
    initialEvent: (state, action: PayloadAction<EventItem[]>) => {
      const events = action.payload;
      // 백엔드에서 받아온 데이터
      state.data = events;
      // 데이터를 받아옴으로 값을 남김
      state.isFetched = true;
    },
  },
});

// action creator 내보내기: action creator는 action객체를 반환하는 함수
export const { addEvent, removeEvent, modifyEvent, initialEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
