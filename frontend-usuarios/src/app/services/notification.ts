import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  type: 'success' | 'danger';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  readonly items = signal<Notification[]>([]);

  success(text: string) {
    this.show('success', text);
  }

  error(text: string) {
    this.show('danger', text);
  }

  dismiss(id: number) {
    this.items.update((list) => list.filter((n) => n.id !== id));
  }

  private show(type: Notification['type'], text: string) {
    const id = this.nextId++;
    this.items.update((list) => [...list, { id, type, text }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
