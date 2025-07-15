import React, { useEffect, useState } from "react";
import GuestbookForm from "../components/GuestbookForm";
import GuestbookList from "../components/GuestbookList";
import styled from 'styled-components'
import { getGuestbookList, postGuestbook, deleteGuestbook, updateGuestbook } from "../api";  // 수정됨

function GuestbookPage() {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // 방명록 목록 불러오기
  useEffect(() => {
    fetchGuestbooks();
  }, []);

  const fetchGuestbooks = async () => {
    try {
      const res = await getGuestbookList();
      setList(res.data);
    } catch (err) {
      console.error("방명록 불러오기 실패", err);
    }
  };

  // 글 작성 처리
  const handleAdd = async (data) => {
    try {
      await postGuestbook(data);
      await fetchGuestbooks();
    } catch (err) {
      console.error("글 추가 실패", err);
    }
  };

  // 글 삭제
  const handleDelete = async (id) => {
    console.log("삭제 시작", id);
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      await deleteGuestbook(id);
      console.log("삭제 요청 완료")
      setList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 글 수정
  const handleUpdate = async (id, updatedItem) => {
    try {
      await updateGuestbook(id, updatedItem);
      setList(prev =>
        prev.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      );
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  return (
    <>
      <Container>
        <h1>익명 방명록</h1>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '게시판 닫기' : '게시판 열기'}
        </ToggleButton>
        {!isOpen && (
          <ImageWrapper>
            <RandomImage
              src="https://picsum.photos/400/300"
              alt="random"
            />
          </ImageWrapper>
        )}
        <DropdownContainer isOpen={isOpen}>
          {isOpen && (
            <>
              {/* 글 작성 폼 */}
              <GuestbookForm onAdd={handleAdd} />

              {/* 방명록 리스트 */}
              <GuestbookList
                list={list}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </>
          )}
        </DropdownContainer>

      </Container>
    </>
  );
}

export default GuestbookPage;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-width: 300px;
  min-height: 500px;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  border: 1px solid;
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.2);
`;

const ToggleButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
`;

const DropdownContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  margin-top: 1rem;
  border: 3px solid #ddd;
  border-radius: 0.5rem;
  background-color: yellow;

  max-height: ${(props) => (props.isOpen ? '1000px' : '0')};
  overflow-y: auto;  
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: max-height 0.4s ease, opacity 0.4s ease;
`;


const ImageWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
  padding: 0 1rem; /* ✅ 좌우 여백 추가 */
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const RandomImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem;
`;