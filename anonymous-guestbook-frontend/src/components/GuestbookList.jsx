import React, { useState } from 'react';
import styled from 'styled-components';


function GuestbookList({ list, onDelete, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [guestbookList, setGuestbookList] = useState([]);



    // 수정 시작
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditContent(item.content);
        setEditNickname(item.nickname);
    };

    // 수정 취소
    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
        setEditNickname('');
    };

    // 수정 저장
    const handleUpdateSubmit = async (id) => {
        await onUpdate(id,  { editNickname: editNickname, content: editContent });
        cancelEdit();
    };

    return (
        <div>
            <Container>
            <ul>
                {list.map(item => (
                    <li key={item.id}>
                        {editingId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editNickname}
                                    onChange={(e) => setEditNickname(e.target.value)}
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <button onClick={() => handleUpdateSubmit(item.id)}>저장</button>
                                <button onClick={cancelEdit}>취소</button>
                            </>
                        ) : (
                            <>
                                <strong>{item.nickname}</strong>
                                <p>{item.content}</p>
                                <button onClick={() => startEdit(item)}>수정</button>
                                <button onClick={() => onDelete(item.id)}>삭제</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
                </Container>
        </div>
    );
}

export default GuestbookList;

const Container = styled.div`
height: auto;
width: auto;
margin: 10px;
padding: 10px;
background-color: red;
`;