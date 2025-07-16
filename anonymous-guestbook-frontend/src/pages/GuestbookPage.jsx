import React, { useEffect, useState } from "react";
import GuestbookForm from "../components/GuestbookForm";
import GuestbookList from "../components/GuestbookList";
import styled from "styled-components";
import {
  getGuestbookList,
  postGuestbook,
  deleteGuestbook,
  updateGuestbook,
} from "../api"; 
import { useNavigate } from "react-router-dom";

function GuestbookPage() {
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/loginpage");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false); 
    alert("로그아웃 되었습니다.");
    navigate("/"); 
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); 
    fetchGuestbooks(); 
  }, [isLoggedIn]);


  // 방명록 목록 불러오기
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
  const handleDelete = async (id, password) => {
    console.log("삭제 시작", id);
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;

    const userId = localStorage.getItem('userId');
    let payload;

    if (userId) { 
      payload = { userId }; 
    } else { 
      payload = { password }; 
    }

    try {
      await deleteGuestbook(id, password);
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      const msg =
        error.response?.data || "삭제 실패: 알 수 없는 오류가 발생했습니다.";
      alert(msg);
    }
  };

  // 글 수정
  const handleUpdate = async (id, updatedItem) => {
    const userId = localStorage.getItem('userId'); 
    let payload = { ...updatedItem };

    if (userId) { 
      payload = { ...payload, userId }; 
    }
    
    try {
      await updateGuestbook(id, updatedItem);
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    } catch (error) {
      const msg =
        error.response?.data || "수정 실패: 알 수 없는 오류가 발생했습니다.";
      alert(msg);
    }
  };

  return (
    <>
      <Container>
        <ButtonWrap>
          {isLoggedIn ? (
            <LoginButton onClick={handleLogoutClick}>로그아웃</LoginButton>
          ) : (
            <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
          )}
        </ButtonWrap>

        <h1>익명 방명록</h1>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "게시판 닫기" : "게시판 열기"}
        </ToggleButton>
        {!isOpen && (
          <ImageWrapper>
            <RandomImage src="https://picsum.photos/400/300" alt="random" />
          </ImageWrapper>
        )}
        <DropdownContainer isOpen={isOpen}>
          {isOpen && (
            <>
              <FormContainer>
                {/* 글 작성 폼 */}
                <GuestbookForm onAdd={handleAdd} />
              </FormContainer>
              <ListContainer>
                {/* 방명록 리스트 */}
                <GuestbookList
                  list={list}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </ListContainer>
            </>
          )}
        </DropdownContainer>
      </Container>
    </>
  );
}

export default GuestbookPage;

const ButtonWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: end;
  align-items: center;
`;
const LoginButton = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: #007bff;
  width: 50px;
  height: 30px;
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-width: 300px;
  min-height: 500px;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem 1rem;
  border: 1px solid;
  box-shadow: 0 22px 25px rgba(0, 0, 0, 0.4);
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
  shouldForwardProp: (prop) => prop !== "isOpen",
})`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 1rem;
  padding: 1.5rem;
  width: 550px;

  background: radial-gradient(
    circle at center,
    #ffffff 0%,
    #f0f0f0 70%,
    #dddddd 100%
  );

  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  max-height: ${(props) => (props.isOpen ? "1000px" : "0")};
  overflow-y: auto;
  overflow-x: hidden;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: max-height 0.6s ease, opacity 0.6s ease;
  padding-right: 1.5rem;
  box-sizing: content-box;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 550px; 
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  animation: fadeIn 0.7s ease forwards;

  background: radial-gradient(
    circle at center,
    #f5f5f5 0%,
    #f0f0f0 40%,
    #ffffff 100%
  );

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const FormContainer =styled.div`
  
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
`

const RandomImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem;
`;
