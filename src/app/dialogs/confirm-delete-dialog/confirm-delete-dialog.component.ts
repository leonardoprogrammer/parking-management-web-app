import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmação</h2>
    <mat-dialog-content>
      <p>Tem certeza que deseja apagar esse estacionamento?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Não</button>
      <button mat-button color="warn" (click)="onConfirm()">Sim</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
