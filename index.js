"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const readline = __importStar(require("readline"));
const fs = __importStar(require("fs"));
const store = "todos.json";
class TodoList {
    constructor() {
        this.todos = [];
        this.loadTodos();
    }
    saveTodos() {
        fs.writeFileSync(store, JSON.stringify(this.todos, null, 2), "utf-8");
    }
    loadTodos() {
        if (fs.existsSync(store)) {
            const data = fs.readFileSync(store, "utf-8");
            this.todos = JSON.parse(data);
        }
    }
    // function to add a new task
    addTodo(task, dueDate) {
        if (!task.trim()) {
            throw new InvalidTaskDescriptionError("Task description cannot be empty");
        }
        if (isNaN(new Date(dueDate).getTime())) {
            throw new InvalidDueDateError("Invalid due date");
        }
        const newTodo = {
            id: (0, uuid_1.v4)(),
            task: { description: task },
            completed: false,
            dueDate,
        };
        this.todos.push(newTodo);
        this.saveTodos();
        return true;
    }
    //function to switch todo from pending to completed
    completeTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) {
            throw new TaskNotFoundError(`Todo with id ${id} not found.`);
        }
        todo.completed = true;
        this.saveTodos();
        return true;
    }
    removeTodo(id) {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter((t) => t.id !== id);
        if (this.todos.length === initialLength) {
            throw new TaskNotFoundError(`Todo with id ${id} not found.`);
        }
        this.saveTodos();
        return true;
    }
    clearCompletedTasks() {
        this.todos = this.todos.filter((t) => !t.completed);
        this.saveTodos();
        console.log("Completed tasks cleared.");
    }
    listTodos() {
        if (this.todos.length === 0) {
            console.log("No tasks available.");
            return;
        }
        console.log("\nAll Tasks:");
        this.todos.forEach(({ id, task, completed, dueDate }, index) => {
            console.log(`${index + 1}. [${completed ? "✔" : " "}] ${task.description} (Due: ${dueDate}) - ID: ${id}`);
        });
    }
    listCompletedTasks() {
        const completedTasks = this.todos.filter((t) => t.completed);
        if (completedTasks.length === 0) {
            console.log("No completed tasks.");
            return;
        }
        console.log("\nCompleted Tasks:");
        completedTasks.forEach(({ id, task, dueDate }, index) => {
            console.log(`${index + 1}. ✔ ${task.description} (Due: ${dueDate}) - ID: ${id}`);
        });
    }
    listUndoneTasks() {
        const undoneTasks = this.todos.filter((t) => !t.completed);
        if (undoneTasks.length === 0) {
            console.log("No pending tasks.");
            return;
        }
        console.log("\nPending Tasks:");
        undoneTasks.forEach(({ id, task, dueDate }, index) => {
            console.log(`${index + 1}.  ${task.description} (Due: ${dueDate}) - ID: ${id}`);
        });
    }
}
// different error responses
class TaskNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "TaskNotFoundError";
    }
}
class InvalidTaskDescriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTaskDescriptionError";
    }
}
class InvalidDueDateError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidDueDateError";
    }
}
// CLI Interaction with my App
const todoList = new TodoList();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function showMenu() {
    console.log("\n*** Todo List App *** ");
    console.log("1. Add Todo");
    console.log("2. Complete Todo");
    console.log("3. Remove Todo");
    console.log("4. List All Todo's");
    console.log("5. Clear Completed Todo's");
    console.log("6. List Completed Todo's");
    console.log("7. List Pending Todo's");
    console.log("8. Exit");
}
function handleMenu(choice) {
    switch (choice) {
        case "1":
            rl.question("Enter task description: ", (description) => {
                rl.question("Enter due date (YYYY-MM-DD): ", (dateInput) => {
                    try {
                        todoList.addTodo(description, dateInput);
                        console.log("Task added successfully.");
                    }
                    catch (error) {
                        console.error(error.message);
                    }
                    main();
                });
            });
            break;
        case "2":
            rl.question("Enter task ID to mark as complete: ", (id) => {
                try {
                    todoList.completeTodo(id);
                    console.log("Task marked as completed.");
                }
                catch (error) {
                    console.error(error.message);
                }
                main();
            });
            break;
        case "3":
            rl.question("Enter task ID to remove: ", (id) => {
                try {
                    todoList.removeTodo(id);
                    console.log("Task removed successfully.");
                }
                catch (error) {
                    console.error(error.message);
                }
                main();
            });
            break;
        case "4":
            todoList.listTodos();
            main();
            break;
        case "5":
            todoList.clearCompletedTasks();
            main();
            break;
        case "6":
            todoList.listCompletedTasks();
            main();
            break;
        case "7":
            todoList.listUndoneTasks();
            main();
            break;
        case "8":
            console.log("Goodbye!");
            rl.close();
            break;
        default:
            console.log("Invalid choice. Please try again.");
            main();
    }
}
function main() {
    showMenu();
    rl.question("Choose an option: ", handleMenu);
}
main();
