/**
 * Build RFC 5545 .ics files so visitors can add bookings and events to any
 * calendar app (Google, Outlook, Apple) without third-party APIs.
 */

const pad = (n) => String(n).padStart(2, '0');

const toICSDate = (date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(
    date.getUTCMinutes(),
  )}00Z`;

const escapeText = (text = '') => String(text).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`);

export function buildICS({ title, start, durationMinutes = 60, description = '', location = '', uid }) {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kanachur Islamic Education Trust//Website//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid || `${startDate.getTime()}@kanachurims.com`}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(startDate)}`,
    `DTEND:${toICSDate(endDate)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(event, filename = 'kanachur-event.ics') {
  const blob = new Blob([buildICS(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
