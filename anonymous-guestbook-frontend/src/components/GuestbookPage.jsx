import React, { useEffect, useState } from "react";
import GuestbookForm from "./GuestbookForm";
import GuestbookList from "./GuestbookList";
import { getGuestbookList, postGuestbook, deleteGuestbook, updateGuestbook } from "../api";  // 수정됨

function GuestbookPage() {
    const [list, setList] = useState([]);

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
        <div>
            <h1>🙅‍♀️익명 방명록🙅‍♂️</h1>

            {/* 글 작성 폼 */}
            <GuestbookForm onAdd={handleAdd} />

            {/* 방명록 리스트 */}
            <GuestbookList
                list={list}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default GuestbookPage;
