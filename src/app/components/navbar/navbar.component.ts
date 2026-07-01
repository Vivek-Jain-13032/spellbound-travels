import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { LucideMenu, LucideX, LucideGlobe, LucideChevronDown } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';

interface NavLink {
  id: string;
  label: string;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideMenu, LucideX, LucideGlobe, LucideChevronDown],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  protected readonly nav = inject(NavigationService);

  readonly scrolled = signal(false);
  readonly mobileMenuOpen = signal(false);

  readonly links: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  ngOnInit(): void {
    this.loadGoogleTranslate();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  goTo(sectionId: string): void {
    this.mobileMenuOpen.set(false);
    this.nav.scrollToSection(sectionId);
  }

  getAQuote(): void {
    this.mobileMenuOpen.set(false);
    this.nav.scrollToSection('contact');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  isActive(sectionId: string): boolean {
    return this.nav.activeSectionId() === sectionId;
  }

  /**
   * Loads the Google Translate widget once, client-side only. Google's
   * widget script rewrites text nodes directly, which can throw
   * NotFoundError from Angular's own removeChild/insertBefore calls
   * elsewhere on the page; see main.ts for the accompanying DOM patch.
   */
  private loadGoogleTranslate(): void {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          // The widget's language picker is a native <select> no matter the
          // layout — restricting it to languages relevant to an
          // international travel clientele keeps that native dropdown short
          // instead of listing all ~100 languages Google supports.
          includedLanguages: 'en,fr,de,es,it,pt,ar,zh-CN,hi,ja,ko,ru',
        },
        'google_translate_element',
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}
