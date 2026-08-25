# Storyloom ✦

A two-person creative vault: IC drops sparks (dialogue, images, half-ideas) into the Inbox;
the Weaver tags, sorts, links, and knits them into Sequences with timelines and mood images.

## Run it

From the `Claude_Win_Troubleshoot` folder:

```
node storyloom/server.js
```

then open http://localhost:4173 — in **any** browser, they all share the same vault.
Leave the window open while you work.

(Double-clicking `index.html` still works, but that mode is browser-only storage —
the header badge will say "this browser only". Prefer the server.)

## Where the data lives

With the server running: in **`storyloom/vault.json`** on disk — one vault shared by
every browser on this machine, immune to browser cache clearing. The previous version
is always kept as `vault.backup.json`. The header badge shows "⛁ vault.json ✓" when
disk saving is active.

Each browser also keeps a localStorage copy (offline fallback). On page load the app
**merges** browser copy + disk copy: newest edit per note wins, exact-duplicate texts
are collapsed, nothing is dropped. So notes made earlier in any browser flow into the
shared vault the first time that browser opens the app with the server running.

**Export weekly** anyway — the JSON download is the canon and imports cleanly anywhere.

## Theme

The ◐/☀/☾ button cycles auto (follows Windows) → light → dark. Per browser.

## GitHub sync

Live at **https://natotela.github.io/storyloom/** — see **[DEPLOY.md](DEPLOY.md)** for the
per-device setup (private vault repo + fine-grained token, entered once per browser).

On a static host the ⇅ Sync button turns on **automatic** syncing:

- saves ~2.5s after you stop editing (badge: `☁ unsaved…` → `☁ saving…` → `☁ synced ✓`)
- pulls on window focus and every 45s, so your partner's work simply appears
- **merges** on every push instead of overwriting, so simultaneous edits are never lost
- deletions carry across devices and cannot be resurrected by a stale copy
- every save is a commit, so the vault repo's History is a complete time machine

## Import from Obsidian / Logseq

The **Import .md** button accepts multiple markdown files (select all files in your
vault folder). Each file becomes one inbox note titled by its filename. It understands:

- Obsidian YAML frontmatter `tags:` (inline `[a, b]` or list form)
- Logseq `tags:: a, b` properties
- inline `#tags` (headings are not mistaken for tags)
- `[[wikilinks]]` (incl. `[[target|alias]]`) — links between imported/existing notes
  are recreated as Storyloom relations labeled `wikilink`

## Concepts

- **Note (thread)** — text + kind (spark/dialogue/scene/character/place/idea/ref) + world + tags + reference URLs + an optional attached image (jpg/png/webp, auto-downscaled to ≤1400px). Starts in `inbox`, becomes `sorted`.
- **Status colors** — each card carries a colored top ribbon, a tinted body, a matching
  border, and a text chip: orange = still in inbox, violet = sorted, teal = woven into a
  sequence. Legend at the top of the Library.
- **Sequence image** — a sequence can take an uploaded jpg/png (or an image URL); it
  becomes the hero backdrop in the sequence view and the cover on the sequences grid.
- **Worlds** — the world field in capture, sequences, and the note editor is a dropdown of every world already in use; typing a new name creates it.
- **Sequence (weave)** — an ordered set of notes ("beats"), each stamped with a *moment*
  label, plus a description and a background image. Drag or arrow-key beats to reorder.
- **Link** — a labeled relation between two notes ("echoes", "contradicts", "same scene").
- **Warp** — a tag raised to a hub page of its own (the 4th tab). In weaving, warp threads
  are the ones held taut that every other thread crosses; a Warp is a recurring motif,
  character, or question. Each has a title, description, image, and pinned links, and it
  automatically gathers every note carrying that tag, those notes' reference URLs, and the
  sequences they appear in. Star a tag (☆ on any tag chip) to make one.
  To rename the concept, change the `WARP`/`WARPS` constants in `index.html`.
- **Tags are case-insensitive** — "Opening" and "opening" are the same tag; the first
  spelling used is kept as the display form, so slips can't fragment your canon.

Roadmap (comic / webapp / 3D world paths): see the published Storyloom Roadmap artifact.

## Hebrew and mixed-language writing

Write in Hebrew, English, or both — including inside a single note. There is no language
setting and no separate version, because direction is decided **per field** from what you
actually typed (`dir="auto"`):

- A Hebrew note renders right-to-left, an English one left-to-right, side by side in the
  same Library grid.
- Capture boxes, titles, descriptions and tag fields flip live as you type.
- Tags, worlds, search and import all work in Hebrew.
- Hebrew typography is real, not fallback: **Frank Ruhl Libre** pairs with Fraunces for
  display text and **Assistant** with Inter for body text. Browsers pick the face per
  glyph, so a mixed sentence uses the right font for each script automatically.
- Dialogue notes are italic in Latin script only — Hebrew has no true italic, and the
  slanted fake browsers synthesise reads as a rendering bug, so it is turned off for RTL.

This works regardless of which language the interface is set to — see below.

## Interface language (English / עברית)

The **א / A** button in the header switches the whole interface between English and
Hebrew. In Hebrew the layout mirrors properly (`dir=rtl`): the timeline rail moves to the
right, card spines and paddings flip, arrows reverse.

Note *content* is unaffected — it keeps deciding its own direction from what you typed,
so an English note still reads left-to-right inside the Hebrew interface, and vice versa.
The setting is per device, so one of you can work in Hebrew while the other works in
English **on the same vault**.

Adding or fixing a translation: edit the `I18N.he` dictionary near the top of the script.
English strings are the keys, so any key without a translation simply falls back to
English rather than breaking.

A note on one term: *Warp* is **שתי** in Hebrew — the actual weaving word. Unvocalized it
is spelled the same as "two", and that double reading is deliberate (IC’s call).

## Is there a database?

No, and there cannot be one on GitHub Pages: Pages is **static hosting**, it only serves
files and cannot run server-side code. So there is nowhere for a database engine, or even
a query endpoint, to live.

Instead the GitHub repo itself is the store: the vault is one JSON document, read and
written over the GitHub API. For two people this buys a lot for free — hosting, auth,
versioning of every save, and no server to maintain. What it costs:

- **Whole-file reads and writes.** There are no queries and no partial updates; every save
  uploads the entire vault. Fine at 250KB, wasteful at 10MB.
- **Size ceiling.** Images are stored inside the JSON as base64, so the file grows fast.
  The app handles vaults over 1MB (past that GitHub stops inlining file content and the
  raw endpoint is required), but this is the limit that will eventually force a move.
- **No per-user accounts.** Whoever holds the token holds everything.

The next step when those bite is Cloudflare Pages + a Worker + D1 (a real SQL database)
and R2 for images — still free at this scale, but with actual queries, per-tenant sign-in,
and images stored as files instead of inflating every commit.
