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
        '#9C27B0', '#607D8B'
    ];

    let players = [];
    let currentPlayerId = null;

    // Inicializa o jogo
    function initGame() {
        const playerCount = parseInt(playerCountInput.value);
        if (playerCount < 2 || playerCount > 6) {
            alert("Número de jogadores deve ser entre 2 e 6");
            return;
        }
        
        playersContainer.innerHTML = '';
        players = [];
        
        for (let i = 0; i < playerCount; i++) {
            createPlayer(i);
        }
        
        positionPlayers();
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
        playerEl.setAttribute('data-position', index);
        playerEl.innerHTML = `
            <div class="player-name" contenteditable="true">${player.name}</div>
            <div class="life-total">${player.life}</div>
            <div class="life-controls">
                <button class="life-btn plus" data-amount="1">+1</button>
                <button class="life-btn plus" data-amount="5">+5</button>
                <button class="life-btn minus" data-amount="1">-1</button>
                <button class="life-btn minus" data-amount="5">-5</button>
            </div>
            <button class="commander-btn">Dano de Comandante</button>
        `;
        
        playersContainer.appendChild(playerEl);
        
        // Edição de nome
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
        
        // Botão de dano de comandante
        playerEl.querySelector('.commander-btn').addEventListener('click', () => {
            currentPlayerId = index;
            showDamagePopup(index);
        });
    }

    // Posiciona os jogadores circularmente
    function positionPlayers() {
        const playerElements = document.querySelectorAll('.player');
        const totalPlayers = playerElements.length;
        
        playerElements.forEach((playerEl, index) => {
            playerEl.setAttribute('data-total', totalPlayers);
            
            // Ajuste especial para 2 jogadores
            if (totalPlayers === 2) {
                if (index === 0) {
                    playerEl.style.top = '20%';
                    playerEl.style.left = '50%';
                    playerEl.style.transform = 'translateX(-50%)';
                } else {
                    playerEl.style.top = '60%';
                    playerEl.style.left = '50%';
                    playerEl.style.transform = 'translateX(-50%)';
                }
            }
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
        
        if (!damageList) return;
        
        damageList.innerHTML = player.commanderDamage.map(damage => `
            <div class="damage-item">
                <span>${damage.sourceName}</span>
                <span>${damage.amount}</span>
            </div>
        `).join('');
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

    // Inicia com 4 jogadores
    initGame();
});