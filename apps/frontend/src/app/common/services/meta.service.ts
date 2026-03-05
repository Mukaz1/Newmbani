import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { appName } from '@newmbani/shared';
import { Breadcrumb } from '../components/breadcrumb/breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

export interface MetadataInterface {
  title: string;
  description: string;
  breadcrumb: Breadcrumb;
}
@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private readonly breadcrumbService = inject(BreadcrumbService);

  setMeta(data: MetadataInterface) {
    // get the breadcrumb and set it in the service
    const { breadcrumb } = data;
    this.breadcrumbService.setBreadcrumb(breadcrumb);

    // update the metadata
    this.meta.addTag({ name: data.title, content: data.description });
    const title = ` ${data.title} - ${appName}`;
    this.titleService.setTitle(title);
  }

  setMetaTags(payload: {
    title: string;
    description: string;
    image: string;
    slug: string;
  }) {
    throw new Error('Method not implemented.');
  }
}
