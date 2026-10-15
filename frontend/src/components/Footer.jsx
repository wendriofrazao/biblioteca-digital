import '../styles/components/Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-dot" />
        <span className="footer-name">Biblioteca RB</span>
      </div>
      <span className="footer-note">14 dias de empréstimo</span>
    </footer>
  )
}