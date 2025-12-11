import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import type { ITask } from '../../domain/tasks/interfaces/task.interface';
import type { ITaskFormControls } from '../interfaces/task-form-controls.interfaces';
import { generateUniqueIdWithTimestamp } from '../../shared/utils/generate-unique-id-with-timestamp';
import { TaskStatusEnum } from '../../domain/tasks/enums/task-status.enum';
import type { IComment } from '../../domain/tasks/interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.TODO));
  readonly todoTasks = this.todoTasks$.asObservable().pipe(
    map((tasks) => {
      return tasks.map(task => ({ ...task })); // Return a new object for each task
    }),
    tap((tasks) => {
      this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks);
    })
  );

  private doingTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DOING));
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((tasks) => {
      return tasks.map(task => ({ ...task })); // Return a new object for each task
    }),
    tap((tasks) => {
      this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks);
    })
  );

  private doneTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DONE));
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((tasks) => {
      return tasks.map(task => ({ ...task })); // Return a new object for each task
    }),
    tap((tasks) => {
      this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks);
    })
  );

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: []
    }
    this.todoTasks$.next([...this.todoTasks$.getValue(), newTask]);

  }

  deleteTask(id: string, status: TaskStatusEnum) {
    const taskList = this.getTaskListByStatus(status);
    const updatedTaskList = taskList.getValue().filter(task => task.id !== id);
    taskList.next(updatedTaskList);


  }
  updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatusEnum, taskNextStatus: TaskStatusEnum) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus)
    const nextTaskList = this.getTaskListByStatus(taskNextStatus)
    const currentTask = currentTaskList.getValue().find(task => task.id === taskId);

    if (!currentTask) return;

    currentTask.status = taskNextStatus;
    const currentTaskListWithoutTask = currentTaskList.value.filter(task => task.id !== taskId);
    currentTaskList.next(currentTaskListWithoutTask);

    nextTaskList.next([...nextTaskList.getValue(), currentTask]);

  }

  updateTask(taskId: string, taskStatus: TaskStatusEnum, updatedInfos: ITaskFormControls) {
    const taskList = this.getTaskListByStatus(taskStatus);
    const taskListUpdated = taskList.getValue().map(t => {
      if (t.id === taskId) {
        return { ...t, ...updatedInfos };
      }
      return t;
    });
    taskList.next(taskListUpdated);
  }

  updateTaskComments(taskId: string, taskStatus: TaskStatusEnum, comments: IComment[]) {
    const taskList = this.getTaskListByStatus(taskStatus);
    const taskListUpdated = taskList.getValue().map(t => {
      if (t.id === taskId) {
        return { ...t, comments };
      }
      return t;
    });
    taskList.next(taskListUpdated);
  }

  private getTaskListByStatus(status: TaskStatusEnum): BehaviorSubject<ITask[]> {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    }
    return taskListObj[status];
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  private loadTasksFromLocalStorage(key: string): ITask[] {
    try {
      const tasksJson = localStorage.getItem(key);
      if (tasksJson) {
        return JSON.parse(tasksJson) as ITask[];
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

}
