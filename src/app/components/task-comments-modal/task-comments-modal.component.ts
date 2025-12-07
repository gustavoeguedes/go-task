import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { ITask } from '../../interfaces/task.interface';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required]);

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);

  onAddComment() {
    console.log('Comentário: ', this.commentControl.value);

    //criar um comantério
    const newComment: IComment = {
      id: generateUniqueIdWithTimestamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    };

    //adicionar o novo comentário à lista de comentários da tarefa
    this._task.comments.unshift(newComment);

    // reset no form control
    this.commentControl.reset();

    // atualizar a flag/prop se houve alteração nos comentários
    this.taskCommentsChanged = true;

    //focar no input de comentário
    this.commentInputRef.nativeElement.focus();
  }

  onRemoveComment(commentId: String) {
    this._task.comments = this._task.comments.filter(
      (comment) => comment.id !== commentId,
    );
    this.taskCommentsChanged = true;
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
