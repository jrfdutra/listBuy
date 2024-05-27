const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listComplete = document.querySelector('.list-buy');

let myList = [];
let tempTask = null;
let tempIndex = null;
let tempList = null;
let undoTimeout = null;
let undoClearTimeout = null;

function addOValordoInput() {
    if (input.value.trim() !== "") {
        myList.push({ text: input.value.trim(), completed: false });
        input.value = '';
        viewList();
    }
}

function deleteTask(index) {
    tempTask = myList[index];
    tempIndex = index;
    myList.splice(index, 1); 
    viewList(); 
    showUndoAlert(deleteUndo);
}

function completeTask(index) {
    myList[index].completed = !myList[index].completed;
    viewList();
}

function clearList() {
    tempList = [...myList];
    myList = [];
    viewList();
    showUndoAlert(clearUndo);
}

function shareList() {
    const listText = myList.map(item => item.text).join('\n');
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(listText)}`;
    window.open(whatsappURL, '_blank');
}

function deleteUndo() {
    if (tempTask !== null && tempIndex !== null) {
        myList.splice(tempIndex, 0, tempTask);
        tempTask = null;
        tempIndex = null;
        clearTimeout(undoTimeout);
        viewList();
    }
}

function clearUndo() {
    if (tempList !== null) {
        myList = [...tempList];
        tempList = null;
        clearTimeout(undoClearTimeout);
        viewList();
    }
}

function showUndoAlert(undoFunction) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'undo-alert';
    alertDiv.innerHTML = `
        <p>Deletado   <button onclick="(${undoFunction})()">Desfazer</button></p>
    `;
    document.body.appendChild(alertDiv);

    const timeout = setTimeout(() => {
        if (alertDiv) {
            document.body.removeChild(alertDiv);
        }
    }, 5000);

    if (undoFunction === deleteUndo) {
        undoTimeout = 5000;
    } else if (undoFunction === clearUndo) {
        undoClearTimeout = 5000;
    }
}

function viewList() {
    let newList = '';

    myList.forEach((item, index) => {
        newList += `
            <li class="task ${item.completed ? 'completed' : ''}">
                <img src="img/correct.png" alt="check-task" onclick="completeTask(${index})">
                <p>${item.text}</p>
                <img src="img/trash.png" alt="delete-task" onclick="deleteTask(${index})">
            </li>
        `;
    });

    listComplete.innerHTML = newList;
}

// Adiciona o evento de clique ao botão de adicionar
button.addEventListener('click', addOValordoInput);

// Adiciona o evento de pressionar a tecla "Enter" ao campo de entrada
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addOValordoInput();
    }
});
