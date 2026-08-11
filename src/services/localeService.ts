function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default class LocaleService {
  static dateToInputString(date: Date) {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16);
  }

  static inputStringToDate(input: string): Date {
    const date = new Date(input);
    return new Date(date.getTime());
  }

  static dateToTimeString(date: Date): string {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  static timeStringToDate(time: string, referenceDate: Date): Date {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(referenceDate);
    date.setHours(h, m, 0, 0);
    return date;
  }
}
