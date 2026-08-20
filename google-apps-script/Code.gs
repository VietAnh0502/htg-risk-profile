const SHEET_NAME = "Trang tính1";
const SPREADSHEET_ID = "16RflszpjnLk3YSV5B5Nr25clLmOhkz8LLp00gW1g8g0";

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
    const payload = JSON.parse((e && e.parameter && e.parameter.payload) || "{}");

    // Honeypot: bot submissions are acknowledged but not stored.
    if (payload.website) return jsonResponse({ ok: true, ignored: true });

    const sheet = prepareSheet();

    const answers = Array.isArray(payload.answers) ? payload.answers.slice(0, 12) : [];
    while (answers.length < 12) answers.push("");

    const capitalVnd = Number(payload.capitalVnd || payload.capital || 0);

    sheet.appendRow([
      new Date(),
      clean(payload.name),
      clean(payload.phone),
      capitalVnd || "",
      clean(payload.experience),
      Number(payload.totalScore) || 0,
      clean(payload.riskProfile),
      Number(payload.capacity) || 0,
      Number(payload.tolerance) || 0,
      Number(payload.autonomy) || 0,
      ...answers.map(clean),
      clean(payload.source),
      "Mới",
      clean(payload.assistant)
    ]);

    const row = sheet.getLastRow();
    sheet.getRange(row, 1).setNumberFormat("dd/MM/yyyy HH:mm:ss");
    sheet.getRange(row, 4).setNumberFormat('#,##0 "VND"');
    SpreadsheetApp.flush();

    return jsonResponse({ ok: true, row: row });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function setupSheet() {
  prepareSheet();
  SpreadsheetApp.flush();
}

function prepareSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Không tìm thấy " + SHEET_NAME);

  sheet.getRange("D1").setValue("Quy mô vốn (VND)");
  sheet.getRange("Y1").setValue("Trợ lý hỗ trợ");

  // Đồng bộ hoàn toàn kiểu tiêu đề và kích thước cột Y với cột X.
  sheet.getRange("X1").copyTo(
    sheet.getRange("Y1"),
    SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
    false
  );
  sheet.getRange("Y1").setValue("Trợ lý hỗ trợ");
  sheet.setColumnWidth(25, sheet.getColumnWidth(24));

  // Mở rộng bộ lọc hiện tại từ A:X sang A:Y mà không thay đổi dữ liệu.
  const filter = sheet.getFilter();
  if (filter && filter.getRange().getNumColumns() < 25) {
    const range = filter.getRange();
    const row = range.getRow();
    const column = range.getColumn();
    const rowCount = range.getNumRows();
    filter.remove();
    sheet.getRange(row, column, rowCount, 25).createFilter();
  } else if (!filter) {
    sheet.getRange(1, 1, sheet.getMaxRows(), 25).createFilter();
  }

  return sheet;
}

function doGet() {
  return jsonResponse({ ok: true, service: "HTG Risk Profile webhook" });
}

function clean(value) {
  const text = String(value == null ? "" : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
