/* ============================================================
   CONFIG — paste your published-CSV links here.
   ============================================================
   How to get a link for each sheet TAB:
     1. Open the Google Sheet.
     2. Click the tab (e.g. "MUŠKETÝŘI") so it's the active tab.
     3. File → Share → Publish to web.
     4. In the first dropdown choose the SPECIFIC SHEET (not "Entire Document").
     5. In the second dropdown choose "Comma-separated values (.csv)".
     6. Click Publish, copy the link it gives you, and paste it below.
     7. Repeat for every tab listed below.

   Do this once per tab. If you rename or add a tab later, publish that
   tab too and add/update its link here.
   ============================================================ */

const SHEET_URLS = {
  // Company roster tabs (K/D/KPE/activity per platoon)
  musketyri:   "PASTE_MUSKETYRI_CSV_LINK_HERE",
  strelci:     "PASTE_STRELCI_CSV_LINK_HERE",
  legion:      "PASTE_LEGIONARI_CSV_LINK_HERE",

  // Regiment & company command roster (CO/XO of each company)
  highCommand: "PASTE_CO_XO_CSV_LINK_HERE",

  // Recruitment tracker (recruiters, staff RC points, sessions hosted)
  recruitment: "PASTE_RECRUITMENT_TRACKER_CSV_LINK_HERE",

  // Depot / new recruit intake tracker
  depot:       "PASTE_DEPOT_CSV_LINK_HERE",
};

/* Battle results are NOT auto-fetched yet — for now you still add battles
   by editing the BATTLES array directly inside index.html (search for
   "const BATTLES ="). Automating this is a good next step once you're
   comfortable editing the other files. */
