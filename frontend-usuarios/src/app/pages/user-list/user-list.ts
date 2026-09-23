import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user';
import { NotificationService } from '../../services/notification';
import { apiErrorMessage } from '../../services/api-error';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, ConfirmDialog],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);
  private readonly notify = inject(NotificationService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly toDelete = signal<User | null>(null);
  readonly deleting = signal(false);

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  askDelete(user: User): void {
    this.toDelete.set(user);
  }

  confirmDelete(): void {
    const user = this.toDelete();
    if (!user) return;
    this.deleting.set(true);
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.notify.success(`Usuario "${user.name}" eliminado.`);
        this.closeDialog();
      },
      error: (err) => {
        this.notify.error(apiErrorMessage(err));
        this.closeDialog();
      },
    });
  }

  closeDialog(): void {
    this.toDelete.set(null);
    this.deleting.set(false);
  }
}
