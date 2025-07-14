package com.example.anonymousguestbook.controller;

import com.example.anonymousguestbook.dto.AccountResponse;
import com.example.anonymousguestbook.dto.LoginRequest;
import com.example.anonymousguestbook.dto.SignupRequest;
import com.example.anonymousguestbook.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/guestbook/account")
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
}
