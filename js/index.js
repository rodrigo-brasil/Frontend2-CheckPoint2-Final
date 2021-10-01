const input_addCategoria = document.getElementById('addCategoria');
const btn_addCategoria = document.getElementById('btnAddCategoria');
const addForm = document.getElementById('addForm');
const input_addTask = document.getElementById('addTaskInput');
const section_Addtask = document.getElementById('sectionAddTodo');
const btn_addLembrete = document.getElementById("addLembrete");
const input_lembrete = document.querySelector("input[name='lembrete']");
const btn_api = document.getElementById('btnApi');
const div_todoContainer = document.getElementById('todoContainer');
const mobile_menu = document.getElementById('mobileMenu');
const date = new Date();
const allTodos = [];
let idGlobal = 0;
let apiUsed = false;

const todos_showed = []


function addTodotoArray(obj) {
    const todosObj = createTodoOjbect(obj)
    allTodos.push(todosObj);
    showTodos(todosObj)
    atualizarDetalhes();
}

function showTodos(todosObj) {
    createTask(todosObj);
}

createTodoOjbect = function ({ title, data, categoria, id, lembrete, completed }) {
    return {
        id: id == undefined ? ++idGlobal : id,
        title: title,
        data: data,
        categoria: categoria,
        lembrete: lembrete,
        completed: completed
    };
};

function createTask({ title, data, id, lembrete, completed }, position = "start") {
    const span_categoria = document.createElement('span');
    const div_task = document.createElement('div');
    const div_lembrete = document.createElement('div');
    div_task.classList.add('task');
    div_task.setAttribute('data-idTask', id);

    if (lembrete) {
        div_lembrete.classList.add('task-lembrete');
        div_lembrete.innerHTML = `<span><i class="far fa-clock"></i>${lembrete}</span>`;
    }

    div_task.innerHTML = `
        <input class="check" type="checkbox" name="completed" id="">
        <p class="title-task">${title}</p>
        ${div_lembrete.outerHTML}
        <div class="options">
            <span class="id-task"><i>#${id}</i></span>
            <span>Criado em: ${data}</span>
            
            <div class="options-buttons">
                <button class="delete-button" data-idTask="${id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`
    /*         <button class="edit-button">
            <i class="fas fa-pen"></i>
        </button> */

    if (position == "start")
        document.getElementById('todoContainer').insertAdjacentElement('afterbegin', div_task);
    else
        document.getElementById('todoContainer').insertAdjacentElement('beforeend', div_task);

    if (completed == true) {
        div_task.firstElementChild.checked = true;
    }

}

function deletarTodo(id) {
    let elemento = allTodos.find(todo => todo.id === id)
    let index = allTodos.indexOf(elemento);
    allTodos.splice(index, 1)
    atualizarDetalhes();
}

function validarInputs(input) {
    if (input.disabled)
        return true;

    if (input.value.trim() == '') {
        alert('Campo vazio');
        return false;
    }
    return true;
}

function retrairForm() {
    document.getElementById('extras').classList.remove('active');
    input_addTask.rows = 2;
    document.getElementById('categoriaModal').classList.add('hidden');
    document.getElementById("removeLembrete").parentElement.style.display = "none";
    input_lembrete.setAttribute("disabled", true)
    btn_addLembrete.style.display = 'inline-flex';
    section_Addtask.classList.add('bg_light');
    addForm.reset();
}

function expandirForm() {
    document.getElementById('extras').classList.add('active');
    document.getElementById('data').value = date.toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
    document.getElementById('extraId').textContent = "#" + (idGlobal + 1);
    section_Addtask.classList.remove('bg_light');
}

async function getTodosApi() {
    const url = "https://jsonplaceholder.typicode.com/todos/";
    const response = await fetch(url);
    return response.json();
}

async function addTodosApiIntoDom() {
    const todosApi = await getTodosApi();
    todosApi.forEach(todo => addTodotoArray(todo));
}

function positionSectionAddToDo() {
    const { left, right, width } = div_todoContainer.getBoundingClientRect()
    const midpoint = width / 2;
    const midPosition = left + midpoint;
    const offset = section_Addtask.offsetWidth / 2;
    section_Addtask.style.left = `${midPosition - offset}px`;
    section_Addtask.style.width = `${width * .9}px`;
}

function showMenuMobile() {
    document.querySelector('main').classList.add('show-mobile-menu')
    section_Addtask.classList.add('hidden');
    document.body.style.overflow = "hidden";
}

function hideMenuMobile() {
    document.querySelector('main').classList.remove('show-mobile-menu')
    section_Addtask.classList.remove('hidden');
    document.body.style.overflow = "auto";
    positionSectionAddToDo();
}

