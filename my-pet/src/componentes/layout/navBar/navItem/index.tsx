import Link from "next/link";
// 1. A importação CORRETA do CSS Module
import styles from "./nav-item.module.css";

export interface NavItemInterface {
    url: string;
    label: string;
    isActive?: boolean;
}

export default function NavItem(props: NavItemInterface) {
    // 2. Aplicando as classes do CSS Module
    // (A classe 'active' é aplicada condicionalmente)
    const linkClasses = `${styles.navLink} ${props.isActive ? styles.active : ''}`;

    return(
        <li className={styles.navItem}>
            <Link href={props.url} className={linkClasses}>
                {props.label}
            </Link>
        </li>
    );
}