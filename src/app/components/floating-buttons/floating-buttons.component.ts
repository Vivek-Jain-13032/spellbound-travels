import { Component } from '@angular/core';
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
}
