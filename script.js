document.addEventListener('DOMContentLoaded', () => {
    const playersGrid = document.getElementById('playersGrid');
    const playerCountSelect = document.getElementById('playerCount');
    const resetBtn = document.getElementById('resetBtn');
    
    const colors = ['#FF5252', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#607D8B'];
    let players = [];
    
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
            color: colors[index % colors.length],
            life: 40,
            commanderDamage: {}
        };
        
        players.push(player);
        
        // Cria elementos do DOM
        const playerEl = document.createElement('div');
        playerEl.className = 'player';
        playerEl.style.borderTop = `5px solid ${player.color}`;
        
        playerEl.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="life-total">${player.life}</div>
            <div class="life-controls">
                <button class="life-btn plus" data-amount="1">+1</button>
                <button class="life-btn plus" data-amount="5">+5</button>
                <button class="life-btn minus" data-amount="1">-1</button>
                <button class="life-btn minus" data-amount="5">-5</button>
            </div>
            <div class="commander-damage">
                <div class="damage-title">Dano de Comandante</div>
                <div id="damage-${index}" class="damage-sources"></div>
            </div>
        `;
        
        playersGrid.appendChild(playerEl);
        
        // Adiciona dano de comandante dos outros jogadores
        const damageSourcesEl = playerEl.querySelector(`#damage-${index}`);
        
        players.forEach(otherPlayer => {
            if (otherPlayer.id !== index) {
                player.commanderDamage[otherPlayer.id] = 0;
                
                const damageSourceEl = document.createElement('div');
                damageSourceEl.className = 'damage-source';
                damageSourceEl.innerHTML = `
                    <span class="damage-name">${otherPlayer.name}</span>
                    <div class="damage-controls">
                        <button class="damage-btn minus" data-player="${otherPlayer.id}">-</button>
                        <span class="damage-value">0</span>
                        <button class="damage-btn plus" data-player="${otherPlayer.id}">+</button>
                    </div>
                `;
                
                damageSourcesEl.appendChild(damageSourceEl);
            }
        });
        
        // Event listeners para os botões de vida
        const plusBtns = playerEl.querySelectorAll('.life-btn.plus');
        const minusBtns = playerEl.querySelectorAll('.life-btn.minus');
        
        plusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.getAttribute('data-amount'));
                updateLife(index, amount);
            });
        });
        
        minusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.getAttribute('data-amount'));
                updateLife(index, -amount);
            });
        });
        
        // Event listeners para dano de comandante
        const damagePlusBtns = playerEl.querySelectorAll('.damage-btn.plus');
        const damageMinusBtns = playerEl.querySelectorAll('.damage-btn.minus');
        
        damagePlusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sourcePlayerId = parseInt(btn.getAttribute('data-player'));
                updateCommanderDamage(index, sourcePlayerId, 1);
            });
        });
        
        damageMinusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sourcePlayerId = parseInt(btn.getAttribute('data-player'));
                updateCommanderDamage(index, sourcePlayerId, -1);
            });
        });
    }
    
    // Atualiza a vida do jogador
    function updateLife(playerIndex, change) {
        const player = players[playerIndex];
        const newLife = player.life + change;
        
        if (newLife >= 0) {
            player.life = newLife;
            updatePlayerDisplay(playerIndex);
        }
    }
    
    // Atualiza dano de comandante
    function updateCommanderDamage(playerIndex, sourcePlayerId, change) {
        const player = players[playerIndex];
        const newDamage = player.commanderDamage[sourcePlayerId] + change;
        
        if (newDamage >= 0) {
            player.commanderDamage[sourcePlayerId] = newDamage;
            updatePlayerDisplay(playerIndex);
        }
    }
    
    // Atualiza a exibição do jogador
    function updatePlayerDisplay(playerIndex) {
        const player = players[playerIndex];
        const playerEl = playersGrid.children[playerIndex];
        
        // Atualiza vida
        playerEl.querySelector('.life-total').textContent = player.life;
        
        // Atualiza dano de comandante
        for (const [sourceId, damage] of Object.entries(player.commanderDamage)) {
            const sourceEl = playerEl.querySelector(`.damage-btn[data-player="${sourceId}"]`).parentNode;
            sourceEl.querySelector('.damage-value').textContent = damage;
        }
    }
    
    // Event listeners
    playerCountSelect.addEventListener('change', initGame);
    resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que quer resetar o jogo?')) {
            initGame();
        }
    });
    
    // Inicia o jogo
    initGame();
    
    // Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('ServiceWorker registrado com sucesso');
            }).catch(err => {
                console.log('ServiceWorker falhou: ', err);
            });
        });
    }
});