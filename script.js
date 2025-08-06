document.addEventListener('DOMContentLoaded', () => {
    const playersGrid = document.getElementById('playersGrid');
    const playerCountSelect = document.getElementById('playerCount');
    const resetBtn = document.getElementById('resetBtn');
    const damagePopup = document.getElementById('damagePopup');
    const damageSourceSelect = document.getElementById('damageSource');
    const damageAmountInput = document.getElementById('damageAmount');
    const confirmDamageBtn = document.getElementById('confirmDamage');
    
    const colors = [
        '#FF5252', '#2196F3', '#4CAF50', '#FFC107',
        '#9C27B0', '#607D8B', '#E91E63', '#00BCD4',
        '#8BC34A', '#FF9800', '#795548', '#9E9E9E'
    ];
    
    let players = [];
    let currentPlayerId = null;

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
                <button class="add-commander-btn">+ Dano de Comandante</button>
                <div class="damage-list"></div>
            </div>
        `;
        
        playersGrid.appendChild(playerEl);
        
        // Nome editável
        const nameEl = playerEl.querySelector('.player-name');
        nameEl.addEventListener('blur', () => {
            player.name = nameEl.textContent;
        });
        
        // Controles de vida
        playerEl.querySelectorAll('.life-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.getAttribute('data-amount'));
                const isPlus = btn.classList.contains('plus');
                updateLife(index, isPlus ? amount : -amount);
            });
        });
        
        // Botão para adicionar dano
        playerEl.querySelector('.add-commander-btn').addEventListener('click', () => {
            currentPlayerId = index;
            showDamagePopup(index);
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
    
    // Mostra popup de dano
    function showDamagePopup(targetId) {
        damageSourceSelect.innerHTML = '';
        
        players.forEach(player => {
            if (player.id !== targetId) {
                const option = document.createElement('option');
                option.value = player.id;
                option.textContent = player.name;
                damageSourceSelect.appendChild(option);
            }
        });
        
        damagePopup.style.display = 'flex';
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
        
        updateDamageList(targetId);
    }
    
    // Atualiza lista de danos
    function updateDamageList(playerIndex) {
        const player = players[playerIndex];
        const playerEl = playersGrid.children[playerIndex];
        const damageList = playerEl.querySelector('.damage-list');
        
        damageList.innerHTML = player.commanderDamage.map(damage => `
            <div class="damage-item">
                <span>${damage.sourceName}</span>
                <div class="damage-controls">
                    <button class="damage-minus" data-source="${damage.sourceId}">-</button>
                    <span>${damage.amount}</span>
                    <button class="damage-plus" data-source="${damage.sourceId}">+</button>
                </div>
            </div>
        `).join('');
        
        // Eventos para +/- do dano
        damageList.querySelectorAll('.damage-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const sourceId = parseInt(btn.getAttribute('data-source'));
                addCommanderDamage(playerIndex, sourceId, 1);
            });
        });
        
        damageList.querySelectorAll('.damage-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const sourceId = parseInt(btn.getAttribute('data-source'));
                addCommanderDamage(playerIndex, sourceId, -1);
            });
        });
    }
    
    // Event listeners
    playerCountSelect.addEventListener('change', initGame);
    resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que quer resetar o jogo?')) {
            initGame();
        }
    });
    
    confirmDamageBtn.addEventListener('click', () => {
        const sourceId = parseInt(damageSourceSelect.value);
        const amount = parseInt(damageAmountInput.value);
        
        if (sourceId !== null && amount > 0) {
            addCommanderDamage(currentPlayerId, sourceId, amount);
            damagePopup.style.display = 'none';
        }
    });
    
    // Inicia o jogo
    initGame();
});