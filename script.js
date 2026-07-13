(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const windowEl = $('#portfolioWindow');
  const titlebar = $('#titlebar');
  const closedDialog = $('#closedDialog');
  const startButton = $('#startButton');
  const startMenu = $('#startMenu');
  const taskWindow = $('#taskWindow');
  const statusText = $('#statusText');
  const poemModal = $('#poemModal');
  const terminalOutput = $('#terminalOutput');
  const terminalInput = $('#terminalInput');

  let activeTab = 'home';
  let isMaximized = false;
  let dragState = null;

  const dialogue = [
    'Okay, fine. I helped make your portfolio look cooler. Just don’t waste it by shipping something boring.',
    'Arch and Hyprland vibes? Good. If the desktop doesn’t look slightly dangerous, what’s even the point?',
    'That mission-control layout? Totally intentional. Cute can still look classified.',
    'The Terry-Davis-style part is the build spirit: make it weird, make it bold, make it yours.',
    'Now go open the projects tab already. I didn’t stand here for nothing.'
  ];
  let dialogueIndex = 0;

  const fallbackProjects = [
    {
      name: 'mission-one',
      description: 'Connect this card to one of your pinned GitHub repositories.',
      html_url: 'https://github.com/nesi56',
      language: 'JavaScript',
      stargazers_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      name: 'mission-two',
      description: 'A placeholder for the next bold, useful, or experimental build.',
      html_url: 'https://github.com/nesi56',
      language: 'HTML',
      stargazers_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      name: 'mission-three',
      description: 'Replace this fallback by pushing another public repository.',
      html_url: 'https://github.com/nesi56',
      language: 'CSS',
      stargazers_count: 0,
      updated_at: new Date().toISOString()
    }
  ];

  function setStatus(message) {
    statusText.textContent = message;
  }

  function openWindow() {
    windowEl.classList.remove('minimized');
    windowEl.hidden = false;
    closedDialog.hidden = true;
    taskWindow.classList.add('active');
  }

  function openTab(tabName) {
    const targetPage = $(`[data-page="${tabName}"]`);
    if (!targetPage) return;

    openWindow();
    activeTab = tabName;

    $$('.tab').forEach(tab => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    $$('.page').forEach(page => page.classList.toggle('active', page.dataset.page === tabName));
    startMenu.hidden = true;
    startButton.classList.remove('pressed');
    setStatus(`opened ${tabName}.exe`);

    if (tabName === 'terminal') {
      requestAnimationFrame(() => terminalInput.focus());
    }

    if (tabName === 'stack') {
      requestAnimationFrame(() => {
        $$('.meter').forEach(meter => {
          $('.meter-track span', meter).style.width = `${meter.dataset.value}%`;
        });
      });
    }
  }

  $$('[data-open-tab]').forEach(button => {
    button.addEventListener('click', event => {
      if (button.tagName === 'A') return;
      event.preventDefault();
      openTab(button.dataset.openTab);
    });
  });

  $$('.tab').forEach(tab => tab.addEventListener('click', () => openTab(tab.dataset.tab)));

  $('#minimizeBtn').addEventListener('click', () => {
    windowEl.classList.add('minimized');
    taskWindow.classList.remove('active');
    setStatus('window minimized');
  });

  $('#maximizeBtn').addEventListener('click', () => {
    isMaximized = !isMaximized;
    windowEl.classList.toggle('maximized', isMaximized);
    setStatus(isMaximized ? 'maximum mission mode enabled' : 'window restored');
  });

  $('#closeBtn').addEventListener('click', () => {
    windowEl.hidden = true;
    closedDialog.hidden = false;
    taskWindow.classList.remove('active');
  });

  closedDialog.addEventListener('click', openWindow);
  taskWindow.addEventListener('click', () => {
    if (windowEl.hidden || windowEl.classList.contains('minimized')) openWindow();
    else windowEl.classList.add('minimized');
    taskWindow.classList.toggle('active', !windowEl.classList.contains('minimized') && !windowEl.hidden);
  });

  startButton.addEventListener('click', event => {
    event.stopPropagation();
    startMenu.hidden = !startMenu.hidden;
    startButton.classList.toggle('pressed', !startMenu.hidden);
  });

  startMenu.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', () => {
    startMenu.hidden = true;
    startButton.classList.remove('pressed');
  });

  $('#shutdownButton').addEventListener('click', () => {
    startMenu.hidden = true;
    startButton.classList.remove('pressed');
    setStatus('it is now safe to close unnecessary tabs');
    $('#menuMessage').textContent = '“Log off, regroup, come back stronger.”';
  });

  $('#dialogueNext').addEventListener('click', () => {
    dialogueIndex = (dialogueIndex + 1) % dialogue.length;
    $('#dialogueText').textContent = dialogue[dialogueIndex];
    setStatus(`dialogue line ${dialogueIndex + 1}/${dialogue.length}`);
  });

  function showPoem() {
    poemModal.hidden = false;
    setStatus('opened note.txt');
  }
  function hidePoem() { poemModal.hidden = true; }
  $('#poemButton').addEventListener('click', showPoem);
  $('#poemClose').addEventListener('click', hidePoem);
  poemModal.addEventListener('click', event => { if (event.target === poemModal) hidePoem(); });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      hidePoem();
      startMenu.hidden = true;
      startButton.classList.remove('pressed');
    }
  });

  function updateClock() {
    $('#clock').textContent = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 1000);

  function projectSymbol(language = '') {
    const symbols = {
      JavaScript: 'JS', TypeScript: 'TS', HTML: '</>', CSS: '#', Python: 'Py',
      Rust: 'Rs', 'C++': 'C+', C: 'C', Java: 'Jv', Shell: '$', Svelte: 'Sv'
    };
    return symbols[language] || '◇';
  }

  function renderProjects(projects, sourceText) {
    const palette = [
      ['#37111d', '#8a334e'],
      ['#131f28', '#436780'],
      ['#4a1625', '#c06d8a'],
      ['#1c1718', '#76505c'],
      ['#2b2834', '#808aa8'],
      ['#3b121f', '#a24f66']
    ];

    $('#projectGrid').innerHTML = projects.slice(0, 6).map((project, index) => {
      const [a, b] = palette[index % palette.length];
      const updated = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' }).format(new Date(project.updated_at));
      const description = project.description || 'A repository from the nesi56 GitHub profile.';
      const language = project.language || 'Code';
      return `
        <article class="project-card">
          <div class="project-banner" style="--card-a:${a};--card-b:${b}"><span>${projectSymbol(project.language)}</span></div>
          <div class="project-copy">
            <div class="project-title-row">
              <h3>${escapeHtml(project.name)}</h3>
              <span class="project-tag">${escapeHtml(language)}</span>
            </div>
            <p class="project-description">${escapeHtml(description)}</p>
            <div class="project-meta"><span>★ ${project.stargazers_count ?? 0}</span><span>updated ${updated}</span></div>
            <a class="project-link" href="${project.html_url}" target="_blank" rel="noreferrer">open repository ↗</a>
          </div>
        </article>`;
    }).join('');

    $('#projectStatus').textContent = `${projects.length} object(s) · ${sourceText}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  async function loadGitHubProjects() {
    try {
      const response = await fetch('https://api.github.com/users/nesi56/repos?sort=updated&per_page=100', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const repos = await response.json();
      const visible = repos.filter(repo => !repo.fork).slice(0, 6);
      $('#repoCount').textContent = repos.length;
      renderProjects(visible.length ? visible : fallbackProjects, 'live');
    } catch (error) {
      console.warn('Could not load GitHub projects:', error);
      $('#repoCount').textContent = '?';
      renderProjects(fallbackProjects, 'offline fallback');
    }
  }

  const commands = {
    help: [
      'commands: help, about, stack, projects, github, neofetch, intel, launch, poem, date, clear'
    ],
    about: [
      'nesi56 // building useful, strange, and ambitious things',
      'portfolio // plain HTML, CSS, and JavaScript // burgundy command center build'
    ],
    stack: ['html  css  javascript  arch-ish  hyprland-feel  aerospace  shell  curiosity'],
    projects: ['Opening projects.exe...'],
    github: ['Opening github.com/nesi56...'],
    neofetch: [
      '       /\\        guest@nesi56',
      '      /  \\       os: nesi56 command center',
      '     / /\\ \\      base: Arch-ish',
      '    / ____ \\     wm: Hyprland-inspired mood',
      '   /_/    \\_\\    shell: imagination',
      '                  status: mission ready'
    ],
    intel: [
      'theme profile:',
      '- doki doki atmosphere',
      '- dark burgundy and black',
      '- hacker / red-team aesthetic',
      '- aerospace mission-control energy'
    ],
    launch: [
      'launch checklist:',
      '[x] curiosity',
      '[x] systems thinking',
      '[x] visual identity',
      '[ ] more public repos'
    ],
    poem: [
      'black glass / burgundy light',
      'stubborn code under a calm face',
      'cute enough to approach / sharp enough to remember'
    ]
  };

  function appendTerminal(text, className = '') {
    const line = document.createElement('div');
    line.textContent = text;
    if (className) line.className = className;
    terminalOutput.append(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  $('#terminalForm').addEventListener('submit', event => {
    event.preventDefault();
    const raw = terminalInput.value.trim();
    if (!raw) return;
    appendTerminal(`guest@nesi56 ~ % ${raw}`, 'terminal-command');
    terminalInput.value = '';

    const command = raw.toLowerCase();
    if (command === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }
    if (command === 'projects') {
      commands.projects.forEach(line => appendTerminal(line));
      setTimeout(() => openTab('projects'), 250);
      return;
    }
    if (command === 'github') {
      commands.github.forEach(line => appendTerminal(line));
      window.open('https://github.com/nesi56', '_blank', 'noopener');
      return;
    }
    if (command === 'date') {
      appendTerminal(new Date().toString());
      return;
    }
    const response = commands[command];
    if (response) response.forEach(line => appendTerminal(line));
    else {
      appendTerminal(`command not found: ${raw}`, 'terminal-error');
      appendTerminal('try: help');
    }
  });

  titlebar.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || isMaximized || window.innerWidth <= 670) return;
    const rect = windowEl.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    };
    titlebar.setPointerCapture(event.pointerId);
    windowEl.style.transform = 'none';
    windowEl.style.left = `${rect.left}px`;
    windowEl.style.top = `${rect.top}px`;
  });

  titlebar.addEventListener('pointermove', event => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const maxLeft = window.innerWidth - windowEl.offsetWidth;
    const maxTop = window.innerHeight - windowEl.offsetHeight - 40;
    const left = Math.max(0, Math.min(maxLeft, event.clientX - dragState.offsetX));
    const top = Math.max(0, Math.min(maxTop, event.clientY - dragState.offsetY));
    windowEl.style.left = `${left}px`;
    windowEl.style.top = `${top}px`;
  });

  titlebar.addEventListener('pointerup', event => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState = null;
    titlebar.releasePointerCapture(event.pointerId);
  });

  window.addEventListener('load', () => {
    setTimeout(() => $('#bootScreen').classList.add('done'), 1050);
    loadGitHubProjects();
  });
})();
