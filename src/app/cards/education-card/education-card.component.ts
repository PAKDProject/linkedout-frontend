import { Component, Input, EventEmitter, Output } from "@angular/core";
import { IEducationItem } from "src/models/user-model";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EducationModalComponent } from "src/app/modals/education-modal/education-modal.component";

@Component({
  selector: "education-card",
  templateUrl: "./education-card.component.html",
  styleUrls: ["./education-card.component.scss"]
})
export class EducationCardComponent {
  @Input("EducationItem") education: IEducationItem;
  @Input("editing") editing: boolean;
  @Output() educationEmit: EventEmitter<any> = new EventEmitter<
    any
  >();

  constructor(public dialog: MatDialog) { }

  openEduModal(): void {
    const dialogRef = this.dialog.open(EducationModalComponent, {
      maxWidth: "1000px",
      data: { education: this.education, editing: this.editing }
    });

    dialogRef.afterClosed().subscribe(data => {

      if (data !== undefined) {
        this.educationEmit.emit(data);
      }
    });
  }
}
