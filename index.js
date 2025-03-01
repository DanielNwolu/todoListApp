"use strict";
// // this  is an example of type and interception
// type User ={
//     name:string
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // since types cannot be extended we use intercept to combine types.
// type CompleteUser= User & {
//     address:string,
//     age: number,
//     sex:"male"|"female"
// }
// const userProfile:CompleteUser={
//     "name":"daniel",
//     "address":"ifo layout",
//     "age":23,
//     "sex":"male"
// }
// console.log(userProfile)
// // Example of extending interfaces.
// interface UserProfile{
//     name:string
// }
// interface completeUserProfile extends UserProfile{
//     address:string,
//     age: number,
//     sex:"male"|"female",
//     nationality:string,
// }
// const myUserProfile:completeUserProfile={
//     "name":"daniel",
//     "address":"ifo layout",
//     "age":23,
//     "sex":"male",
//     "nationality":"Nigeria"
// }
// console.log(myUserProfile)
// Import required Node.js types
const process_1 = __importDefault(require("process"));
class TodoList {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }
    addTodo(task, dueDate) {
        const newTodo = {
            id: this.nextId++,
            task,
            completed: false,
            dueDate,
        };
        this.todos.push(newTodo);
    }
    completeTodo(id) {
        const todo = this.findTodoById(id);
        todo.completed = true;
    }
    removeTodo(id) {
        const index = this.findTodoIndexById(id);
        this.todos.splice(index, 1);
    }
    listTodos(filter) {
        switch (filter) {
            case 'completed':
                return this.todos.filter(t => t.completed);
            case 'pending':
                return this.todos.filter(t => !t.completed);
            default:
                return [...this.todos];
        }
    }
    updateTodoTask(id, newTask) {
        const todo = this.findTodoById(id);
        todo.task = newTask;
    }
    clearCompletedTodos() {
        this.todos = this.todos.filter(t => !t.completed);
    }
    findTodoById(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo)
            throw new Error(`Todo with ID ${id} not found`);
        return todo;
    }
    findTodoIndexById(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1)
            throw new Error(`Todo with ID ${id} not found`);
        return index;
    }
}
// CLI Implementation
const todoList = new TodoList();
const [, , command, ...args] = process_1.default.argv;
function displayTodos(todos) {
    if (todos.length === 0) {
        console.log("No todos found");
        return;
    }
    todos.forEach(todo => {
        const status = todo.completed ? '[x]' : '[ ]';
        const dueDate = todo.dueDate.toISOString().split('T')[0];
        console.log(`${status} ${todo.id}: ${todo.task} (Due: ${dueDate})`);
    });
}
try {
    switch (command) {
        case 'add':
            const [task, dueDateString] = args;
            if (!task || !dueDateString) {
                console.error('Usage: add <task> <dueDate (YYYY-MM-DD)>');
                process_1.default.exit(1);
            }
            const dueDate = new Date(dueDateString);
            if (isNaN(dueDate.getTime())) {
                console.error('Invalid date format. Use YYYY-MM-DD');
                process_1.default.exit(1);
            }
            todoList.addTodo(task, dueDate);
            console.log('Todo added successfully');
            break;
        case 'complete':
            const id = parseInt(args[0]);
            if (isNaN(id)) {
                console.error('Usage: complete <id>');
                process_1.default.exit(1);
            }
            try {
                todoList.completeTodo(id);
                console.log(`Todo ${id} marked as complete`);
            }
            catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process_1.default.exit(1);
            }
            break;
        case 'remove':
            const removeId = parseInt(args[0]);
            if (isNaN(removeId)) {
                console.error('Usage: remove <id>');
                process_1.default.exit(1);
            }
            try {
                todoList.removeTodo(removeId);
                console.log(`Todo ${removeId} removed`);
            }
            catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process_1.default.exit(1);
            }
            break;
        case 'list':
            const filter = args[0] || 'all';
            const todos = todoList.listTodos(filter);
            displayTodos(todos);
            break;
        case 'update':
            const [updateId, ...taskParts] = args;
            const newTask = taskParts.join(' ');
            if (!updateId || !newTask) {
                console.error('Usage: update <id> <new task>');
                process_1.default.exit(1);
            }
            try {
                todoList.updateTodoTask(parseInt(updateId), newTask);
                console.log(`Todo ${updateId} updated`);
            }
            catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process_1.default.exit(1);
            }
            break;
        case 'clear-completed':
            todoList.clearCompletedTodos();
            console.log('Completed todos cleared');
            break;
        default:
            console.log(`Available commands:
  add <task> <dueDate>    Add new todo
  complete <id>           Mark todo as complete
  remove <id>             Remove todo
  list [filter]           List todos (all|completed|pending)
  update <id> <new task>  Update todo task
  clear-completed         Clear all completed todos`);
            break;
    }
}
catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process_1.default.exit(1);
}
