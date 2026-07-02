import { Component, ElementRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { LucideMenu, LucideX, LucideGlobe, LucideChevronDown } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';

interface NavLink {
  id: string;
  label: string;
}

interface LanguageOption {
  code: string;
  label: string;
  short: string;
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
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly scrolled = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly languageMenuOpen = signal(false);
  readonly currentLanguage = signal('EN');

  readonly links: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  // Kept in sync with `includedLanguages` in loadGoogleTranslate() below.
  readonly languages: LanguageOption[] = [
    { code: 'en', label: 'English (Original)', short: 'EN' },
    { code: 'fr', label: 'French', short: 'FR' },
    { code: 'de', label: 'German', short: 'DE' },
    { code: 'es', label: 'Spanish', short: 'ES' },
    { code: 'it', label: 'Italian', short: 'IT' },
    { code: 'pt', label: 'Portuguese', short: 'PT' },
    { code: 'ar', label: 'Arabic', short: 'AR' },
    { code: 'zh-CN', label: 'Chinese (Simplified)', short: 'ZH' },
    { code: 'hi', label: 'Hindi', short: 'HI' },
    { code: 'ja', label: 'Japanese', short: 'JA' },
    { code: 'ko', label: 'Korean', short: 'KO' },
    { code: 'ru', label: 'Russian', short: 'RU' },
  ];

  ngOnInit(): void {
    this.loadGoogleTranslate();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.languageMenuOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.languageMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.languageMenuOpen.set(false);
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

  toggleLanguageMenu(): void {
    this.languageMenuOpen.update((open) => !open);
  }

  selectLanguage(language: LanguageOption): void {
    this.languageMenuOpen.set(false);
    this.currentLanguage.set(language.short);
    this.applyTranslation(language.code);
  }

  isActive(sectionId: string): boolean {
    return this.nav.activeSectionId() === sectionId;
  }

  /**
   * Loads the Google Translate widget once, client-side only. Google's
   * widget script rewrites text nodes directly, which can throw
   * NotFoundError from Angular's own removeChild/insertBefore calls
   * elsewhere on the page; see main.ts for the accompanying DOM patch.
   *
   * The widget itself is never shown — its native <select> popup can't be
   * restyled by any site (browser/OS-level limitation), so instead our own
   * language menu (see the template) drives it programmatically via
   * applyTranslation() below.
   */
  private loadGoogleTranslate(): void {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          includedLanguages: this.languages
            .map((l) => l.code)
            .filter((code) => code !== 'en')
            .join(','),
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

  /**
   * Google's widget script creates its <select id="goog-te-combo"> only
   * once translate.google.com finishes loading (asynchronous, network- and
   * cache-dependent) — retry briefly if a language is picked before it's
   * ready.
   */
  private applyTranslation(code: string, attempt = 0): void {
    const select = document.querySelector<HTMLSelectElement>(
      '#google_translate_element select.goog-te-combo',
    );
    if (!select) {
      if (attempt < 15) {
        setTimeout(() => this.applyTranslation(code, attempt + 1), 300);
      }
      return;
    }
    select.value = code;
    select.dispatchEvent(new Event('change'));
  }
}
