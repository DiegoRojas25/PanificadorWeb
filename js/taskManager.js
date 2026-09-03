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
        this.save();
        return newTask;
    }

    getTaskById(taskId) {
        let foundTask;
        for (let task of this.tasks) {
            if (task.id === taskId) {
                foundTask = task;
            }
        }
        return foundTask;
    }

    deleteTask(taskId) {
        const newTasks = [];
        
        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }

        this.tasks = newTasks;
    }

    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
        localStorage.setItem('currentId', String(this.currentId));
    }

    load() {
        if (localStorage.getItem('tasks')) {
            const tasksJson = localStorage.getItem('tasks');
            this.tasks = JSON.parse(tasksJson);
        }
        if (localStorage.getItem('currentId')) {
            const currentIdStr = localStorage.getItem('currentId');
            this.currentId = Number(currentIdStr);
        }
    }
}