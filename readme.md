# Todo List CLI - Manage Your Tasks Efficiently

A command-line application to manage your todo list with task descriptions, due dates, and robust error handling.


## Features

- ✅ Add tasks with descriptions
- 📋 List all tasks with status and due dates
- ✔️ Mark tasks as complete
- 🗑️ Remove tasks from the list
- 📅 Set/update due dates for tasks
- 🚨 Comprehensive error handling:
  - Invalid task descriptions
  - Invalid due dates
  - Missing tasks

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) (v16+) installed
2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-cli.git
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Usage

```bash
# Add a new task
todo add "Buy groceries"

# List all tasks
todo list

# Mark task as complete
todo complete 1

# Remove a task
todo remove 1

# Set due date for task
todo due-date 1 "2023-12-31"
```

## Error Handling

The application provides clear error messages for common issues:

### `InvalidTaskDescriptionError`
- Triggered when:
  - Description is empty
  - Description exceeds 255 characters
- Example:
  ```bash
  Error: InvalidTaskDescriptionError: Task description must be between 1 and 255 characters
  ```

### `InvalidDueDateError`
- Triggered when:
  - Date format is invalid
  - Date is in the past
- Example:
  ```bash
  Error: InvalidDueDateError: Due date must be a future date in YYYY-MM-DD format
  ```

### `TaskNotFoundError`
- Triggered when:
  - Trying to modify/remove non-existent tasks
- Example:
  ```bash
  Error: TaskNotFoundError: No task found with ID 5
  ```

## Example Workflow

```bash
# Add a new task
$ todo add "Prepare project presentation"
Task added successfully! ID: 1

# Try adding invalid task
$ todo add ""
Error: InvalidTaskDescriptionError: Task description cannot be empty

# Set due date
$ todo due-date 1 "2023-11-30"
Due date updated for task 1

# Try setting past due date
$ todo due-date 1 "2020-01-01"
Error: InvalidDueDateError: Due date must be in the future

# Complete task
$ todo complete 1
Task 1 marked as complete!

# List tasks
$ todo list
ID  Description                 Status    Due Date
1   Prepare project presentation ✅       2023-11-30
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

[MIT License](LICENSE)