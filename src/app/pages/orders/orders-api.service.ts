import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { IOrder, IResOrders, IResOrder } from '../../model/order.interface';

@Injectable()
export class OrderApiService {

  apiURL: string;

  constructor(
    public http: HttpClient
  ) {
    this.apiURL = environment.apiURL;
  }

  getAllOrders(id: number): Observable<IResOrders> {
    return this.http.get<IResOrders>(`${this.apiURL}/api/v1/users/${id}/orders`)
    .pipe(
      tap(_ => this.log('fetched Orders')),
      catchError(this.handleError<IResOrders>('getAllOrders', {}))
    );
  }

  setNewOrder(userId: number, order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.apiURL}/api/v1/users/${userId}/orders`, order)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IOrder>('setNewUser', {}))
    );
  }

  getOrder(userId: number, id: number): Observable<IResOrder> {
    return this.http.get<IResOrder>(`${this.apiURL}/api/v1/users/${userId}/orders/${id}`)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IResOrder>('getOrder', {}))
    );
  }

  updateOrder(userId: number, id: number, model: IOrder): Observable<IResOrder> {
    return this.http.put<IResOrder>(`${this.apiURL}/api/v1/users/${userId}/orders/${id}`, model)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IResOrder>('getOrder', {}))
    );
  }

  deleteOrder(userId: number, id: number): Observable<IResOrder> {
    return this.http.delete<IResOrder>(`${this.apiURL}/api/v1/users/${userId}/orders/${id}`)
    .pipe(
      tap(_ => this.log('put User: ')),
      catchError(this.handleError<IResOrder>('getOrder', {}))
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
