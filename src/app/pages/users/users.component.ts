import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UsersApiService } from './users-api.service';
import { IUser } from '../../model/user.interface';
import { IResponse } from 'src/app/model/response.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Observable<IResponse>;
  frm: FormGroup;
  userId = 0;
  btnLabel = 'Cadastrar';

  constructor(
    private api: UsersApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.frm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', Validators.required]
    });
    // this.users$ = this.api.getAllUsers();
    // this.users$.subscribe(items => {
    //   if (items.status === 'SUCCESS') {
    //     console.log(items.data);
    //   }
    // });
    this.refreshUser();
  }

  saveForm(data: IUser) {
    if (this.frm.valid && this.frm.dirty) {
      const model: IUser = data;
      if (this.userId === 0) {
        this.api.setNewUser(model).subscribe(m => {
          this.refreshUser();
          this.resetForm();
        });
      } else {
        this.api.setUpdateUser(this.userId, model).subscribe(m => {
          Swal.fire('Information', `${m.data.nome} foi atualizado com sucesso !!`, 'success');
          this.refreshUser();
          this.resetForm();
          this.userId = 0;
          this.btnLabel = 'Cadastrar';
        });
      }
    } else {
      Swal.fire('Error', 'Por favor preencher todos os campos !!!', 'error');
    }
  }

  searchUser(id: number): void {
    this.api.getUser(id).subscribe((resp) => {
      if (resp.status === 'SUCCESS') {
        Swal.fire('Information', `User ${resp.data.nome} is find !!!`, 'info');
      }
    });
  }

  editUser(id: number): void {
    this.api.getUser(id).subscribe((resp) => {
      this.userId = resp.data.id;
      this.resetForm();
      this.frm.setValue({
        nome: resp.data.nome,
        cpf: resp.data.cpf,
        email: resp.data.email,
      });
      this.btnLabel = 'Atualizar';
    });
  }

  deleteUser(id: number): void {
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
        this.api.deleteUser(id).subscribe((resp) => {
          this.refreshUser();
        });
      }
    });
  }

  private refreshUser(): void {
    this.users$ = this.api.getAllUsers();
  }

  private resetForm(): void {
    this.frm.reset();
  }

}
