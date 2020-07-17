import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;
  constructor() {
    this.token = localStorage.accessToken ? localStorage.accessToken : "";
  }
  isAuthorized() {
    return this.token ? true : false;
  }
  getToken() {
    return this.token;
  }
  removeToken() {
    this.token = null;
    localStorage.removeItem("accessToken");
  }
}
