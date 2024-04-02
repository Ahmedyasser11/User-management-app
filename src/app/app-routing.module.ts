import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSingupComponent } from './login-singup/login-singup.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignupComponent } from './signup/signup.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  {path : "", component : LoginSingupComponent},
  {path : "Home" , component : MainPageComponent},
  {path : "Signup" , component : SignupComponent},
  {path : "userPage" , component : UserPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
