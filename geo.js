
async function loadGeoAnalysis() {
  const response = await fetch("geo.json", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("geo.json non disponibile");
  }

  const rows = await response.json();

  const total = rows.reduce(
    (sum, row) => sum + row.records, 0
  );

  const data = rows.map(row => ({
    ...row,
    share: row.records / total,
    percentage: row.records / total * 100
  })).sort((a, b) => b.share - a.share);

  // TABLE
  const table = document.createElement("table");
  table.className = "geo-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Region</th>
        <th>Share of Records</th>
        <th>Pageviews</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          <td>${row.region}</td>
          <td>${(row.percentage).toFixed(1)}%</td>
          <td>${row.pageviews}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  document.getElementById("geo-table")
    .replaceChildren(table);

  // BAR CHART
  Plotly.newPlot("geo-bar", [{
    type: "bar",
    x: data.map(row => row.region),
    y: data.map(row => row.percentage),
    text: data.map(
      row => row.percentage.toFixed(1) + "%"
    ),
    textposition: "outside",
    marker: {
      color: data.map(row => row.percentage),
      colorscale: "YlOrRd",
      showscale: false
    },
    customdata: data.map(row => row.pageviews),
    hovertemplate:
      "<b>%{x}</b><br>" +
      "Share of Records: %{y:.1f}%<br>" +
      "Pageviews: %{customdata}<extra></extra>"
  }], {
    margin: {t: 35, b: 80, l: 50, r: 20},
    height: 430,
    paper_bgcolor: "#fff",
    plot_bgcolor: "#fff",
    font: {family: "Times New Roman"},
    xaxis: {title: "Region"},
    yaxis: {title: "Share (%)", rangemode: "tozero"}
  }, {
    responsive: true,
    displaylogo: false
  });

  // WORLD MAP
  const mapped = data.filter(row => row.iso3);

  Plotly.newPlot("geo-map", [{
    type: "choropleth",
    locationmode: "ISO-3",
    locations: mapped.map(row => row.iso3),
    z: mapped.map(row => row.percentage),
    text: mapped.map(row => row.region),
    customdata: mapped.map(row => row.pageviews),
    colorscale: "YlOrRd",
    colorbar: {title: "%"},
    hovertemplate:
      "<b>%{text}</b><br>" +
      "Share of Records: %{z:.1f}%<br>" +
      "Pageviews: %{customdata}<extra></extra>"
  }], {
    margin: {t: 10, b: 10, l: 0, r: 0},
    height: 520,
    font: {family: "Times New Roman"},
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: {type: "natural earth"}
    }
  }, {
    responsive: true,
    displaylogo: false
  });
}

loadGeoAnalysis().catch(error => {
  console.error("Geographic analysis:", error);
});
