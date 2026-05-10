(() => {
  const previousLadeDropdowns = typeof ladeDropdowns === "function" ? ladeDropdowns : null;

  async function ladeDropdownsAusGithub() {
    fillFallbackDropdowns();

    try {
      const lists = window.MILES_PLANNER_LISTS;
      const programs = window.MILES_PLANNER_PROGRAMS;

      if (!lists || !programs || !programs.programs) {
        throw new Error("GitHub-Stammdaten nicht vollständig geladen.");
      }

      PROGRAM_META = programs.programs || FALLBACK_PROGRAM_META;

      populateSelect("ziel", lists.ziele || [], "Bitte Ziel wählen");
      populateSelect("reiseklasse", lists.reiseklassen || [], "Bitte Reiseklasse wählen");
      populateSelect("reisezeit", lists.reisezeiten || [], "Bitte Reisezeit wählen");
      populateSelect("reisemonat", lists.reisemonate || [], "Bitte Reisemonat wählen");
      populateSelect("programm", lists.programme || [], "Bitte Programm wählen");

      console.log("Dropdowns aus GitHub-Stammdaten geladen:", {
        listsDataStand: lists.dataStand,
        programsDataStand: programs.dataStand
      });
    } catch (error) {
      console.error("GitHub-Stammdaten konnten nicht geladen werden. Fallback wird verwendet:", error);

      if (previousLadeDropdowns) {
        await previousLadeDropdowns();
        return;
      }
    }

    updatePointsLabels();
    updateFormFlow();
  }

  ladeDropdowns = ladeDropdownsAusGithub;
  window.ladeDropdowns = ladeDropdownsAusGithub;
})();
