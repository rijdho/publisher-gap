// Runs before first paint: a theme chosen earlier wins over the preference of the system.
// Without a saved choice nothing is stamped, and house.css follows the system.
(function () {
  try {
    var saved = localStorage.getItem("pg-theme");
    if (saved === "dark" || saved === "light") document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
})();
