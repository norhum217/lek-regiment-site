/* ============================================================
   PARSERS — turns raw sheet rows (from PapaParse) into the same
   data shapes the site's rendering code expects.

   This is a direct JavaScript port of the Python parsing scripts
   used to build the first version of this site by hand. If your
   sheet's layout changes (columns move, a block gets added), this
   is the file to adjust.
   ============================================================ */

/* ---------- small helpers ---------- */
function cell(rows, r, c){
  const row = rows[r];
  if(!row) return "";
  const v = row[c];
  return (v === undefined || v === null) ? "" : String(v).trim();
}
function toNum(v, fallback){
  const n = parseFloat(v);
  return isNaN(n) ? (fallback === undefined ? 0 : fallback) : n;
}
function toInt(v, fallback){
  return Math.round(toNum(v, fallback));
}
const JUNK_NAMES = new Set(["", "Formula Placeholder", "Formula Holder", "~", "\\", "X", "nan"]);

function rolePriority(pos){
  const p = (pos || '').trim().toLowerCase();
  if(p === 'pco' || p === 'cco') return 0;
  if(p === 'pxo' || p === 'cxo') return 1;
  if(p === 'nco' || p === 't-nco') return 2;
  return 3;
}
const STAFF_ROLES = new Set(['pco','pxo','nco','cco','cxo']);

/* ============================================================
   COMPANY ROSTER SHEETS (Musketeers / Strelci / Legionáři)
   ============================================================
   Each sheet has 1-3 "platoon blocks" laid out side by side.
   A block's columns, starting at rosterCol, are:
     Rank, Position, Name, K, D, KDR, KPE, Activity%, Events,
     [Notes if hasNotes], Tue, Wed, Thu, Fri, Sat, Sun
   The platoon's display name lives in the row above the header
   row, in the same rosterCol (nameRow, 0-indexed). */
function parsePlatoonBlock(rows, rosterCol, hasNotes, rowStart, rowEnd){
  const dayOffset = hasNotes ? 10 : 9;
  const members = [];
  const end = Math.min(rowEnd, rows.length);
  for(let r = rowStart; r < end; r++){
    const rank = cell(rows, r, rosterCol);
    const name = cell(rows, r, rosterCol + 2);
    if(JUNK_NAMES.has(name)) continue;
    const k = toInt(cell(rows, r, rosterCol + 3));
    const d = toInt(cell(rows, r, rosterCol + 4));
    const kdr = toNum(cell(rows, r, rosterCol + 5));
    const kpe = toNum(cell(rows, r, rosterCol + 6));
    const activity = toInt(cell(rows, r, rosterCol + 7).replace('%',''));
    const events = toInt(cell(rows, r, rosterCol + 8));
    const days = [];
    for(let j = 0; j < 6; j++){
      days.push(cell(rows, r, rosterCol + dayOffset + j).toUpperCase() === 'TRUE');
    }
    const pos = cell(rows, r, rosterCol + 1);
    members.push({
      rank, position: pos, name,
      kills: k, deaths: d,
      kdr: Math.round(kdr * 100) / 100,
      kpe: Math.round(kpe * 10) / 10,
      activity, events, days,
      active_this_week: days.some(Boolean),
      is_staff: STAFF_ROLES.has(pos.trim().toLowerCase()),
      priority: rolePriority(pos),
    });
  }
  members.sort((a, b) => (a.priority - b.priority) || (b.kills - a.kills));
  return members;
}

/* config = { id, label, gloss, fullName, city, filter,
              nameRow, blocks: [{rosterCol, hasNotes}],
              rowStart, rowEnd } */
function parseCompanySheet(rows, config){
  const rowStart = config.rowStart ?? 14;
  const rowEnd = config.rowEnd ?? 200;
  const platoons = config.blocks.map(b => ({
    name: cell(rows, config.nameRow, b.rosterCol) || config.label,
    members: parsePlatoonBlock(rows, b.rosterCol, !!b.hasNotes, rowStart, rowEnd),
  }));
  return {
    id: config.id, label: config.label, gloss: config.gloss,
    full_name: config.fullName, city: config.city, filter: config.filter,
    platoons,
  };
}

