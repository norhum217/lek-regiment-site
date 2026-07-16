/* ============================================================
   DATA LOADER — fetches each published CSV from config.js,
   parses it with the functions in parsers.js, and returns the
   same data shapes the site's rendering code already expects.
   ============================================================ */

/* Column layout for each company sheet — matches the structure of
   the "[LEK] LEGION ERZHERZOG KARL ORBAT - <COMPANY>" tabs.
   If a company's sheet changes shape (more/fewer platoons, a
   Notes column added/removed), update its entry here. */
const COMPANY_SHEET_CONFIG = {
  musketyri: {
    id: 'musketyri', label: 'MUŠKETÝŘI', gloss: 'Fusiliers',
    fullName: 'Mušketýři z Plzně', city: 'Pilsen', filter: 'weekly',
    nameRow: 11,
    blocks: [
      { rosterCol: 5,  hasNotes: false },
      { rosterCol: 26, hasNotes: false },
      { rosterCol: 47, hasNotes: false },
    ],
  },
  strelci: {
    id: 'strelci', label: 'STŘELCI', gloss: 'Jägers',
    fullName: 'Střelci z Žatce', city: 'Žatec', filter: 'all',
    nameRow: 11,
    blocks: [
      { rosterCol: 5,  hasNotes: true },
      { rosterCol: 27, hasNotes: true },
    ],
  },
  legion: {
    id: 'legion', label: 'LEGIONÁŘI', gloss: 'Grenadiers',
    fullName: 'Legionáři z Prahy', city: 'Prague', filter: 'all',
    nameRow: 11,
    blocks: [
      { rosterCol: 5, hasNotes: false },
    ],
  },
};

async function fetchCSVRows(url){
  if(!url || url.startsWith('PASTE_')){
    throw new Error('Sheet URL not configured yet — edit config.js');
  }
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  const text = await res.text();
  const parsed = Papa.parse(text, { skipEmptyLines: false });
  return parsed.data; // array of arrays, same shape as the Python pandas rows
}

async function loadAllData(urls){
  const [muskRows, strelRows, legionRows, hcRows, recRows, depotRows] = await Promise.all([
    fetchCSVRows(urls.musketyri),
    fetchCSVRows(urls.strelci),
    fetchCSVRows(urls.legion),
    fetchCSVRows(urls.highCommand),
    fetchCSVRows(urls.recruitment),
    fetchCSVRows(urls.depot),
  ]);

  const companies = [
    parseCompanySheet(muskRows, COMPANY_SHEET_CONFIG.musketyri),
    parseCompanySheet(strelRows, COMPANY_SHEET_CONFIG.strelci),
    parseCompanySheet(legionRows, COMPANY_SHEET_CONFIG.legion),
  ];

  const highCommand = parseHighCommand(hcRows);
  const recruitment = parseRecruitment(recRows);
  const depot = parseDepot(depotRows);

  return { companies, highCommand, recruitment, depot };
}
