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
    project.name = storage.addProject(project);
    let projectElement = projectsDisplay.renderProject(
      project,
      "projects",
      () => {
        //TODO:
        this.removeProject(project, storage);
        projectsDisplay.deleteProject(projectElement);
      },
      (event) => {
        currentProjectName =
          event.currentTarget.getAttribute("data-projectname");
        tasksFormHandler.showForm();
      }
    );

    projectElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("project-name")) {
        tasksDisplay.deleteTasks("tasks");
        controller.filterTasks(project, storage);
      }
    });

    return project;
  }
  clearTasks() {
    document.getElementById("tasks").innerHTML = "";
  }
  removeProject(project, storage) {
    if (project.name === currentProjectName) {
      storage.removeProject(project);
      tasksDisplay.deleteTasks("tasks");
    } else {
      storage.removeProject(project);
    }
  }

  createTask(title, description, dueDate, priority, project, storage) {
    const task = new Task(title, description, dueDate, priority, project.name);
    project.addTask(task);
    return task;
  }

  filterTasks(project, storage) {
    tasksDisplay.deleteTasks("tasks");
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

controller.filterTasks(newStorage.storage[currentProjectName], newStorage);
//Add task
document.getElementById("addtask-button").addEventListener("click", (event) => {
  event.preventDefault();
  let task = tasksFormHandler.getFormData();
  if (task) {
    controller.createTask(
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      newStorage.storage[currentProjectName],
      newStorage
    );
  }
  if (task) {
    controller.filterTasks(newStorage.storage[currentProjectName], newStorage);
    tasksFormHandler.hideForm();
  }
});

//Add project
document
  .getElementById("addproject-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let project = projectsFormHandler.getFormData();
    if (project) {
      controller.createProject(project.name, newStorage);
      projectsFormHandler.hideForm();
    }
  });

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
