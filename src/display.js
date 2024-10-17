import addIcon from "./icons/add.svg";
import deleteIcon from "./icons/delete.svg";

class Display {
  renderWrapper(parent, className) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(className);
    parent.appendChild(wrapper);
    return wrapper;
  }
  renderElement(parent, elementName, className, value) {
    const element = document.createElement(elementName);
    element.textContent = value;
    element.classList.add(className);
    parent.appendChild(element);
    return element;
  }
}

class TasksDisplay extends Display {
  getUuid(element) {
    element.getAttribute("data-uuid");
    return element.value;
  }
  //FIXME:
  renderTask(task, parentId, deleteFunction) {
    if (!task) {
      console.log("cannot render task");
      return;
    }
    const tasksWrapper = document.getElementById(parentId);
    const taskWrapper = this.renderWrapper(tasksWrapper, "task-item");
    this.renderElement(taskWrapper, "p", "task-title", task.title);
    this.renderElement(taskWrapper, "p", "task-description", task.description);
    this.renderElement(taskWrapper, "p", "task-dueDate", task.dueDate);
    this.renderElement(taskWrapper, "p", "task-priority", task.priority);
    renderDeleteElement(taskWrapper, task.uuid, deleteFunction);

    function renderDeleteElement(parent, uuid, deleteFunction) {
      const element = document.createElement("a");
      element.textContent = "✔";
      element.classList.add("task-delete");
      element.setAttribute("data-uuid", uuid);
      parent.appendChild(element);
      element.addEventListener("click", (event) => {
        deleteFunction();
        event.target.parentElement.remove();
      });
      return element;
    }
  }

  deleteTasks(parentId) {
    const tasksWrapper = document.getElementById(parentId);

    tasksWrapper.innerHTML = "";
  }
}

class ProjectsDisplay extends Display {
  renderProject(project, parentId, deleteFunction, addFunction) {
    const projectsWrapper = document.getElementById(parentId);
    const projectWrapper = this.renderWrapper(projectsWrapper, "project-item");
    let projectHeading = this.renderElement(
      projectWrapper,
      "p",
      "project-name",
      project.name
    );
    projectHeading.setAttribute("data-projectname", project.name);
    //TODO:
    renderControlElement(
      projectWrapper,
      project.name,
      deleteIcon,
      deleteFunction
    );
    renderControlElement(projectWrapper, project.name, addIcon, addFunction);

    return projectWrapper;

    function renderControlElement(parent, name, icon, func) {
      const element = document.createElement("a");
      const img = document.createElement("img");
      img.setAttribute("src", icon);
      img.classList.add("project-icon");
      element.classList.add("control-icon");
      element.setAttribute("data-projectname", name);
      parent.appendChild(element);
      element.append(img);
      element.addEventListener("click", (event) => {
        //TODO:
        func(event);
      });
      return element;
    }
  }
  deleteProject(element) {
    element.remove();
  }
}

export const tasksDisplay = new TasksDisplay();
export const projectsDisplay = new ProjectsDisplay();
