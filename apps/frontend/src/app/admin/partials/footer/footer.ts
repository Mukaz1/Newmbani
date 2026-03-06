import { Component, HostBinding } from '@angular/core';
import { AppConstants } from '../../../common/constants';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.html',
    styleUrl: './footer.scss'
})
export class Footer {
  @HostBinding('class') hostClass = 'footer';
  app = AppConstants.appName;

  year = new Date().getFullYear();
}
