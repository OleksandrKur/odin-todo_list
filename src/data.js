import logger from "./logger";
import { v4 as uuidv4 } from "uuid";

export class Task {
  constructor(title, description, dueDate, priority, projectName) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectName = projectName;
    this.uuid = uuidv4();
  }
}

export class Project {
  constructor(name) {
    this.name = name;
    this.tasks = {};
  }

}

export class Storage {
  constructor(storage) {
    this.storage = storage;
  }
  addProject(project) {
    let projectName = project.name;
    if (!this.storage.hasOwnProperty(projectName)) {
      this.storage[projectName] = project;
      logger.log(`${this.storage[projectName].name} project was added`);
    } else {
      let i = 1;
      while (this.storage.hasOwnProperty(projectName + `(${i})`)) {
        i++;
      }
      projectName = projectName + `(${i})`;
      this.storage[projectName] = project;
    }
    console.log(this.storage);
    return projectName;
  }
  removeProject(project) {
    const projectName = project.name;
    delete this.storage[projectName];
    logger.log(`${projectName} project was deleted`);
    project.tasks.length = 0;
  }
  removeTaskFromStorage(taskUuid) {
    for (const [key, value] of Object.entries(this.storage)) {
      if (Object.hasOwn(this.storage[key].tasks, taskUuid)) {
        delete this.storage[key].tasks[taskUuid];
        logger.log(`${taskUuid} was removed`);
        return;
      }
    }

    logger.log(`Failed to remove ${taskUuid}`);
    return;
  }
  getProjectByName(projectName) {
    return this.storage[projectName];
  }
  addTask(project, task) {
    const taskUuid = task.uuid;
    this.storage[project.name].tasks[taskUuid] = task;

  }
  removeTask(project, taskName) {
    delete this.storage[project.name].tasks[taskName]();

  }
}
