import { DateTime } from "luxon";

export function isTheSameDay(d1: DateTime, d2: DateTime) {
    return ( d1.hasSame(d2, 'day') && d1.hasSame(d2, 'month') && d1.hasSame(d2, 'year') )
}