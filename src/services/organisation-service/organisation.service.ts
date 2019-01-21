import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { IOrganisation } from 'src/models/organisation-model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  //Api endpoint
  endpoint: string = `${environment.backendUrl}/organisations`;
  //Http options for post and put requests
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  //Inject required dependanciesd
  constructor(private _http: HttpClient) { }

  getOrganisations(): Observable<IOrganisation[]> {
    return this._http.get<IOrganisation[]>(this.endpoint).
      pipe(catchError(this.handleError))
  }

  getOrganisationByID(organisationId: string): Observable<IOrganisation> {
    return this._http.get(`${this.endpoint}/${organisationId}`).
      pipe(map(res => {
        let response = res as { organisation: IOrganisation };
        return response.organisation;
      }),
        catchError(this.handleError)
      )
  }

  createOrganisation(organisation: IOrganisation): Observable<IOrganisation> {
    return this._http.post<IOrganisation>(this.endpoint, JSON.stringify(organisation), this.httpOptions).
      pipe(catchError(this.handleError));
  }

  updateOrganisation(updatedOrganisation: Partial<IOrganisation>, organisationId: string): Observable<IOrganisation> {
    return this._http.put<IOrganisation>(`${this.endpoint}/${organisationId}`, JSON.stringify(updatedOrganisation), this.httpOptions).
      pipe(catchError(this.handleError));
  }

  deleteOrganisation(organisationId: string): Observable<IOrganisation> {
    return this._http.delete<IOrganisation>(`${this.endpoint}/${organisationId}`).
      pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`
      );
    }
    return throwError(error);
  }
}
