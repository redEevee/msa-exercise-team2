package com.example.account.service;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.dto.response.LoginResult;
import com.example.account.entity.User;
import com.example.account.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;

    public AccountResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AccountResponse(false, "이미 존재하는 이메일입니다.", null);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());  // 평문 저장
        userRepository.save(user);

        return new AccountResponse(true, "회원가입 성공", null);
    }

    public AccountResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 틀렸습니다."));

        if (!request.getPassword().equals(user.getPassword())) {
            return new AccountResponse(false, "비밀번호가 틀렸습니다.", null);
        }

        String uuid = UUID.randomUUID().toString();
        LoginResult result = new LoginResult(uuid, user.getId());

        return new AccountResponse(true, "로그인 성공", result);
    }

    public boolean checkEmailExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
