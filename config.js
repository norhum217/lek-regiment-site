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
  musketyri:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=1736233066&single=true&output=csv",
  strelci:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=1921076111&single=true&output=csv",
  legion:      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=960466620&single=true&output=csv",

  // Regiment & company command roster (CO/XO of each company)
  highCommand: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=1443379977&single=true&output=csv",

  // Recruitment tracker (recruiters, staff RC points, sessions hosted)
  recruitment: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=502799338&single=true&output=csv",

  // Depot / new recruit intake tracker
  depot:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLjI04jG4l6WgY2VJ03LWtBzaOvyYmNZVw9VbHR8TYK8HHUkpsDMw56zRBt1UQGMS0zmzFhh6wk13/pub?gid=1462752426&single=true&output=csv",
};

/* Battle results are NOT auto-fetched yet — for now you still add battles
   by editing the BATTLES array directly inside index.html (search for
   "const BATTLES ="). Automating this is a good next step once you're
   comfortable editing the other files. */
