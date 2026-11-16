# Assignment 8 — Study Programme Server

A small information server built with Node.js and Express 5.
The browser page introduces a software development programme and
allows visitors to test the API.

## Installation and running

Install Node.js 24 LTS, then run these commands inside the project folder:

```bash
npm ci
npm start
```

For development with automatic restart:

```bash
npm run dev
```

Open http://localhost:3000 in a browser.

The server uses `process.env.PORT`, with 3000 as the default.
To choose another port in PowerShell:

```powershell
$env:PORT = "4000"
npm start
```

## File organization

- `server.js`: application, hard-coded courses, middleware and routes.
- `public/index.html`: programme introduction and API buttons.
- `public/styles.css`: page styling and mobile layout.
- `public/app.js`: Fetch requests and response display.
- `package.json`: project settings, scripts and dependency declaration.
- `package-lock.json`: exact dependency versions for installation.
- `.gitignore`: excludes `node_modules/` and `.env`.
- `README.md`: instructions, explanations and testing evidence.

## Middleware and request counting

The logger prints a timestamp, HTTP method and URL for each request.
The counter increments once for every request reaching the application.
Both middleware functions run before static files and routes, and both call
`next()` so processing can continue.

The count includes the HTML page, CSS, JavaScript, API requests and 404s.
It also includes the request to `/api/stats` itself.
Following `/old-page` creates another request to `/hello`.
The counter resets when the server restarts.

## Reasoning questions

### 3. Status codes

The assignment uses 201 for subscription because it represents creating
a subscription, although this exercise does not save it permanently.
200 means general success, while 201 describes creation more precisely.
A missing page needs 404 so browsers and other clients can recognize
that the requested resource was not found.

### 4. Configuration

Reading `process.env.PORT` lets the environment choose the listening port.
This is useful when a hosting service assigns a port or 3000 is already in use.
The fallback makes local development easy without extra configuration.

### 5. Dependencies

`node_modules` contains installed dependencies and can be recreated,
so it should not be committed.
After cloning, a teammate runs `npm ci` in the project folder and then
`npm start`. The committed lockfile makes the installation reproducible.

### 6. Same origin

When served through Express, the page and API share the same scheme,
host and port, so relative API URLs reach this server.
Opening the HTML directly uses a `file:` URL, and relative paths no longer
point to the Express server.
Browser access between different origins is governed by the same-origin
policy; cross-origin Fetch access requires the server's CORS permission.

## Self-study notes

### Running process information

The Node.js documentation explains that `process.version` contains the
running Node version and `process.uptime()` returns elapsed process time
in seconds. I used both in `/api/status` and rounded uptime down with
`Math.floor()`.

Source: https://nodejs.org/docs/latest-v24.x/api/process.html

### Plain-text responses

Express provides `res.type()` to set a response's content type.
I used `res.type("text/plain")` before `res.send()` for `/robots.txt`,
so it is returned as plain text.

Source: https://expressjs.com/en/5x/api.html#res.type

### Readable JSON

`JSON.stringify(data, null, 2)` formats JSON with two-space indentation.
The browser script puts this string in the response area's `textContent`,
making nested response data easier to read.

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

### Static file paths

The static directory uses an absolute path based on `import.meta.url`.
This makes the server independent of the terminal's working directory.
Express serves `index.html` automatically when `/` is requested.

Source: https://expressjs.com/en/starter/static-files.html

## Challenges faced

I initially placed static serving before the logger and counter.
I moved it below both middleware functions so static requests are counted.
I also initially received Express's default missing-page response because
my custom 404 fallback was missing.
Adding the fallback after the routes fixed the API error response.