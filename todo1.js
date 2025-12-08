var todoitems = [];

// Register search button
document.getElementById('searchBtn').addEventListener('click', onsearch);

// Load data on page load
onloadPrintItems();

function onloadPrintItems() {
    // Load from localStorage
    var localData = localStorage.getItem("todoitems");

    if (localData != null) {
        todoitems = JSON.parse(localData);

        // Convert old string tasks to objects
        todoitems = todoitems.map(item => {
            if (typeof item === "string") {
                return { name: item, completed: false };
            }
            return item;
        });

        localStorage.setItem("todoitems", JSON.stringify(todoitems));
    }

    ShowEmptyMsgorFiltred(todoitems, "Task list is empty, start adding tasks");
    printItem(todoitems);
}

function ShowEmptyMsgorFiltred(array, message) {
    if (array.length === 0) {
        document.getElementById("noresult").style.display = "block";
        document.getElementById("noresult").innerText = message;
    } else {
        document.getElementById("noresult").style.display = "none";
    }
}

function onsearch() {
    var searchText = document.getElementById("todoInput").value.trim().toLowerCase();

    var filteredData = todoitems.filter(x =>
        x.name.toLowerCase().startsWith(searchText)
    );

    printItem(filteredData);
    ShowEmptyMsgorFiltred(filteredData, "No task found with name: " + searchText);
}

function printItem(array) {
    document.getElementById("todoList").innerHTML = "";

    for (var index = 0; index < array.length; index++) {
        createtodoitemsLi(array[index]);
    }
}

function addTask() {
    var taskName = document.getElementById("todoInput").value.trim();

    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }

    var istaskexist = todoitems.find(x => x.name == taskName);

    if (istaskexist == undefined) {
        todoitems.unshift({ name: taskName, completed: false });
        localStorage.setItem("todoitems", JSON.stringify(todoitems));
        onloadPrintItems();
    } else {
        alert("Task is already present");
    }
}

function onsort() {
    todoitems.sort((a, b) => a.name.localeCompare(b.name));
    printItem(todoitems);
}

function onDelete(event) {
    var taskName = event.target.dataset.itemName;
    var taskIndex = todoitems.findIndex(m => m.name == taskName);

    if (taskIndex > -1) {
        todoitems.splice(taskIndex, 1);
        localStorage.setItem("todoitems", JSON.stringify(todoitems));
        onloadPrintItems();
    }
}

function createtodoitemsLi(item) {
    var todoitemsLi = document.createElement("li");
    todoitemsLi.className = "list-group-item d-flex justify-content-between align-items-center";

    // LEFT SIDE: checkbox + task text
    var leftDiv = document.createElement("div");
    leftDiv.className = "d-flex align-items-center gap-2";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;

    checkbox.addEventListener("change", function () {
        item.completed = checkbox.checked;
        localStorage.setItem("todoitems", JSON.stringify(todoitems));
        onloadPrintItems();
    });

    var textSpan = document.createElement("span");
    textSpan.innerText = item.name;

    if (item.completed) {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.color = "gray";
    }

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(textSpan);

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger btn-delete";
    deleteBtn.innerText = "Delete";
    deleteBtn.dataset.itemName = item.name;
    deleteBtn.addEventListener("click", onDelete);

    todoitemsLi.appendChild(leftDiv);
    todoitemsLi.appendChild(deleteBtn);

    document.getElementById("todoList").appendChild(todoitemsLi);
}
