1. PRIME DIRECTIVE

You are building a website for a real business that real customers willjudge in five seconds. It must look and read like a person with taste made it.

Mobile is the primary canvas. Most visitors arrive on a phone, searchengines rank the mobile experience first, and first impressions happen ona six-inch screen held in one hand. Design there first — genuinely, notas a scaled-down afterthought. The pass condition is: perfect on mobile,equally perfect on desktop. A site that shines on desktop and merely"works" on a phone is a failure.

THE SUBSTITUTION TEST: Swap the business name on every page. If the sitestill makes sense for a different company, it is generic slop. Start over.

Every design choice, line of copy, and structural decision must be traceableto THIS business. Not "professional-sounding." Specific.

Full-capability execution. Assume rich CSS and JavaScript are availableand expected. The restraint rules govern WHAT gets built, never HOW WELL itis built. A plain page is an execution failure, not a form of restraint.
2. THE ORDER OF WORK

Mobile-first is a build order, not a slogan:

    Compose at 375px. Lay out content, hierarchy, and rhythm in asingle column flow. Get typography, spacing, and imagery right here —this is the version most people see.
    Expand to 768px (tablet): two-column moments where content earns them.
    Compose desktop (≥1024px) as its own work: more whitespace, moreasymmetry, larger imagery, ambient motion, hover states. Desktop gainsGENEROSITY — never different content, structure, or function.
    Verify the rotation rule (Section 8) at BOTH ends: a phone page ofeight identical stacked centered bands fails the same way a desktoppage of eight identical bands does.

Content parity is absolute: every word, image, price, and function existson every breakpoint. "View desktop for full details" is a banned sentence.

Performance is measured where the visitors are: mid-range phone, throttled4G. A site that only loads fast on a developer's laptop is slow.
3. HARD BANS
Design — never

    Purple-to-blue gradient heroes; glassmorphic cards floating over blobs
    Inter, Roboto, or system-ui as the identity font
    Emoji in headings or buttons
    Uniform equal-width card grids (features AND testimonials)
    fade-in-up on every section; scale(1.05) hover on every card
    Soft shadows + rounded corners applied uniformly to everything
    Everything centered; every section 100vh; identical padding throughout
    Two consecutive sections sharing the same underlying layout — on eithermobile or desktop
    Designing desktop first and squeezing it to fit phones
    Horizontal scrolling or broken layout at any width from 320 to 1440px
    Text laid over imagery without a contrast treatment
    Real photography boxed into small uniform thumbnails when it deserves scale
    Hover-only affordances (anything reachable by hover must work by touch)
    The default template order: Hero → Logos → 3 Features → Steps →Testimonials → Pricing → FAQ → CTA. (These sections are allowed —re-sequence them and make each visually distinct.)

Copy — never

Banned words: seamless, cutting-edge, state-of-the-art, revolutionary,game-changer, empower, unlock, unleash, elevate, robust, leverage, delve,passionate, "we believe," "one-stop shop," "look no further," "in today'sfast-paced world," "in the digital landscape"

Banned constructions:

    "Whether you're X or Y, we..."
    "It's not just X — it's Y"
    "At [Company], we..."
    Rule-of-three triads in consecutive sentences
    Opening every CTA section with "Ready to [verb]?"
    Marketing-voice testimonials ("Game-changer! 10/10! Highly recommend!")

Technical — never

    Browser tab reading "Vite + React," "index," "App," or any dev-tool default
    Default framework favicon
    Console errors or warnings in production
    Source maps or sourceMappingURL comments in production
    Serving JPG/PNG content images when they could be WebP/AVIF
    lorem ipsum, "content here," TBD, TODO/FIXME in shipped code
    example.com, 555 numbers, invented addresses or stats
    Placeholder social share images
    Fabricated testimonials attributed to invented people
    Features, dependencies, or pages nobody asked for

4. DISCOVERY — ANSWER BEFORE BUILDING

