# Storyloom — online setup

**App:** https://natotela.github.io/storyloom/ ✅ live
**Vault:** a separate **private** repo, written by the app over the GitHub API.

Two repos on purpose: Pages only serves free sites from *public* repos, and your canon
has no business being public. The public repo holds only the app — `vault.json` is
gitignored, verified absent from the published site.

The app being public is harmless: without a token it's an empty shell. The token lives
in each browser's local storage — never in the page, the vault file, or an export.

---

## Step 1 — app repo (public) ✅ done

Live at https://natotela.github.io/storyloom/

## Step 2 — vault repo (private) — do this once

github.com → **New repository** → name `storyloom-vault` → **Private** →
tick **Add a README** → Create.

(The README just forces the `main` branch into existence so the app has somewhere to write.)

## Step 3 — the token — do this once

1. github.com → avatar → **Settings** → **Developer settings**
   → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Name `storyloom`. Expiry: 1 year (you'll re-enter it when it lapses).
3. **Repository access** → *Only select repositories* → **`storyloom-vault`** only.
4. **Permissions** → Repository permissions → **Contents** → **Read and write**.
   (Leave everything else alone. This token can touch nothing but the vault.)
5. Generate and copy the `github_pat_…` string — GitHub shows it exactly once.

**Put it somewhere you both can reach it**: a shared password manager entry, or a note
in an end-to-end encrypted chat. You need it on every device. Don't email it.

One token shared between the two of you is fine — it's scoped to a single private repo.

## Step 4 — connect each device

On **every** machine, phone, and tablet, once each:

1. Open https://natotela.github.io/storyloom/
2. **⇅ Sync**
3. Repository `Natotela/storyloom-vault` · branch `main` · path `vault.json`
4. Paste the token → **⟳ Connect**
5. Badge turns **☁ synced ✓**

That's the whole per-device ritual. Nothing to install.

## Step 5 — move your real vault up (once, from IC's laptop)

Your existing notes are in `vault.json` on IC's laptop, not yet on GitHub.

1. On IC's laptop run `node storyloom/server.js`, open http://localhost:4173
2. **Export** → saves a `.json` file
3. Open the Pages site (already connected per step 4) → **Import** that file
4. Badge goes `☁ saving…` → `☁ synced ✓`

Everything is now on GitHub. From here on the Pages URL is home on every device;
`server.js` becomes optional.

---

## iPhone / iPad

Do step 4 in **Safari**, then **Share → Add to Home Screen**. You get the ✦ icon and a
full-screen app with no browser chrome — good for capturing a spark in three seconds.

Two iOS notes worth knowing:

- **Use the home-screen icon, not a Safari tab.** Safari clears storage for sites you
  haven't visited in ~7 days; installed home-screen apps are treated as in-use. If it
  ever does forget, nothing is lost — the vault is on GitHub. You just re-paste the token.
- **Pasting the token**: keep it in your password manager and paste from there. Typing
  a `github_pat_…` string on a phone keyboard is misery.

Each iOS device needs the token entered separately — Safari and the home-screen app
share storage on modern iOS, so doing it once per device is enough.

## How syncing behaves

- **Auto-save** ~2.5s after you stop editing: `☁ unsaved…` → `☁ saving…` → `☁ synced ✓`
- **Auto-pull** on focus and every 45s while visible — your partner's work just appears.
- **Simultaneous edits are safe**: every push re-reads GitHub and merges, newest version
  of each note winning. Tested with both sides editing at once; nothing was lost.
- **Version history free**: every save is a commit. `storyloom-vault` → *History* lets you
  read or restore the canon as of any past moment.
- **Offline**: keeps working against the browser copy and retries. Don't close the tab on
  a red badge — you'll get a warning if you try.
- **Your view isn't shared**: open tab, filters, and theme stay per-device on purpose.

## If a deploy does not appear

Check **https://github.com/Natotela/storyloom/actions** — the "pages build and deployment"
run for your commit should be green.

- **Run failed with every job still `queued` and nothing executed** — that is GitHub
  failing to assign a runner, not a problem with the code. Click **Re-run all jobs** on
  that run; it normally succeeds on the retry.
- **Run is green but the page looks old** — the CDN caches for up to 10 minutes. Hard
  refresh (`Ctrl+F5`); the build tag by the logo is the reliable check.

The repo contains an empty `.nojekyll` file so Pages skips Jekyll and just copies the
files as-is. Do not delete it: it makes the build faster and removes a whole class of
build failures that Jekyll can cause on a plain static site.

## Updating the app

From the `storyloom` folder:

```bash
git add -A && git commit -m "update storyloom" && git push
```

Pages redeploys in ~1 minute. Vaults untouched — app and data live in different repos so
shipping app changes can never endanger the canon.

## When you outgrow this

Two honest limits: images sit inside `vault.json` as base64, so the file and every commit
grow fast once real art goes in; and there's no sign-in, so whoever holds the token holds
everything. Both are solved by the Cloudflare Pages + Worker + R2 step — images in object
storage, real per-tenant accounts — whenever you're ready.

## Deletions

A deletion is recorded as a fact ("this id died at this time"), not just an absence, and
that record syncs like everything else. So deleting a spark on any device deletes it
everywhere at the next sync, and a device that still has the old copy cannot push it back.

- Deleting a note also removes it from any sequence timeline and drops its links.
- If one of you deletes something and the other *edits* it afterwards, the edit wins and
  the item survives — losing work is worse than an unwanted note.
- Deletion records are forgotten after 180 days to keep the file small; long past the
  point where every device has synced.

**One-time catch:** anything you deleted *before* this update has no such record, so it
may come back once from the copy on GitHub. Delete it a second time — after that it stays
gone. Do this after every device has loaded the updated app.
