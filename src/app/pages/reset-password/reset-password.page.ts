/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  passwordForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {

  }

  get password() {
    return this.passwordForm.controls.password;
  }

  get confirmPassword() {
    return this.passwordForm.controls.confirmPassword;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors.passwordMismatch;
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  }

  async updatePassword() {
    if (!this.passwordForm.valid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Atualizando senha...',
    });
    await loading.present();

    try {
      const { password } = this.passwordForm.getRawValue();
      const { error } = await this.authService.updatePassword(password);

      await loading.dismiss();

      if (error) {
        this.showAlert('Erro', error.message);
      } else {
        await this.showAlert('Sucesso', 'Sua senha foi atualizada com sucesso!');
        this.router.navigateByUrl('/groups', { replaceUrl: true });
      }
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Erro', 'Ocorreu um erro ao atualizar a senha. Tente novamente.');
      console.error('Erro ao atualizar senha:', error);
    }
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
