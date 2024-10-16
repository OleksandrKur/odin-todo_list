class FormHandler {
  constructor(wrapper, titleInput) {
    this.wrapper = document.getElementById(wrapper);
    this.titleInput = document.getElementById(titleInput);
  }
  showForm() {
    this.wrapper.classList.remove("hidden");
    document.body.classList.add("modal-opened");
  }
  hideForm() {
    this.wrapper.classList.add("hidden");
    document.body.classList.remove("modal-opened");
  }
}
class TasksFormHandler extends FormHandler {
  constructor(
    wrapper,
    titleInput,
    descriptionInput,
    dueDateInput,
    priorityInput,
    submitInput
  ) {
    super(wrapper, titleInput);
    this.descriptionInput = document.getElementById(descriptionInput);
    this.dueDateInput = document.getElementById(dueDateInput);
    this.priorityInput = document.getElementById(priorityInput);
    this.submitInput = document.getElementById(submitInput);
  }
  getFormData() {
    if (
      this.titleInput.value != "" &&
      this.descriptionInput.value != "" &&
      this.dueDateInput.value != ""
    ) {
      const title = this.titleInput.value;
      const description = this.descriptionInput.value;
      const dueDate = this.dueDateInput.value;
      const priority = this.priorityInput.value;
      this.titleInput.value = "";
      this.descriptionInput.value = "";
      this.dueDateInput.value = "";
      this.priorityInput.value = "";
      return { title, description, dueDate, priority };
    } else alert("Please fill in all fields");
  }
}
class ProjectsFormHandler extends FormHandler {
  constructor(wrapper, titleInput) {
    super(wrapper, titleInput);
  }
  getFormData() {
    if (this.titleInput.value != "") {
      const name = this.titleInput.value;
      this.titleInput.value = "";
      return { name };
    } else alert("Please fill in all fields");
  }
}

export const tasksFormHandler = new TasksFormHandler(
  "taskform-wrapper",
  "title",
  "description",
  "duedate",
  "priority",
  "submit"
);

export const projectsFormHandler = new ProjectsFormHandler(
  "projectsform-wrapper",
  "name"
);
