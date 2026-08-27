# Storyloom ✦

A two-person creative vault: IC drops sparks (dialogue, images, half-ideas) into Ideas;
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

## Build tag

A small `vNN · date` label sits next to the logo (hover it for a note about what it is
for). It is bumped by hand right before each commit, so after you deploy and hard-refresh,
seeing the number change is proof you are looking at the new version and not a cached
copy. Also logged to the console on load. To bump it: edit `const BUILD` near the top of
the `<script>` in index.html.

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
- **Character Tags vs. General Tags** — both tabs list every tag that exists;
  they differ in role, not in coverage. **Character Tags** is the main tag workspace —
  full hierarchy, exactly what the single "Tags" tab used to be. **General Tags** is a
  flat, always-searchable index of the same tags, for a fast lookup by name rather than
  browsing a tree. Working a tree or a list never jumps you to the other tab — a click
  inside either one opens that tag’s page right there.
- **Marking a tag as a character** (on its own page, either tab) gives it a private space:
  any note carrying that tag — created in Ideas, in the note editor, or straight on the
  tag’s page — belongs only there and stops appearing in Ideas, Library, or the Sequences
  beat-picker. Removing the tag returns the note to the normal pool immediately; nothing
  is a one-way trip. The dot on a tag row shows which ones are currently marked.
- **Tags are clickable on notes** — wherever a tag appears on a note card, clicking it is
  a hyperlink: a character tag opens under Character Tags, any other tag opens under
  General Tags. You never have to know a tag’s type to follow it.
- **Tag pages** — every tag in use gets a page of its own: a title, free text you write
  like an idea, an image, and pinned links. Pages are created lazily, the moment you first
  put something on one.
- **Tag hierarchy** — a tag can sit under a parent tag (sub-characters under a character).
  A parent page also surfaces the notes belonging to its sub-tags under "From sub-tags".
  A tag cannot be nested under itself or its own descendant, so the tree can never loop.
- **Tag autocomplete** — the tags field (in capture and in the note editor) suggests tags
  you already use as you type each comma-separated entry, showing each one’s type and note
  count. Anything unrecognised is flagged **new tag** before you commit to it, so a typo
  cannot quietly fork a tag into two — and typing an existing *general* tag never creates
  a character tag by accident, since only a character tag already declared as such isolates
  a note.
- **Search matches tags too** — the search box in Ideas and Library now matches a note’s
  tags, not just its body text. General Tags has its own comprehensive tag-name search box,
  for finding a tag itself rather than the notes on it.
- **Capture from a tag page** — a tag page has its own idea box. Whatever you write there
  is tagged with that tag automatically and appears below without leaving the page; the
  world field is pre-filled from the notes already there.
- **Pinned tags** — the ☆ on a tag page marks it important; pinned tags appear as chips at
  the top of their section and get a ★ wherever that tag is shown.
- **Multi-select everywhere, Gmail-style** — every section has it: notes (Ideas,
  Library, a tag’s own note grids), sequences, and tags (Character and General) all show
  a checkbox once you start selecting, with an action bar tailored to what you checked:
  - **Notes**: Add tag…, Set world…, Add to sequence… (existing sequences only — there
    is no "create new" shortcut outside Sequences), Mark sorted, Back to Ideas, Move to Trash.
  - **Sequences**: Move to Trash.
  - **Tags**: Mark as character, Mark as general, Add notes to sequence… (gathers every
    note carrying any of the selected tags — select a character and its sub-tags together
    to sweep up all of their notes at once — into one existing sequence), Move to Trash.
  Selection is per-device, forgotten on tab switch, never synced, and never triggers a
  save to GitHub by itself.
- **Cards or list, per section** — every section (Ideas, Library, Sequences, Character
  Tags, General Tags) has a ▦ / ☰ toggle in its header. Notes and sequences default to
  cards, tag sections default to the list/tree; either can be switched. The choice is
  remembered per section and per device, and is never written to the shared vault.
- **A note is a post** — besides its text it carries a free-text **notes** field (context
  for yourself, written under the spark line in Ideas) and a **comment thread**. Anyone
  can reply as whoever is currently selected in the user switcher, so a note can turn into
  a two-person conversation. Comments save immediately on posting rather than waiting for
  Save, so a reply cannot be lost by closing the dialog. Cards show 💬 with a count, and 📝
  when notes are attached.
- **Routing to a character** — from an open post, **➦ Send post to…** adds a character tag
  to the whole note, moving it into that character's private space. The ➦ on an individual
  comment instead creates a *new* note in that character from just that comment, carrying
  the original post's title as context so the fragment still makes sense, credited to
  whoever wrote the comment. Both offer character tags only.
- **Notifications** — a 🔔 in the header with a count of comments the *other* person has
  written that you have not seen. Opening it lists each post with something new: who wrote
  it, when, and a preview; clicking a row jumps straight to that post and clears it. Your
  own comments never notify you. Because there is no server pushing anything, "unread" is
  derived from the vault itself — a post is new to you if it carries a comment by someone
  else written after the last time you opened it. Read markers are stored per person in
  the vault, so reading on the laptop also clears it on the phone.
- **Direct links** — 🔗 on an open post copies a URL ending `#n=<id>`. Opening that URL
  goes straight to the post, so you can paste one to each other outside the app.
- **Trash** — the 6th tab. Every delete, single or bulk, lands here first: notes,
  sequences, and tag pages alike, each showing what it was and when it was removed.
  Restore puts it back exactly where it lived (and safely overrides a stale tombstone
  from another device, if it comes to that); Delete forever removes it for good.
  Untouched items age out automatically after 30 days.


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

## Who is working (IC / LIK)

A **👤 IC / 👤 LIK** button in the header, next to the language toggle. Like the language
and theme, the choice is per device and lives in its own localStorage key — it is never
written into the vault, so the two of you can be signed in as different people on the same
shared vault at the same time.

What *does* travel is the marking. Each person has a fixed symbol — **◆ IC** (ember) and
**▲ LIK** (violet) — and it appears on whatever they last touched:

- **Every change is marked, not just creation.** Editing, retagging, moving to a sequence,
  changing status, restoring from Trash — any mutation stamps `editedBy` with whoever is
  currently selected. This applies to records that already existed, so you can always see
  who was last in a thing.
- **Creation is remembered separately.** `author` is set once and never rewritten, so
  opening a note shows the full story: *created by ◆ IC · last edited by ▲ LIK*.
- **The marks appear on every pane** — note cards, sequence cards, and tag rows — beside
  the date or count.
- Records that predate this feature carry no marking and show none, rather than being
  attributed to whoever happens to be selected now.

This is enforced structurally rather than by remembering to add it: all 34 mutation points
in the app were converted to route through a single `stamp()` helper that sets the editor
and the timestamp together, so a future code path cannot update something without also
recording who did it.

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

The Inbox is called **Ideas** / רעיונות, and the fourth tab is **Tags** / תגיות.

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
