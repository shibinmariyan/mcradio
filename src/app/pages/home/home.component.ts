import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  errorMsg: boolean = false;
  addForm: boolean = false;
  galleryForm: FormGroup;
  galleryEdit: FormGroup;
  newTask = String; editForm: boolean = false;
  galleryArray: any = [
  ];
  caption: any;
  path: any;
  _id: any;

  constructor(private data: DataService, private fb: FormBuilder,private router: Router) {

  }

  ngOnInit(): void {
    this.galleryForm = this.fb.group({
      caption: ['', Validators.required],
      path: ['', Validators.required]
    })
    this.galleryEdit = this.fb.group({
      caption: ['', Validators.required],
      path: ['', Validators.required],
      _id: ['', Validators.required],
    })
    this.getGallery();

  }
  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']);

  }
  getGallery() {
    this.data.getGallery()
      .subscribe((data: any) => {
        this.galleryArray = data;
        if (this.galleryArray.length <= 0)
          this.errorMsg = true;
      });
  }
  deleteGallery(id) {
    this.data.delete({ _id: id })
      .subscribe((reslt: any) => {
        if (reslt.status == 200)
          alert("Deleted Successfully");
        else {
          alert("Failed")
        }
        location.reload();
      })
  }
  onSubmit(data) {
    this.data.upload(data)
      .subscribe((rslt: any) => {
        console.log(rslt);
        alert("Upload Successfully");
        location.reload();
      })
  }
  editSubmit(data) {


    console.log(data, "after")
    this.data.update(data)
      .subscribe((rslt: any) => {
        alert(rslt.message);
        location.reload();

      })

  }
  editGallery(data) {
    console.log(data)
    this.editForm = true;
    this.caption = data.caption;
    this.path = data.path;
    this._id = data._id;
    console.log(this._id, "b4")
    this.galleryEdit.patchValue({
      _id: this._id
    });
    this.galleryEdit.get('_id').updateValueAndValidity();
  }
}
