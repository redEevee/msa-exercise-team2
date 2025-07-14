import React, { useEffect, useState } from 'react';
import GuestbookForm from './components/GuestbookForm';
import GuestbookList from './components/GuestbookList';
import { postGuestbook, getGuestbookList } from './api';
import styled from 'styled-components';

function App() {
    const [list, setList] = useState([]);

    const [isOpen, setIsOpen] = useState(false);


    // 글 목록 불러오기
    const fetchList = async () => {
        const res = await getGuestbookList();
        setList(res.data);
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 글 작성 핸들러
    const handleAdd = async (data) => {
        await postGuestbook(data);
        fetchList(); // 작성 후 목록 생신
    }

    const handleDelete = async (id) => {
        setList((prevList) => prevList.filter((item) => item.id !== id));
    };

    const handleUpdate = async (id, updatedItem) => {
        setList((prevList) =>
            prevList.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    return (
       
        <Container>
            <h1>🙅‍♀️익명 방명록🙅‍♂️</h1>
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
            <GuestbookForm onAdd={handleAdd} />
            <GuestbookList list={list} />
            </>
        )}
            
            </DropdownContainer>
        </Container>
       
    );
}

export default App;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 500px;
  max-height: 800px;
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

const DropdownContainer = styled.div`
  margin-top: 1rem;
  border: 3px solid #ddd;
  border-radius: 0.5rem;
  background-color: yellow;

  max-height: ${(props) => (props.isOpen ? '1000px' : '0')};
  overflow-y: auto;  
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: max-height 0.4s ease, opacity 3s ease;
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