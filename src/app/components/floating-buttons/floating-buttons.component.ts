import { Component, inject } from '@angular/core';
import { GtmService } from '../../services/gtm.service';
import { LucidePhone } from '@lucide/angular';
import { environment } from '../../../environments/environment';
import { SocialIconComponent } from '../shared/social-icon.component';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [LucidePhone, SocialIconComponent],
  templateUrl: './floating-buttons.component.html',
})
export class FloatingButtonsComponent {
  protected readonly contact = environment.contact;

  private readonly gtm = inject(GtmService);

  trackWhatsApp(): void {
    this.gtm.pushEvent('whatsapp_click', {
      method: 'WhatsApp'
    });
  }

  trackPhone(): void {
    this.gtm.pushEvent('phone_click', {
      method: 'Phone'
    });
  }
}
