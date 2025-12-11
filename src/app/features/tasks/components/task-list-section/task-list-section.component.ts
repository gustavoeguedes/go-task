import { Component, inject } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";
import { TaskService } from '../../../../core/services/task.service';
import type { ITask } from '../../../../domain/tasks/interfaces/task.interface';

import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import type { TaskStatusType } from '../../../../domain/tasks/types/task-status';
import { TaskStatusEnum } from '../../../../domain/tasks/enums/task-status.enum';




@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDrag, CdkDropList, AsyncPipe],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css'
})
export class TaskListSectionComponent {


  public readonly _taskService = inject(TaskService);

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
  }


  private updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatusType, droppedColumn: string) {
    let taskNextStatus: TaskStatusEnum;
    switch (droppedColumn) {
      case "to-do-column":
        taskNextStatus = TaskStatusEnum.TODO;
        break;
      case "doing-column":
        taskNextStatus = TaskStatusEnum.DOING;
        break;
      case "done-column":
        taskNextStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw new Error("Invalid column");
    }

    this._taskService.updateTaskStatus(taskId, taskCurrentStatus, taskNextStatus);
  }
}
