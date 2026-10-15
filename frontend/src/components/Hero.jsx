import "../styles/components/Hero.css";

export function Hero() {
  return (
    <div className="hero">
      <p className="hero-note">~ bem-vindo ao seu refúgio ~</p>
      <h1 className="hero-title">
        Sua pausa para leitura<span>.</span>
      </h1>
      <p className="hero-sub">Toque nos livros ou vire a página.</p>
    </div>
  )
}