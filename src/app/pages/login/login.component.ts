import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName, FormBuilder } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  alertsucc: boolean = false;
  alertdan: boolean = false;

  constructor(private fb: FormBuilder, private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  onSubmit(data) {
    if (data.userName === '' || data.password === '') {
      this.alertdan = true;
    }
    this.data.loginSubmit(data)
      .subscribe((rsult: any) => {
        localStorage.setItem('accessToken', rsult.token);
        console.log(rsult);
        this.router.navigate(['/home']);

      }, (err) => {
        alert(err.message + "from Err")
        console.log(err)
      })
  }

}

