import axios from 'axios';

// axios 인스턴스 생성 (공통 baseURL 설정)
const api = axios.create({
    baseURL: '/api/guestbook',
});

// 방명록 목록 가져오기
export const getGuestbookList = () => api.get('');  // 빈 문자열로 호출

// 글 작성
export const postGuestbook = (data) => api.post('', data);

// 글 삭제
export const deleteGuestbook = (id) => api.delete(`/${id}`);

// 글 수정
export const updateGuestbook = (id, data) => api.put(`/${id}`, data);

export default api;