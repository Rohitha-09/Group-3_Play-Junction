import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

const bootstrapApp = () => platformBrowserDynamic().bootstrapModule(AppModule);

bootstrapApp().catch(console.error);
