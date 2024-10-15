import "./cssreset.css";
import "./style.css";

import { Storage, Project, Taks, Task } from "./data.js";
import { tasksDisplay, projectsDisplay } from "./display.js";
import { tasksFormHandler, projectsFormHandler } from "./input.js";

let currentProjectName = "Default";

class Controller {
  createStorage() {
    const storage = new Storage();
    return storage;
  }

  createProject(name, storage) {
    const project = new Project(name);
    storage.addProject(project);
    let projectElement = projectsDisplay.renderProject(
      project,
      "projects",
      () => {
        this.removeProject(project, storage);
        projectsDisplay.deleteProject(projectElement);
      },
      () => {
        currentProjectName = event.target.getAttribute("data-projectname");
        tasksFormHandler.showForm();
        console.log(currentProjectName);
      }
    );

    projectElement.addEventListener("click", () => {
      tasksDisplay.deleteTasks("tasks");
      controller.filterTasks(project, storage);
    });

    return project;
  }

  removeProject(project, storage) {
    storage.removeProject(project);
  }

  createTask(title, description, dueDate, priority, project, storage) {
    const task = new Task(title, description, dueDate, priority, project.name);
    project.addTask(task);
    return task;
  }

  filterTasks(project, storage) {
    Object.keys(project.tasks).forEach((key) => {
      tasksDisplay.renderTask(project.tasks[key], "tasks", () =>
        this.removeTask(storage, project.tasks[key].uuid)
      );
    });
  }

  removeTask(storage, taskUuid) {
    storage.removeTaskFromStorage(taskUuid);
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
  defaultProject,
  newStorage
);

newTask = controller.createTask(
  "Make Todo Project",
  "Finish project by monday",
  "13.10.2021",
  "High",
  defaultProject,
  newStorage
);

newTask = controller.createTask(
  "Design Todo page",
  "Finish project by monday",
  "11.10.2021",
  "Top",
  defaultProject,
  newStorage
);
console.dir(newStorage);

//Add task
document.getElementById("addtask-button").addEventListener("click", (event) => {
  event.preventDefault();
  let task = tasksFormHandler.getFormData();
  controller.createTask(
    task.title,
    task.description,
    task.dueDate,
    task.priority,
    newStorage.storage[currentProjectName],
    newStorage
  );
  tasksFormHandler.hideForm();
});

//Add project
document
  .getElementById("addproject-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let project = projectsFormHandler.getFormData();
    controller.createProject(project.name, newStorage);
    projectsFormHandler.hideForm();
  });

console.log(controller.listTasks(newStorage));

//Make forms modals closable
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("form-wrapper")) {
    tasksFormHandler.hideForm();
    projectsFormHandler.hideForm();
  }
});

document
  .getElementById("open-project-form-button")
  .addEventListener("click", (event) => {
    projectsFormHandler.showForm();
  });
