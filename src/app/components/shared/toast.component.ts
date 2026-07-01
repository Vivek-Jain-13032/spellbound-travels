import { Component, inject } from '@angular/core';
import { LucideCircleCheck, LucideCircleX, LucideX } from '@lucide/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideCircleCheck, LucideCircleX, LucideX],
  template: `
    @if (toastService.toast(); as toast) {
      <div
        role="status"
        aria-live="polite"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 max-w-[92vw] md:max-w-md px-5 py-4 rounded-sm border shadow-2xl bg-[#141414]"
        [class.border-sb-gold]="toast.type === 'success'"
        [class.border-red-500]="toast.type === 'error'"
      >
        @if (toast.type === 'success') {
          <svg lucideCircleCheck class="w-5 h-5 text-sb-gold flex-shrink-0"></svg>
        } @else {
          <svg lucideCircleX class="w-5 h-5 text-red-400 flex-shrink-0"></svg>
        }
        <p class="font-body text-sm text-white m-0">{{ toast.message }}</p>
        <button type="button" (click)="toastService.dismiss()" class="ml-auto text-[#8a8a8a] hover:text-white" aria-label="Dismiss notification">
          <svg lucideX class="w-4 h-4"></svg>
        </button>
      </div>
    }
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
