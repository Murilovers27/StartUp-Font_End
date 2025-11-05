"use client";

// 1. Reativando os imports do Next.js
import Image from "next/image"; 
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import React, { useState } from "react";

// 2. Importando o CSS Module (Sintaxe CORRETA)
import styles from "./nav-bar.module.css";

// 3. Importando o NavItem que acabamos de corrigir
import NavItem, { NavItemInterface } from "./navItem"; 

export default function Navbar() {
    // Hook para saber qual página está ativa
    const pathname = usePathname(); 

    // 4. Links ATUALIZADOS para as rotas do seu projeto
    const items: NavItemInterface[] = [
        { url: "/pet-map", label: "PetMap" },
        { url: "/planos", label: "Planos" },
        { url: "/parcerias", label: "Parcerias" },
        { url: "/contatos", label : "Contatos"}
    ];

    const [openMenu, setOpenMenu] = useState<boolean>(false);
    
    return (
        <header>
            {/* 5. Aplicando as classes do CSS Module */}
            <nav className={styles.navBar}>
                
                {/* Logo usando <Link> e <Image> do Next.js */}
                <Link href="/" className={styles.logo}>
                    <Image 
                        src="/logo.png" 
                        width={40} // Ajustei o tamanho
                        height={40} 
                        alt="Logo MyPetZone"
                    />
                    <span>myPetZone</span>
                </Link>

                {/* 6. Lista de links usando o componente <NavItem> */}
                <ul className={`${styles.navItems} ${openMenu ? styles.open : ''}`}>
                    {items.map((item, index) => (
                        <NavItem 
                            key={index}
                            url={item.url}
                            label={item.label}
                            isActive={pathname === item.url} // Passa se o link está ativo
                        />
                    ))}
                </ul>

                {/* 7. Botão de Login (agora também é um <Link>) */}
                <Link href="/login" passHref>
                    <button className={styles.loginButton}>
                        Login
                    </button>
                </Link>

                {/* 8. Botão Hamburger (para o 'openMenu') */}
                <div 
                    className={`${styles.hamburger} ${openMenu ? styles.open : ''}`} 
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </nav>
        </header>
    );
}