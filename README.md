# Osheen Bhardwaj — Personal Website

A static personal site and portfolio: about, experience, projects, publications,
resume and contact pages, with a starfield background, a fluid cursor trail and a
light/dark theme that persists between visits.

Plain HTML, CSS and JavaScript — **no framework, no build step, no dependencies.**
What is in this repo is exactly what the browser runs.

---

## Requirements

| | |
|---|---|
| **Python** | 3.7 or newer — only to run the local web server |
| **Browser** | Any modern one (Chrome, Firefox, Safari, Edge) |
| **Anything else** | Nothing. No npm install, no compiler, no API keys. |

Check your Python:

```bash
python3 --version
```

---

## Run it locally

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install requirements (optional)

The site needs no third-party packages — the local server uses Python's built-in
`http.server`. Running this is harmless and installs nothing:

```bash
pip install -r requirements.txt
```

`requirements.txt` documents that fact, and lists a couple of optional
developer conveniences (such as live-reload) that you can uncomment if you want them.

### 3. Start the server

From the project root:

```bash
python3 -m http.server 8000
```

### 4. Open it

<http://localhost:8000>

To stop the server, press `Ctrl + C` in that terminal.

If port 8000 is already taken, pick another one — `python3 -m http.server 5500`
serves at <http://localhost:5500>.

---

### Other ways to serve it

Any static file server works; the site does not care which.

```bash
npx serve .                 # Node — http://localhost:3000
php -S localhost:8000       # PHP
ruby -run -e httpd . -p 8000   # Ruby
```

Or, in VS Code, install the **Live Server** extension, right-click `index.html`
and choose *Open with Live Server*.

### Can I just double-click `index.html`?

Mostly, yes — the pages render over `file://`. But a local server is the
recommended way: some browsers restrict storage and fetch behaviour on `file://`
URLs, so theme persistence and the contact form are more reliable over
`http://localhost`.

---

## Project structure

```
.
├── index.html            # Home
├── about.html            # About
├── experience.html       # Experience
├── projects.html         # Projects
├── publications.html     # Publications
├── resume.html           # Resume
├── contact.html          # Contact form
│
├── css/
│   └── style.css         # All styling, including light/dark theme tokens
│
├── js/
│   ├── data.js           # ← ALL site content lives here
│   ├── render.js         # Turns the data into page markup
│   ├── main.js           # Nav, page wiring, shared behaviour
│   ├── resume.js         # Builds the resume page
│   ├── hero.js           # Home-page hero
│   ├── starfield.js      # Animated star background (canvas)
│   ├── fluid-cursor.js   # Fluid cursor trail (canvas)
│   ├── theme-boot.js     # Applies the saved theme before first paint
│   ├── theme.js          # Theme toggle
│   └── contact-form.js   # Contact form validation + sending
│
├── assets/
│   └── profile.jpg       # Profile photo
│
├── requirements.txt
└── README.md
```

---

## Editing the site

**Content** — nearly everything you would want to change (name, role, tagline,
socials, education, experience, projects, publications, achievements) lives in
one file:

```
js/data.js
```

Edit the objects and arrays there and reload the page. No rebuild.

**Styling** — `css/style.css`. Colours for both themes are defined as CSS custom
properties at the top of the file; change them in one place and both themes follow.

**A note on caching.** Stylesheets and scripts are linked with a version query
string, for example `css/style.css?v=10`. If you edit a CSS or JS file and the
browser keeps serving the old version, either hard-refresh
(`Cmd + Shift + R` on macOS, `Ctrl + Shift + R` elsewhere) or bump that number
in the `<link>` / `<script>` tags across the HTML files.

---

## Contact form

The contact form posts to [FormSubmit](https://formsubmit.co), which forwards
messages as email — there is no backend of ours to run. The first message sent
to a given address triggers a one-time activation link to that inbox; once it is
clicked, later messages arrive directly.

The target address is read from `SITE.email` in `js/data.js`. To switch to a
different provider (Web3Forms, EmailJS, your own endpoint), change `ENDPOINT` and
`buildPayload()` in `js/contact-form.js` — nothing else in the site knows how mail
is sent.

---

## Deploying

Because it is fully static, any static host works. For **GitHub Pages**:

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, set **Source** to *Deploy from a branch*, and
   pick the `main` branch with folder `/ (root)`.
4. Save. The site appears at `https://<your-username>.github.io/<your-repo>/`
   within a minute or two.

Netlify, Vercel and Cloudflare Pages also work — point them at the repo root with
no build command and no output directory.
