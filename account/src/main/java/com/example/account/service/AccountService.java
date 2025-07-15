package com.example.account.service;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.entity.User;
import com.example.account.jwt.JwtTokenProvider;
import com.example.account.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AccountResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AccountResponse(false, "이미 존재하는 사용자입니다.", null);
        }

        String encoded = passwordEncoder.encode(request.getPassword());
        userRepository.save(new User(null, request.getEmail(), encoded));
        return new AccountResponse(true, "회원가입 성공", null);
    }

    public AccountResponse login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> new AccountResponse(true, "로그인 성공", jwtTokenProvider.generateToken(user.getEmail())))
                .orElseGet(() -> new AccountResponse(false, "로그인 실패", null));
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}
