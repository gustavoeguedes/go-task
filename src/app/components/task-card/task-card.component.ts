import { Component, inject, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import type { ITask } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  private readonly _modalControllerService = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);

  @Input({ required: true }) task!: ITask;


  openCommentsModal() {
    const dialogRef = this._modalControllerService.openTaskCommentsModal(
      this.task,
    );

    dialogRef.closed.subscribe((taskCommentsChanged) => {
      if (taskCommentsChanged) {
        // atualizar a fonte de verdade
        console.log('tarefa atualizada: ', this.task);
        this._taskService.updateTaskComments(
          this.task.id,
          this.task.status,
          this.task.comments,
        );
      }
    });
  }

  openEditTaskModal() {
    const dialogRef = this._modalControllerService.openEditTaskModal({
      name: this.task.name,
      description: this.task.description,
    });
    dialogRef.closed.subscribe((formValues) => {
      if (formValues) {
        this._taskService.updateTask(this.task.id, this.task.status, formValues);
      }
    });
  }

  onDeleteTask() {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
