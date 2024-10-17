import "./cssreset.css";
import "./style.css";

import { Storage, Project, Taks, Task } from "./data.js";
import { tasksDisplay, projectsDisplay } from "./display.js";
import { tasksFormHandler, projectsFormHandler } from "./input.js";
import { format, compareAsc } from "date-fns";

let currentProjectName = "Default";

class Controller {
  createStorage() {
    let storage;
    if (!localStorage.getItem("tasksStorage")) {
      storage = new Storage({});
      this.createProject("Default", storage);
    } else {
      let lclstorage = JSON.parse(localStorage.getItem("tasksStorage"));
      storage = new Storage(lclstorage);
      Object.keys(storage.storage).forEach((key) => {
        let projectElement = projectsDisplay.renderProject(
          storage.storage[key],
          "projects",
          () => {
            this.removeProject(storage.storage[key], storage);
            projectsDisplay.deleteProject(projectElement);
          },
          (event) => {
            console.log(event.currentTarget.getAttribute("data-projectname"));
            console.log(storage);
            currentProjectName =
              event.currentTarget.getAttribute("data-projectname");
            tasksFormHandler.showForm();
          }
        );

        projectElement.addEventListener("click", (event) => {
          if (event.target.classList.contains("project-name")) {
            tasksDisplay.deleteTasks("tasks");
            controller.filterTasks(storage.storage[key], storage);
          }
        });
      });
    }

    return storage;
  }
  saveStorage(storage) {
    let storageJSON = JSON.stringify(storage);
    localStorage.setItem("tasksStorage", storageJSON);
  }
  createProject(name, storage) {
    const project = new Project(name);
    project.name = storage.addProject(project);
    let projectElement = projectsDisplay.renderProject(
      project,
      "projects",
      () => {
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
    this.saveStorage(storage.storage);
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
    this.saveStorage(storage.storage);
  }

  createTask(title, description, dueDate, priority, project, storage) {
    const task = new Task(
      title,
      description,
      format(dueDate, "dd.MM.yyyy"),
      priority,
      project.name
    );
    storage.addTask(project, task);
    this.saveStorage(storage.storage);
    return task;
  }

  filterTasks(project, storage) {
    let tasks = [];
    tasksDisplay.deleteTasks("tasks");
    Object.keys(project.tasks).forEach((key) => {
      tasks.push(project.tasks[key]);
    });
    tasks.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
    tasks.forEach((task) =>
      tasksDisplay.renderTask(task, "tasks", () =>
        this.removeTask(storage, task.uuid)
      )
    );
  }

  filterAllTasks(storage) {
    tasksDisplay.deleteTasks("tasks");
    let tasks = [];
    if (Object.keys(storage.storage).length > 0) {
      Object.keys(storage.storage).forEach((project) => {
        if (
          storage.storage[project].tasks &&
          Object.keys(storage.storage[project].tasks).length > 0
        ) {
          Object.keys(storage.storage[project].tasks).forEach((task) => {
            tasks.push(storage.storage[project].tasks[task]);
          });
        } else {
          console.log(`No tasks found for project: ${project}`);
        }
      });
    } else {
      console.log("No projects found.");
    }

    tasks.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
    console.log(tasks);
    tasks.forEach((task) =>
      tasksDisplay.renderTask(task, "tasks", () =>
        this.removeTask(storage, task.uuid)
      )
    );
  }

  removeTask(storage, taskUuid) {
    storage.removeTaskFromStorage(taskUuid);
    this.saveStorage(storage.storage);
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

controller.filterAllTasks(newStorage);
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
document
  .getElementById("all-projects")
  .addEventListener("click", () => controller.filterAllTasks(newStorage));
