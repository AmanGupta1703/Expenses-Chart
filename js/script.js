(async function () {
  const data = await getData();
  const allExpenses = data.map((item) => item.amount);
  const maxExpense = Math.max(...allExpenses);

  const spendingSummaryChartEl = document.querySelector(".spending-summary__chart");
  const barsStr = createBarsHTML(data);
  renderBarsInChart(spendingSummaryChartEl, barsStr);

  /**
   * Fetches data from the local data.json file and returns it as a JSON object.
   * @returns {Promise<Object>} A promise which resolves to the fetched data.
   */
  async function getData() {
    try {
      const res = await fetch("../data.json");
      if (!res.ok) throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
      alert("Error fetching data. Please check your internet connection and try again later.");
      return [];
    }
  }

  /**
   * Calculate the height of a bar based on the expense.
   * The height is calculated as a percentage of the maximum expense.
   * @param {number} expense - The expense amount.
   * @returns {number} The calculated bar height.
   */
  function calcBarHeight(expense) {
    return Math.round((expense / maxExpense) * 100);
  }

  /**
   * Creates the HTML for the bars in the spending summary chart.
   * @param {array} data - The data for the chart, containing objects with day and amount properties.
   * @returns {string} The HTML for the bars in the chart.
   */
  function createBarsHTML(data) {
    return data
      .map(
        (item) => `
      <div class="spending-summary__bar">
        <div style="height: ${calcBarHeight(
          item.amount,
        )}%" class="spending-summary__bar-fill spending-summary__bar-fill-${item.day}">
          <span class="spending-summary__amount">&dollar;${item.amount}</span>
        </div>
        <span class="spending-summary__day">${item.day}</span>
      </div>
    `,
      )
      .join("");
  }

  /**
   * Adds the bars to the spending summary chart.
   * @param {HTMLElement} chartContainer - The container element for the bars.
   * @param {string} barsStr - The HTML string for the bars in the chart.
   */
  function renderBarsInChart(chartContainer, barsStr) {
    chartContainer.innerHTML = "";
    chartContainer.insertAdjacentHTML("beforeend", barsStr);
  }
})();
