/**
 * Google Apps Script for the "Odradjene zurke" sheet → zippydj.com upcoming events.
 * Paste into the sheet via Extensions → Apps Script, save, reload the sheet.
 *
 * Only DATUM, MESTO, VREME, TIP ZURKE and NAZIV from rows above the "PAST EVENTS"
 * divider are sent. Profit, ticket price, attendance and comments never
 * leave the sheet.
 */

const SYNC_URL = 'https://zippydj.com/api/sync/events';
const SHEET_NAME = 'Sheet1';
const HEADER_ROW = 3;
const DIVIDER = 'PAST EVENTS';

// TIP ZURKE or NAZIV that makes a night open format (not house): blue card + Open format chip.
// Izuvanje is an open-format party series, so naming a night Izuvanje is enough.
const OPEN_FORMAT = /y2k|90s|komerc|open|pop|hip ?hop|izuvanje/i;

// TIP ZURKE → subtitle for house nights when NAZIV is empty. First match wins; no match = no subtitle.
// (The site never shows "House Music Therapy" as a name; it only feeds the event schema.)
const SUBTITLES = [
  [/house|tech|groove/i, 'House Music Therapy'],
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sajt')
    .addItem('Sync upcoming na sajt', 'syncNow')
    .addItem('Uključi automatski sync', 'installTrigger')
    .addItem('Postavi token', 'setToken')
    .addToUi();
}

function setToken() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('SYNC_TOKEN', 'Nalepi token (isti kao u wrangler secret):', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() === ui.Button.OK) {
    PropertiesService.getScriptProperties().setProperty('SYNC_TOKEN', res.getResponseText().trim());
    ui.alert('Token sačuvan.');
  }
}

/** Installable onEdit trigger — simple triggers aren't allowed to call UrlFetchApp. */
function installTrigger() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onSheetEdit')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onSheetEdit').forSpreadsheet(ss).onEdit().create();
  SpreadsheetApp.getUi().alert('Automatski sync uključen: svaka izmena iznad "PAST EVENTS" ide na sajt.');
}

function onSheetEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  const divider = findDivider_(sheet);
  if (e.range.getRow() <= HEADER_ROW || (divider && e.range.getRow() > divider)) return;
  sync_();
}

function syncNow() {
  const result = sync_();
  SpreadsheetApp.getActive().toast(result, 'Sajt', 8);
}

function sync_() {
  const token = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');
  if (!token) return 'Nema tokena — Sajt → Postavi token.';

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values[HEADER_ROW - 1].map((h) => String(h).trim().toUpperCase());
  const col = (name) => headers.findIndex((h) => h.indexOf(name) !== -1);
  const cDate = col('DATUM');
  const cVenue = col('MESTO');
  const cTime = col('VREME');
  const cType = col('TIP');
  const cName = col('NAZIV'); // optional: the night's own name, e.g. Core Memories

  const events = [];
  for (let r = HEADER_ROW; r < values.length; r++) {
    const row = values[r];
    if (row.some((v) => String(v).trim().toUpperCase() === DIVIDER)) break;
    const date = toIsoDate_(row[cDate]);
    const title = String(row[cVenue]).trim();
    if (!date || !title) continue;
    const type = String(row[cType]);
    const name = cName === -1 ? '' : String(row[cName]).trim();
    const openFormat = OPEN_FORMAT.test(type + ' ' + name);
    events.push({
      date: date,
      title: title,
      time: String(row[cTime]).replace(/\s*-\s*/, ' - ').trim(),
      subtitle: name || (openFormat ? '' : subtitleFor_(type)),
      // '' = house night (site shows the default genres), 'open_format' = blue OPEN FORMAT card
      genres: openFormat ? 'open_format' : '',
    });
  }

  const res = UrlFetchApp.fetch(SYNC_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ events: events }),
    muteHttpExceptions: true,
  });
  const body = res.getContentText();
  if (res.getResponseCode() !== 200) return 'Greška ' + res.getResponseCode() + ': ' + body;
  const d = JSON.parse(body);
  return 'Poslato ' + events.length + ' žurki (novih ' + d.inserted + ', izmenjeno ' + d.updated +
    ', obrisano ' + d.removed + ', u prošle ' + d.archived + ').';
}

function findDivider_(sheet) {
  const values = sheet.getDataRange().getValues();
  for (let r = HEADER_ROW; r < values.length; r++) {
    if (values[r].some((v) => String(v).trim().toUpperCase() === DIVIDER)) return r + 1;
  }
  return null;
}

/** DATUM is either a real date cell or text like 31/10/2026. */
function toIsoDate_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, 'Europe/Belgrade', 'yyyy-MM-dd');
  }
  const m = String(v).trim().match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})/);
  if (!m) return null;
  return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
}

function subtitleFor_(type) {
  for (const [re, label] of SUBTITLES) if (re.test(type)) return label;
  return '';
}
