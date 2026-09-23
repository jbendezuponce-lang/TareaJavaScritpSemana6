import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { NotificationService } from '../../services/notification';
import { apiErrorMessage } from '../../services/api-error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
})
export class UserForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  readonly isEdit = computed(() => !!this.id());

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(150)]],
  });

  ngOnInit(): void {
    if (!this.isEdit()) return;
    this.loading.set(true);
    this.userService.getById(Number(this.id())).subscribe({
      next: (user) => {
        this.form.setValue({ name: user.name, email: user.email });
        this.loading.set(false);
      },
      error: (err) => {
        this.notify.error(apiErrorMessage(err));
        this.router.navigate(['/usuarios']);
      },
    });
  }

  invalid(field: 'name' | 'email'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.serverError.set(null);
    const data = this.form.getRawValue();
    const request = this.isEdit()
      ? this.userService.update(Number(this.id()), data)
      : this.userService.create(data);

    request.subscribe({
      next: (user) => {
        this.notify.success(this.isEdit() ? `Usuario "${user.name}" actualizado.` : `Usuario "${user.name}" creado.`);
        this.router.navigate(['/usuarios']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        if (err.status === 409) {
          this.form.controls.email.setErrors({ duplicate: true });
        } else {
          this.serverError.set(apiErrorMessage(err));
        }
      },
    });
  }
}
