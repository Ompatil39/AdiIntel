// app.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("campaignForm");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect input values
    const platform = document.getElementById("platform").value;
    const impressions = parseInt(document.getElementById("impressions").value);
    const clicks = parseInt(document.getElementById("clicks").value);
    const spend = parseFloat(document.getElementById("spend").value);
    const conversions = parseInt(document.getElementById("conversions").value);
    const CTR = parseFloat(document.getElementById("CTR").value);
    const ROAS = parseFloat(document.getElementById("ROAS").value);
    const recommended_budget_distribution = document.getElementById("budgetDist").value;

    const payload = {
      platform,
      impressions,
      clicks,
      spend,
      conversions,
      CTR,
      ROAS,
      recommended_budget_distribution
    };

    try {
      // Call Flask API
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      // Display results
      resultsDiv.innerHTML = ""; // clear previous results
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      for (let key in data) {
        const row = document.createElement("tr");

        const cellKey = document.createElement("td");
        cellKey.textContent = key;
        cellKey.style.border = "1px solid #ccc";
        cellKey.style.padding = "8px";
        cellKey.style.fontWeight = "bold";

        const cellValue = document.createElement("td");
        if (typeof data[key] === "object") {
          // Nested object like budget distribution
          cellValue.textContent = JSON.stringify(data[key]);
        } else {
          cellValue.textContent = data[key];
        }
        cellValue.style.border = "1px solid #ccc";
        cellValue.style.padding = "8px";

        row.appendChild(cellKey);
        row.appendChild(cellValue);
        table.appendChild(row);
      }

      resultsDiv.appendChild(table);

    } catch (err) {
      resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
      console.error(err);
    }
  });
});
