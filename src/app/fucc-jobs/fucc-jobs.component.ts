import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IJob } from 'src/models/job-model';
import { MatDialog } from '@angular/material';
import { InactiveJobModalComponent } from '../modals/inactive-job-modal/inactive-job-modal.component';

@Component({
  selector: 'fucc-jobs',
  templateUrl: './fucc-jobs.component.html',
  styleUrls: ['./fucc-jobs.component.scss']
})
export class FuccJobsComponent implements OnInit {
  @Output() dismissFormEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  fuccJob: IJob[] = [
    {
      title: 'Develop Ancient Technology',
      employerID: '1',
      employerName: 'Microsoft',
      location: 'Dublin',
      remote: false,
      payment: 3000,
      datePosted: new Date(),
      dateDue: new Date(2019,3,21),
      description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: 'Angular Version 72',
      employerID: '2',
      employerName: 'Google',
      location: 'Galway',
      remote: false,
      payment: 4000,
      datePosted: new Date(),
      dateDue: new Date(2019,5,14),
      description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: 'Virgin Sacrifice for Lord Jeff',
      employerID: '3',
      employerName: 'Amazon',
      remote: true,
      payment: 3500,
      datePosted: new Date(),
      dateDue: new Date(2019,4,29),
      description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ]

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

  dismiss() { this.dismissFormEmit.emit(true) }

  openJob(job: IJob) {
    this.dialog.open(InactiveJobModalComponent, {
      data: job
    })
  }
}