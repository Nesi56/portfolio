<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import ReactTerminal from '$lib/ReactTerminal.svelte';

  type Tab = 'welcome' | 'projects' | 'skills' | 'terminal' | 'guestbook';

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'welcome', label: 'Welcome', icon: '✿' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'skills', label: 'Stack', icon: '△' },
    { id: 'terminal', label: 'Terminal', icon: '⌘' },
    { id: 'guestbook', label: 'Guestbook', icon: '♡' }
  ];

  const projects = [
    {
      name: 'night-radio',
      tag: 'featured',
      description: 'A dreamy web radio interface for late-night coding sessions.',
      stack: ['SvelteKit', 'Web Audio', 'TypeScript'],
      symbol: '☾'
    },
    {
      name: 'soft-kernel',
      tag: 'experiment',
      description: 'A tiny browser desktop where every window is a different idea.',
      stack: ['React', 'Canvas', 'CSS'],
      symbol: '◈'
    },
    {
      name: 'pixel-garden',
      tag: 'open source',
      description: 'A calm pixel garden that grows from GitHub contribution data.',
      stack: ['Svelte', 'SVG', 'GitHub API'],
      symbol: '❀'
    }
  ];

  let active: Tab = 'welcome';
  let windowOpen = true;
  let startOpen = false;
  let clock = '';
  let status = 'ready';

  function setTab(tab: Tab) {
    active = tab;
    startOpen = false;
    status = `opened ${tab}.exe`;
  }

  onMount(() => {
    const updateClock = () => {
      clock = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      }).format(new Date());
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  });
</script>

<svelte:head>
  <title>nesi56.exe — Portfolio</title>
  <meta
    name="description"
    content="A calm retro desktop portfolio built with SvelteKit and React."
  />
</svelte:head>

