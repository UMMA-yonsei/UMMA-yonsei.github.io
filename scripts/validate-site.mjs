import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const requiredFiles = [
  'index.html',
  'details/assembled-robot.html',
  'details/assembled-umma.html',
  'details/cad-gallery.html',
  'details/control-hardware.html',
  'details/gripper.html',
  'details/mobile-app.html',
  'details/operation-videos.html',
  'details/system.html',
  'details/umma-hardware.html',
  'details/umma-ws.html',
  'details/web-frontend.html',
  'src/styles/site.css',
  'src/scripts/site.js',
  'public/assets/brand/umma-logo-dark.svg',
  'public/assets/photos/umma-appearance.jpg',
];

const requiredDirs = [
  'public/assets/photos',
  'public/assets/videos',
  'public/assets/slides',
  'public/assets/technical',
  'public/assets/cad',
  'public/assets/diagrams',
];

const requiredSections = [
  'overview',
  'system',
  'hardware',
  'software',
  'demo',
  'media',
  'team',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `Missing required file: ${file}`);
}

for (const dir of requiredDirs) {
  assert(existsSync(join(root, dir)), `Missing required directory: ${dir}`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'src/styles/site.css'), 'utf8');
const js = readFileSync(join(root, 'src/scripts/site.js'), 'utf8');
const detailPages = [
  'details/assembled-robot.html',
  'details/assembled-umma.html',
  'details/cad-gallery.html',
  'details/control-hardware.html',
  'details/gripper.html',
  'details/mobile-app.html',
  'details/operation-videos.html',
  'details/system.html',
  'details/umma-hardware.html',
  'details/umma-ws.html',
  'details/web-frontend.html',
].map((file) => readFileSync(join(root, file), 'utf8'));
const allMarkup = [html, ...detailPages].join('\n');
const cardDetailPages = [
  'details/system.html',
  'details/assembled-robot.html',
  'details/gripper.html',
  'details/umma-hardware.html',
  'details/control-hardware.html',
  'details/umma-ws.html',
  'details/web-frontend.html',
  'details/mobile-app.html',
  'details/assembled-umma.html',
  'details/cad-gallery.html',
  'details/operation-videos.html',
];

for (const section of requiredSections) {
  assert(html.includes(`id="${section}"`), `Missing section id: ${section}`);
  assert(html.includes(`href="#${section}"`), `Missing nav link for: ${section}`);
}

