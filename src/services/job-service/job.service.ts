import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IJob } from 'src/models/job-model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  endpoint: string = 'http://localhost:3000/jobs';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private _http: HttpClient, private _notification: NotificationService) { }

  /**
   * Get all jobs
   */
  getJobs(): Observable<IJob[]> {
    return this._http.get(this.endpoint).pipe(map((res) => {
      let response = res as { jobs: IJob[] };
      return response.jobs;
    }))
  }

  /**
   * Get job by a specific id
   * @param jobId string
   */
  getJobById(jobId: string): Observable<IJob> {
    return this._http.get(`${this.endpoint}/${jobId}`).pipe(map((res) => {
      let response = res as { job: IJob };
      return response.job;
    }))
  }

  /**
   * Creates a new job
   * @param job IJob object
   */
  createNewJob(job: IJob) {
    return this._http.post(this.endpoint, JSON.stringify(job), this.httpOptions).pipe(catchError(this.handleError));
  }

  /**
   * Update the details of a job
   * @param job IJob Object
   */
  updateJob(job: IJob) {
    this._http.put(`${this.endpoint}/${job.id}`, JSON.stringify(job), this.httpOptions).pipe(catchError(this.handleError))
  }

  /**
   * Delete a job
   * @param jobId string
   */
  deleteJob(jobId: string) {
    this._http.delete(`${this.endpoint}/${jobId}`).pipe(catchError(this.handleError))
  }


  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notification.showError(error.status.toString(), error.error.message)
      console.error('An error occurred:', error.error.message);
    } else {
      this._notification.showError(error.status.toString(), error.error.message)
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error)
  }
}