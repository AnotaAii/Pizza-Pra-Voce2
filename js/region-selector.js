// Funcionalidade de seleção de região client-side
class RegionSelector {
    constructor() {
        this.data = null;
        this.selectedState = null;
        this.selectedCity = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.createModal();
        this.checkStoredLocation();
    }

    async loadData() {
        try {
            const response = await fetch('estados_cidades.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados de estados e cidades:', error);
            // Fallback com alguns estados principais
            this.data = [
                {
                    "uf": "SP",
                    "nomeEstado": "São Paulo",
                    "cidades": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"]
                },
                {
                    "uf": "RJ",
                    "nomeEstado": "Rio de Janeiro",
                    "cidades": ["Rio de Janeiro", "Niterói", "Petrópolis", "Nova Iguaçu", "Duque de Caxias"]
                },
                {
                    "uf": "MG",
                    "nomeEstado": "Minas Gerais",
                    "cidades": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"]
                }
            ];
        }
    }

    createModal() {
        const modalHTML = `
            <div id="regionModal" class="region-modal" style="display: none;">
                <div class="region-modal-overlay"></div>
                <div class="region-modal-content">
                    <div class="region-modal-header">
                        <h3>Selecione sua região</h3>
                        <button class="region-modal-close">&times;</button>
                    </div>
                    <div class="region-modal-body">
                        <div class="region-form-group">
                            <label for="stateSelect">Estado:</label>
                            <select id="stateSelect" class="region-select">
                                <option value="">Selecione um estado</option>
                            </select>
                        </div>
                        <div class="region-form-group">
                            <label for="citySelect">Cidade:</label>
                            <select id="citySelect" class="region-select" disabled>
                                <option value="">Primeiro selecione um estado</option>
                            </select>
                        </div>
                        <div class="region-modal-actions">
                            <button id="confirmRegion" class="region-btn region-btn-primary" disabled>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adicionar CSS
        const style = document.createElement('style');
        style.textContent = `
            .region-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .region-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }

            .region-modal-content {
                position: relative;
                background: white;
                border-radius: 8px;
                padding: 0;
                max-width: 400px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .region-modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .region-modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }

            .region-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .region-modal-close:hover {
                color: #333;
            }

            .region-modal-body {
                padding: 20px;
            }

            .region-form-group {
                margin-bottom: 20px;
            }

