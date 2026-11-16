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
## Experiments

### 1. Route order

I moved the 404 fallback before static serving and the routes.
Requesting `/hello` returned `Page not found` instead of the greeting.
The fallback sent a response before Express reached the matching route.
I restored it below all routes after the experiment.

### 2. Middleware without next()

I temporarily commented out `next()` in the logger.
The browser kept loading because the middleware neither sent a response
nor passed control to the next handler.
The logger printed the timestamp, method and URL in the server terminal.
I restored `next()` after the experiment.

## Testing evidence

These are the responses received from the running server using
`curl.exe --include` in PowerShell.

### GET /api/courses

Command: `curl.exe --include http://localhost:3000/api/courses`

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 148
ETag: W/"94-6+1smdS+rFJfgBRUSDqD3KfZ/Nk"
Date: Mon, 16 Nov 2026 20:05:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Web Programming","credits":6},{"id":2,"title":"Database Systems","credits":5},{"id":3,"title":"Software Engineering","credits":5}]
```

### POST /api/subscribe

Command: `curl.exe --include -X POST http://localhost:3000/api/subscribe`

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 20:05:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### GET /api/admin

Command: `curl.exe --include http://localhost:3000/api/admin`

```http
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 20:05:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### GET /old-page

Command: `curl.exe --include http://localhost:3000/old-page`

```http
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 20:05:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

### GET /api/missing

Command: `curl.exe --include http://localhost:3000/api/missing`

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 20:05:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### GET /missing

Command: `curl.exe --include http://localhost:3000/missing`

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 14
ETag: W/"e-vDAjs2Bjp2gdskaBRytU+hHw1Ow"
Date: Mon, 16 Nov 2026 20:05:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Page not found
```