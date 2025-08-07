document.addEventListener('DOMContentLoaded', () => {
    const playersContainer = document.getElementById('playersContainer');
    const firstPlayerBtn = document.getElementById('firstPlayerBtn');
    const firstPlayerDisplay = document.getElementById('firstPlayerDisplay');
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

    // Inicializa o jogo com 4 jogadores por padrão
    initGame(4);

    function initGame(playerCount = 4) {
        playersContainer.innerHTML = '';
        players = [];
        firstPlayerDisplay.textContent = '';

        for (let i = 0; i < playerCount; i++) {
            createPlayer(i);
        }

        positionPlayers();
    }

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
            <button class="commander-btn">Dano de Comandante</button>
        `;

        playersContainer.appendChild(playerEl);

        // Edição de nome
        const nameEl = playerEl.querySelector('.player-name');
        nameEl.addEventListener('click', () => {
            nameEl.contentEditable = true;
            nameEl.focus();
        });

        nameEl.addEventListener('blur', () => {
            nameEl.contentEditable = false;
            player.name = nameEl.textContent;
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
            showDamagePopup(index);
        });
    }

    function positionPlayers() {
        const playerElements = document.querySelectorAll('.player');
        const totalPlayers = playerElements.length;

        playerElements.forEach((playerEl, index) => {
            playerEl.setAttribute('data-position', index);
            playerEl.setAttribute('data-total', totalPlayers);
        });
    }

    function updateLife(playerIndex, change) {
        const player = players[playerIndex];
        player.life = Math.max(0, player.life + change);

        const playerEl = playersContainer.children[playerIndex];
        const lifeEl = playerEl.querySelector('.life-total');

        lifeEl.textContent = player.life;
        lifeEl.style.transform = 'scale(1.2)';
        lifeEl.style.color = change > 0 ? 'var(--life-plus)' : 'var(--life-minus)';

        setTimeout(() => {
            lifeEl.style.transform = 'scale(1)';
            lifeEl.style.color = 'var(--accent)';
        }, 300);
    }

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
        damageAmountInput.value = 1;
    }

    // Sorteio de jogador inicial
    firstPlayerBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * players.length);
        const winner = players[randomIndex];

        // Remove destaque anterior
        document.querySelectorAll('.player').forEach(p => {
            p.classList.remove('highlight');
        });

        // Adiciona destaque ao vencedor
        const winnerEl = playersContainer.children[randomIndex];
        winnerEl.classList.add('highlight');

        firstPlayerDisplay.textContent = `${winner.name} começa!`;
    });

    // Confirmação de dano
    confirmDamageBtn.addEventListener('click', () => {
        const sourceId = parseInt(damageSourceSelect.value);
        const amount = parseInt(damageAmountInput.value);

        if (sourceId !== null && amount > 0) {
            // (Implemente sua lógica de dano aqui)
            damagePopup.style.display = 'none';
        }
    });

    // Fechar popup ao clicar fora
    damagePopup.addEventListener('click', (e) => {
        if (e.target === damagePopup) {
            damagePopup.style.display = 'none';
        }
    });
});