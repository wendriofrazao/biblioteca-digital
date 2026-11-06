import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import "../styles/components/AdvancedFiltersModal.css";

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedPublisher,
  setSelectedPublisher,
  onlyAvailable,
  setOnlyAvailable,
  mostPopular,
  setMostPopular,
  activeTags = [],
  onToggleTag = () => {},
  onResetFilters = () => {},
}) {
  if (!isOpen) return null;

  const availableTags = [
    "Literatura Brasileira",
    "Exemplares físicos",
    "Clássicos",
    "Direito",
    "Administração",
    "Sustentabilidade",
    "Modernismo",
    "Realismo",
  ];

  return (
    <div className="afm-overlay" role="dialog" aria-modal="true">
      <div className="afm-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="afm-modal">
        <div className="afm-header">
          <div className="afm-title-wrap">
            <SlidersHorizontal className="afm-icon" size={16} />
            <h3 className="afm-title">Filtros Avançados do Acervo</h3>
          </div>
          <button
            type="button"
            className="afm-close"
            onClick={onClose}
            aria-label="Fechar filtros"
          >
            <X size={16} />
          </button>
        </div>

        <div className="afm-body">
          {/* Tags */}
          <div className="afm-section">
            <label className="afm-label">Marcadores & Coleções Especiais</label>
            <div className="afm-tags">
              {availableTags.map((tag) => {
                const isSelected = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={
                      isSelected ? "afm-tag afm-tag--active" : "afm-tag"
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Switches */}
          <div className="afm-switches">
            <label className="afm-switch">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <div className="afm-switch-text">
                <span className="afm-switch-title">
                  Apenas obras com exemplares disponíveis imediatamente
                </span>
                <span className="afm-switch-desc">
                  Ocultar temporariamente obras que estejam emprestadas
                </span>
              </div>
            </label>

            <label className="afm-switch">
              <input
                type="checkbox"
                checked={mostPopular}
                onChange={(e) => setMostPopular(e.target.checked)}
              />
              <div className="afm-switch-text">
                <span className="afm-switch-title">
                  Priorizar obras mais procuradas e consultadas
                </span>
                <span className="afm-switch-desc">
                  Ordena pelo índice histórico de circulação da biblioteca
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="afm-footer">
          <button type="button" className="afm-reset" onClick={onResetFilters}>
            Limpar todos os filtros
          </button>

          <button type="button" className="afm-apply" onClick={onClose}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
