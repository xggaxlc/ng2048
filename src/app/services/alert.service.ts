import { Injectable } from '@angular/core';
import * as Swal from 'sweetalert';

@Injectable()
export class AlertService {

  constructor() {}

  error(title = '错误', text = 'text', btnText = '关闭'): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal({
        title: title,
        text: text,
        type: 'error',
        html: true,
        confirmButtonColor: '#4ad99b',
        confirmButtonText: btnText,
        allowEscapeKey: true,
        allowOutsideClick: true
      }, (isConfirm) => {
        resolve(isConfirm);
      });
    });
  }

  success(title = '成功', text = 'text'): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal({
        title: title,
        text: text,
        type: 'success',
        html: true,
        confirmButtonColor: '#4ad99b',
        confirmButtonText: '关闭',
        allowEscapeKey: true,
        allowOutsideClick: true
      }, (isConfirm) => {
        resolve(isConfirm);
      });
    });
  }

  delete(title = 'title', text = 'text'): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal({
        title: title,
        text: text,
        type: 'warning',
        html: true,
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false
      },
      (isConfirm) => {
        isConfirm ? resolve(isConfirm) : reject(isConfirm);
      });
    });
  }

  confirm(title = 'title', text = 'text', okBtnText = '确定', cancelBtnText = '取消'): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal({
        title: title,
        text: text,
        type: 'warning',
        html: true,
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: okBtnText,
        cancelButtonText: cancelBtnText,
        closeOnConfirm: true,
        // showLoaderOnConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false
      },
      (isConfirm) => {
        isConfirm ? resolve(isConfirm) : reject(isConfirm);
      });
    });
  }

}
