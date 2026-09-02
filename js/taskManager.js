class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, priority, status = 'PORHACER') {
        this.currentId++;

        const newTask = {
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            priority: priority,
            status: status
        };

        this.tasks.push(newTask);
        return newTask;
    }
}