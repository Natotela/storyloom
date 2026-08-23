# Putting Storyloom online (GitHub Pages)

The result: a URL you both open from any device — laptop, partner's laptop, phones —
with the vault living in GitHub, not on IC's machine. Nothing has to be running at home.

**Two repos, on purpose:**

| repo | visibility | holds | why |
|---|---|---|---|
| `storyloom` | **public** | `index.html` | GitHub Pages only serves free sites from public repos |
| `storyloom-vault` | **private** | `vault.json` | your canon — no reason for it to be readable by strangers |

The app being public is harmless: it's an empty shell without a token. Every browser you
use enters the token once, and it stays in that browser's local storage — never in the
page, the vault file, or an export. (Verified: the token cannot reach the published file.)

---

## Step 1 — the app repo (public)

1. On github.com: **New repository** → name `storyloom` → **Public** → Create.
2. On the empty repo page click **uploading an existing file**.
3. Drag in `storyloom/index.html` from this project. Commit.
4. Repo → **Settings** → **Pages** → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → Save.
5. Wait ~1 minute. Your site is at **`https://<your-username>.github.io/storyloom/`**

## Step 2 — the vault repo (private)

1. **New repository** → name `storyloom-vault` → **Private** → tick *Add a README* → Create.
   (The README just ensures the `main` branch exists.)

## Step 3 — the token

1. github.com → your avatar → **Settings** → **Developer settings**
   → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Name it `storyloom`, expiry as you like (you'll re-enter it when it lapses).
3. **Repository access** → *Only select repositories* → pick **`storyloom-vault`** only.
4. **Permissions** → Repository permissions → **Contents** → **Read and write**.
5. Generate, then copy the `github_pat_…` string — GitHub shows it once.

## Step 4 — connect

1. Open your Pages URL, click **⇅ Sync**.
2. Repository: `<your-username>/storyloom-vault` · branch `main` · path `vault.json`
3. Paste the token → **⟳ Connect**.
4. The header badge turns **☁ synced ✓**. Done — the vault now lives on GitHub.

Repeat step 4 (only step 4) in every browser and on every phone you want to use.

## Step 5 — move your existing vault up

Do this once, from the machine that has your real notes (the one running `server.js`):
open the local app, **Export**, then on the Pages site **Import** that file. It pushes
to GitHub within a couple of seconds. After that, use the Pages URL as home.

---

## How syncing behaves

- **Auto-save**: ~2.5s after you stop editing. Badge shows `☁ unsaved…` → `☁ saving…` → `☁ synced ✓`.
- **Auto-pull**: on page focus and every 45s while the tab is visible, so your partner's
  work appears without you doing anything.
- **Simultaneous edits are safe**: every push re-reads GitHub first and merges, keeping
  the newest version of each note. Tested with both sides editing at once — nothing is lost.
- **Version history for free**: every save is a commit. `storyloom-vault` → *History*
  lets you see or restore the canon as of any past moment.
- **Offline**: edits keep working against the browser copy; the badge shows it isn't
  saved, and it retries. Don't close the tab on a red badge — you'll get a warning if you try.

## Updating the app later

When `index.html` changes here, upload it again: repo → the file → pencil icon, or drag
the new copy in. Pages redeploys in about a minute. Everyone's vault is untouched — the
app and the data are deliberately separate.

Prefer git? From this folder:

```bash
git clone https://github.com/<your-username>/storyloom.git site && cp storyloom/index.html site/ && cd site && git add -A && git commit -m "update storyloom" && git push
```

## When you outgrow this

Two honest limits: images live inside `vault.json` as base64, so the file (and every
commit) grows fast once you add art; and there's no sign-in, so anyone with the token has
everything. Both are solved by the Cloudflare Pages + Worker + R2 step — images in object
storage, real accounts — whenever you're ready.
