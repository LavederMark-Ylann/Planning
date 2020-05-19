import {CalendarDateFormatter, DateFormatterParams, getWeekViewPeriod} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

  public dayViewHour({ date, locale= 'fr' }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm', locale);
  } // OK

  public weekViewHour({ date, locale= 'fr' }: DateFormatterParams): string {
    return this.dayViewHour({ date, locale });
  } // OK

  public monthViewColumnHeader({ date, locale= 'fr' }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  } // OK

  public monthViewTitle({ date, locale = 'fr' }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MMM y', locale);
  } // OK

  public weekViewTitle({
                         date,
                         locale = 'fr',
                         weekStartsOn,
                         excludeDays,
                         daysInWeek,
                       }: DateFormatterParams): string {
    const { viewStart, viewEnd } = getWeekViewPeriod(
      this.dateAdapter,
      date,
      weekStartsOn,
      excludeDays,
      daysInWeek
    );

    const format = (dateToFormat: Date, showYear: boolean) =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: showYear ? 'numeric' : undefined,
      }).format(dateToFormat);

    return `semaine du ${format(viewStart, false)}`;
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    // return new DatePipe(locale).transform(date, 'EEEE', locale);
  } // manque une majuscule au début

  public weekViewColumnSubHeader({date, locale= 'fr', }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'dd MMM', locale);
  } // OK

  public dayViewTitle({date, locale= 'fr'}: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEE dd MMM y', locale);
  } // OK
}

