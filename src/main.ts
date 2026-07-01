import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { patchDomForGoogleTranslate } from './app/utils/google-translate-dom-patch';

patchDomForGoogleTranslate();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
