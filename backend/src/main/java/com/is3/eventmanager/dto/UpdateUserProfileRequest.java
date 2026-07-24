package com.is3.eventmanager.dto;

public class UpdateUserProfileRequest {

    private String name;
    private String email;

    public UpdateUserProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
