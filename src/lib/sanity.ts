import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'fy0w8fxa',
  dataset: 'production',
  apiVersion: '2021-10-21',
  useCdn: true,
});

export interface Post {
  title: string;
  slug: string;
  date: string;
  tags: string;
  excerpt: string;
  body: PortableTextBlock[];
}

export interface PortableTextBlock {
  _type: string;
  style?: string;
  children?: Array<{ text: string; marks?: string[] }>;
}

export function ptToHtml(blocks: PortableTextBlock[]): string {
  return (blocks || []).map(b => {
    if (b._type !== 'block') return '';
    const html = (b.children || []).map(s => {
      let t = (s.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if ((s.marks || []).includes('strong')) t = `<strong>${t}</strong>`;
      if ((s.marks || []).includes('em'))     t = `<em>${t}</em>`;
      return t;
    }).join('');
    if (!html.trim()) return '';
    const s = b.style || 'normal';
    if (s === 'h2') return `<h2>${html}</h2>`;
    if (s === 'h3') return `<h3>${html}</h3>`;
    if (s === 'blockquote') return `<blockquote>${html}</blockquote>`;
    return `<p>${html}</p>`;
  }).join('');
}

export const FALLBACK_POSTS: (Omit<Post, 'body'> & { content: string })[] = [
  {
    slug: 'ai-coding-year-one',
    title: 'A year of AI-assisted coding: what actually got faster',
    date: 'Aug 2026',
    tags: 'workflow · ai',
    excerpt: "Twelve months of using AI assistants for real production work — mobile, backend, infra. Here's what actually moved the needle, and what stayed exactly the same.",
    content: `<p>A year ago I started using AI coding assistants seriously — not just for boilerplate, but across the full stack of things I build: React Native apps, Node backends, PHP services, infrastructure. Here's what I actually found after twelve months of real use.</p>
<h2>What genuinely got faster</h2>
<p><strong>Scaffolding and boilerplate.</strong> New API endpoints, migration files, UI components — the mechanical parts of building disappeared. What used to take an hour now takes five minutes. This alone is worth the price of any subscription.</p>
<p><strong>Debugging unfamiliar code.</strong> Dropping a stack trace or an unfamiliar codebase into context and getting a working explanation is genuinely useful. I debug faster in code I don't own, and faster in my own code when I haven't touched it in months.</p>
<p><strong>Context switching across languages.</strong> I work across React Native, Node, PHP, and occasionally Swift. The AI handles the syntax differences so I can stay in the problem space instead of spending ten minutes remembering how PHP handles array destructuring.</p>
<h2>What didn't change</h2>
<p>Architecture decisions still take the same amount of thinking. The AI is confident about a lot of things it shouldn't be confident about. Knowing when to push back — and noticing when the generated code is subtly wrong — requires the same engineering judgement it always did.</p>
<p>Code review got <em>more</em> important, not less. Fast generation means fast accumulation of technical debt if you're not paying attention. Every time you accept a block of code you don't fully understand, you're borrowing against your future self.</p>
<h2>The honest number</h2>
<p>I ship roughly 2–3× more per month than before. Some of that is AI. Some of it is that I've gotten better at scoping work and saying no to things that don't matter. Hard to separate the two — and I suspect that's the point.</p>`,
  },
  {
    slug: 'boring-infrastructure',
    title: 'Keeping infrastructure boring on purpose',
    date: 'Jul 2026',
    tags: 'devops · reliability',
    excerpt: "The best infrastructure is the kind nobody talks about. Getting there requires making a deliberate, ongoing choice to be boring — and saying no to a lot of interesting things.",
    content: `<p>The best infrastructure is the kind nobody talks about. No incidents, no surprises, no 2am pages. Getting there isn't about using the right tools — it's about making a deliberate, ongoing choice to be boring.</p>
<h2>What boring looks like</h2>
<p>Boring infrastructure uses managed services instead of self-hosted where the trade-off makes sense. It uses the same three deployment patterns across every service. It has runbooks that actually work because someone ran them last month, not last year.</p>
<p>It also means saying no to interesting things. A new database engine, a custom caching layer, a clever optimization — all of these are interesting problems. Most of them are also unnecessary. The interesting problem you take on today is the incident someone else is debugging at 3am next year.</p>
<h2>The cost of interesting</h2>
<p>Every non-standard component in your stack is a component someone has to understand under pressure. Interesting choices compound: each one adds cognitive overhead to everyone who touches the system, raises the floor for new hires, and creates another thing that can fail in a novel way.</p>
<p>The question I ask before adding anything to the stack: "Is this interesting because it's genuinely the right tool, or because I find it interesting?" The answer is usually the second one.</p>
<h2>How I keep things boring</h2>
<p>Default to managed services. Choose the boring option when options are otherwise equal. Document decisions — not what you chose, but <strong>why</strong>, so the next person knows what you ruled out. Run your own runbooks on a schedule. Keep the alert threshold high and the on-call rotation short.</p>
<p>The product should be interesting. The infrastructure should not.</p>`,
  },
  {
    slug: 'anti-brain-rot-in-public',
    title: 'Building an anti brain-rot app in public',
    date: 'Jun 2026',
    tags: 'product · mobile',
    excerpt: "TikTok figured out something real about human attention. The format works. I'm borrowing it and pointing it somewhere more useful — here's how it's going.",
    content: `<p>I've been building an app I'm calling "anti brain-rot" — a vertical short-feed app, structurally similar to TikTok, but optimized for things worth knowing instead of things that just feel good to watch.</p>
<h2>The premise</h2>
<p>Short-form video figured out something real about human attention. The dopamine loop, the infinite scroll, the autoplay — it works. The problem isn't the format. The problem is what gets optimized for. Current apps optimize for time-in-app, which in practice means maximizing engagement at the cost of everything else.</p>
<p>You can borrow the same format and optimize for something different. A feed that makes you a little sharper instead of a little duller.</p>
<h2>The stack</h2>
<p>React Native on the client. The core feed experience is a vertical swipe — card up, reveal answer, swipe to next. The interactions are simple by design; the content is where the work is.</p>
<p>The backend runs on infrastructure I already operate for Burket, which keeps the cost manageable while I'm still figuring out what this thing actually needs to be.</p>
<h2>The hard part</h2>
<p>Generating trivia that's actually interesting is harder than it looks. Not just factually correct — interesting. Questions that make you go "huh" when you read the answer. That have a reveal, not just a fact. Building a content pipeline that produces those at scale, reliably, is the unsolved problem right now.</p>
<p>The feed works. The content quality isn't where I want it yet. Shipping when it is.</p>`,
  },
];

export async function getPosts(): Promise<(Omit<Post, 'body'> & { content: string })[]> {
  try {
    const results = await sanity.fetch<Post[]>(
      '*[_type=="post"]|order(date desc){title,"slug":slug.current,date,tags,excerpt,body}'
    );
    if (results && results.length > 0) {
      return results.map(p => ({ ...p, content: ptToHtml(p.body) }));
    }
  } catch {
    // fall through to fallback
  }
  return FALLBACK_POSTS;
}
