package com.example.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountResponse {
    private boolean success;
    private String message;
    private String token;
}
