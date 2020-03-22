import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { OrderApiService } from './orders-api.service';
import { IOrder, IResOrders, IResOrder } from '../../model/order.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  userId: number;
  orderId = 0;
  orders$: Observable<IResOrders>;
  frm: FormGroup;
  btnLabel = 'Cadastrar';

  constructor(
    private ar: ActivatedRoute,
    private api: OrderApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ar.paramMap.subscribe(params => {
      // tslint:disable-next-line: radix
      this.userId = parseInt(params.get('id'));
      this.refreshOrders(this.userId);
    });
    this.frm = this.fb.group({
      user_id: this.userId,
      model: ['', Validators.required],
      vrl_year: ['', Validators.required],
      num_parcel: ['']
    });
  }

  saveForm(data: IOrder) {
    if (this.frm.valid && this.frm.dirty) {
      const model: IOrder = data;
      if (this.orderId === 0) {
        this.api.setNewOrder(this.userId, data).subscribe(m => {
          console.log(m);
          this.refreshOrders(this.userId);
          this.resetForm();
        });
      } else {
        this.api.updateOrder(this.userId, this.orderId, model).subscribe(m => {
          console.log(m);
          this.refreshOrders(this.userId);
          this.resetForm();
          this.orderId = 0;
          this.btnLabel = 'Cadastrar';
        });
      }
    } else {
      Swal.fire('Error', 'Por favor preencher todos os campos !!!', 'error');
    }
  }

  editOrder(id: number): void {
    this.api.getOrder(this.userId, id).subscribe(resp => {
      this.resetForm();
      this.frm.setValue({
        user_id: resp.data.user_id,
        model: resp.data.model,
        vrl_year: resp.data.vrl_year,
        num_parcel: resp.data.num_parcel
      });
      this.orderId = resp.data.id;
      this.btnLabel = 'Atualizar';
    });
  }

  deleteOrder(id: number): void {
    Swal.fire({
      title: 'Excluir?',
      text: 'Deseja excluir o cliente !!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.api.deleteOrder(this.userId, id).subscribe(resp => {
          this.refreshOrders(this.userId);
        });
      }
    });
  }

  refreshOrders(id: number): void {
    this.orders$ = this.api.getAllOrders(id);
  }

  private resetForm(): void {
    this.frm.reset();
  }

}
