import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

function GuestbookList({ list, onDelete, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [editingPassword, setEditingPassword] = useState('');

    const startEdit = (item, password) => {
        setEditingId(item.id);
        setEditContent(item.content);
        setEditNickname(item.nickname);
        setEditingPassword(password);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
        setEditNickname('');
        setEditingPassword('');
    };

    const handleUpdateSubmit = async (id) => {
        await onUpdate(id, {
            nickname: editNickname,
            content: editContent,
            password: editingPassword,
        });
        cancelEdit();
    };

    return (
        <List>
            {list.map(item => (
                <Card key={item.id}>
                    {editingId === item.id ? (
                        <>
                            <Input
                                type="text"
                                value={editNickname}
                                onChange={(e) => setEditNickname(e.target.value)}
                                placeholder="닉네임"
                            />
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="내용"
                            />
                            <ButtonGroup>
                                <Button onClick={() => handleUpdateSubmit(item.id)}>저장</Button>
                                <CancelButton onClick={cancelEdit}>취소</CancelButton>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            <Nickname>{item.nickname}</Nickname>
                            <Content>{item.content}</Content>
                            <ButtonGroup>
                                <Button onClick={() => {
                                    const password = prompt("비밀번호를 입력하세요");
                                    if (password) {
                                        startEdit(item, password);
                                    }
                                }}>수정</Button>
                                <DeleteButton onClick={async () => {
                                    const password = prompt("비밀번호를 입력하세요");
                                    if (!password) return;
                                    await onDelete(item.id, password);
                                }}>삭제</DeleteButton>
                            </ButtonGroup>
                        </>
                    )}
                </Card>
            ))}
        </List>
    );
}

export default GuestbookList;

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem auto;
  min-width: 500px;
  max-width: 800px;
`;

const Card = styled.li`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
  border: 3px solid;
  border-image: linear-gradient(135deg, #f9b937, #e25858) 1;
  transition: transform 0.3s ease;
  will-change: transform;

  &:hover {
    animation: ${shake} 0.4s ease-in-out;
  }
`;

const Nickname = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 0.6rem;
  border-left: 4px solid #6a5af9;
  padding-left: 0.5rem;
`;

const Content = styled.p`
  margin: 0;
  color: #333;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ddd;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #6a5af9;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5848e5;
  }
`;

const CancelButton = styled(Button)`
  background-color: #aaa;

  &:hover {
    background-color: #888;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff5e5e;

  &:hover {
    background-color: #e04848;
  }
`;