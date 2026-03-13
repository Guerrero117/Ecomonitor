import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

 registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router){

    this.registerForm = this.fb.group({
      name:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
      confirmPassword:['', Validators.required]
    });

  }

  register(){

    if(this.registerForm.invalid){
      alert("Completa todos los campos");
      return;
    }

    const data = this.registerForm.value;

    if(data.password !== data.confirmPassword){
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Usuario registrado:", data);

    this.router.navigate(['/']);
  }

  goLogin(){
    this.router.navigate(['/']);
  }

}
