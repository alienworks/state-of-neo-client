import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stampToDate' })
export class TimestampFormatPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        const date = new Date(value * 1000);
        return date;
    }
}
