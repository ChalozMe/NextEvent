package com.is3.eventmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;
    private String username;
    private String email;
    private String fullName;
    private String role;

}
