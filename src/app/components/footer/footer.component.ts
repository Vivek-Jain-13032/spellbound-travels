import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavigationService } from '../../services/navigation.service';
import { SocialIconComponent, SocialPlatform } from '../shared/social-icon.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SocialIconComponent, ScrollSpyDirective],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly nav = inject(NavigationService);
  protected readonly contact = environment.contact;

  readonly links = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    // { id: 'about', label: 'About' }, // About section temporarily disabled — see app.component.html
    { id: 'footer', label: 'Contact' }, // Contact now points at the footer's contact details, not the enquiry form
  ];

  readonly socials: { platform: SocialPlatform; href: string; label: string }[] = [
    { platform: 'instagram', href: '#', label: 'Follow us on Instagram' },
    { platform: 'facebook', href: '#', label: 'Follow us on Facebook' },
    { platform: 'linkedin', href: '#', label: 'Follow us on LinkedIn' },
  ];

  /**
   * Opens Gmail's web compose UI directly instead of leaving it to the
   * browser/OS's default mail handler (a plain mailto: link) — requested
   * so the footer email always opens Gmail rather than whatever desktop
   * client (e.g. Outlook) happens to be registered as default.
   */
  get gmailComposeHref(): string {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.contact.adminEmail)}`;
  }

  goTo(sectionId: string): void {
    this.nav.scrollToSection(sectionId);
  }
}
