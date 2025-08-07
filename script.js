document.addEventListener('DOMContentLoaded', () => {
    const playersContainer = document.getElementById('playersContainer');
    const playerCountInput = document.getElementById('playerCount');
    const generateBtn = document.getElementById('generateBtn');
    const firstPlayerBtn = document.getElementById('firstPlayerBtn');
    const damagePopup = document.getElementById('damagePopup');
    const damageSourceSelect = document.getElementById('damageSource');
    const damageAmountInput = document.getElementById('damageAmount');
    const confirmDamageBtn = document.getElementById('confirmDamage');

    const colors = [
        '#FF5252', '#2196F3', '#4CAF50', '#FFC107',
        '#9C27B0', '#607D8B', '#E91E63', '#00BCD4'
    ];

    let players = [];
    let currentPlayerId = null;

    // Inicializa o jogo
    function initGame() {
        const playerCount = parseInt(playerCountInput.value);
        if (playerCount < 2 || playerCount > 8) {
            alert("Número de jogadores deve ser entre 2 e 8");
            return;
        }
        
        playersContainer.innerHTML = '';
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
        playerEl.style.borderColor = player.color;
        
        playerEl.innerHTML = `
            <div class="player-name" contenteditable="true">${player.name}</div>
            <div class="life-total">${player.life}</div>
            <div class="life-controls">
                <button class="life-btn plus" data-amount="1">+1</button>
                <button class="life-btn plus" data-amount="5">+5</button>
                <button class="life-btn minus" data-amount="1">-1</button>
                <button class="life-btn minus" data-amount="5">-5</button>
            </div>
            <div class="commander-section">
                <button class="commander-btn">Dano de Comandante</button>
                <div class="damage-list"></div>
            </div>
        `;
        
        playersContainer.appendChild(playerEl);
        
        // Edição de nome
        const nameEl = playerEl.querySelector('.player-name');
        nameEl.addEventListener('blur', () => {
            player.name = nameEl.textContent;
            updateDamageSources();
        });
        
        nameEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nameEl.blur();
            }
        });
        
        // Controles de vida
        playerEl.querySelectorAll('.life-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.getAttribute('data-amount'));
                const isPlus = btn.classList.contains('plus');
                updateLife(index, isPlus ? amount : -amount);
            });
        });
        
        // Botão de dano de comandante
        playerEl.querySelector('.commander-btn').addEventListener('click', () => {
            currentPlayerId = index;
            showDamagePopup();
        });
    }
    
    // Atualiza vida
    function updateLife(playerIndex, change) {
        const player = players[playerIndex];
        player.life = Math.max(0, player.life + change);
        
        const playerEl = playersContainer.children[playerIndex];
        const lifeEl = playerEl.querySelector('.life-total');
        
        lifeEl.textContent = player.life;
        lifeEl.style.color = change > 0 ? 'var(--life-plus)' : 'var(--life-minus)';
        
        setTimeout(() => {
            lifeEl.style.color = 'var(--accent)';
        }, 300);
    }
    
    // Mostra popup de dano
    function showDamagePopup() {
        damageSourceSelect.innerHTML = '';
        
        players.forEach(player => {
            if (player.id !== currentPlayerId) {
                const option = document.createElement('option');
                option.value = player.id;
                option.textContent = player.name;
                damageSourceSelect.appendChild(option);
            }
        });
        
        damageAmountInput.value = 1;
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
        const playerEl = playersContainer.children[playerIndex];
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
        const selects = document.querySelectorAll('#damageSource, .damage-source');
        selects.forEach(select => {
            select.innerHTML = players
                .filter(p => p.id !== currentPlayerId)
                .map(p => `<option value="${p.id}">${p.name}</option>`)
                .join('');
        });
    }
    
    // Sorteia jogador inicial
    function chooseFirstPlayer() {
        if (players.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * players.length);
        const winner = players[randomIndex];
        
        // Remove destaque anterior
        document.querySelectorAll('.player').forEach(p => {
            p.classList.remove('highlight');
        });
        
        // Adiciona destaque ao vencedor
        playersContainer.children[randomIndex].classList.add('highlight');
        
        alert(`${winner.name} começa!`);
    }

    // Event listeners
    generateBtn.addEventListener('click', initGame);
    firstPlayerBtn.addEventListener('click', chooseFirstPlayer);
    confirmDamageBtn.addEventListener('click', () => {
        const sourceId = parseInt(damageSourceSelect.value);
        const amount = parseInt(damageAmountInput.value);
        
        if (sourceId !== null && amount > 0) {
            addCommanderDamage(currentPlayerId, sourceId, amount);
            damagePopup.style.display = 'none';
        }
    });
    
    damagePopup.addEventListener('click', (e) => {
        if (e.target === damagePopup) {
            damagePopup.style.display = 'none';
        }
    });

function updateDamageList(playerIndex) {
    const player = players[playerIndex];
    const playerEl = playersContainer.children[playerIndex];
    const damageList = playerEl.querySelector('.damage-list');
    
    damageList.innerHTML = player.commanderDamage.map(damage => `
        <div class="damage-item" data-source="${damage.sourceId}">
            <span>${damage.sourceName}</span>
            <div class="damage-controls">
                <button class="damage-minus">-</button>
                <span class="damage-value">${damage.amount}</span>
                <button class="damage-plus">+</button>
            </div>
        </div>
    `).join('');

    // Adiciona eventos aos botões de controle de dano
    damageList.querySelectorAll('.damage-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sourceId = parseInt(e.target.closest('.damage-item').getAttribute('data-source'));
            adjustCommanderDamage(playerIndex, sourceId, 1);
        });
    });

    damageList.querySelectorAll('.damage-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sourceId = parseInt(e.target.closest('.damage-item').getAttribute('data-source'));
            adjustCommanderDamage(playerIndex, sourceId, -1);
        });
    });
}

// Nova função para ajustar dano existente
function adjustCommanderDamage(targetId, sourceId, change) {
    const target = players[targetId];
    const damage = target.commanderDamage.find(d => d.sourceId === sourceId);
    
    if (damage) {
        damage.amount = Math.max(0, damage.amount + change);
        updateDamageList(targetId);
    }
}
    // Inicia o jogo com 4 jogadores por padrão
    initGame();
});