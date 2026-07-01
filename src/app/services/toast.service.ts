import { Injectable, signal } from '@angular/core';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<ToastState | null>(null);
  private hideTimeout?: ReturnType<typeof setTimeout>;

  show(message: string, type: ToastState['type'] = 'success', durationMs = 6000): void {
    clearTimeout(this.hideTimeout);
    this.toast.set({ message, type });
    this.hideTimeout = setTimeout(() => this.toast.set(null), durationMs);
  }

  dismiss(): void {
    clearTimeout(this.hideTimeout);
    this.toast.set(null);
  }
}
