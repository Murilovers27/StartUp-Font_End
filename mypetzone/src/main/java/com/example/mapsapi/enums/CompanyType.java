package com.example.mapsapi.enums;

public enum CompanyType {
    RESTAURANTE("Restaurante"),
    PET_SHOP("Pet Shop"),
    HOTEL("Hotel"),
    POUSADA("Pousada"),
    CAFE("Café"),
    LANCHONETE("Lanchonete"),
    COMERCIO("Comércio"),
    SERVICOS("Serviços"),
    CLINICA_VETERINARIA("Clínica Veterinária"),
    SUPERMERCADO("Supermercado"),
    FARMACIA("Farmácia"),
    ESCRITORIO("Escritório"),
    INDUSTRIA("Indústria"),
    ACADEMIA("Academia"),
    SALAO_BELEZA("Salão de Beleza"),
    CONSULTORIO("Consultório"),
    ESCOLA("Escola"),
    TRANSPORTADORA("Transportadora"),
    CONSTRUTORA("Construtora"),
    OUTROS("Outros");

    private final String displayName;

    CompanyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

