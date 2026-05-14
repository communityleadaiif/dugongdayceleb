/**
 * OCEANS OF KNOWLEDGE 2026 - BACKEND SCRIPT
 * Handles: Competition Registrations, File Uploads, Pledges, and Visitor Counting
 */

// ===== CONFIGURATION (User: Replace these IDs) =====
const SHEET_ID = '1wErfqjZ5ivPT_jFW6pHFV-tz7gATO-z1djtpUHm6AhE';
const FOLDER_ARTICLES_ID = '1YSW8O-ThO_s1OUHqSt0Cia0CLDxwJCQE';
const FOLDER_DRAWINGS_ID = '1LSiffmrRcT6wDpZ_L6zwXu1malPhrJb5';

/**
 * Handle GET requests: Used for fetching current stats (Visitors & Pledges)
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getStats') {
    return ContentService.createTextOutput(JSON.stringify(getStats()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'OK', message: 'Backend is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests: Used for submissions, pledges, and visitor counting
 */
function doPost(e) {
  try {
    const data = e.parameter;
    const action = data.action;

    // 1. Handle Visitor Counting
    if (action === 'visitor') {
      updateStats('visitors');
      return createJsonResponse({ status: 'success', message: 'Visitor logged' });
    }

    // 2. Handle Pledge Signing
    if (action === 'pledge') {
      const sheet = getOrCreateSheet('Pledges', ['Timestamp', 'Name', 'Location']);
      sheet.appendRow([new Date().toISOString(), data.name, data.location || 'N/A']);
      updateStats('pledges');
      return createJsonResponse({ status: 'success', message: 'Pledge recorded' });
    }

    // 3. Handle Competition Submissions (Article or Drawing)
    if (action === 'submission') {
      const type = data.submissionType; // 'article' or 'drawing'
      const sheetName = type === 'article' ? 'Article_Submissions' : 'Drawing_Submissions';
      const folderId = type === 'article' ? FOLDER_ARTICLES_ID : FOLDER_DRAWINGS_ID;
      
      const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'City', 'State', 'Institution', 'Category', 'File Name', 'File URL'];
      const sheet = getOrCreateSheet(sheetName, headers);

      let fileUrl = '';
      let fileName = '';

      if (e.postData.contents && e.postData.type.includes('multipart/form-data')) {
         // Standard multi-part form handling is tricky in GAS doPost.
         // Usually files are passed as base64 or via specific parameter handling.
      }
      
      // If file is passed as blob/parameter (Vite/React FormData style)
      // Handle file upload (Base64)
      if (data.fileData) {
        const folder = DriveApp.getFolderById(folderId);
        const decoded = Utilities.base64Decode(data.fileData);
        const blob = Utilities.newBlob(decoded, data.mimeType, data.fileName);
        
        const file = folder.createFile(blob);
        file.setName(`${type.toUpperCase()}_${data.name.replace(/\s+/g, '_')}_${new Date().getTime()}`);
        fileUrl = file.getUrl();
        fileName = file.getName();
      }

      sheet.appendRow([
        new Date().toISOString(),
        data.name,
        data.phone,
        data.email,
        data.city,
        data.state,
        data.institution,
        data.category || 'N/A',
        fileName,
        fileUrl
      ]);

      // Optional: Send Email
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: 'Submission Confirmed - Oceans of Knowledge 2026',
          body: `Hi ${data.name}, your ${type} submission has been received successfully.`
        });
      } catch(f) {}

      return createJsonResponse({ status: 'success', message: 'Submission saved', fileUrl });
    }

    return createJsonResponse({ status: 'error', message: 'Invalid action' });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// --- HELPER FUNCTIONS ---

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
  }
  return sheet;
}

function updateStats(type) {
  const sheet = getOrCreateSheet('Stats', ['Metric', 'Count']);
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase() === type.toLowerCase()) {
      sheet.getRange(i + 1, 2).setValue(data[i][1] + 1);
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([type, 1]);
  }
}

function getStats() {
  const sheet = getOrCreateSheet('Stats', ['Metric', 'Count']);
  const data = sheet.getDataRange().getValues();
  const stats = { visitors: 0, pledges: 0 };
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'visitors') stats.visitors = data[i][1];
    if (data[i][0] === 'pledges') stats.pledges = data[i][1];
  }
  return stats;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
