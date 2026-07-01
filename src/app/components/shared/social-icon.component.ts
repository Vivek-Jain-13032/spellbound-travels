import { Component, Input } from '@angular/core';

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'whatsapp';

/**
 * Lucide has no brand logos, so social/WhatsApp icons are inlined here as SVG paths.
 */
@Component({
  selector: 'app-social-icon',
  standalone: true,
  template: `
    @switch (icon) {
      @case ('instagram') {
        <svg viewBox="0 0 24 24" fill="none" [attr.class]="svgClass">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>
        </svg>
      }
      @case ('facebook') {
        <svg viewBox="0 0 24 24" fill="none" [attr.class]="svgClass">
          <path d="M15 8.5h2V5.2c-.35-.05-1.54-.15-2.93-.15-2.9 0-4.88 1.78-4.88 5.05v2.6H6.5v3.7h2.69V21h3.72v-4.6h2.58l.41-3.7h-2.99V10.5c0-1.07.29-1.8 1.79-1.8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
      }
      @case ('linkedin') {
        <svg viewBox="0 0 24 24" fill="none" [attr.class]="svgClass">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="7.5" cy="8" r="1.3" fill="currentColor"/>
          <path d="M7.5 11v6.5M11.5 11v6.5M11.5 13.8c0-1.7 1.1-2.8 2.6-2.8 1.4 0 2.4 1 2.4 2.8v3.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      }
      @case ('whatsapp') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.class]="svgClass">
          <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.52 22 22 17.52 22 12S17.52 2 12.02 2Zm0 18.06c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3 .79.8-2.93-.2-.3a8.06 8.06 0 0 1-1.25-4.3c0-4.46 3.63-8.08 8.09-8.08 2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08Zm4.44-6.05c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
        </svg>
      }
    }
  `,
})
export class SocialIconComponent {
  @Input() icon!: SocialPlatform;
  @Input() svgClass = 'w-4 h-4';
}
