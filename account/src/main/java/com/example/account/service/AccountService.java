package com.example.account.service;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.entity.User;
import com.example.account.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;

    public AccountResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AccountResponse(false, "이미 존재하는 사용자입니다.", null);
        }

//        String encoded = passwordEncoder.encode(request.getPassword());
        userRepository.save(new User(null, request.getUsername(), request.getPassword()));
        return new AccountResponse(true, "회원가입 성공", null);
    }

    public AccountResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ExpressionException("로그인 오류"));
        
        

        if (user.getPassword().equals(request.getPassword())) {

            String token = UUID.randomUUID().toString();
            return new AccountResponse(true, "성공", token);
        } else {    
            return new AccountResponse(false, "실패", null);
        }
        
    }
}
