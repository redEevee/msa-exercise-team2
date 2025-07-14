package com.example.anonymousguestbook.service;

import com.example.anonymousguestbook.dto.AccountResponse;
import com.example.anonymousguestbook.dto.LoginRequest;
import com.example.anonymousguestbook.dto.SignupRequest;
import com.example.anonymousguestbook.entity.User;
import com.example.anonymousguestbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AccountResponse signup(SignupRequest request) {
        if (request.getUsername().isBlank() || request.getPassword().isBlank()) {
            return new AccountResponse(false, "아이디와 비밀번호를 입력해주세요.");
        }

        // 중복 사용자 확인
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return new AccountResponse(false, "이미 존재하는 사용자입니다.");
        }

        // 비밀번호 암호화 후 저장
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        return new AccountResponse(true, "회원가입 성공");
    }

    public AccountResponse login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return new AccountResponse(true, "로그인 성공");
                    } else {
                        return new AccountResponse(false, "비밀번호가 틀렸습니다.");
                    }
                })
                .orElseGet(() -> new AccountResponse(false, "존재하지 않는 사용자입니다."));
    }
}
