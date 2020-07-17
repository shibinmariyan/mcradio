import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public apiUrl: string;
  baseurl = "http://192.168.43.177:3000/api";
  user = this.baseurl + '/user';
  gallery = this.baseurl + '/gallery';
  ApiList = {
    login: this.user + '/login',
    regsiter: this.user + '/register',
    upload: this.gallery + '/upload',
    delete: this.gallery + '/delete',
    get: this.gallery + '/',
    update: this.gallery + '/update'
  }
  constructor(private http: HttpClient) {

  }

  loginSubmit(data) {
    console.log(data)
    return this.http.post(this.ApiList.login, data)
  }
  regSubmit(data) {
    console.log(data)
    return this.http.post(this.ApiList.regsiter, data)
  }
  getGallery() {
    return this.http.get(this.ApiList.get)
  }
  delete(data) {
    return this.http.post(this.ApiList.delete, data)
  }
  upload(data) {
    return this.http.post(this.ApiList.upload, data)
  }
  update(data) {
    console.log(data);
    return this.http.post(this.ApiList.update, data)
  }


}