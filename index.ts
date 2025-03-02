import { v4 as uuidv4 } from 'uuid';
import * as readline from 'readline';
import * as fs from 'fs';

const store = "todos.json";


interface TodoItem {
  id: string;
  task: { description: string };
  completed: boolean;
  dueDate: string; 
}

class TodoList {
  private todos: TodoItem[] = [];

  constructor() {
    this.loadTodos();
  }

  private saveTodos(): void {
    fs.writeFileSync(store, JSON.stringify(this.todos, null, 2), "utf-8");
  }

  private loadTodos(): void {
    if (fs.existsSync(store)) {
      const data = fs.readFileSync(store, "utf-8");
      this.todos = JSON.parse(data);
    }
  }
// function to add a new task
  addTodo(task: string, dueDate: string): boolean {
    if (!task.trim()) {
      throw new InvalidTaskDescriptionError("Task description cannot be empty");
    }
    if (isNaN(new Date(dueDate).getTime())) {
      throw new InvalidDueDateError("Invalid due date");
    }

    const newTodo: TodoItem = {
      id: uuidv4(),
      task: { description: task },
      completed: false,
      dueDate,
    };
    this.todos.push(newTodo);
    this.saveTodos();
    return true;
  }
//function to switch todo from pending to completed
  completeTodo(id: string): boolean {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new TaskNotFoundError(`Todo with id ${id} not found.`);
    }
    todo.completed = true;
    this.saveTodos();
    return true;
  }

  removeTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    if (this.todos.length === initialLength) {
      throw new TaskNotFoundError(`Todo with id ${id} not found.`);
    }
    this.saveTodos();
    return true;
  }

  clearCompletedTasks(): void {
    this.todos = this.todos.filter((t) => !t.completed);
    this.saveTodos();
    console.log("Completed tasks cleared.");
  }

  listTodos(): void {
    if (this.todos.length === 0) {
      console.log("No tasks available.");
      return;
    }
    console.log("\nAll Tasks:");
    this.todos.forEach(({ id, task, completed, dueDate }, index) => {
      console.log(
        `${index + 1}. [${completed ? "✔" : " "}] ${task.description} (Due: ${dueDate}) - ID: ${id}`
      );
    });
  }

  listCompletedTasks(): void {
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


  listUndoneTasks(): void {
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
    constructor(message: string) {
      super(message);
      this.name = "TaskNotFoundError";
    }
  }
  
  class InvalidTaskDescriptionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidTaskDescriptionError";
    }
  }
  
  class InvalidDueDateError extends Error {
    constructor(message: string) {
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

function showMenu(): void {
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

function handleMenu(choice: string): void {
  switch (choice) {
    case "1":
      rl.question("Enter task description: ", (description) => {
        rl.question("Enter due date (YYYY-MM-DD): ", (dateInput) => {
          try {
            todoList.addTodo(description, dateInput);
            console.log("Task added successfully.");
          } catch (error) {
            console.error((error as Error).message);
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
        } catch (error) {
          console.error((error as Error).message);
        }
        main();
      });
      break;

    case "3":
      rl.question("Enter task ID to remove: ", (id) => {
        try {
          todoList.removeTodo(id);
          console.log("Task removed successfully.");
        } catch (error) {
          console.error((error as Error).message);
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

function main(): void {
  showMenu();
  rl.question("Choose an option: ", handleMenu);
}

main();