function atualizarDetalhes() {
    const countAlltodos = allTodos.length;
    const countCompleted = allTodos.filter(todo => todo.completed).length;
    const countPending = countAlltodos - countCompleted;
    document.getElementById('countAlltodos').textContent = countAlltodos;
    document.getElementById('countCompleted').textContent = countCompleted;
    document.getElementById('countPending').textContent = countPending;
}

function init() {
    atualizarDetalhes();
    positionSectionAddToDo();
}


// Event listeners
input_addTask.addEventListener('focus', expandirForm);

input_addTask.addEventListener('keydown', function (e) {
    while (input_addTask.scrollHeight > input_addTask.offsetHeight) {
        input_addTask.rows += 1;
    }
});

btn_api.addEventListener('click', function () {
    if (apiUsed) {

    } else {
        apiUsed = true;
        addTodosApiIntoDom();
    }
})

addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputsValido = Array.from(addForm.querySelectorAll('input:not(#addCategoria), textarea')).every(input => validarInputs(input));
    if (inputsValido) {
        const form = e.target;
        const formData = new FormData(form);
        const obj = {};
        formData.forEach((value, key) => obj[key] = value);
        addTodotoArray(obj);
        console.log(obj);
        retrairForm();
    }
});

document.querySelectorAll('[data-modalTarget]').forEach(element => {
    element.addEventListener('click', function (e) {
        const modal = document.querySelector(element.dataset.modaltarget);
        modal.classList.toggle('hidden');
    });
});

btn_addCategoria.addEventListener('click', function (e) {
    if (input_addCategoria.value.trim() != '' && input_addCategoria.value.length > 2) {
        const novaCategoria = document.createElement('li');
        novaCategoria.textContent = input_addCategoria.value;
        input_addCategoria.value = '';
        document.querySelector('#categoriasUl > li:last-of-type').insertAdjacentElement("beforebegin", novaCategoria);
    }
});

btn_addLembrete.addEventListener('click', function (e) {
    btn_addLembrete.nextElementSibling.style.display = "inline-flex"
    input_lembrete.removeAttribute("disabled");
    input_lembrete.focus();
    input_lembrete.min = date.toLocaleString("sv").substring(0, 16).replace(" ", "T");
    btn_addLembrete.style.display = 'none';
});

document.getElementById("removeLembrete").addEventListener('click', function (e) {
    document.getElementById("removeLembrete").parentElement.style.display = "none";
    input_lembrete.setAttribute("disabled", true)
    btn_addLembrete.style.display = 'inline-flex';
})

mobile_menu.addEventListener('click', function (e) {
    if (document.querySelector('main').classList.contains('show-mobile-menu'))
        hideMenuMobile();
    else
        showMenuMobile();
});


// Global events listener
document.addEventListener('click', function (e) {
    if (!e.target.closest('#sectionAddTodo')) {
        retrairForm();
    }

    if (e.target.closest('.task .delete-button')) {
        const button = e.target.closest('.task .delete-button')
        const task = button.parentElement.parentElement.parentElement;

        let idInterval = null;
        clearInterval(idInterval);
        idInterval = setInterval(deleteAnimation, 5);
        let opacity = 1;
        let pos = 0;
        function deleteAnimation() {
            if (opacity <= 0) {
                clearInterval(idInterval);
                const id = task.dataset["idTask"]
                deletarTodo(id)
                task.remove();
            } else {
                pos += 5;
                opacity = opacity - 0.01;
                task.style.left = pos + 'px';
                task.style.opacity = opacity;
            }
        }


    }

    if (!e.target.closest('.modal') && !e.target.closest('[data-modalTarget]')) {
        const modal = document.querySelectorAll('.modal:not(.hidden)')
        if (modal)
            modal.forEach(modal => {
                modal.classList.add('hidden');
            })
    }

    if (e.target.closest("#categoriasUl > li:not(li:last-of-type)")) {
        document.getElementById("categoria-input").value = e.target.textContent;
    }

    if (e.target.closest("input[type=checkbox][name=completed]")) {
        const checkbox = e.target.closest("input[type=checkbox][name=completed]");
        const id = checkbox.parentElement.dataset.idtask;
        const task = allTodos.find(todo => todo.id == id);
        if (checkbox.checked)
            task.completed = true;
        else
            task.completed = false;
        atualizarDetalhes();
    }

    positionSectionAddToDo();
});

window.addEventListener('resize', function () {
    positionSectionAddToDo();
    if (window.innerWidth > 945) {
        hideMenuMobile();
    }
});

// init
init()