<div class="desktop-shell">
  <div class="wallpaper-orb orb-one"></div>
  <div class="wallpaper-orb orb-two"></div>
  <div class="pixel-stars" aria-hidden="true">·　✦　·　　✧　·　✦　·</div>

  <aside class="desktop-icons" aria-label="Desktop shortcuts">
    <button onclick={() => { windowOpen = true; setTab('welcome'); }}>
      <span class="desktop-icon computer">▣</span>
      <span>my_portfolio</span>
    </button>
    <button onclick={() => setTab('projects')}>
      <span class="desktop-icon folder">▰</span>
      <span>projects</span>
    </button>
    <a href="https://github.com/nesi56" target="_blank" rel="noreferrer">
      <span class="desktop-icon github">⌁</span>
      <span>github</span>
    </a>
    <button onclick={() => setTab('guestbook')}>
      <span class="desktop-icon note">▤</span>
      <span>read_me.txt</span>
    </button>
  </aside>

  {#if windowOpen}
    <main class="window" aria-label="nesi56 portfolio window">
      <header class="title-bar">
        <div class="title-left">
          <span class="app-glyph">✧</span>
          <strong>nesi56.exe</strong>
          <span class="muted-title">— a tiny place on the internet</span>
        </div>
        <div class="window-controls" aria-label="Window controls">
          <button aria-label="Minimize" onclick={() => status = 'window minimized (emotionally)'}>_</button>
          <button aria-label="Maximize" onclick={() => status = 'already using maximum whimsy'}>□</button>
          <button aria-label="Close" onclick={() => windowOpen = false}>×</button>
        </div>
      </header>

      <nav class="menu-bar" aria-label="Application menu">
        <button onclick={() => setTab('welcome')}><u>F</u>ile</button>
        <button onclick={() => setTab('projects')}><u>V</u>iew</button>
        <button onclick={() => setTab('skills')}><u>C</u>ode</button>
        <button onclick={() => setTab('guestbook')}><u>H</u>elp</button>
        <span class="menu-quote">“make something only you would make.”</span>
      </nav>

      <div class="tab-strip" role="tablist" aria-label="Portfolio sections">
        {#each tabs as tab}
          <button
            class:active={active === tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onclick={() => setTab(tab.id)}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        {/each}
      </div>

      <section class="window-body">
        {#if active === 'welcome'}
          <div class="welcome-grid">
            <section class="intro-panel">
              <div class="eyebrow">/home/nesi56</div>
              <h1>Hi, I’m <span>nesi56</span>.</h1>
              <p class="lead">
                I build playful software, strange interfaces, and useful experiments.
                This portfolio runs on SvelteKit, with a React-powered terminal hiding inside.
              </p>
              <div class="button-row">
                <button class="retro-button primary" onclick={() => setTab('projects')}>
                  Explore projects →
                </button>
                <a class="retro-button" href="https://github.com/nesi56" target="_blank" rel="noreferrer">
                  Open GitHub
                </a>
              </div>

              <div class="notice-box">
                <span class="notice-icon">i</span>
                <div>
                  <strong>system note</strong>
                  <p>No corporate buzzwords detected. Curiosity is running normally.</p>
                </div>
              </div>
            </section>

            <section class="mascot-panel" aria-label="Original visual novel inspired mascot">
              <div class="mascot-frame">
                <img src={`${base}/mascot.svg`} alt="Original anime-inspired retro computer mascot" />
                <div class="dialogue-box">
                  <div class="speaker">N.E.S.I.</div>
                  <p>Welcome back! I organized the projects by emotional damage and commit count.</p>
                  <span class="dialogue-next">▼</span>
                </div>
              </div>
            </section>
          </div>
        {:else if active === 'projects'}
          <section class="content-page">
            <div class="section-heading">
              <div>
                <span class="eyebrow">C:\PORTFOLIO\PROJECTS</span>
                <h2>Selected work</h2>
              </div>
              <span class="counter">3 object(s)</span>
            </div>

            <div class="project-grid">
              {#each projects as project, index}
                <article class="project-card">
                  <div class="project-preview preview-{index + 1}">
                    <span class="project-symbol">{project.symbol}</span>
                    <span class="project-index">0{index + 1}</span>
                  </div>
                  <div class="project-copy">
                    <div class="project-title-row">
                      <h3>{project.name}</h3>
                      <span class="tag">{project.tag}</span>
                    </div>
                    <p>{project.description}</p>
                    <div class="chip-row">
                      {#each project.stack as item}<span>{item}</span>{/each}
                    </div>
                    <button class="text-link" onclick={() => status = `${project.name}: connect your repository URL here`}>
                      view case file ↗
                    </button>
                  </div>
                </article>
              {/each}
            </div>
          </section>
        {:else if active === 'skills'}
          <section class="content-page skills-page">
            <div class="section-heading">
              <div>
                <span class="eyebrow">pacman -S creativity</span>
                <h2>Tools & systems</h2>
              </div>
              <div class="arch-mark" title="Arch-inspired mark">△</div>
            </div>

            <div class="skills-layout">
              <div class="tree-panel">
                <div class="tree-title">skills.tree</div>
                <pre>{`nesi56/
├── frontend/
│   ├── SvelteKit
│   ├── React
│   ├── TypeScript
│   └── CSS / motion
├── systems/
│   ├── Linux
│   ├── shell scripting
│   └── low-level curiosity
├── design/
│   ├── interface design
│   ├── prototyping
│   └── pixel restraint
└── currently-learning/
    └── whatever looks impossible`}</pre>
              </div>

              <div class="meter-panel">
                <h3>process monitor</h3>
                {#each [
                  ['shipping ideas', 92],
                  ['debugging calmly', 78],
                  ['reading the docs', 84],
                  ['naming variables', 61]
                ] as meter}
                  <div class="meter-row">
                    <div><span>{meter[0]}</span><small>{meter[1]}%</small></div>
                    <div class="meter-track"><span style={`width:${meter[1]}%`}></span></div>
                  </div>
                {/each}
                <div class="holy-note">
                  <strong>ring-0 thought:</strong>
                  <p>Simple tools can still hold enormous ideas.</p>
                </div>
              </div>
            </div>
          </section>
        {:else if active === 'terminal'}
          <section class="content-page terminal-page">
            <div class="section-heading">
              <div>
                <span class="eyebrow">react-dom/client</span>
                <h2>Interactive terminal</h2>
              </div>
              <span class="react-badge">React component</span>
            </div>
            <ReactTerminal />
          </section>
        {:else}
          <section class="content-page guestbook-page">
            <div class="guestbook-window">
              <div class="guestbook-art">♡</div>
              <div>
                <span class="eyebrow">README.TXT</span>
                <h2>Thanks for stopping by.</h2>
                <p>
                  This is a public developer portfolio for <strong>nesi56</strong>. Replace the sample
                  projects, links, and stack with your real work, then deploy it straight to GitHub Pages.
                </p>
                <blockquote>
                  “The computer is a canvas, even when the canvas has beveled gray buttons.”
                </blockquote>
                <div class="contact-list">
                  <a href="https://github.com/nesi56" target="_blank" rel="noreferrer">github.com/nesi56</a>
                  <span>contact.exe — add your email or social link here</span>
                </div>
              </div>
            </div>
          </section>
        {/if}
      </section>

      <footer class="status-bar">
        <span class="status-main"><span class="status-light"></span>{status}</span>
        <span>SvelteKit + React</span>
        <span>calmOS build 98.56</span>
      </footer>
    </main>
  {:else}
    <button class="closed-message" onclick={() => windowOpen = true}>
      <span>✧</span>
      nesi56.exe is closed. Double-click the desktop icon—or click here—to reopen.
    </button>
  {/if}

  <footer class="taskbar">
    <div class="start-wrap">
      <button class="start-button" class:pressed={startOpen} onclick={() => startOpen = !startOpen}>
        <span class="start-gem">◆</span> start
      </button>
      {#if startOpen}
        <div class="start-menu">
          <div class="start-side"><span>nesi</span><strong>56</strong></div>
          <div class="start-items">
            {#each tabs as tab}
              <button onclick={() => { windowOpen = true; setTab(tab.id); }}>
                <span>{tab.icon}</span><div><strong>{tab.label}</strong><small>Open {tab.id}.exe</small></div>
              </button>
            {/each}
            <div class="start-divider"></div>
            <button onclick={() => { startOpen = false; status = 'it is now safe to turn off perfectionism'; }}>
              <span>◉</span><div><strong>Shut Down...</strong><small>Close unnecessary tabs</small></div>
            </button>
          </div>
        </div>
      {/if}
    </div>
    <div class="task-button" class:active={windowOpen}>
      <span>✧</span> nesi56.exe
    </div>
    <div class="task-spacer"></div>
    <div class="tray"><span>♬</span><span>△</span><time>{clock}</time></div>
  </footer>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { min-width: 320px; background: #b9d2cf; }
  :global(body) {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    overflow: hidden;
    color: #26313a;
    font-family: "Trebuchet MS", "MS Sans Serif", system-ui, sans-serif;
  }
  :global(button), :global(a) { font: inherit; }
  :global(button) { color: inherit; }
  :global(::selection) { background: #7c78a9; color: white; }

  .desktop-shell {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(255,255,255,.25), transparent 38%),
      radial-gradient(circle at 15% 20%, #dfe9df 0 7%, transparent 8%),
      linear-gradient(145deg, #abc9c6 0%, #c8d8d4 48%, #b7c7d9 100%);
  }
  .desktop-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: .16;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: linear-gradient(to bottom, black, transparent 78%);
  }
  .wallpaper-orb { position: absolute; border-radius: 50%; filter: blur(1px); opacity: .6; }
  .orb-one { width: 430px; height: 430px; right: -110px; top: -130px; background: #d9cfea; }
  .orb-two { width: 300px; height: 300px; left: 10%; bottom: 1%; background: #e9dfcc; opacity: .36; }
  .pixel-stars { position: absolute; right: 5%; top: 14%; color: rgba(57,69,83,.35); font-family: monospace; letter-spacing: 9px; transform: rotate(-7deg); }

  .desktop-icons {
    position: absolute;
    z-index: 2;
    top: 18px;
    left: 14px;
    display: grid;
    gap: 14px;
    width: 82px;
  }
  .desktop-icons button, .desktop-icons a {
    border: 0;
    background: transparent;
    text-decoration: none;
    color: #20313a;
    display: grid;
    justify-items: center;
    gap: 4px;
    padding: 4px;
    cursor: pointer;
    text-shadow: 1px 1px rgba(255,255,255,.7);
  }
  .desktop-icons button:focus, .desktop-icons a:focus { outline: 1px dotted #24343d; background: rgba(255,255,255,.22); }
  .desktop-icons span:last-child { font-size: 12px; line-height: 1.1; text-align: center; }
  .desktop-icon {
    width: 38px;
    height: 34px;
    display: grid;
    place-items: center;
    font-size: 27px !important;
    line-height: 1;
    filter: drop-shadow(2px 2px 0 rgba(60,70,80,.25));
  }
  .computer { color: #d4dbe3; text-shadow: -2px -2px #51636f; }
  .folder { color: #eee0a8; text-shadow: -2px -2px #9b865a; }
  .github { color: #817aa6; }
  .note { color: #f0eee2; text-shadow: -2px -2px #70828d; }

  .window {
    position: absolute;
    z-index: 3;
    width: min(1080px, calc(100vw - 170px));
    height: min(720px, calc(100vh - 86px));
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-rows: 31px 27px 37px minmax(0, 1fr) 25px;
    background: #d8d8d1;
    border: 2px solid;
    border-color: #fff #4d5961 #4d5961 #fff;
    box-shadow: 3px 4px 0 rgba(42,52,59,.25), 18px 22px 50px rgba(53,70,77,.2);
  }
  .title-bar {
    margin: 2px;
    padding: 0 3px 0 7px;
    color: #f7fbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, #65658f, #8f91b2 60%, #b2b9c8);
  }
  .title-left { display: flex; align-items: center; min-width: 0; gap: 6px; font-size: 13px; }
  .app-glyph { width: 18px; height: 18px; display: grid; place-items: center; color: #f5e7b8; background: #515271; border: 1px solid #e8e8df; }
  .muted-title { opacity: .83; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .window-controls { display: flex; gap: 2px; }
  .window-controls button {
    width: 22px;
    height: 20px;
    padding: 0;
    line-height: 15px;
    font-weight: 900;
    background: #d9d9d2;
    border: 2px solid;
    border-color: #fff #565f63 #565f63 #fff;
    cursor: pointer;
  }
  .window-controls button:active { border-color: #565f63 #fff #fff #565f63; }

  .menu-bar { display: flex; align-items: center; gap: 2px; padding: 1px 6px; border-bottom: 1px solid #8e9697; }
  .menu-bar button { border: 0; background: transparent; padding: 3px 7px; cursor: pointer; }
  .menu-bar button:hover { background: #706f9b; color: white; }
  .menu-quote { margin-left: auto; padding-right: 8px; font-family: Georgia, serif; font-size: 11px; color: #697278; }

  .tab-strip {
    display: flex;
    align-items: end;
    padding: 5px 8px 0;
    gap: 2px;
    border-bottom: 2px solid #fff;
    background: #c8cac5;
  }
  .tab-strip button {
    position: relative;
    height: 30px;
    min-width: 98px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 13px;
    cursor: pointer;
    background: #c6c7c1;
    border: 2px solid;
    border-color: #fff #626b6d #626b6d #fff;
    border-bottom: 0;
  }
  .tab-strip button.active { height: 33px; background: #e5e3dc; transform: translateY(2px); z-index: 2; color: #4f4e78; font-weight: 700; }

  .window-body {
    overflow: auto;
    margin: 4px;
    padding: 18px;
    background: #f1eee7;
    border: 2px solid;
    border-color: #616c70 #fff #fff #616c70;
  }
  .welcome-grid { min-height: 100%; display: grid; grid-template-columns: 1.05fr .95fr; gap: 22px; }
  .intro-panel { align-self: center; padding: 20px 12px 20px 22px; }
  .eyebrow { color: #6f7395; font: 700 12px/1.2 "Courier New", monospace; text-transform: uppercase; letter-spacing: .12em; }
  h1, h2, h3, p { margin-top: 0; }
  h1 { margin: 12px 0 15px; max-width: 600px; color: #313c45; font: 700 clamp(36px, 5vw, 68px)/.94 Georgia, serif; letter-spacing: -.045em; }
  h1 span { color: #7775a2; text-shadow: 2px 2px 0 #d8d3e6; }
  .lead { max-width: 620px; color: #536067; font-size: clamp(15px, 1.6vw, 19px); line-height: 1.62; }
  .button-row { display: flex; flex-wrap: wrap; gap: 9px; margin: 24px 0; }
  .retro-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 7px 14px;
    color: #2e3b42;
    text-decoration: none;
    cursor: pointer;
    background: #d9d9d2;
    border: 2px solid;
    border-color: #fff #5d686b #5d686b #fff;
    box-shadow: 1px 1px 0 #262f33;
  }
  .retro-button:active { transform: translate(1px, 1px); border-color: #5d686b #fff #fff #5d686b; box-shadow: none; }
  .retro-button.primary { color: white; background: #7777a0; border-color: #aaaaca #46465e #46465e #aaaaca; }
  .notice-box { max-width: 580px; display: flex; gap: 12px; padding: 12px; background: #e8ecdf; border: 1px solid #a9b59d; box-shadow: inset 1px 1px white; }
  .notice-box p { margin: 2px 0 0; color: #566056; font-size: 13px; }
  .notice-icon { flex: 0 0 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; color: white; background: #879a82; font-family: Georgia, serif; font-weight: 700; }

  .mascot-panel { display: grid; place-items: center; min-width: 0; }
  .mascot-frame {
    position: relative;
    width: min(100%, 450px);
    aspect-ratio: 4 / 4.8;
    overflow: hidden;
    background: linear-gradient(180deg, #d8d2e3, #cedfd9 70%);
    border: 2px solid;
    border-color: #fff #6a7475 #6a7475 #fff;
    box-shadow: inset 0 0 0 8px rgba(255,255,255,.25), 5px 6px 0 rgba(84,92,97,.12);
  }
  .mascot-frame::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px); background-size: 100% 4px; pointer-events: none; z-index: 2; }
  .mascot-frame img { width: 100%; height: 84%; object-fit: contain; object-position: 50% 10%; display: block; filter: drop-shadow(0 8px 0 rgba(78,79,99,.12)); }
  .dialogue-box { position: absolute; z-index: 3; left: 12px; right: 12px; bottom: 12px; min-height: 104px; padding: 21px 18px 14px; color: #39464b; background: rgba(249,247,240,.95); border: 2px solid #616a70; box-shadow: inset 0 0 0 3px #fff, 4px 4px 0 rgba(61,69,74,.22); }
  .speaker { position: absolute; top: -14px; left: 15px; padding: 4px 13px; color: white; background: #7775a0; border: 2px solid #52516d; font-weight: 700; letter-spacing: .08em; }
  .dialogue-box p { margin: 7px 0 0; line-height: 1.45; font-family: Georgia, serif; }
  .dialogue-next { position: absolute; right: 9px; bottom: 5px; color: #7775a0; animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  .content-page { min-height: 100%; max-width: 980px; margin: 0 auto; }
  .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 16px; padding: 4px 2px 16px; border-bottom: 1px dotted #8a9293; }
  .section-heading h2 { margin: 5px 0 0; font: 700 clamp(28px, 4vw, 43px)/1 Georgia, serif; color: #36434a; }
  .counter, .react-badge { padding: 5px 9px; background: #e1e0d9; border: 1px solid #939a99; font: 12px monospace; }
  .project-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding-top: 18px; }
  .project-card { min-width: 0; overflow: hidden; background: #e8e5dd; border: 2px solid; border-color: #fff #626b6d #626b6d #fff; box-shadow: 2px 2px 0 rgba(37,48,54,.16); }
  .project-preview { position: relative; height: 145px; display: grid; place-items: center; overflow: hidden; border-bottom: 1px solid #727b7d; }
  .preview-1 { background: radial-gradient(circle at 65% 25%, #f4e6b8 0 8%, transparent 9%), linear-gradient(145deg, #48506d, #9291b5); }
  .preview-2 { background: repeating-linear-gradient(90deg, rgba(255,255,255,.13) 0 1px, transparent 1px 22px), linear-gradient(155deg, #88aaa8, #d6ddd2); }
  .preview-3 { background: radial-gradient(circle, #e7d5d8 0 4px, transparent 5px) 0 0/28px 28px, linear-gradient(160deg, #d8ded0, #aabfba); }
  .project-symbol { font: 70px Georgia, serif; color: rgba(255,255,255,.82); text-shadow: 3px 3px 0 rgba(50,58,64,.2); }
  .project-index { position: absolute; right: 8px; bottom: 6px; color: rgba(255,255,255,.8); font: 700 13px monospace; }
  .project-copy { padding: 13px; }
  .project-title-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .project-title-row h3 { margin: 0; color: #3c4850; font: 700 20px "Courier New", monospace; }
  .tag { white-space: nowrap; padding: 2px 5px; color: #5d617a; background: #d8d4e4; border: 1px solid #aaa3bd; font-size: 10px; text-transform: uppercase; }
  .project-copy p { min-height: 66px; margin: 11px 0; color: #5b676c; font-size: 13px; line-height: 1.48; }
  .chip-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip-row span { padding: 2px 5px; background: #f3f0e8; border: 1px solid #aeb3b0; font-size: 10px; }
  .text-link { margin-top: 13px; padding: 0; border: 0; border-bottom: 1px dotted currentColor; color: #68688f; background: transparent; cursor: pointer; font-size: 12px; }

  .skills-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 15px; padding-top: 18px; }
  .tree-panel, .meter-panel { padding: 15px; background: #e6e4dc; border: 2px solid; border-color: #fff #656e70 #656e70 #fff; }
  .tree-title { margin: -15px -15px 13px; padding: 5px 8px; color: white; background: #7a799c; font: 700 12px monospace; }
  .tree-panel pre { margin: 0; white-space: pre-wrap; color: #3e4c51; font: 13px/1.62 "Courier New", monospace; }
  .arch-mark { font-size: 44px; line-height: .7; color: #719da2; text-shadow: 2px 2px #d0e3df; }
  .meter-panel h3 { margin-bottom: 18px; font: 700 17px monospace; }
  .meter-row { margin-bottom: 15px; }
  .meter-row > div:first-child { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
  .meter-row small { color: #717b7e; }
  .meter-track { height: 17px; padding: 2px; background: white; border: 2px solid; border-color: #666e70 #fff #fff #666e70; }
  .meter-track span { display: block; height: 100%; background: repeating-linear-gradient(90deg, #7f9e9d 0 9px, #afc2bd 9px 11px); }
  .holy-note { margin-top: 22px; padding: 12px; color: #56536b; background: #eee9d8; border: 1px solid #b9ac84; }
  .holy-note p { margin: 4px 0 0; font-family: Georgia, serif; font-style: italic; }

  .terminal-page { display: flex; flex-direction: column; }
  .terminal-page :global(.react-mount) { flex: 1; min-height: 360px; margin-top: 17px; }
  .terminal-page :global(.react-terminal) { height: 100%; display: grid; grid-template-rows: 1fr auto; }
  .terminal-page :global(.terminal-screen) { min-height: 340px; overflow: auto; padding: 16px; color: #d8eee7; background: #202a2d; border: 3px solid; border-color: #576165 #111819 #111819 #576165; box-shadow: inset 0 0 45px rgba(93,145,128,.08); }
  .terminal-page :global(pre) { margin: 0 0 4px; white-space: pre-wrap; font: 13px/1.35 "Courier New", monospace; }
  .terminal-page :global(pre.command) { color: #f1dcac; }
  .terminal-page :global(.terminal-input-row) { display: flex; gap: 8px; align-items: center; color: #b7d9c8; font: 13px "Courier New", monospace; }
  .terminal-page :global(.terminal-input-row input) { flex: 1; min-width: 0; border: 0; outline: 0; color: #f1f4e9; caret-color: #f0d49c; background: transparent; font: inherit; }
  .terminal-page :global(.terminal-hint) { justify-self: end; margin-top: 7px; color: #6e787b; font: 11px monospace; }

  .guestbook-page { display: grid; place-items: center; }
  .guestbook-window { width: min(760px, 100%); display: grid; grid-template-columns: 150px 1fr; gap: 22px; padding: 24px; background: #e7e4db; border: 2px solid; border-color: #fff #687173 #687173 #fff; box-shadow: 3px 3px 0 rgba(42,52,59,.13); }
  .guestbook-art { align-self: stretch; min-height: 230px; display: grid; place-items: center; color: #f8f0ee; background: linear-gradient(155deg, #9fa9bf, #d0b9c6); border: 2px inset #d9d9d2; font: 90px Georgia, serif; }
  .guestbook-window h2 { margin: 8px 0 12px; font: 700 37px Georgia, serif; }
  .guestbook-window p { color: #58646a; line-height: 1.65; }
  blockquote { margin: 18px 0; padding: 12px 15px; color: #5e5b76; background: #efeada; border-left: 5px solid #aaa5c1; font-family: Georgia, serif; font-style: italic; }
  .contact-list { display: grid; gap: 6px; font: 12px monospace; }
  .contact-list a { color: #626188; }

  .status-bar { display: grid; grid-template-columns: 1fr auto auto; gap: 3px; margin: 0 3px 3px; font-size: 11px; }
  .status-bar > span { min-width: 0; padding: 3px 7px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid; border-color: #777f80 #fff #fff #777f80; }
  .status-main { display: flex; align-items: center; gap: 6px; }
  .status-light { width: 7px; height: 7px; border-radius: 50%; background: #7fa98c; box-shadow: 0 0 0 1px #50655a; }

  .closed-message { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); width: min(460px, calc(100vw - 40px)); padding: 18px; background: #d9d9d2; border: 2px solid; border-color: white #626b6d #626b6d white; box-shadow: 3px 3px 0 rgba(30,40,45,.2); cursor: pointer; }
  .closed-message span { margin-right: 8px; color: #7775a0; }

  .taskbar { position: absolute; z-index: 10; left: 0; right: 0; bottom: 0; height: 38px; display: flex; align-items: center; gap: 5px; padding: 3px 5px; background: #d1d2cc; border-top: 2px solid white; box-shadow: 0 -1px #717a7c; }
  .start-wrap { position: relative; }
  .start-button, .task-button { height: 30px; display: flex; align-items: center; gap: 6px; padding: 0 11px; background: #d1d2cc; border: 2px solid; border-color: #fff #596366 #596366 #fff; font-weight: 700; cursor: pointer; }
  .start-button.pressed, .task-button.active { border-color: #596366 #fff #fff #596366; background: #c5c6c1; }
  .start-gem { color: #7b7ca5; text-shadow: 1px 1px #fff; }
  .task-button { width: min(245px, 27vw); font-weight: 400; overflow: hidden; white-space: nowrap; }
  .task-spacer { flex: 1; }
  .tray { height: 29px; display: flex; align-items: center; gap: 9px; padding: 0 10px; border: 2px solid; border-color: #737b7d #fff #fff #737b7d; font-size: 12px; }
  .tray span:nth-child(2) { color: #719da2; }
  .start-menu { position: absolute; left: 0; bottom: 34px; width: 290px; min-height: 350px; display: grid; grid-template-columns: 38px 1fr; background: #d7d7d0; border: 2px solid; border-color: #fff #555f62 #555f62 #fff; box-shadow: 3px 3px 0 rgba(35,44,48,.2); }
  .start-side { display: flex; flex-direction: column; align-items: center; justify-content: end; padding: 8px 0; color: #dfe0eb; background: linear-gradient(#6d6e91, #9698b3); writing-mode: vertical-rl; transform: rotate(180deg); font-size: 18px; letter-spacing: .08em; }
  .start-side strong { color: white; font-size: 24px; }
  .start-items { padding: 5px; }
  .start-items button { width: 100%; display: grid; grid-template-columns: 38px 1fr; align-items: center; gap: 7px; padding: 8px 6px; text-align: left; border: 0; background: transparent; cursor: pointer; }
  .start-items button:hover { color: white; background: #74749b; }
  .start-items button > span { font-size: 23px; text-align: center; }
  .start-items button div { display: grid; }
  .start-items small { opacity: .72; font-size: 10px; }
  .start-divider { height: 2px; margin: 5px; border-top: 1px solid #767e80; border-bottom: 1px solid #fff; }

  @media (max-width: 920px) {
    .window { width: calc(100vw - 105px); left: calc(50% + 42px); }
    .welcome-grid { grid-template-columns: 1fr; }
    .intro-panel { padding: 8px; }
    .mascot-panel { min-height: 420px; }
    .mascot-frame { height: 420px; aspect-ratio: auto; }
    .project-grid { grid-template-columns: 1fr; }
    .project-copy p { min-height: auto; }
    .skills-layout { grid-template-columns: 1fr; }
  }

  @media (max-width: 650px) {
    :global(body) { overflow: auto; }
    .desktop-shell { min-height: 100dvh; padding: 10px 7px 48px; overflow: auto; }
    .desktop-icons, .pixel-stars { display: none; }
    .window { position: relative; width: 100%; height: calc(100dvh - 58px); min-height: 650px; left: auto; top: auto; transform: none; grid-template-rows: 31px 27px auto minmax(0, 1fr) 25px; }
    .tab-strip { overflow-x: auto; align-items: end; }
    .tab-strip button { min-width: 88px; padding: 0 9px; }
    .menu-quote { display: none; }
    .window-body { padding: 12px; }
    .mascot-panel { min-height: 360px; }
    .mascot-frame { height: 360px; }
    .guestbook-window { grid-template-columns: 1fr; }
    .guestbook-art { min-height: 120px; }
    .status-bar { grid-template-columns: 1fr; }
    .status-bar > span:not(:first-child) { display: none; }
    .tray span { display: none; }
    .task-button { width: 42vw; }
  }
</style>
