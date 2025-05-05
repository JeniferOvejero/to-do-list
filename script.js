document.addEventListener('DOMContentLoaded', function(){
    const input = document.getElementById('nova-tarefa');
    const botao = document.getElementById('adiciona-tarefa');
    const lista = document.getElementById('lista-tarefas');
    const filtro = document.getElementById('div-filtro');

    function filtrarTarefas(){
        const filtroTodas = document.getElementById('filtro-todas').checked;
        const filtroIncompletas = document.getElementById('filtro-incompletas').checked;
        const filtroCompletas = document.getElementById('filtro-completas').checked;

        const tarefasArmazenadas = JSON.parse(localStorage.getItem('tarefas')) || [];

        lista.innerHTML = '';

        tarefasArmazenadas.forEach(tarefa => {
            const deveExibir =
                (filtroTodas) ||
                (filtroIncompletas && !tarefa.concluida) ||
                (filtroCompletas && tarefa.concluida);
            
            if (deveExibir){
                criarItem(tarefa);
            }
        })
    }

    function criarItem(tarefa) {
        const li = document.createElement('li');
        li.className = 'tarefa-item';

        li.innerHTML = `
            <span>
                <input type="checkbox" id="${tarefa.id}" class="tarefa" ${tarefa.concluida ? 'checked' : ''}/>
                <label for="${tarefa.id}"style="text-decoration: ${tarefa.concluida ? 'line-through' : 'none'}">${tarefa.texto}</label>
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

    filtro.addEventListener('change', function(event){
        if (event.target && event.target.matches('input[type="radio"].filtro')) {
            filtrarTarefas();
        }
    })
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
            const idTarefa = checkbox.id;

            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
            } else {
                label.style.textDecoration = 'none';
            }

            //atualiza LocalStorage
            const tarefasArmazenadas = JSON.parse(localStorage.getItem('tarefas')) || [];
            const tarefaIndex = tarefasArmazenadas.findIndex(t => t.id === idTarefa);
            if (tarefaIndex !== -1){
                tarefasArmazenadas[tarefaIndex].concluida = checkbox.checked;
                localStorage.setItem('tarefas', JSON.stringify(tarefasArmazenadas));
            }
        }

    });

    //Remover tarefas. Delegação de Eventos.
    lista.addEventListener('click', function (event) {
        if (event.target && event.target.matches('button.remover')) {
            const li = event.target.closest('li');
            const idTarefa = li.querySelector('input[type="checkbox"]').id;

            //atualiza LocalStorage
            const tarefasArmazenadas = JSON.parse(localStorage.getItem('tarefas')) || [];
            const tarefasAtualizadas = tarefasArmazenadas.filter(tarefa => tarefa.id !== idTarefa);
            localStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));

            li.remove();

        }
    });

});