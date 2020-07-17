import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  alertsucc: boolean = false;
  alertdan: boolean = false;

  constructor(private fb: FormBuilder, private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      mobileNo: ['', Validators.required],
    })
  }
  onSubmit(data) {
    if (data.name == '' || data.email === '' || data.password === '' || data.userName == '' || data.mobileNo == '')
      this.alertdan = true;
    this.data.regSubmit(data)
      .subscribe((rslt: any) => {
        console.log(rslt)
        if (rslt.status === 200) {
          localStorage.setItem('accessToken', rslt.token);
          alert("Created Successfully")
          this.router.navigate(['/home']);
        }
      })
  }


}
