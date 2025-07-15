import React, { useState } from "react";
import styled from "styled-components";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { checkEmailDuplicate, signup, login } from "../api";

const AuthForm = () => {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(null); // null | true | false

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === "email") {
      setIsEmailValid(null); // 이메일 변경 시 상태 초기화
    }
  };

  const handleReset = () => {
    setForm({ email: "", password: "", repeatPassword: "" });
    setIsEmailValid(null);
  };

  const handleCheckEmail = async () => {
    if (!form.email) {
      alert("이메일을 입력하세요.");
      return;
    }
    try {
      const res = await checkEmailDuplicate(form.email);
      if (res.data === true) {
        alert("사용 가능한 이메일입니다.");
        setIsEmailValid(true);
      } else {
        alert("이미 사용 중인 이메일입니다.");
        setIsEmailValid(false);
      }
    } catch (err) {
      alert("중복 확인 실패");
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!isEmailValid) {
        return alert("이메일 중복 확인이 필요합니다.");
      }
      if (form.password !== form.repeatPassword) {
        return alert("비밀번호가 일치하지 않습니다.");
      }

      try {
        await signup({
          email: form.email,
          password: form.password,
        });
        alert("회원가입 성공! 로그인 해보세요.");
        handleReset();
        setMode("signin");
      } catch (err) {
        alert("회원가입 실패");
      }
    } else {
      try {
        await login({
          email: form.email,
          password: form.password,
        });
        alert("로그인 성공!");
        // 이후 토큰 저장 등 처리 가능
      } catch (err) {
        alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
      }
    }
  };

  return (
    <Container>
      <Title>{mode === "signin" ? "SIGN IN" : "SIGN UP"}</Title>

      <ToggleGroup>
        <ToggleButton
          active={mode === "signin"}
          onClick={() => setMode("signin")}
          type="button"
        >
          SIGN IN
        </ToggleButton>
        <ToggleButton
          active={mode === "signup"}
          onClick={() => setMode("signup")}
          type="button"
        >
          SIGN UP
        </ToggleButton>
        <ResetButton onClick={handleReset} type="button">
          RESET
        </ResetButton>
      </ToggleGroup>

      <Form onSubmit={handleSubmit}>
        <InputBlock>
          <Input
            type="email"
            placeholder="Email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {mode === "signup" && (
            <CheckButton type="button" onClick={handleCheckEmail}>
              중복 확인
            </CheckButton>
          )}
        </InputBlock>

        <InputBlock>
          <Input
            type="password"
            placeholder="Password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </InputBlock>

        {mode === "signup" && (
          <InputBlock>
            <Input
              type="password"
              placeholder="Repeat password"
              id="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              required
            />
          </InputBlock>
        )}

        <SubmitButton type="submit">
          {mode === "signin" ? "Sign in" : "Sign up"}
        </SubmitButton>
      </Form>

      <Separator>
        <p>OR</p>
      </Separator>
      <SocialContainer>
        <SocialButton google>
          <FaGoogle />
          Sign in with Google
        </SocialButton>
        <SocialButton github>
          <FaGithub />
          Sign in with GitHub
        </SocialButton>
      </SocialContainer>
    </Container>
  );
};

export default AuthForm;

const Container = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
  background: radial-gradient(
    circle at center,
    #ffffff 0%,
    #f9f9f9 70%,
    #eeeeee 100%
  );
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 900;
  color: #ff0000;
  letter-spacing: 0.1em;
`;

const ToggleGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.8rem;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 0.7rem;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: ${({ active }) => (active ? "#007bff" : "transparent")};
  color: ${({ active }) => (active ? "white" : "#007bff")};
  box-shadow: ${({ active }) =>
    active ? "0 6px 12px rgba(0,123,255,0.4)" : "none"};
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: white;
    box-shadow: 0 6px 12px rgba(0, 86, 179, 0.5);
  }
`;

const ResetButton = styled.button`
  margin-left: auto;
  padding: 0.65rem 1rem;
  background-color: #6c757d;
  border-radius: 0.7rem;
  font-weight: 600;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 0.6rem;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const CheckButton = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 0;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(0, 123, 255, 0.5);
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #0056b3, #003d7a);
  }
`;

const Separator = styled.div`
  text-align: center;
  margin: 2rem 0 1.5rem;
  font-weight: 900;
  font-size: 1.1rem;
  color: #999;
  position: relative;

  p {
    background-color: #fff;
    display: inline-block;
    padding: 0 1rem;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: #ddd;
    z-index: 0;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  width: 100%;
  border: none;
  border-radius: 0.7rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  background-color: ${({ google, github }) =>
    google ? "#DB4437" : github ? "#24292e" : "#6c757d"};

  &:hover {
    background-color: ${({ google, github }) =>
      google ? "#b33629" : github ? "#171a1d" : "#5a6268"};
  }

  svg {
    font-size: 1.3rem;
  }
`;
