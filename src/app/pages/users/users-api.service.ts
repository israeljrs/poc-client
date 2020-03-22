import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { IUser } from '../../model/user.interface';
import { IResponse, IResponseObj } from 'src/app/model/response.interface';


@Injectable()
export class UsersApiService {

  apiURL: string;

  constructor(
    public http: HttpClient
  ) {
    this.apiURL = environment.apiURL;
  }

  getAllUsers(): Observable<IResponse> {
    return this.http.get<IResponse>(this.apiURL + '/api/v1/users')
    .pipe(
      tap(_ => this.log('fetched Users')),
      catchError(this.handleError<IResponse>('getAllUsers', {}))
    );
  }

  setNewUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiURL + '/api/v1/users', user)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IUser>('setNewUser', {}))
    );
  }

  setUpdateUser(id: number, user: IUser): Observable<IResponseObj> {
    return this.http.put<IResponseObj>(`${this.apiURL}/api/v1/users/${id}`, user)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IResponseObj>('setUpdateUser', {}))
    );
  }

  deleteUser(id: number): Observable<IResponseObj> {
    return this.http.delete<IResponseObj>(`${this.apiURL}/api/v1/users/${id}`)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IResponseObj>('setDeleteUser', {}))
    );
  }

  getUser(id: number): Observable<IResponseObj> {
    return this.http.get<IResponseObj>(`${this.apiURL}/api/v1/users/${id}`)
    .pipe(
      tap(_ => this.log('search user.')),
      catchError(this.handleError<IResponseObj>('getUser', {}))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
          Swal.fire('Error', errorMessage, 'error');
      } else {
          // server-side error
          if (error.error.status === 'FAILED') {
            console.log(error.error.errors);
            const obj = error.error.errors;
            for (const prop in obj) {
              if (obj.hasOwnProperty(prop)) {
                // console.log('obj.' + prop + ' = ' + obj[prop]);
                Swal.fire('Error', `obj. ${prop} = ${obj[prop]}`, 'error');
              }
            }
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            // Swal.fire('Error', errorMessage, 'error');
          }
          // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          // Swal.fire('Error', errorMessage, 'error');
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`Logger: ${message}`);
  }

}
