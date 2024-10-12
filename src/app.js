import "./cssreset.css";
import "./style.css";

import { Storage, Project, Taks, Task } from "./data.js";

console.log("Hello, world!");

class Controller {
  createStorage() {
    const storage = new Storage();
    return storage;
  }
  createProject(name, storage) {
    const project = new Project(name);
    storage.addProject(project);
    return project;
  }
  removeProject(project, storage) {
    storage.removeProject(project);
  }
  createTask(title, description, dueDate, priority, project) {
    const task = new Task(title, description, dueDate, priority, project.name);
    project.addTask(task);
    return task;
  }
  removeTask(storage, tastUuid) {
    storage.removeTask(tastUuid);
  }
  listTasks(storage) {
    let tasks = {};
    for (const [key, value] of Object.entries(storage.storage)) {
      Object.assign(tasks, storage.storage[key].tasks);
    }
    return tasks;
  }
}

const controller = new Controller();
const newStorage = controller.createStorage();


let defaultProject = controller.createProject("Default", newStorage);
let newTask = controller.createTask(
  "Wash dishes",
  "I have to wash dishes",
  "12.10.2021",
  "Top",
  defaultProject
);

newTask = controller.createTask(
  "Make Todo Project",
  "Finish project by monday",
  "13.10.2021",
  "High",
  workProject
);

newTask = controller.createTask(
  "Design Todo page",
  "Finish project by monday",
  "11.10.2021",
  "Top",
  workProject
);


console.log(controller.listTasks(newStorage));
