import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

const BOSNIAN_DATE_FORMAT = "dd.MM.yyyy";

@Injectable({
  providedIn: "root",
})
export class DateFormatService {
  private datePipe = new DatePipe("hr");

  format(
    date: string | Date | null | undefined,
    format: string = BOSNIAN_DATE_FORMAT,
  ): string {
    if (!date) return "";
    return this.datePipe.transform(date, format) ?? "";
  }
}
