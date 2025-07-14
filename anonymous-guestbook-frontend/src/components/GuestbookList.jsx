import React from 'react';
import styled from 'styled-components';

function GuestbookList({ list }) {
    return (
        <Container>
        <ul>
            {list.map((item) => (
                <li key = {item.id}>
                    <strong>{item.nickname}</strong>
                    ({new Date(item.createdAt).toLocaleString()})
                    <p>{item.content}</p>
                </li>
            ))}
        </ul>
        </Container>
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