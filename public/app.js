const output = document.querySelector("#output");
const buttons = document.querySelectorAll("button[data-url]");

async function callApi(url, method) {
  output.textContent = `Loading ${method} ${url}...`;

  try {
    const response = await fetch(url, { method });
    const contentType = response.headers.get("content-type") || "";

    let body;

    if (contentType.includes("application/json")) {
      const data = await response.json();
      body = JSON.stringify(data, null, 2);
    } else {
      body = await response.text();
    }

    output.textContent =
      `${method} ${url}\n` +
      `Status: ${response.status} ${response.statusText}\n` +
      `Result: ${response.ok ? "Success" : "HTTP error"}\n\n` +
      body;
  } catch (error) {
    output.textContent = `Network error: ${error.message}`;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const url = button.dataset.url;
    const method = button.dataset.method || "GET";

    callApi(url, method);
  });
});