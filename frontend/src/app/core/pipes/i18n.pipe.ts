import { Pipe, PipeTransform } from '@angular/core';
import { I18nText } from '../models/site-config.model';

@Pipe({
  name: 'i18n',
  standalone: true,
})
export class I18nPipe implements PipeTransform {
  transform(value: I18nText | undefined | null, lang: string = 'en'): string {
    if (!value) return '';
    return value[lang as keyof typeof value] || value.en || '';
  }
}