/* ============================================================
   HIGH COMMAND SHEET (CO/XO of Comp.)
   Sections are marked by a row where Rank has a value but Name
   is empty — that value is the section title (e.g. "Štáb Pluku").
   ============================================================ */
const HC_SECTION_LABELS = {
  "Štáb Pluku": "Regiment Staff",
  "Velitelství Landwehrů": "Landwehr Command",
  "Velitelství Mušketýrů": "Musketeers Command",
  "Velitelství Střelců": "Strelci Command",
  "Velitelství Legionářů": "Legionáři Command",
};
function parseHighCommand(rows){
  const rc = 5;
  let current = "Regiment Staff";
  const sections = {};
  for(let r = 12; r < 29 && r < rows.length; r++){
    const rankVal = cell(rows, r, rc);
    const name = cell(rows, r, rc + 2);
    if(rankVal === "Rank" && name === "Name") continue; // header row
    if(!name){
      if(rankVal && HC_SECTION_LABELS[rankVal]) current = HC_SECTION_LABELS[rankVal];
      continue;
    }
    const k = toInt(cell(rows, r, rc + 3));
    const d = toInt(cell(rows, r, rc + 4));
    const kdr = toNum(cell(rows, r, rc + 5));
    const kpe = toNum(cell(rows, r, rc + 6));
    const activity = toInt(cell(rows, r, rc + 7).replace('%',''));
    const events = toInt(cell(rows, r, rc + 8));
    const entry = {
      rank: cell(rows, r, rc), position: cell(rows, r, rc + 1), name,
      kills: k, deaths: d, kdr: Math.round(kdr*100)/100, kpe: Math.round(kpe*10)/10,
      activity, events,
    };
    (sections[current] = sections[current] || []).push(entry);
  }
  return sections;
}

/* ============================================================
   RECRUITMENT TRACKER SHEET
   ============================================================ */
function findLabelValue(rows, label){
  const target = label.trim();
  for(let r = 0; r < rows.length; r++){
    for(let c = 0; c < rows[r].length; c++){
      if(String(rows[r][c]).trim() === target){
        const v = cell(rows, r + 1, c);
        return toInt(v);
      }
    }
  }
  return 0;
}
function parsePointsBlock(rows, rosterCol, rowStart, rowEnd){
  const entries = [];
  const end = Math.min(rowEnd, rows.length);
  for(let r = rowStart; r < end; r++){
    const rank = cell(rows, r, rosterCol);
    const name = cell(rows, r, rosterCol + 2);
    if(JUNK_NAMES.has(name)) continue;
    const company = cell(rows, r, rosterCol + 3);
    const totalPoints = toInt(cell(rows, r, rosterCol + 4));
    const days = [];
    for(let j = 0; j < 7; j++){
      days.push(toInt(cell(rows, r, rosterCol + 6 + j)));
    }
    const robux = toInt(cell(rows, r, rosterCol + 14));
    entries.push({ rank, name, company, totalPoints, days, robux });
  }
  return entries;
}
function parseSessionsBlock(rows, rosterCol, rowStart, rowEnd){
  const entries = [];
  const end = Math.min(rowEnd, rows.length);
  for(let r = rowStart; r < end; r++){
    const rank = cell(rows, r, rosterCol);
    const position = cell(rows, r, rosterCol + 1);
    const name = cell(rows, r, rosterCol + 3);
    if(JUNK_NAMES.has(name)) continue;
    const days = [];
    for(let j = 0; j < 7; j++){
      days.push(toInt(cell(rows, r, rosterCol + 5 + j)));
    }
    entries.push({ rank, position, name, days, totalSessions: days.reduce((a,b)=>a+b,0) });
  }
  return entries;
}
function parseRecruitment(rows){
  return {
    dailyGoal: findLabelValue(rows, "Daily Goal"),
    totalRecruits: findLabelValue(rows, "Total Recruits"),
    totalRobux: findLabelValue(rows, "Total ROBUX "), // note: trailing space in the sheet label
    totalSessionsHosted: findLabelValue(rows, "Total Sessions Hosted"),
    recruiters: parsePointsBlock(rows, 5, 14, 50),
    staff: parsePointsBlock(rows, 21, 14, 50),
    sessions: parseSessionsBlock(rows, 37, 14, 25),
  };
}

