package com.example.mapsapi.enums;

public enum UserRole {
    CLIENTE("Cliente"),
    EMPRESA("Empresa");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

