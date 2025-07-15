package com.example.account.controller;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<AccountResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(accountService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AccountResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(accountService.login(request));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(accountService.isEmailAvailable(email));
    }
}