/* ============================================================
   DEPOT SHEET (new recruit intake)
   Sections marked the same way as High Command: a row with a
   value in Rank/name-col-0 but nothing in the Name column.
   "Returned" = attended 2+ days this week (came back after the
   first event). "DM'd" comes straight from the DMd column. */
function parseDepot(rows){
  const rc = 5;
  let current = null;
  const sections = {};
  for(let r = 10; r < 77 && r < rows.length; r++){
    const rank = cell(rows, r, rc);
    const name = cell(rows, r, rc + 1);
    if(!rank && !name) continue;
    if(rank === "Rank" && name === "Name") continue; // header row
    if(!name && rank){ current = rank; continue; } // section title
    if(!name) continue;

    const k = toInt(cell(rows, r, rc + 3));
    const d = toInt(cell(rows, r, rc + 4));
    const kdr = toNum(cell(rows, r, rc + 5));
    const kpe = toNum(cell(rows, r, rc + 6));
    const activity = toInt(cell(rows, r, rc + 7).replace('%',''));
    const joinDate = cell(rows, r, rc + 8);
    const days = [];
    // Tuesday(14) Wednesday(15) [gap 16] Thursday(17) Friday(18) Saturday(19) Sunday(20)
    [14,15,17,18,19,20].forEach(col => days.push(cell(rows, r, col).toUpperCase() === 'TRUE'));
    const dmd = cell(rows, r, 21).toUpperCase() === 'TRUE';

    const entry = {
      rank, name, kills: k, deaths: d,
      kdr: Math.round(kdr*100)/100, kpe: Math.round(kpe*10)/10,
      activity, joinDate, days,
      daysAttended: days.filter(Boolean).length,
      returned: days.filter(Boolean).length >= 2,
      dmd,
    };
    (sections[current] = sections[current] || []).push(entry);
  }
  return sections;
}

if(typeof module !== 'undefined'){
  module.exports = { parseCompanySheet, parseHighCommand, parseRecruitment, parseDepot };
}

/* ============================================================
   HISTORY SHEET (weekly battle logs since January)
   Layout: one "week marker" row (date range in column 0) starts
   a block; every row in that block has up to 6 day-slots
   (Tue..Sun), each slot = 4 columns: Name, K, D, UnitTag. */
function parseWeekLabel(label){
  const m = label.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if(!m) return null;
  let d = parseInt(m[1],10), mo = parseInt(m[2],10), y = parseInt(m[3],10);
  if(y < 100) y += 2000;
  const dt = new Date(Date.UTC(y, mo-1, d));
  return isNaN(dt.getTime()) ? null : dt;
}
function parseHistory(rows){
  const DAY_SLOTS = [1,5,9,13,17,21]; // start col of each day's Name/K/D/UnitTag block
  const weeks = [];
  let current = null;
  for(let r = 11; r < rows.length; r++){
    const marker = cell(rows, r, 0);
    if(marker){
      current = { label: marker, start: parseWeekLabel(marker), entries: [] };
      weeks.push(current);
    }
    if(!current) continue;
    DAY_SLOTS.forEach((c, dayIdx) => {
      const name = cell(rows, r, c);
      if(JUNK_NAMES.has(name)) return;
      const kills = toInt(cell(rows, r, c+1));
      const deaths = toInt(cell(rows, r, c+2));
      const unitTag = cell(rows, r, c+3);
      current.entries.push({ day: dayIdx, name, kills, deaths, unitTag });
    });
  }
  weeks.sort((a,b) => (a.start ? a.start.getTime() : 0) - (b.start ? b.start.getTime() : 0));
  return weeks;
}

if(typeof module !== 'undefined'){
  module.exports.parseHistory = parseHistory;
}
