import { CalendarPickerView } from "@mui/lab";
import { PickersLocaleText } from "@mui/x-date-pickers";

// maps ClockPickerView to its translation
const views = {
  hours: 'godziny',
  minutes: 'minuty',
  seconds: 'sekundy',
};

const plPLPickersLocaleText: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Poprzedni miesiąc',
  nextMonth: 'Następny miesiąc',

  // View navigation
  openPreviousView: 'otwórz poprzedni widok',
  openNextView: 'otwórz następny widok',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'widok lat otwarty, przejdź do widoku kalendarza'
      : 'widok kalendarza otwarty, przejdź do widoku lat',

  // DateRange placeholders
  start: 'Początek',
  end: 'Koniec',

  // Action bar
  cancelButtonLabel: 'Anuluj',
  clearButtonLabel: 'Wyczyść',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Dziś',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Wybierz ${views[view]}. ${
      time === null ? 'Brak wybranego czasu' : `Wybrany czas to ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ${views.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${views.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds} ${views.seconds}`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Wybierz datę, wybrana data to ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Wybierz datę',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Wybierz czas, wybrany czas to ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Wybierz czas',

  // Table labels
  timeTableLabel: 'wybierz czas',
  dateTableLabel: 'wybierz datę',
};

export default plPLPickersLocaleText;