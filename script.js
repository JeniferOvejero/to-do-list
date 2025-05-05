document.addEventListener('DOMContentLoaded', function(){
    const input = document.getElementById('nova-tarefa');
    const botao = document.getElementById('adiciona-tarefa');
    const lista = document.getElementById('lista-tarefas');
    
    function criarItem(tarefa) {
        const li = document.createElement('li');
        li.className = 'tarefa-item';

        li.innerHTML = `
            <span>
                <input type="checkbox" id="${tarefa.id}" class="tarefa" ${tarefa.concluida ? 'checked' : ''}/>
                <label for="${tarefa.id}">${tarefa.texto}</label>
            </span>
            <button class="remover">⛔</button>
        `;

        lista.appendChild(li);
    }

    //Carregar tarefas do LocalStorage
    function carregarTarefas(){
        const tarefasArmazenadas = JSON.parse(localStorage.getItem('tarefas')) || [];

        tarefasArmazenadas.forEach(tarefa => {
            criarItem(tarefa);
        })
    }

    carregarTarefas();

    //Adicionar tarefas.
    botao.addEventListener('click', function() {
        const texto = input.value.trim();

        if (texto !== ''){
            const idTarefa = 'tarefa-' + Date.now();
            const tarefa = {
                id: idTarefa,
                texto: texto,
                concluida: false
            };

            //salvar no LocalStorage
            const tarefasArmazenadas = JSON.parse(localStorage.getItem('tarefas')) || [];
            tarefasArmazenadas.push(tarefa);
            localStorage.setItem('tarefas', JSON.stringify(tarefasArmazenadas));

            criarItem(tarefa);
            input.value = '';
        }
    });

    //Marcar como concluídas. Delegação de Eventos.
    lista.addEventListener('change', function (event) {
        if (event.target && event.target.matches('input[type="checkbox"].tarefa')) {
            const checkbox = event.target;
            const label = checkbox.nextElementSibling;

            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
            } else {
                label.style.textDecoration = 'none';
            }
        }
    });

    //Remover tarefas. Delegação de Eventos.
    lista.addEventListener('click', function (event) {
        if (event.target && event.target.matches('button.remover')) {
            const li = event.target.closest('li');
            if (li) {
                li.remove();
            }
        }
    });

});