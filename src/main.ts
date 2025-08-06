import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

// اجمع كل الـ providers في مكان واحد
const mergedProviders = [
  provideHttpClient(),
  ...(appConfig.providers ?? [])
];

bootstrapApplication(AppComponent, {
  ...appConfig, // باقي الإعدادات
  providers: mergedProviders, // نمرر الـ providers الموحدة هنا
})
.catch((err) => console.error(err));
