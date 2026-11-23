# Stack Garden

A React PWA for studying the [roadmap.sh System Design Roadmap](https://roadmap.sh/system-design). The curriculum contains 144 short lessons across ten freely accessible chapters. Each lesson includes a worked explanation, an example, defined terminology, free references, and a visible scenario question with feedback after you answer. Lessons and key terms are searchable and work offline. External reading links require connectivity.

## Study

Open **Speedrun plan** for a first pass tonight and a recall session tomorrow. **Concept index** searches the entire guide. Use **Shuffle topic** to change subjects, or bookmark a lesson to revisit. The quiz room lets you choose 5, 10, or 20 questions for mixed, terminology, bookmarked, and missed-question rounds. In terminology rounds, choose the definition of a system design term. Missed definitions are saved individually for review. Smaller pools use every available card once.

Fifteen worked scenarios cover AWS and Azure implementations across the stack. Each includes a component flow, a design trade-off, and official documentation. The communication lessons compare RPC, gRPC, REST, and GraphQL through an order lookup. Both the walkthroughs and tables are available offline.

The core reading pass contains approximately 19,500 words of lessons, examples, and definitions. At 150–200 words per minute that is roughly 98–130 minutes of reading, plus time for questions, breaks and reflection.

## Install on a phone

Open [Stack Garden on GitHub Pages](https://zerosicx.github.io/system-design-speedrun/) in your mobile browser. On iOS, use Safari’s Share menu and choose **Add to Home Screen**. On Android, use **Install app** from the site navigation or Chrome menu. After **Install app** reports that lessons and quizzes are ready offline, the production app can reload without a connection.

Reading progress, bookmarks, quiz accuracy, missed questions and preferences are stored in the current browser’s local storage. Clearing site data removes this history. Sounds are opt-in, and vibration depends on browser and device support.

## Develop

Requires Node.js 20 or newer and npm.

```sh
npm ci
npm run dev
```

Build and test the offline-capable production version locally.

```sh
npm run check
npm run build
npm run preview
```

Pushes to `main` run the curriculum check, build the app, and publish `dist/` to GitHub Pages. Relative asset paths also support other HTTPS hosts and project subdirectories. The build writes a versioned service worker that precaches the complete app, including the curriculum, local fonts and illustrations. Hash-based routes support direct links without a server rewrite.

## Curriculum and artwork

Topic coverage was checked against the live roadmap on November 23, 2026. Related roadmap nodes are grouped into study chapters. Repeated cloud patterns share lessons, while concepts such as replication and sharding also have distinct applied examples. Reading links were curated from the [roadmap topic files](https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/system-design/content). Supplementary references are identified in each lesson. The original study text lives in `src/data/`. Each lesson stores the correct choice first in source data and shuffles choices for display. The [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/) provides further reading on cloud design patterns.

The hero illustration and nine chapter tiles in `public/art/` were made with built-in ImageGen. The potted-sprout app icon was drawn as a pixel grid. DM Sans and Space Mono are bundled alongside their font licenses.

<details>
<summary>Illustration prompts</summary>

**Hero**

Wide 3:2 hand-painted pixel art illustration for a cozy computer science study garden at night. Isometric miniature floating mossy earth island with a substantial old-fashioned charcoal-green CRT desktop terminal showing a tiny glowing lime >_ cursor, beige keyboard, two small grey server nodes with glowing lights, sunlit golden lamp, stacks of books, chunky pixelated rounded deciduous trees in muted jade and sage, tiny orange mushrooms, golden wildflowers, stony path. Obvious large crisp pixel clusters and stair-step edges, richly layered dark forest / amber / sage palette with small lavender details. 1990s adventure game landscape sprite, orthographic three-quarter view. Place the entire isolated island within frame with wide margins. Flat solid very dark forest green background #18392d extending to all edges, a few sparse glowing block fireflies. No border, no UI, no legible words, no other text, no sky or horizon.

**Chapter tiles**

A precisely aligned 3-column by 3-row sprite asset sheet on wide 3:2 canvas. Nine equally sized rectangular tiles edge-to-edge; each tile has its own flat muted pastel color background and one small central detailed isometric pixel-art object, entire object visible within central 60% of tile, generous negative space at edges. No writing, text, numbers, borders, lines, UI or shadows outside each cell. All 9 are 1990s cozy adventure game hand pixel art, obvious crisp pixel clusters, consistent three-quarter isometric angle, olive ink outlines, warm highlights, earthy jade color palette. Top left tile: three mossy stacked stone building blocks topped with a tiny two-leaf green sprout on pale creamy sage green background. Top middle: two small connected miniature communication antenna dishes with a signal on pale powder blue background. Top right: stack of 3 violet database cylinders with wildflowers on pale lavender. Middle left: a miniature warm brick castle tower with a small shield on pale peach. Middle middle: tiny mossy server rack with three layers on pale aquamarine. Middle right: chunky treasure chest with a gold lightning bolt on pale straw. Bottom left: cream mailbox holding letters with a green flag on muted pastel mint. Bottom middle: a CRT monitor with a pale green heartbeat line on warm blush background. Bottom right: a puffy cloud over small connected wooden blocks and sprouting leaves on pale sky blue. All tiles evenly spaced on a mathematically regular grid, exactly thirds each axis.

</details>