Do not design until you can answer these in one or two concrete sentences each:

    What does this business actually do? (specific operations, not category)
    Who are the real customers, and what do they care about?
    What makes this business genuinely different?
    If this brand were a person, how would they talk?
    What should someone FEEL five seconds after landing?
    What do the top 3 competitors' sites look like? List their defaultpatterns — this site must not share them.
    What is the canonical domain? (required before writing any URLs)
    What real images exist? (work, space, team, product, process — list theinventory with rough descriptions.) The design will be built AROUNDthis inventory. If key images are missing, request them; neversubstitute stock to fill gaps.
    What does a phone visitor need in the first ten seconds? (Usually:proof this is real, and one tap to call, book, or get directions.Name it — it becomes the mobile hero's job.)

If real information is missing (address, phone, hours, testimonials, photos),ask for it. Never invent it.
5. VISUAL SYSTEM

The paradox that governs everything: visually rich, technically lean.Boldness and richness come from imagery, scale, composition, and motion —all of which cost little in code. Never from features, widgets, orcomplexity. A site can be stunning on a phone with static HTML. "Basic"is a composition failure, not a technology failure.

Direction. Commit to ONE: Editorial / Minimal-Confident / Warm-Human /Technical-Precise / Bold-Expressive. Do not blend.

Typography.

    Distinctive core pairing: one characterful headline font, one highly readable body font that stays nearly invisible
    Contrast weight, not just size (e.g., 250 vs 700)
    Accent fonts for specific roles: a refined serif for pull quotes/editorial highlights, a characterful display font for hero accent words and CTAs, a monospace for technical details, prices, and metadata
    Fluid scaling with clamp() — headline sizes must be composed at 375px, not merely shrink; check that no line wraps into orphans on a phone
    ≤3 weights visible per viewport for core fonts; accent fonts used at their natural weights

Color.

    Background: warm neutral (never pure #fff or #000)
    Text: high contrast against background
    ONE accent color, for interaction and emphasis only — 90/10 discipline
    Monochrome is a valid, confident choice

6. MOTION

The page must feel alive — visibly, immediately, memorably. Motion is aquality requirement, not decoration. Two hard rules above all others:

    First-screen rule: something in the first viewport must visiblymove within one second of load, with no user input — verified at375px as well as desktop. A hero that sits still on load is a failed hero.

    The delight rule: every site needs ONE signature moment a visitorcould describe to someone afterward. It must be tied to the brand'sactual work — the visitor gets to DO the thing the business does, once.A piano workshop lets you hear the tuned note. A salon could let youstyle a head of hair. A sawmill lets you split a log.

    CALIBRATE THE REGISTER to the buying context — a judgment call wheregetting it wrong costs trust:
    Buying context	Register	Signature moment looks like
    Low-stakes, consumer, self-treat (salon, bakery, restaurant, daycare)	PLAYFUL — a toy or minigame is welcome	Hair-styling minigame, "build your box," cake customizer
    Trust-first, considered service (piano tuner, sawmill, contractor, dentist)	DEMONSTRATIVE — let them experience the result	Hear flat vs. tuned, before/after slider, "mill this log" simulator
    High-stakes B2B, committee purchase (IT implementation, legal, industrial)	PRESENTATIONAL — live demo, calculator, self-drawing diagram; zero games	Animated architecture diagram, savings counter, live dashboard

    The test: does this moment make THIS buyer trust the business MORE?A game on a salon site reads as fit; the same game on an enterpriseIT site reads as risk. When in doubt, dial toward DEMONSTRATIVE.Never: a game unrelated to the work, delight that mocks the buyer'sproblem, or delight that delays the actual information.

The floor — every page, both canvases:

    Entrance choreography: every section announces itself with staggered,varied motion — text by line or letter, images by clip or slow settle,labels by a drawn rule. (Uniform fade-in-up on everything remains banned.)
    Ambient response: hero and media layers respond to scroll (parallax,slow drift) and to load (slow settle or zoom). Transform and opacityonly, tuned to run smoothly on phone CPUs.
    Interaction feedback: every link, button, row, and control has adirectional or state-change response — hover on desktop, and atouch/active equivalent on mobile (hover carries no meaning on touch).Every focusable element has a visible, styled focus state.
    Data moves: numbers count to their values, meters respond to scroll,stamps land with weight — final values always in the HTML first.

The encouraged vocabulary (all cheap, all allowed, all transform/opacity/canvas — zero libraries): self-drawing SVG diagrams (pathLength +dashoffset), live canvas visualizations (waveforms, meters), scroll-linkedgauges, odometer numbers, letter-level headline effects, watermarkparallax, before/after audio or visual comparisons.

The ceiling:

    ONE signature delight per page; at most two quiet interactions besides.Ambient scroll response and micro-feedback don't count toward this limit.
    The signature moment must work by touch at 375px — designed for thephone first, enhanced on desktop. Not a desktop toy with a brokenmobile fallback.
    No autoplay carousels, no bounce/elastic easing on layout elements,nothing that delays comprehension more than ~600 ms.
    Loaders only if branded, under one second, shown once per session,never blocking content from the DOM, with a hard timeout escape.
    Everything respects prefers-reduced-motion: transforms off, countersrender final values, ambient motion off, canvas draws one static frame.

7. IMAGERY & ART DIRECTION

Photography is a primary design material, not decoration. Real images(Discovery 4.8) STRUCTURE the design — sections are built around images,never images squeezed into finished sections.

Use images at full confidence — starting on mobile:

    Full-bleed heroes and background images that set a section's entiremood — these work BEST on phones, where the screen is all image
    Oversized images that break the grid or bleed off the page edge
    Image-led sections: a photograph plus a caption, nothing else
    Alternate scale: huge, then small, then huge — on both canvases
    Full-width image moments between text sections as chapter breaks

Text over imagery:

    Must pass AA contrast on the phone, where text sits larger relative tothe image and the focal point is cropped tighter — verify at 375px,not only on the desktop mock
    Use a tuned scrim, a solid panel, or a type treatment with its ownweight — a designed element, consistent site-wide, never a black boxslapped on

Art direction system — one look, all images:

    Consistent aspect ratios and crop logic per image role — with theMOBILE crop art-directed first: deliberate object-position, subjectkept in frame at small sizes, never default-center by accident
    One color treatment direction (natural, warm-graded, duotone — pickper project), applied consistently, so ten photos read as one set
    Choose the moments. Two or three images used powerfully beat eightused evenly. Competing background photos are noise, not richness.

Integrity:

    The business's real photos only — never stock models standing in forreal people, spaces, or work
    Every image gets meaningful alt text, full performance treatment,correct format, and SEO handling (all in Section 16)

8. LAYOUT & COMPOSITION

There is deliberately NO list of approved layouts in this file — a patternlibrary would just become a new template every site converges on. Inventthe composition fresh, derived from the content itself. Two sites builtfrom this file should not resemble each other.

Derive, don't recall — starting at 375px. For every section:

    What is this content's nature? A process is a sequence — give itvisual order. One dominant idea deserves the whole width. Dense factswant columns and margins (columns arrive on desktop; the ORDER isdecided at mobile). Emotion wants air. Let meaning choose structure.
    Where does the weight sit? Left, right, center, bleeding off anedge. Rotate the answer between sections — on the phone too, where"edge" means full-bleed, offset indents, and asymmetric spacing.
    What's the size relationship? Every section needs one clearlydominant element and something deliberately small. Everything atsimilar scale is the definition of flat — on every screen size.
    What can break the frame? An image crossing the grid line, typecrossing a column, a background escaping its section. At least oneelement per page escapes containment — on mobile this is often thestrongest available move (full-bleed images, hanging text).
    What did the previous section do? The rotation rule: betweenevery pair of adjacent sections, change at least two of — alignment ·width · density · background treatment · scale · imagery role.No exceptions. Applied independently to the mobile flow AND thedesktop composition.

Per-page identity. Home, About, Services, and Contact each get theirown dominant compositional idea — on BOTH canvases. If two pages couldswap content and nobody would notice, the layouts have failed.

Whitespace is load-bearing. Generous space around one element is howyou make it feel important — and a phone screen needs this even morethan a desktop. Crowding is what makes a site look cheap.

The portrait test, twice: screenshot every section at 375px AND atdesktop, place each set side by side. In each set: no two sections looklike the same arrangement reused, yet all obviously belong to the samebrand. Fail either half, recompose.
9. THE TWO CANVASES — MOBILE BASELINE, DESKTOP EXPANSION

Mobile and desktop are two fully designed experiences of one system.Neither is the other's degraded copy.

Mobile baseline (the primary product):

    Single-thumb usability: primary CTA reachable in the thumb zone;tap-to-call, tap-to-email, and directions are real links, not text
    Touch targets ≥44×44px with real spacing between them
    Inputs ≥16px (so iOS doesn't zoom), labels always visible, single-columnforms, correct inputmode keyboards
    Navigation designed for touch: condensed nav opens with motion, closeson outside tap and Escape, never traps scroll; key destinations neverburied more than one tap deep
    No hover-dependent meaning anywhere; active/pressed states designed
    Sticky elements (header, bars) never eat the viewport or cover content;anchored sections get scroll-margin; respect safe-area insets
    Zero horizontal scroll at 320 / 375 / 414 / 768px — hunt downfixed-width elements, oversized type, negative margins, and unclippedfull-bleed children

Desktop expansion (the reward for a bigger screen):

    More whitespace, more asymmetry, larger imagery, multi-column momentswhere content earns them, ambient motion that phones skip or soften
    Hover states as progressive enhancement — never carrying uniqueinformation
    Desktop must never re-introduce content, sections, or functions themobile version lacks; it ARRANGES the same content more generously

The parity contract:

    Every function works on both canvases — the form may differ (hover →tap, sidebar → inline), the capability may not
    The signature delight moment works on both, designed mobile-first
    Feature-parity check: list every interactive element; each must appearin both breakpoint inventories

Verify on a real phone. DevTools emulation misses touch behavior,viewport quirks, safe areas, and real performance.
10. VOICE

Human does NOT mean simplified. Write at a full adult reading level.Specificity, rhythm, and opinion remove the AI smell — never dumbinglanguage down.

    Write like one specific person with opinions, not a committee
    Vary sentence length deliberately: short after long. Fragments allowed.
    Concrete nouns and real numbers over adjectives. "Loads in 400ms" beats"blazing fast."
    At least one memorable, quotable line somewhere on the site
    Read-aloud test: if you can't imagine a person saying it, rewrite it
    Microcopy carries personality: buttons, labels, empty states, footer

11. TRUST SECTIONS — TESTIMONIALS & FAQ

Both are expected and welcome. They fail only when they sound generated.

Testimonials:

    Real ones only. Never fabricate a quote or a person. If none exist, askor use other proof (specific guarantees, transparent process, verifiablenumbers).
    Attribution: full name, role, company — never "Sarah M."
    Real testimonials contain specifics: numbers, timeframes, a moment,often initial skepticism. Preserve that texture; don't polish realquotes into sameness.
    Vary lengths. Give the strongest the most space — not three equal cards.
    Include one that admits a limitation. Imperfection is credibility.

FAQ:

    Questions phrased the way customers actually ask them (mine realemails, reviews, and calls)
    First sentence of every answer IS the direct answer. Depth after.(Also an AEO requirement.)
    Vary answer length: some one line, some a short paragraph
    Include 1–2 brave questions competitors avoid: "What if I'm nothappy?", "Who is this NOT for?", "Why does it cost more than X?"
    No questions nobody asks ("Why are you so great?")
    FAQPage JSON-LD must mirror the visible text exactly

12. STRUCTURE & NARRATIVE

    Each page is a story: hook → specifics → proof → what working togetherfeels like → confident close. Not a stack of sales modules.
    Typical page set: Home, About (entity page — required for AEO), onepage per service, Proof/Work, Contact, 404. Adapt to the business —and don't add pages nobody needs.
    One topic per page. One idea per section.
    Accordions/tabs: content must exist in the DOM on load — use<details>/<summary> or equivalent, never click-only JS injection.On mobile, accordions are a legitimate primary pattern for longreference content — as long as the content is crawlable.

13. PAGE HEAD — EVERY PAGE, UNIQUE

Required on every page (illustration only — replace every value;the example domain is forbidden in real output):

<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>[Primary Value/Query] — [Brand]</title>              ← 30–60 chars, unique<meta name="description" content="...">                     ← 140–160 chars, unique<link rel="canonical" href="https://CANONICAL-DOMAIN/path/"><meta property="og:type" content="website"><meta property="og:url" content="https://CANONICAL-DOMAIN/path/"><meta property="og:title" content="..."><meta property="og:description" content="..."><meta property="og:image" content="https://CANONICAL-DOMAIN/social/page.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><script type="application/ld+json">{ ...structured data... }</script>

Rules:

    Homepage title = value proposition, never "Home" or "Welcome"
    og:url equals the canonical URL exactly
    Exactly ONE H1 per page stating the page's topic naturally; hierarchyh1→h2→h3 with no skipped levels
    Titles and descriptions hand-written per page — never templated

14. REQUIRED FILES

Favicon set: favicon.svg, favicon.ico (fallback), apple-touch-icon.png(180×180). Default framework icons never ship.

Custom 404 page:

    Returns real HTTP 404 status (never a soft 200) — configure the host
    On-brand design, on-voice copy, zero blame language
    Actually helps: links to home and 2–3 key pages
    Responsive and passing the full checklist itself — including on a phone

sitemap.xml: absolute canonical URLs only, one entry per real page,accurate lastmod, no redirects/404s/parameterized URLs.

robots.txt:

User-agent: *Allow: /Sitemap: https://CANONICAL-DOMAIN/sitemap.xml

llms.txt (lowercase LL — exact filename) at the site root:

# Business Name> One-paragraph factual summary: what this business does, who it> serves, where, and what makes it different.## Pages- [Home](https://CANONICAL-DOMAIN/): one-line description- [Services](https://CANONICAL-DOMAIN/services): one-line description- [Contact](https://CANONICAL-DOMAIN/contact): phone, address, hours## Facts- Founded / Service area / Pricing approach / Hours

Machine files are for machines. robots.txt, sitemap.xml, and llms.txtare never linked in human-facing UI — no footer links, no nav links.
15. STRUCTURED DATA

JSON-LD, valid, complete — with REAL values, never invented:

    LocalBusiness (or precise subtype — Dentist, Restaurant, Plumber…):name, @id, url, telephone, image, PostalAddress, geo,openingHoursSpecification, priceRange, sameAs. Use Organization ifthere is no physical/service location.
    BreadcrumbList on every subpage, matching the visible breadcrumb(last ListItem omits "item")
    FAQPage wherever an FAQ exists, mirroring visible text exactly

Schema with fake or empty fields is worse than no schema. Validate all.
16. ON-PAGE SEO & IMAGE OPTIMIZATION

Links and headings:

    Internal links: descriptive anchors ("see our commercial roofingwork," never "click here"); every page ≤3 clicks from home; noorphans — every sitemap URL is linked from somewhere
    Visible breadcrumbs on all subpages (home excluded), current page asnon-link text, matching BreadcrumbList schema
    Alt text on every meaningful image: describe what's shown AND whyit's there ("Chef Marcos unloading produce at the ferry buildingdock") — never "image of…", never keyword stuffing; decorativeimages get alt=""

Image formats — WebP mandatory:

    Every content image ships as WebP (or AVIF). JPEG and PNG do notship to browsers. If the source is JPG/PNG, CONVERT it beforedeployment (sharp, cwebp, Squoosh, or the build pipeline) — keep theoriginal only as an archival source, never the served file. If apipeline can't convert, pick another pipeline; skipping conversionis not an option.
    Sanctioned exceptions for platform compatibility only: og:image(JPG/PNG — many social platforms don't render WebP previews) andfavicon.ico.
    Serve display-appropriate dimensions with srcset sized to actual use —never a 3000px file displayed at 400px (and never a desktop-sizedfile served to a phone)
    width/height on every image (no CLS), lazy below fold, hero eager +fetchpriority="high". Budgets: hero ≤250 KB, every other image≤150 KB. Every container reserves its space (dimensions plus abackground tone) so nothing flashes or shifts while loading.

Image SEO:

    Descriptive filenames BEFORE upload: "white-oak-stack-rhinebeck.webp",never "IMG_4032.webp" — descriptive, not keyword-stuffed
    Captions and surrounding copy give images context; captions dodouble duty for readers and crawlers
    Content-bearing images included in the sitemap as image entries
    The primary brand image referenced in LocalBusiness/Organizationschema (the image field)
    Lazy-loading must not hide images from crawlers — real srcattributes, never JS-only injection

17. AEO — ANSWER ENGINE OPTIMIZATION

The site must be accurately quotable by AI assistants:

    Answer-first: each section's first sentence answers its question
    Entity clarity: the About page states plainly what the businessIS, who it serves, and where — one paragraph an AI could quote verbatim
    Citable specifics: real numbers, dates, names, places
    Question-formatted H2s where natural ("How much does X cost?")
    Consistent NAP everywhere: pages, footer, schema, llms.txt
    Semantic HTML landmarks — clean parse in, clean answer out
    llms.txt present and accurate
    Content in initial HTML, not locked behind JS-only rendering

18. ENGINEERING RESTRAINT — BUILD ONLY WHAT'S NEEDED

The engineering ceiling: the simplest implementation that reachesproduction quality. Complexity must be justified or it doesn't ship.(This constrains code and features only — Section 5's paradox: visualand motion richness are cheap, so never cut imagery, composition, oranimation to save complexity, and never add complexity to buy richness.)

Don't build:

    A framework SPA for a brochure site — static HTML/CSS + one smallvanilla JS file is the default stack. Use a framework only when thesite genuinely requires it, and keep pages prerendered/static sotitles, meta, and JSON-LD exist in the initial HTML
    Carousels where a static row would do; mega menus for sites undersix pages
    Dark-mode toggles, chat widgets, newsletter modals, cookie-toolsprawl — anything not asked for
    Custom CMS/admin for content that changes a few times a year
    A component abstraction used once
    Animation, slider, or icon libraries — CSS transitions and inlineSVG (only icons actually used) do it

The removal test: for every dependency, feature, and script, ask"what breaks if this is gone?" If the answer is "nothing," remove it.

Caps:

    ONE signature delight per page + at most two quiet ones (Section 6);ambient scroll response and hover/active feedback don't count
    A curated font palette: core headline + body pair, plus 2–3 accent fonts for pull quotes, hero words, CTAs, and technical details — each with a defined role; 1 accent color, 1 art-direction treatment system across the whole site — consistency is engineering restraint
    Marketing-site dependencies: ideally zero; hard ceiling three, eachnamed and justified
    Initial JS ≤150 KB gzipped (target under 100 KB); fonts self-hosted, subsetted, font-display: swap; total font files ≤6 (core pair + accent fonts)
    Core Web Vitals, measured on mobile: LCP < 2.5s · CLS < 0.1 ·INP < 200ms

Source hygiene:

    Semantic HTML5 landmarks; design tokens as CSS custom properties;consistent spacing scale
    CSS organized mobile-first (base styles = small screen; min-widthqueries add, never subtract)
    No dead code, no commented-out blocks, no !important, no console.logs
    Verify against the PRODUCTION build, never the dev server
    React/Vite specifically: the tab must show the real title and favicon— "Vite + React" and the Vite logo are Section 3 bans

Done is a design decision. A fast, plain, well-typeset page beats aclever fragile one. If a feature needs a paragraph to justify, cut it.
19. DOMAIN & NO PLACEHOLDERS

Domain:

    Confirm canonical form (https + apex OR https + www — pick one) anduse it EXACTLY in: canonical tags, og:url, sitemap.xml, robots.txt,llms.txt, JSON-LD url/@id, and the footer
    Host config: http→https and non-canonical→canonical 301 redirects;unknown routes serve the 404 page with status 404
    Nothing in shipped code references localhost, staging, or file://

None of these may exist anywhere in the output:

    lorem ipsum or filler text; "Your Name," "123 Example St," 555 numbers
    Invented addresses, hours, or statistics — request real data instead
    Stock photos of models pretending to be the team
    "Your text here" alt attributes; untitled pages
    Gray-box OG images; TODO/FIXME comments; dead code

20. SHIP GATE — VERIFY BY INSPECTION, NOT ASSUMPTION

Fix and re-verify on any failure. Deliver nothing until every box checks.

MOBILE — verified first, on a real phone□ Checked at 320 / 375 / 414 / 768px: zero horizontal scroll, zero  overlap, zero broken sections□ Mobile portrait test passed: composed, not stacked — hierarchy,  scale contrast, and rotation rule survive at 375px□ Touch targets ≥44px; every interaction works by touch, including the  signature delight; nav opens/closes cleanly, never traps scroll□ Tap-to-call/email/directions live; forms single-column, correct  keyboards, inputs ≥16px; safe areas respected□ First-screen motion fires on the phone; Core Web Vitals pass on  throttled mobile□ Content parity confirmed: nothing exists on desktop that is missing  on mobile

DESIGN, LAYOUT, IMAGERY & MOTION□ Substitution test passed (name swap breaks the site)□ Zero banned words/constructions (search the source)□ One committed visual direction; signature + ≤2 quiet interactions□ First screen visibly animates on load, zero user input□ ≥1 signature delight tied to the brand's actual work — describable  in one sentence by someone who saw the page once□ Delight register calibrated to the buying context (playful /  demonstrative / presentational) — nothing game-like where a game  would cost trust□ Motion floor met: varied entrance choreography per section, ambient  scroll/load response on media, hover AND touch feedback on every  control, counters animate — all reduced-motion safe□ Loader (if any) branded, <1s, once per session, hard timeout□ Portrait test passed on BOTH canvases; rotation rule honored;  composition derived from content, not recalled□ Every page has its own dominant compositional identity, both  breakpoints□ ≥1 element breaks containment per page; weight/scale varies□ Images used at bold scale — full-bleed or oversized where content  supports; mobile crops art-directed, none reduced to filler thumbs□ Text over imagery passes AA on the phone with a designed, consistent  treatment□ One art-direction system: crops, ratios, color treatment consistent;  real photos only□ ≥1 memorable, quotable line; ≥1 moment of personality□ Exactly one H1 per page; no skipped heading levels□ Unique title + meta description on EVERY page (list and check all)□ Testimonials real, attributed, specific; FAQ answers open direct;  ≥1 brave question□ Alt text on every meaningful image

TECHNICAL — checked in the production build□ Tab shows real title + real favicon on every page (no Vite/React)□ Console: 0 errors, 0 warnings, 0 failed requests — every page, the  404, and after interacting with nav/forms/accordions — desktop AND  mobile□ No .map files or sourceMappingURL comments anywhere□ Removal test passed: every dependency and feature justified; JS in  budget□ Every content image is WebP/AVIF — JPG/PNG sources CONVERTED, not  skipped (og:image and favicon.ico excepted)□ Hero image ≤250 KB, all others ≤150 KB; containers reserve space —  no flash, no shift on load□ Image filenames descriptive; image entries in sitemap; no JS-only  image injection□ Machine files (robots/sitemap/llms.txt) NOT linked in human UI□ Canonical = og:url = sitemap = llms.txt = schema URLs — exact  canonical domain, all https□ robots.txt references sitemap; every sitemap URL resolves 200□ llms.txt present, lowercase filename, factually accurate□ All JSON-LD validates; LocalBusiness complete and real; FAQ schema  mirrors visible text; breadcrumbs visible + schema on subpages□ 404 serves HTTP 404 and passes this checklist itself□ OG image 1200×630, renders in a share validator□ All internal links resolve; AA contrast; keyboard navigable;  reduced-motion respected□ Zero placeholders anywhere in the output
21. FINAL STANDARD

If a stranger lands on this site — on their phone, on the bus, with onethumb and four seconds — they should think a competent human studio builtit, understand exactly what this business does, who it's for, and whyit's different, and want to stay. Then they should open it on a desktopand find the same site, breathing larger. It should feel alive because ofits motion, rich because of its images and composition, lean because ofits engineering — and it should hold all of it in the palm of a hand.That is the bar. Every rule above exists to reach it.

22. FIELD LESSONS — VIVA HAIR SALON BUILD (APPLY TO EVERY NEW BUILD)

These are corrections the client actually asked for. Treat them as additions to the rules above, not alternatives.

Copy — what got rejected and why

    Poetic/riddle phrasing reads as weird to business owners. "The shampoo here is a rumour that spreads on its own", "Four chairs' worth of work, listed plainly", "One shoplot, easy to spot" — all rejected. The spoken-aloud test has a stricter sibling: could you say this sentence to a walk-in customer without feeling silly?
    Write what-it-is first: "Cuts, colour and treatments in Taipan. Every visit starts with a proper wash." Then personality in small doses, never in the H1 or the section label.
    Do NOT theme the whole site on one piece of trivia. The Diva→Viva rename appeared in the hero, story section, gallery caption and footer — the client wanted it mentioned once. Rule: brand pivots get ONE paragraph on the About page and an invisible alternateName in schema, nothing else.
    Stat labels must stand alone grammatically: "0 upsell attempts", not "0 hard selling, ever".
    Review sections: keep quotes verbatim (light trims of filler are fine), and keep the LAYOUT boring-tidy — uniform cards, consistent attribution. Uneven bordered rows read as "messy".
    Prices must be traceable. RM75 came from a 3-year-old review; keep it but confirm with the client. When unquotable, write "Quoted before we start", never "quoted in the chair" on every row.

Header, contrast, spacing

    The nav is never transparent-over-photo. Solid header background on every page and every scroll state — transparent headers made "Services/About" unreadable and got rejected.
    Small gold-on-cream text fails in practice even when it passes AA. Darken the accent token for text use (#8A6110-style), keep the brighter gold for dark backgrounds only.
    Decorative extras the client finds hard to read (vertical scroll indicators, faint letterspaced microcopy) get removed, not restyled. If it needs a shadow to survive, question it.
    Oversized vertical section padding reads as unfinished/empty. Cap desktop section padding around 5–6rem; scan the full-page screenshot for "blank band" feeling between sections.

JavaScript — the broken-slider lesson

    After ANY refactor, run node --check AND click-test every interactive element. Dropping one var declaration (dragging) silently killed the before/after slider: strict-mode ReferenceError on pointerdown, no console output the client would notice.
    In drag/pointer handlers, cache getBoundingClientRect() at pointerdown and never measure inside pointermove — per-move layout reads make the widget feel sluggish.
    Reveal-on-scroll animations must never permanently hide content: IntersectionObserver plus a timed sweep fallback (~2.8s) that reveals everything regardless. Verify with a full-page screenshot and with JS disabled.

Third-party embeds (Cal.com)

    What the client sees in the embed — account name ("abc corp"), event name, hover tooltips ("Book a call") — comes from the CLIENT's Cal dashboard, not from site code. Deliver a config checklist: account display name, event type name, timezone, durations, slug.
    Never give the embed container a fixed height; use min-height and let the widget auto-size, or short states leave large dead space.
    Inline embeds may not load over file:// — always test via local server or hosting before telling the client it works.

Rendering and evidence

    Full-page screenshot CLIs do not scroll: lazy images vanish and scroll reveals stay hidden. Before blaming the CSS, distinguish render artifact from real bug (the fallback sweep in 6 fixes the reveal case).
    Client "before/after" photos are often collages/grids. Crop the pairs programmatically and autocrop white margins; check crops for bleed from adjacent grid cells before shipping.

Workspace layout

    One folder per project inside a parent workspace folder: <workspace>/websites/<ProjectName>/ containing the client's raw files, the site folder, and renders. Never mix two projects' files in one folder; never dump site files loose in the workspace root.

23. PITCH WORKFLOW — SOURCING CLIENTS & SHIPPING DEMO SITES (LESSONS ROUND 2)

Sourcing local-business pitch clients

    Research on Google Maps in a real browser (it passes the bot walls that block curl and plain fetch). Search "<service> <area>", then for each candidate open the place panel and collect: rating + review count, address, phone, weekly hours, the "Website" link (an Instagram or Facebook link instead of a real website = a lead), photo count, and Google's own "mentioned in X reviews" service stats.
    Check recent reviews BEFORE pitching — if the first screen of reviews shows fresh 1-star complaints (ignored walk-ins, "overpriced"), the demo site cannot fix their reputation; skip or deprioritise that candidate.
    Favour businesses with 300+ photos on their listing — that's an owner who invests in presentation, and your demo will have real material to build with.
    Booking-method discovery doubles as pitch material: if they book by WhatsApp, build the site WhatsApp-first; if they already use Fresha or Cal.com, integrate that instead of a contact form.

Harvesting the client's own photos from their Google listing

    Open the listing's photo gallery lightbox, scroll the thumbnail filmstrip with anchored mouse-wheel events to lazy-load it, then collect unique photo tokens from BOTH src/srcset attributes AND computed background-image of every element (Maps loads thumbnails as background-images). Reconstruct full resolution as https://lh3.googleusercontent.com/gps-cs-s/<token>=w1400.
    VERIFY EVERY EXPORTED IMAGE VISUALLY before use. A download log said "success" while one file was a brick clock tower instead of a utility pole, and another batch was mislabelled entirely. Build a contact sheet of every candidate and eyeball it against the topic before placing images into sections.
    These are the client's own listing photos — fine for a pitch demo, but when a client says yes, get their explicit OK to keep using listing/Instagram photos on the live site.
    Portrait smartphone shots are normal and authentic for salons — design galleries as masonry columns or normalised fixed-ratio grids instead of failing on non-landscape photos.

The weekly-hours trick

    Google Maps place pages embed per-day "copy open hours" buttons whose aria-labels contain the full hours ("Saturday, 10:30 am to 7:30 pm, Copy open hours"). Click the hours row via DOM evaluate (pointer clicks get blocked by Maps' overlay), then scrape those aria-labels — exact weekly hours without inventing anything. Watch for holiday rows ("Hours might differ") and closed-day patterns that differ per salon (Tuesday is the common salon closed day in Malaysia; verify per listing).

Cal.com embeds across multiple client sites

    The same demo Cal account can power every demo site — each site is a separate domain, so identical namespaces and div ids never collide. Paste the client's snippet verbatim.
    Give the embed container a min-height (≈560px) and never a fixed height — short states otherwise leave a large dead panel.
    Everything visible inside the widget comes from the CLIENT's Cal dashboard, not your code: the account display name ("abc corp"), the event name, and the event's location field. Deliver a checklist per client: rename account, rename event, set the correct location address and timezone. These will be wrong on every new demo otherwise.

Client feedback rounds — expect taste to iterate

    Colour flips on the hero word will happen ("make BUSINESS blue", then "only BUSINESS", then "make SOLUTIONS blue but brighter"). Keep every hero/accent colour as a CSS variable and scope words with spans so each flip is a one-line change. Add a brightness step (--accent-bright) for accent-on-dark-background text — the dark accent is unreadable on navy or on photos.
    Clients reject white boxes, faint labels, and low-contrast faded text fast. When they say a colour "blends in", raise contrast immediately rather than defending it.
    Highlight key phrases in body copy with the display font + brand colour — clients like emphasis, and it reads as designed rather than flat.

Regressions to guard against

    When a section sets `color: #fff`, every nested white card inherits it — white quote text on a white card is invisible. Always set text colour on the component, not just the section.
    A `.in` reveal state must reset EVERY property the hidden state set (including clip-path). Dropping one clips headlines permanently at 1.25em.
    When replacing deployed images, cache-bust the URLs (?v=2) or clients see stale photos for up to 10 minutes and report "you didn't fix it".
    Full-page screenshot renders do not scroll: eager hero images prove asset paths, blank boxes below the fold are the known lazy-load artifact — verify each suspect asset by HTTP status before rewriting code.
    Judges and clients misread thin letterspaced uppercase at low opacity ("UBIQUITI" read as "UBQUITI"). Verify spelling in source before changing anything; then raise the opacity anyway.
    Image export scripts must be cross-checked against every filename the HTML references — two gallery files were referenced but never exported and shipped as broken icons.
    Marquee edge-fade masks read as dark smudges on light bands. On light UI, prefer solid band edges plus slower scroll and pause-on-hover instead of fade masks.
24. ROUND-3 LESSONS — AUSTINN, KLANG SESSION & REGIONAL SEO

Review attribution — the hard rule

    NEVER reuse a review quote across clients. During the Klang Session build, a kids-haircut quote from a Viva review almost shipped as a Klang Session testimonial. After scraping, cross-check every quote against the salon's own scraped review text; discard anything not present in that scrape.
    Perfect-rating salons (5.0 across 340) exist — the pitch angle writes itself ("a perfect 5.0"), and review tone tends to be personal: stylist named, quoted warmly. Match the design register: appointment-only + personal = editorial serif, calm palette, manifesto band.

Region-tailored SEO (local + global)

    Every client schema gets geo (lat/long taken from the Maps place URL) and areaServed as an array: [neighbourhood, city, district, Klang Valley, Selangor]. Local keywords first, Klang Valley as the global tier.
    Meta descriptions carry "(Klang Valley)" after the city — it reads naturally and catches the broader searches.
    Titles stay within 60 characters: service + district + city beats keyword stuffing.

Dark luxe skins — contrast discipline

    Dark-on-dark hovers are the white-box bug in another costume: emerald-deep background with inherited dark text is unreadable. On dark skins, button hover = cream background + ink text.
    Portrait listing photos will dominate a hero if allowed. Cap the hero image (max-height around 480px on mobile; the image column never taller than the text) — the client complained the photo was "really big and you can't read the words".
    Before/after photos must not be cropped by fixed aspect ratios — a 50/50 before-after pair loses its "after" half to object-fit: cover. Use masonry columns for galleries that contain pairs.

Bilingual copy is design material

    When an owner posts in two languages (e.g. Chinese taglines about quality taking time), the untranslated line is authentic texture — use it as a styled pull-quote beside the English translation. Do not translate it away.
    Match script to font: a Korean serif (Gowun Batang) signals the salon's actual identity better than a generic European serif.

Cal.com embeds work for appointment-only salons too

    Pair the calendar with a "call or WhatsApp if you prefer to talk" line so both booking styles are served.
    After adding a Cal booking section, remove any redundant CTA band it replaces — duplicate appointment bands shipped once and had to be removed.
The contact section carries an embedded Google map

    Every contact/visit section ships with an embedded Google Maps iframe, not just a text link: <iframe src="https://www.google.com/maps?q=<address query>&output=embed" ...> — works without an API key.
    Insert it as a full-width block after the contact columns (wrap it in the same .wrap container), with title="Google Maps location — <business>, <area>" for accessibility.
    Do NOT set loading="lazy" on map iframes — they render blank in static captures and add nothing to performance (one small iframe per page).
    When inserting programmatically, watch for duplicated </section> tags — the insertion string must not re-close the section.
    CSS: .map-embed { margin-top: 2.2rem } .map-embed iframe { width: 100%; height: 340px; border: 0; display: block; border-radius: 8px }

