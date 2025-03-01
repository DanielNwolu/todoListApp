
// // this  is an example of type and interception
// type User ={
//     name:string
// }

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
import process from 'process';

interface TodoItem {
    id: number;
    task: string;
    completed: boolean;
    dueDate: Date;
}

class TodoList {
    private todos: TodoItem[] = [];
    private nextId = 1;

    addTodo(task: string, dueDate: Date): void {
        const newTodo: TodoItem = {
            id: this.nextId++,
            task,
            completed: false,
            dueDate,
        };
        this.todos.push(newTodo);
    }

    completeTodo(id: number): void {
        const todo = this.findTodoById(id);
        todo.completed = true;
    }

    removeTodo(id: number): void {
        const index = this.findTodoIndexById(id);
        this.todos.splice(index, 1);
    }

    listTodos(filter?: 'all' | 'completed' | 'pending'): TodoItem[] {
        switch (filter) {
            case 'completed':
                return this.todos.filter(t => t.completed);
            case 'pending':
                return this.todos.filter(t => !t.completed);
            default:
                return [...this.todos];
        }
    }

    updateTodoTask(id: number, newTask: string): void {
        const todo = this.findTodoById(id);
        todo.task = newTask;
    }

    clearCompletedTodos(): void {
        this.todos = this.todos.filter(t => !t.completed);
    }

    private findTodoById(id: number): TodoItem {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) throw new Error(`Todo with ID ${id} not found`);
        return todo;
    }

    private findTodoIndexById(id: number): number {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) throw new Error(`Todo with ID ${id} not found`);
        return index;
    }
}

// CLI Implementation
const todoList = new TodoList();

const [,, command, ...args] = process.argv;

function displayTodos(todos: TodoItem[]): void {
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
                process.exit(1);
            }
            const dueDate = new Date(dueDateString);
            if (isNaN(dueDate.getTime())) {
                console.error('Invalid date format. Use YYYY-MM-DD');
                process.exit(1);
            }
            todoList.addTodo(task, dueDate);
            console.log('Todo added successfully');
            break;

        case 'complete':
            const id = parseInt(args[0]);
            if (isNaN(id)) {
                console.error('Usage: complete <id>');
                process.exit(1);
            }
            try {
                todoList.completeTodo(id);
                console.log(`Todo ${id} marked as complete`);
            } catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process.exit(1);
            }
            break;

        case 'remove':
            const removeId = parseInt(args[0]);
            if (isNaN(removeId)) {
                console.error('Usage: remove <id>');
                process.exit(1);
            }
            try {
                todoList.removeTodo(removeId);
                console.log(`Todo ${removeId} removed`);
            } catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process.exit(1);
            }
            break;

        case 'list':
            const filter = args[0] as 'all' | 'completed' | 'pending' || 'all';
            const todos = todoList.listTodos(filter);
            displayTodos(todos);
            break;

        case 'update':
            const [updateId, ...taskParts] = args;
            const newTask = taskParts.join(' ');
            if (!updateId || !newTask) {
                console.error('Usage: update <id> <new task>');
                process.exit(1);
            }
            try {
                todoList.updateTodoTask(parseInt(updateId), newTask);
                console.log(`Todo ${updateId} updated`);
            } catch (error) {
                console.error(error instanceof Error ? error.message : 'Unknown error');
                process.exit(1);
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
} catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
}