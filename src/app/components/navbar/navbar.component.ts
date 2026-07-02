import { Component, ElementRef, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
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
export class NavbarComponent implements OnInit, OnDestroy {
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

  private cookieWatcher?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.loadGoogleTranslate();
    this.currentLanguage.set(this.readLanguageFromCookie());

    // Google's own "Translated to: X / Show original" banner can change or
    // clear the translation without reloading the page, so our pill would
    // otherwise go stale. There's no native cookie-change event, so a
    // lightweight poll is the standard way to detect it.
    this.cookieWatcher = setInterval(() => {
      const detected = this.readLanguageFromCookie();
      if (detected !== this.currentLanguage()) {
        this.currentLanguage.set(detected);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.cookieWatcher);
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

  planYourJourney(): void {
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
    this.setLanguageCookie(language.code === 'en' ? null : language.code);
    window.location.reload();
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
   * The widget's own UI is never shown — its language picker is a native
   * <select> in every layout, an OS/browser popup no site's CSS can
   * restyle. It's also not driven by simulating a change event on that
   * <select>: Google's internal listener for that has changed across
   * script versions and isn't a stable public API, so triggering it that
   * way is unreliable. Instead, language selection sets the `googtrans`
   * cookie and reloads — that's the documented mechanism the script itself
   * checks on initialization, which is what actually performs translation.
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

  private readLanguageFromCookie(): string {
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (!match) return 'EN';
    const found = this.languages.find((l) => l.code.toLowerCase() === match[1].toLowerCase());
    return found ? found.short : 'EN';
  }

  private setLanguageCookie(code: string | null): void {
    const hostname = window.location.hostname;
    if (!code) {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      return;
    }
    const value = `/en/${code}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=.${hostname}`;
  }
}
