import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { TrustBarComponent } from './components/trust-bar/trust-bar.component';
import { ServicesComponent } from './components/services/services.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
// About section temporarily disabled — see app.component.html.
// import { AboutComponent } from './components/about/about.component';
import { LeadFormComponent } from './components/lead-form/lead-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingButtonsComponent } from './components/floating-buttons/floating-buttons.component';
import { ToastComponent } from './components/shared/toast.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    TrustBarComponent,
    ServicesComponent,
    WhyChooseUsComponent,
    // AboutComponent,
    LeadFormComponent,
    FooterComponent,
    FloatingButtonsComponent,
    ToastComponent,
    RevealOnScrollDirective,
    ScrollSpyDirective,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
