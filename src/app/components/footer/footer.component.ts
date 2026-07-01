import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavigationService } from '../../services/navigation.service';
import { SocialIconComponent, SocialPlatform } from '../shared/social-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SocialIconComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly nav = inject(NavigationService);
  protected readonly contact = environment.contact;

  readonly links = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly socials: { platform: SocialPlatform; href: string; label: string }[] = [
    { platform: 'instagram', href: '#', label: 'Follow us on Instagram' },
    { platform: 'facebook', href: '#', label: 'Follow us on Facebook' },
    { platform: 'linkedin', href: '#', label: 'Follow us on LinkedIn' },
  ];

  goTo(sectionId: string): void {
    this.nav.scrollToSection(sectionId);
  }
}
