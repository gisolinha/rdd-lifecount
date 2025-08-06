document.addEventListener('DOMContentLoaded', () => {
    const playersGrid = document.getElementById('playersGrid');
    const playerCountSelect = document.getElementById('playerCount');
    const toggleModeBtn = document.getElementById('toggleMode');
    
    const colors = [
        '#FF5252', '#2196F3', '#4CAF50', '#FFC107',
        '#9C27B0', '#607D8B', '#E91E63', '#00BCD4',
        '#8BC34A', '#FF9800', '#795548', '#9E9E9E'
    ];
    
    let players = [];
    let advancedMode = false;

    // Inicializa o jogo
    function initGame() {
        const playerCount = parseInt(playerCountSelect.value);
        playersGrid.innerHTML = '';
        players = [];
        
        for (let i = 0; i < playerCount; i++) {
            createPlayer(i);
        }
    }

    // Cria um jogador
    function createPlayer(index) {
        const player = {
            id: index,
            name: `Jogador ${index + 1}`,
            color: colors[index],
            life: 40,
            commanderDamage: []
        };
        
        players.push(player);
        
        const playerEl = document.createElement('div');
        playerEl.className = 'player';
        playerEl.style.borderTop = `4px solid ${player.color}`;
        
        playerEl.innerHTML = `
            <div class="player-header">
                <div class="player-name" contenteditable="true">${player.name}</div>
            </div>
            <div class="life-total">${player.life}</div>
            <div class="life-controls">
                <button class="life-btn plus" data-amount="1">+1</button>
                <button class="life-btn plus" data-amount="5">+5</button>
                <button class="life-btn minus" data-amount="1">-1</button>
                <button class="life-btn minus" data-amount="5">-5</button>
            </div>
            <div class="commander-section">
                <div class="add-damage">
                    <select class="damage-source">
                        ${players.filter(p => p.id !== index).map(p => 
                            `<option value="${p.id}">${p.name}</option>`
                        ).join('')}
                    </select>
                    <button class="add-damage-btn">+ Dano</button>
                </div>
                <div class="damage-list"></div>
            </div>
        `;
        
        playersGrid.appendChild(playerEl);
        
        // Atualiza nome editável
        const nameEl = playerEl.querySelector('.player-name');
        nameEl.addEventListener('blur', () => {
            player.name = nameEl.textContent;
            updateDamageSources();
        });
        
        // Controles de vida
        playerEl.querySelectorAll('.life-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.getAttribute('data-amount'));
                const isPlus = btn.classList.contains('plus');
                updateLife(index, isPlus ? amount : -amount);
            });
        });
        
        // Adiciona dano de comandante
        playerEl.querySelector('.add-damage-btn').addEventListener('click', () => {
            const sourceId = parseInt(playerEl.querySelector('.damage-source').value);
            addCommanderDamage(index, sourceId, 1);
        });
    }
    
    // Atualiza vida
    function updateLife(playerIndex, change) {
        const player = players[playerIndex];
        player.life = Math.max(0, player.life + change);
        
        const playerEl = playersGrid.children[playerIndex];
        const lifeEl = playerEl.querySelector('.life-total');
        
        lifeEl.textContent = player.life;
        lifeEl.style.color = change > 0 ? 'var(--life-plus)' : 'var(--life-minus)';
        
        setTimeout(() => {
            lifeEl.style.color = 'var(--accent)';
        }, 300);
    }
    
    // Adiciona dano de comandante
    function addCommanderDamage(targetId, sourceId, amount) {
        const target = players[targetId];
        const source = players.find(p => p.id === sourceId);
        
        const existingDamage = target.commanderDamage.find(d => d.sourceId === sourceId);
        
        if (existingDamage) {
            existingDamage.amount += amount;
        } else {
            target.commanderDamage.push({
                sourceId,
                sourceName: source.name,
                amount
            });
        }
        
        updateCommanderDamageDisplay(targetId);
    }
    
    // Atualiza exibição de dano
    function updateCommanderDamageDisplay(playerIndex) {
        const player = players[playerIndex];
        const playerEl = playersGrid.children[playerIndex];
        const damageList = playerEl.querySelector('.damage-list');
        
        damageList.innerHTML = player.commanderDamage.map(damage => `
            <div class="damage-item">
                <span>${damage.sourceName}</span>
                <span>${damage.amount}</span>
            </div>
        `).join('');
    }
    
    // Atualiza seletores de fonte de dano
    function updateDamageSources() {
        document.querySelectorAll('.damage-source').forEach(select => {
            const playerId = parseInt(select.closest('.player').id.replace('player-', ''));
            select.innerHTML = players
                .filter(p => p.id !== playerId)
                .map(p => `<option value="${p.id}">${p.name}</option>`)
                .join('');
        });
    }
    
    // Alterna modo avançado
    toggleModeBtn.addEventListener('click', () => {
        advancedMode = !advancedMode;
        toggleModeBtn.textContent = advancedMode ? 'Modo Simples' : 'Modo Avançado';
        
        document.querySelectorAll('.commander-section').forEach(section => {
            section.style.display = advancedMode ? 'block' : 'none';
        });
    });
    
    // Event listeners
    playerCountSelect.addEventListener('change', initGame);
    initGame();
});