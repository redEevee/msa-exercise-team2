import React, { useEffect, useState } from 'react';
import { postGuestbook, getGuestbookList } from './api';
import styled from 'styled-components';
import GuestbookPage from './pages/GuestbookPage';
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';

function App() {

    return (



        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="guestbookpage" element={<GuestbookPage />} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;