            .region-form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
            }

            .region-select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                background: white;
                color: #333;
            }

            .region-select:focus {
                outline: none;
                border-color: #007bff;
            }

            .region-select:disabled {
                background: #f5f5f5;
                color: #999;
                cursor: not-allowed;
            }

            .region-modal-actions {
                text-align: center;
                margin-top: 30px;
            }

            .region-btn {
                padding: 12px 30px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .region-btn-primary {
                background: #007bff;
                color: white;
            }

            .region-btn-primary:hover:not(:disabled) {
                background: #0056b3;
            }

            .region-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            @media (max-width: 480px) {
                .region-modal-content {
                    width: 95%;
                    margin: 10px;
                }
                
                .region-modal-header,
                .region-modal-body {
                    padding: 15px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.bindEvents();
        this.populateStates();
    }

    populateStates() {
        const stateSelect = document.getElementById('stateSelect');
        
        this.data.forEach(state => {
            const option = document.createElement('option');
            option.value = state.uf;
            option.textContent = state.nomeEstado;
            stateSelect.appendChild(option);
        });
    }

    bindEvents() {
        const modal = document.getElementById('regionModal');
        const closeBtn = document.querySelector('.region-modal-close');
        const overlay = document.querySelector('.region-modal-overlay');
        const stateSelect = document.getElementById('stateSelect');
        const citySelect = document.getElementById('citySelect');
        const confirmBtn = document.getElementById('confirmRegion');

        // Fechar modal
        closeBtn.addEventListener('click', () => this.hideModal());
        overlay.addEventListener('click', () => this.hideModal());

        // Mudança de estado
        stateSelect.addEventListener('change', (e) => {
            this.onStateChange(e.target.value);
        });

        // Mudança de cidade
        citySelect.addEventListener('change', (e) => {
            this.onCityChange(e.target.value);
        });

        // Confirmar seleção
        confirmBtn.addEventListener('click', () => {
            this.confirmSelection();
        });
    }

    onStateChange(stateUF) {
        const citySelect = document.getElementById('citySelect');
        const confirmBtn = document.getElementById('confirmRegion');
        
        // Limpar cidades
        citySelect.innerHTML = '<option value="">Selecione uma cidade</option>';
        citySelect.disabled = !stateUF;
        confirmBtn.disabled = true;

        if (stateUF) {
            const state = this.data.find(s => s.uf === stateUF);
            if (state) {
                this.selectedState = state;
                
                // Adicionar cidades
                state.cidades.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        } else {
            this.selectedState = null;
        }
    }

    onCityChange(cityName) {
        const confirmBtn = document.getElementById('confirmRegion');
        
        if (cityName && this.selectedState) {
            this.selectedCity = cityName;
            confirmBtn.disabled = false;
        } else {
            this.selectedCity = null;
            confirmBtn.disabled = true;
        }
    }

    confirmSelection() {
        if (this.selectedState && this.selectedCity) {
            // Salvar no localStorage
            localStorage.setItem('selectedRegion', JSON.stringify({
                state: this.selectedState.nomeEstado,
                stateUF: this.selectedState.uf,
                city: this.selectedCity
            }));

            // Atualizar interface
            this.updateLocationDisplay();
            
            // Fechar modal
            this.hideModal();

            // Disparar evento customizado
            window.dispatchEvent(new CustomEvent('regionSelected', {
                detail: {
                    state: this.selectedState.nomeEstado,
                    stateUF: this.selectedState.uf,
                    city: this.selectedCity
                }
            }));
        }
    }

    updateLocationDisplay() {
        const cityElements = document.querySelectorAll('#localCidade');
        const stateElements = document.querySelectorAll('#localEstado');
        
        cityElements.forEach(el => {
            el.textContent = this.selectedCity || 'Local Desconhecido';
        });
        
        stateElements.forEach(el => {
            el.textContent = this.selectedState ? this.selectedState.nomeEstado : 'Local Desconhecido';
        });
    }

    checkStoredLocation() {
        const stored = localStorage.getItem('selectedRegion');
        
        if (stored) {
            try {
                const location = JSON.parse(stored);
                this.selectedState = this.data.find(s => s.uf === location.stateUF);
                this.selectedCity = location.city;
                this.updateLocationDisplay();
            } catch (error) {
                console.error('Erro ao carregar localização salva:', error);
                this.showModal();
            }
        } else {
            // Tentar detectar localização automaticamente
            this.tryAutoDetectLocation();
        }
    }

    tryAutoDetectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Em uma implementação real, você usaria um serviço de geocoding reverso
                    // Por enquanto, vamos mostrar o modal
                    this.showModal();
                },
                (error) => {
                    console.log('Geolocalização não disponível:', error);
                    this.showModal();
                }
            );
        } else {
            this.showModal();
        }
    }

    showModal() {
        const modal = document.getElementById('regionModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        const modal = document.getElementById('regionModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Método público para abrir o modal manualmente
    openRegionSelector() {
        this.showModal();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.regionSelector = new RegionSelector();
});

// Adicionar botão para reabrir o seletor de região (opcional)
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar um pequeno botão para alterar a região
    const locationElements = document.querySelectorAll('#localCidade');
    locationElements.forEach(el => {
        if (el.parentElement) {
            el.parentElement.style.cursor = 'pointer';
            el.parentElement.title = 'Clique para alterar sua região';
            el.parentElement.addEventListener('click', () => {
                if (window.regionSelector) {
                    window.regionSelector.openRegionSelector();
                }
            });
        }
    });
});

