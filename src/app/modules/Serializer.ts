import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

const namedOutlets = {
  outlets: ['side']
};

export class Serializer implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    namedOutlets.outlets.forEach(outletName => {
      const reg = new RegExp('/(' + outletName + ')/([^\/]*)');
      url = url.replace(reg, '' );
    });
    return this.defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    let url = this.defaultUrlSerializer.serialize(tree);
    namedOutlets.outlets.forEach(outletName => {
      const reg = new RegExp('\\(' + outletName + ':([^\/]*)\\)');
      url = url.replace(reg, '');
    });
    return url;
  }
}
