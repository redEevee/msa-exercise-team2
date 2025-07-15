import React, { useState } from 'react';

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
                            <button onClick={async () => {
                                const password = prompt("비밀번호를 입력하세요");
                                if (!password) return;
                                await onDelete(item.id, password);
                            }}>삭제</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default GuestbookList;