assert(!/timeline/i.test(html), 'Timeline content should not be present');
assert(!/timeline/i.test(js), 'Timeline script content should not be present');
assert(!/market|business|feasibility|경제|시장|필요성/i.test(allMarkup), 'Non-technical pitch content leaked into markup');
assert(!/넣습니다|추가합니다|Replace|Add renders|Add operation|slot|placeholder|Page Role|이 웹사이트는 프로젝트|상위 허브/i.test(allMarkup), 'Internal build guidance leaked into visible markup');
assert(html.includes('data-click-depth="3"'), 'Three-click access marker is missing');
assert(html.includes('aria-label="Primary navigation"'), 'Primary navigation needs an aria-label');
assert(html.includes('aria-label="Media filters"'), 'Media filters need an aria-label');
assert(!/Quick Access|id="documents"|href="#documents"|document-grid|document-card/i.test(html), 'Quick Access and Documents should not be visible on the main page');
assert(!/Contributors|Robot and Mechanisms|Repository Structure|Technical Media|System Map/i.test(html), 'Main section headings should use a single plain title');
assert(!/<p class="eyebrow">(Architecture|Hardware|Software|Media|Team)<\/p>/i.test(html), 'Main sections should not show duplicate eyebrow titles');
assert(!/Creative Product Design 2026 Spring, Section 1 Team 1/i.test(html), 'Team subtitle should not be visible on the main page');
assert(html.includes('<h2 id="system-title">System</h2>'), 'System section needs a single System heading');
assert(html.includes('<h2 id="hardware-title">Hardware</h2>'), 'Hardware section needs a single Hardware heading');
assert(html.includes('<h2 id="software-title">Software</h2>'), 'Software section needs a single Software heading');
assert(html.includes('<h2 id="demo-title">Demo</h2>'), 'Demo section needs a single Demo heading');
assert(html.includes('<h2 id="media-title">Media</h2>'), 'Media section needs a single Media heading');
assert(html.includes('<h2 id="team-title">Team</h2>'), 'Team section needs a single Team heading');
for (const page of cardDetailPages) {
  assert(html.includes(`href="${page}"`), `Missing card detail link: ${page}`);
}
assert(!/details\/(hardware|software|media)\.html/i.test(html), 'Main cards should not link to theme-based detail pages');
assert(!existsSync(join(root, 'details/hardware.html')), 'Theme-based hardware detail page should be removed');
assert(!existsSync(join(root, 'details/software.html')), 'Theme-based software detail page should be removed');
assert(!existsSync(join(root, 'details/media.html')), 'Theme-based media detail page should be removed');
assert(!/<span>.*Detail<\/span>/i.test(allMarkup), 'Detail pages should not show a second header title');
assert(!/<section class="detail-hero">[\s\S]*?<p class="eyebrow">/i.test(allMarkup), 'Detail pages should use one visible title only');
assert(html.includes('class="team-card"'), 'Expanded team cards are missing');
assert((html.match(/<h3>[^<]+<br><span class="team-name-en">/g) || []).length === 5, 'Team names should line-break between Korean and English');
assert(!/<dt>School<\/dt>|<dt>Department<\/dt>|<dt>Year<\/dt>/i.test(html), 'Team cards should not use School/Department/Year labels');
assert(!/<dl>|<\/dl>|<dt>|<\/dt>|<dd>|<\/dd>/i.test(html), 'Team cards should use a single strict affiliation line, not definition lists');
assert((html.match(/class="team-info"/g) || []).length === 5, 'Each team member needs one strict team-info line');
assert((html.match(/class="person-links"/g) || []).length === 5, 'Each team member needs social icon links');
assert(!/<a[^>]*>(GitHub|Homepage|LinkedIn)<\/a>/i.test(html), 'Team social links should use icons instead of visible text');
assert((html.match(/<svg class="social-icon" aria-hidden="true">/g) || []).length === 15, 'Each team social link should render as an icon');
assert(html.includes('id="icon-github"'), 'GitHub logo symbol is missing');
assert(html.includes('id="icon-homepage"'), 'Homepage logo symbol is missing');
assert(html.includes('id="icon-linkedin"'), 'LinkedIn logo symbol is missing');
assert(html.includes('href="https://www.linkedin.com/in/sunghyun-park-a141bb332/"'), 'Park Sunghyun LinkedIn link is missing');
assert(html.includes('href="https://www.linkedin.com/in/jeonhyungjoon/"'), 'Jeon Hyungjoon LinkedIn link is missing');
assert(html.includes('Yonsei University Mechanical Engineering & Computer Science 21'), 'Strict team-info format is missing for ME/CS members');
assert(html.includes('Yonsei University Mechanical Engineering 21'), 'Strict team-info format is missing for ME members');
assert(html.includes('Yonsei University Astronomy & Mechanical Engineering 22'), 'Strict team-info format is missing for Astronomy/ME member');
assert(!/Mechanical CAD|Result Capture|data-filter="ui"|details\/software\.html#hardware/i.test(html), 'Removed or moved cards are still present');
assert(html.includes('href="details/umma-hardware.html"'), 'UMMA-Hardware card should live in Hardware');
assert(!/<section class="section" id="software"[\s\S]*?<h3>UMMA-Hardware<\/h3>[\s\S]*?<\/section>/i.test(html), 'UMMA-Hardware should not remain in Software');
assert(html.includes('Granular jamming mechanism'), 'Gripper card needs granular jamming mechanism wording');
assert(html.includes('형상 적응형 소프트 그리퍼'), 'Gripper card needs adaptive soft gripper wording');
assert(html.includes('data-detail-card'), 'Detail-card affordance markers are missing');
assert(allMarkup.includes('github.com/UMMA-yonsei'), 'GitHub repository links are missing');
assert(css.includes('color-scheme: dark'), 'Dark color scheme declaration is missing');
assert(css.includes(':focus-visible'), 'Visible focus styles are missing');
assert(css.includes('--shadow-soft: 0 14px 34px rgba(0, 0, 0, 0.02);'), 'Soft shadow opacity must be reduced to 2%');
assert(/h1,\s*h2,\s*h3[\s\S]*line-height:\s*1\.2/.test(css), 'Heading line-height must be 1.2');
assert(/p,\s*li[\s\S]*line-height:\s*1\.6/.test(css), 'Body line-height must be 1.6');
assert(/\.team-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/.test(css), 'Team grid must place five cards horizontally on desktop');
assert(!/box-shadow:[^;]*rgba\([^)]*,\s*0\.(0[5-9]|[1-9])\)/.test(css), 'Box shadows must stay at or below 4% opacity');
assert(!/border:\s*1px\s+solid\s+var\(--line\)/.test(css), 'Avoid heavy all-around borders');
assert(html.includes('https://www.youtube.com/embed/kt8CM3tcnwI'), 'Third presentation YouTube embed is missing');
assert(html.includes('title="UMMA 3rd presentation video"'), 'YouTube embed needs an accessible title');
assert(html.includes('https://www.youtube-nocookie.com/embed/mRAA-HTJxhM'), 'Door Opening demo YouTube embed is missing');
assert(html.includes('title="UMMA door opening demo"'), 'Door Opening demo embed needs an accessible title');
assert(js.includes('filterMedia'), 'Media filtering behavior is missing');

console.log('Site validation passed');
