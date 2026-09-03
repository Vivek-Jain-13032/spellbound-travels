import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-thank-you',
    standalone: true,
    imports: [RouterLink],
    template: `
    <main class="success-page">
      <div class="success-card">

        <!-- Success Icon -->
        <div class="success-icon" aria-hidden="true">
          ✓
        </div>

        <!-- Brand -->
        <p class="eyebrow">SPELLBOUND TRAVELS</p>

        <!-- Heading -->
        <h1>Quote Request Received</h1>

        <!-- Message -->
        <p class="message">
          Thank you for choosing Spellbound Travels.
          Your enquiry has been received successfully.
        </p>

        <!-- Information -->
        <div class="info-box">

          <div class="info-item">
            <span class="icon" aria-hidden="true">✈</span>
            <div>
              <strong>Enquiry Received</strong>
              <p>We have received your enquiry.</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon" aria-hidden="true">⏱</span>
            <div>
              <strong>Quick Response</strong>
              <p>Our team will review your request and contact you shortly.</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon" aria-hidden="true">💬</span>
            <div>
              <strong>Need Assistance?</strong>
              <p>Our travel experts are here to help.</p>
            </div>
          </div>

        </div>

        <!-- Buttons -->
        <div class="actions">

          <a
            routerLink="/"
            class="primary-btn">
            Back to Home
          </a>

          <a
            href="https://wa.me/918690045677"
            target="_blank"
            rel="noopener noreferrer"
            class="secondary-btn">
            WhatsApp Us
          </a>

        </div>

        <!-- Footer -->
        <p class="footer-text">
          Journeys That Leave You Spellbound
        </p>

      </div>
    </main>
  `,

    styles: [`
    :host {
      display: block;
      min-height: 100dvh;
    }

    /* Page */

    .success-page {
      min-height: 100dvh;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;

      padding: 24px 16px;

      background:
        radial-gradient(
          circle at top,
          rgba(196, 164, 94, 0.08),
          transparent 42%
        ),
        #0b0b0b;
    }

    /* Main Card */

    .success-card {
      width: 100%;
      max-width: 560px;

      box-sizing: border-box;

      padding: 34px 36px 30px;

      text-align: center;

      background: #111111;

      border: 1px solid rgba(196, 164, 94, 0.24);

      border-radius: 12px;

      box-shadow:
        0 18px 50px rgba(0, 0, 0, 0.35);
    }

    /* Success Icon */

    .success-icon {
      width: 58px;
      height: 58px;

      margin: 0 auto 17px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: #c4a45e;

      color: #111111;

      font-size: 31px;
      font-weight: 700;

      box-shadow:
        0 8px 24px rgba(196, 164, 94, 0.16);
    }

    /* Brand */

    .eyebrow {
      margin: 0 0 8px;

      color: #c4a45e;

      font-size: 10px;

      letter-spacing: 2.5px;

      font-weight: 700;
    }

    /* Heading */

    h1 {
      margin: 0 0 13px;

      color: #ffffff;

      font-family: 'Playfair Display', serif;

      font-size: clamp(30px, 5vw, 40px);

      font-weight: 500;

      line-height: 1.12;
    }

    /* Message */

    .message {
      max-width: 460px;

      margin: 0 auto 22px;

      color: #bdbdbd;

      font-size: 14px;

      line-height: 1.55;
    }

    /* Information Box */

    .info-box {
      margin: 0 0 22px;

      padding: 5px 16px;

      text-align: left;

      border-radius: 10px;

      background: rgba(255, 255, 255, 0.025);

      border: 1px solid rgba(255, 255, 255, 0.07);
    }

    .info-item {
      display: flex;

      align-items: center;

      gap: 13px;

      padding: 11px 0;
    }

    .info-item + .info-item {
      border-top: 1px solid rgba(255, 255, 255, 0.07);
    }

    .icon {
      flex: 0 0 28px;

      width: 28px;

      color: #c4a45e;

      font-size: 18px;

      line-height: 1;

      text-align: center;
    }

    .info-item strong {
      display: block;

      margin-bottom: 2px;

      color: #ffffff;

      font-size: 13px;

      font-weight: 700;
    }

    .info-item p {
      margin: 0;

      color: #999999;

      font-size: 12px;

      line-height: 1.4;
    }

    /* Buttons */

    .actions {
      display: flex;

      justify-content: center;

      gap: 10px;

      flex-wrap: wrap;
    }

    .primary-btn,
    .secondary-btn {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      min-width: 145px;

      box-sizing: border-box;

      padding: 11px 20px;

      border-radius: 7px;

      text-decoration: none;

      font-family: inherit;

      font-size: 13px;

      font-weight: 700;

      transition:
        transform 0.2s ease,
        background 0.2s ease,
        color 0.2s ease;
    }

    .primary-btn {
      background: #c4a45e;

      color: #111111;
    }

    .secondary-btn {
      border: 1px solid #c4a45e;

      color: #c4a45e;

      background: transparent;
    }

    .primary-btn:hover,
    .secondary-btn:hover {
      transform: translateY(-1px);
    }

    .secondary-btn:hover {
      background: rgba(196, 164, 94, 0.08);
    }

    /* Footer */

    .footer-text {
      margin: 18px 0 0;

      color: #666666;

      font-family: 'Playfair Display', serif;

      font-size: 12px;

      font-style: italic;
    }

    /* Mobile */

    @media (max-width: 600px) {

      .success-page {
        padding: 16px 12px;
      }

      .success-card {
        max-width: 100%;

        padding: 28px 20px 24px;

        border-radius: 10px;
      }

      .success-icon {
        width: 52px;
        height: 52px;

        margin-bottom: 14px;

        font-size: 28px;
      }

      .eyebrow {
        font-size: 9px;

        letter-spacing: 2.2px;

        margin-bottom: 7px;
      }

      h1 {
        font-size: 29px;

        margin-bottom: 11px;
      }

      .message {
        font-size: 13px;

        line-height: 1.5;

        margin-bottom: 18px;
      }

      .info-box {
        padding: 3px 13px;

        margin-bottom: 18px;
      }

      .info-item {
        gap: 10px;

        padding: 9px 0;
      }

      .icon {
        flex-basis: 25px;

        width: 25px;

        font-size: 16px;
      }

      .info-item strong {
        font-size: 12px;
      }

      .info-item p {
        font-size: 11px;
      }

      .actions {
        flex-direction: column;

        gap: 8px;
      }

      .primary-btn,
      .secondary-btn {
        width: 100%;

        min-width: 0;

        padding: 11px 18px;
      }

      .footer-text {
        margin-top: 15px;

        font-size: 11px;
      }
    }

    /* Very small phones */

    @media (max-height: 650px) {

      .success-page {
        padding: 10px 12px;
      }

      .success-card {
        padding-top: 20px;
        padding-bottom: 18px;
      }

      .success-icon {
        width: 46px;
        height: 46px;

        margin-bottom: 10px;

        font-size: 24px;
      }

      h1 {
        font-size: 26px;

        margin-bottom: 8px;
      }

      .message {
        margin-bottom: 13px;
      }

      .info-item {
        padding: 7px 0;
      }

      .info-box {
        margin-bottom: 14px;
      }

      .footer-text {
        margin-top: 10px;
      }
    }
  `]
})
export class ThankYouComponent implements OnInit, OnDestroy {

    private redirectTimer?: ReturnType<typeof setTimeout>;

    constructor(private router: Router) { }

    ngOnInit(): void {

        this.redirectTimer = setTimeout(() => {
            this.router.navigate(['/']);
        }, 20000);

    }

    ngOnDestroy(): void {

        if (this.redirectTimer) {
            clearTimeout(this.redirectTimer);
            this.redirectTimer = undefined;
        }

    }
}