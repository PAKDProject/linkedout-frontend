import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IJob } from "src/models/job-model";
import { NotificationService } from "src/services/notifications/notification.service";
import { UserService } from "src/services/user-service/user.service";
import { JobService } from "src/services/job-service/job.service";
import { Store } from "@ngxs/store";
import { AddJob } from "src/redux/actions/job.actions";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-create-job-modal",
  templateUrl: "./create-job-modal.component.html",
  styleUrls: ["./create-job-modal.component.scss"]
})
export class CreateJobModalComponent implements OnInit {
  induvidual: boolean;
  induvidualJobForm: FormGroup;
  newJob: IJob;
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private _jobService: JobService,
    private _store: Store,
    private _dialogRef: MatDialogRef<CreateJobModalComponent>
  ) { }

  ngOnInit() {
    this.newJob = {
      title: "",
      employer: "",
      description: "",
      datePosted: new Date(),
      payment: null,
    };
    this.induvidualJobForm = this.fb.group({
      jobTitle: ["", [Validators.required]],
      employer: ["", [Validators.required]],
      location: [""],
      dateDue: [""],
      payment: [
        "",
        [Validators.required, Validators.min(1), Validators.max(1000000)]
      ],
      description: ["", [Validators.required]]
    });

    this.induvidualJobForm.valueChanges.subscribe(data => {
      this.newJob.title = data.jobTitle;
      this.newJob.employer = data.employer;
      this.newJob.description = data.description;
      this.newJob.location = data.location;
      this.newJob.dateDue = data.dateDue;
      this.newJob.payment = data.payment;
    });
  }

  //#region getters
  get jobTitle() {
    return this.induvidualJobForm.get("jobTitle");
  }
  get employer() {
    return this.induvidualJobForm.get("employer");
  }
  get location() {
    return this.induvidualJobForm.get("location");
  }
  get dateDue() {
    return this.induvidualJobForm.get("dateDue");
  }
  get payment() {
    return this.induvidualJobForm.get("payment");
  }
  get description() {
    return this.induvidualJobForm.get("description");
  }
  //#endregion

  submitForm(): void {
    const date = new Date(`${this.dateDue.value}T00:00:00`);
    if (date <= new Date()) {
      this.dateDue.setErrors({ invalid: true });
      this.notificationService.showError("An error occured");
    } else {
      this._store.dispatch(new AddJob(this.newJob))
      this.notificationService.showSuccess(
        "Job Created",
        "Your Job can now be applied for"
      );
      this._dialogRef.close();

    }
  }
}
