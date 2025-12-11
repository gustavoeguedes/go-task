import type { ITaskFormControls } from "./task-form-controls.interfaces";

export interface ITaskFormModalData {
  mode: 'create' | 'edit';
  formValues: ITaskFormControls;
}
