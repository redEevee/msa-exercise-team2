import React, { useState } from 'react';
import styled from 'styled-components';

function GuestbookList({ list, onDelete, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [editingPassword, setEditingPassword] = useState('');

    console.log('📦 list:', list);
    console.log('📦 typeof list:', typeof list);

    // 수정 시작
    const startEdit = (item, password) => {
        setEditingId(item.id);
        setEditContent(item.content);
        setEditNickname(item.nickname);
        setEditingPassword(password);
    };

    // 수정 취소
    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
        setEditNickname('');
        setEditingPassword('');
    };

    // 수정 저장
    const handleUpdateSubmit = async (id) => {
        await onUpdate(id, {
            nickname: editNickname,
            content: editContent,
            password: editingPassword,
        });
        cancelEdit();
    };

    // 삭제 처리
    const handleDelete = async (id) => {
        const password = prompt("비밀번호를 입력하세요");
        if (!password) return;

        await onDelete(id, password); // 부모 컴포넌트에서 삭제 처리
    };

    return (
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
                            <button onClick={() => {
                                const password = prompt("비밀번호를 입력하세요");
                                if (password) {
                                    startEdit(item, password);
                                }
                            }}>수정</button>

                            <button onClick={() => handleDelete(item.id)}>삭제</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default GuestbookList;
