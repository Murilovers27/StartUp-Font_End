// 1. Importe o CSS Module
// (Certifique-se que o nome do arquivo importado bate com o nome real)
import styles from './footer.module.css';

// (Opcional) Se você for usar ícones, ex:
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

// O export default é o padrão para componentes de página/layout
export default function Footer() {
  return (
    // 2. Aplique a classe principal
    <footer className={styles.footer}>
      
      {/* (Opcional) Seção de Redes Sociais
      <div className={styles.socialLinks}>
        <a href="#" className={styles.socialIcon}><FaFacebook /></a>
        <a href="#" className={styles.socialIcon}><FaInstagram /></a>
        <a href="#" className={styles.socialIcon}><FaTwitter /></a>
      </div> 
      */}

      <p>© {new Date().getFullYear()} myPetZone. Todos os direitos reservados.</p>
    </footer>
  );
}