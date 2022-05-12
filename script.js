// объявляем переменные, прописываем константы, обрабатываем даты
const lang = navigator.language;
const d = new Date();
let month = d.toLocaleString(lang, {month: 'long'})
let year = d.getFullYear();
let daynumber = d.getDate();
let dayname = d.toLocaleString(lang,{weekday: 'long'});

document.querySelector('.month').innerHTML = month + ', ' + year;
document.querySelector('.data').innerHTML = dayname + ', ' + daynumber;

const taskinput = document.querySelector('.task-input');
const taskaddbtn = document.querySelector('.add-task-btn');
let filter = document.querySelectorAll('.task-menu-container span');
const todos = JSON.parse(localStorage.getItem("todo-list") || "[]");
let UpdateId;
let isUpdate = false;

// делаем рабочим меню выбора тасков: All, Pending, Completed
filter.forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add('active');
        showTodos(btn.id);
    })
})

// отображаем ВСЕ таски
function showTodos(filter){
    document.querySelectorAll(".task-list").forEach(todo => todo.remove());
    let liTag = '';
    todos.forEach((todo,id)=>{
        let isCompleted = todo.status === 'completed'? 'checked': '';
        if (filter === todo.status || filter === 'all'){
            liTag += `<div class="task-list">
                <label for="${id}">
                    <input onclick="taskcomplete(this)" type="checkbox" id="${id}" class="checkbox" onclick="taskcomplete(this)" ${isCompleted}>
                    <h3 class="task ${isCompleted}">${todo.name}</h3>
                </label>
                <span onclick="editTask(${id},'${todo.name}')" class="edit-btn"> Edit</span>
                <span onclick="deleteTask(${id})" class="delete-btn"> Delete</span>
            </div>`;
        }
    });
    document.querySelector('.task-list-container').innerHTML = liTag || `
        <span><i class="fa-clipboard-list"></i></span>
        <span class='no-task-message'>No task here yet</span>`;
}
showTodos('all');

// указываем что делать, когда таска введена и нажата кнопочка "+"
taskaddbtn.addEventListener('click',e=>{
    if(taskinput.value !== ''){
        let userTask = taskinput.value;
        if(!isUpdate){
            let taskinfo = {name:userTask,status:'pending'};
            todos.push(taskinfo);
        }else{
            isUpdate = false;
            todos[UpdateId].name = userTask;
        }
        localStorage.setItem("todo-list",JSON.stringify(todos));
        taskinput.value = '';
        showTodos('all');
    }
    let divlist = document.querySelectorAll('.task-list').length;
    document.querySelector('.number-of-tasks').innerHTML = divlist + ' Tasks';
});

// при установки галочки возле таски (что таска выполнена) => активируем перечеркивание таски и отображение в Completed
function taskcomplete(elem){
    if(elem.checked){
        elem.nextElementSibling.classList.add('checked');
        todos[elem.id].status = 'completed';
    }else{
        elem.nextElementSibling.classList.remove('checked');
        todos[elem.id].status = 'pending';
    }
    localStorage.setItem("todo-list",JSON.stringify(todos));
}

// настраиваем кнопочку Delete для таска
function deleteTask(deleteId){
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodos('all');
    let divlist = document.querySelectorAll('.task-list').length;
    document.querySelector('.number-of-tasks').innerHTML=divlist + ' Tasks';
}

// настраиваем кнопочку Edit для таска
function editTask(taskId,taskName){
    isUpdate = true;
    UpdateId = taskId;
    taskinput.value = taskName;
    taskinput.focus();
}

// настраиваем кнопочку Clear all для всех тасков
document.querySelector('.clear-all-btn').addEventListener('click',()=>{
    todos.splice(0,todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodos('all');
    let divlist = document.querySelectorAll('.task-list').length;
    document.querySelector('.number-of-tasks').innerHTML = divlist + ' Tasks';
});

// пересчитываем количество тасков
let divlist = document.querySelectorAll('.task-list').length;
document.querySelector('.number-of-tasks').innerHTML = divlist + ' Tasks';