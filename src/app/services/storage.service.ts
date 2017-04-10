import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  storage: any = window.localStorage;
  prefix: string = 'ng2048';
  expires: number = 0;
  constructor() { }

  getKey(key): string {
    return `${this.prefix}_${key}`;
  }

  setItem(key, value, expires?): void {
    key = this.getKey(key);
    expires = expires || this.expires;
    // 如果不是存的对象
    if (!Object.keys(value).length) {
      value = { $$key: value }
    }
    // 添加超时时间
    expires && (value['$$expires'] = new Date().getTime() + expires);
    this.storage.setItem(key, JSON.stringify(value));
  }

  getItem(key): any {
    key = this.getKey(key);
    let value = JSON.parse(this.storage.getItem(key));
    if (!value) return;
    // 存储超时了
    if (value.$$expires && (new Date().getTime() > value.$$expires)) {
      return this.removeItem(key);
    }
    delete value.$$expires;
    let keys = Object.keys(value);
    // 不是存的对象
    if (keys.length === 1 && keys.pop() === '$$key') {
      value = value.$$key;
    }
    return value;
  }

  removeItem(key): void {
    key = this.getKey(key);
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

}

@Injectable()
export class SessionStorageService extends LocalStorageService {
  constructor() {
    super();
    this.storage = window.sessionStorage;
  }
}