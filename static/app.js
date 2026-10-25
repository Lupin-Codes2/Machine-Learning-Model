const forms = [
  {
    formId: "regression-form",
    resultId: "regression-result",
    metricId: "regression-metric",
    endpoint: "/predict/regression",
    format: (data) => `Estimated votes: ${Number(data.prediction).toLocaleString("en-US")} · Test R² ${Number(data.r2).toFixed(3)}`,
  },
  {
    formId: "classification-form",
    resultId: "classification-result",
    metricId: "classification-metric",
    endpoint: "/predict/classification",
    format: (data, features) => {
      const selectedGame = gamesByName.get(features.game.toLocaleLowerCase());
      const gameContext = features.game
        ? `For ${features.game} (#${features.ranking}, ${features.year}, ${Number(features.votes).toLocaleString("en-US")} votes), `
        : "For these inputs, ";
      const listedGenres = selectedGame
        ? ` Dataset genres: ${selectedGame.genres.join(", ")}.`
        : "";
      return `${gameContext}the model predicts ${data.prediction} as the primary genre (${(Number(data.confidence) * 100).toFixed(1)}% confidence; ${(Number(data.accuracy) * 100).toFixed(1)}% test accuracy).${listedGenres}`;
    },
  },
];
const gamesByName = new Map();

for (const config of forms) {
  const form = document.getElementById(config.formId);
  const result = document.getElementById(config.resultId);
  const button = form.querySelector("button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    result.hidden = true;
    result.classList.remove("error");
    button.disabled = true;
    button.textContent = "Running model…";

    const formData = new FormData(form);
    const game = String(formData.get("game") || "").trim();
    const features = Object.fromEntries(
      [...formData]
        .filter(([name]) => name !== "game")
        .map(([name, value]) => [name, Number(value)]),
    );

    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      const data = await response.json();
      if (!response.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((error) => `${error.loc.at(-1)}: ${error.msg}`).join(", ")
          : data.detail;
        throw new Error(detail || "The prediction could not be completed.");
      }
      result.textContent = config.format(data, { ...features, game });
      document.getElementById(config.metricId).textContent =
        config.endpoint.endsWith("regression")
          ? `R² ${Number(data.r2).toFixed(3)}`
          : `Accuracy ${(Number(data.accuracy) * 100).toFixed(1)}%`;
    } catch (error) {
      result.textContent = error.message || "Could not connect to the prediction service.";
      result.classList.add("error");
    } finally {
      result.hidden = false;
      button.disabled = false;
      button.innerHTML = `${config.endpoint.endsWith("regression") ? "Predict vote count" : "Predict genre"} <span aria-hidden="true">→</span>`;
    }
  });
}

async function loadGameLookup() {
  const response = await fetch("/static/games.json");
  if (!response.ok) {
    throw new Error(`Game list could not be loaded (${response.status}).`);
  }

  const games = await response.json();
  const form = document.getElementById("classification-form");
  const gameInput = form.elements.game;
  const gameOptions = document.getElementById("game-options");
  const gameStatus = document.getElementById("game-lookup-status");
  gamesByName.clear();
  games.forEach((game) =>
    gamesByName.set(game.name.toLocaleLowerCase(), game),
  );

  gameOptions.replaceChildren(
    ...games.map((game) => {
      const option = document.createElement("option");
      option.value = game.name;
      return option;
    }),
  );

  gameInput.addEventListener("change", () => {
    const game = gamesByName.get(gameInput.value.trim().toLocaleLowerCase());
    if (!game) {
      return;
    }

    form.elements.ranking.value = game.ranking;
    form.elements.year.value = game.year;
    form.elements.votes.value = game.votes;
  });

  gameStatus.textContent =
    "Choose a title to automatically fill its ranking, year, and vote count.";
}

loadGameLookup().catch((error) => {
  document.getElementById("game-lookup-status").textContent =
    "Game names could not be loaded. You can still enter the numeric features manually.";
  console.error(error);
});
