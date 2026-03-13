import { SubTopic } from '@newmbani/types';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppConstants } from '../../../common/constants';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  app = AppConstants.appName;
  // year = new Date().getFullYear();
  year: number = new Date().getFullYear();

  // @Input({ required: true }) settings: Settings | undefined = undefined;


  
}
