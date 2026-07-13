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
    'I sorted your projects by cuteness, usefulness, and how many bugs they survived.',
    'Plain JavaScript? Good. Fewer dependencies means more room for manga.',
    'You use Arch, by the way. Yes, I was legally required to say that.',
    'Open the terminal and type “poem”. I made it only a little embarrassing.',
    'Now stop staring at the desktop and ship something.'
  ];
  let dialogueIndex = 0;

  const fallbackProjects = [
    {
      name: 'project-one',
      description: 'Connect this card to one of your pinned GitHub repositories.',
      html_url: 'https://github.com/nesi56',
      language: 'JavaScript',
      stargazers_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      name: 'project-two',
      description: 'A placeholder for your next useful, strange, or ambitious build.',
      html_url: 'https://github.com/nesi56',
      language: 'HTML',
      stargazers_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      name: 'project-three',
      description: 'Replace this fallback by making a public repository on GitHub.',
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
    setStatus(isMaximized ? 'maximum whimsy enabled' : 'window restored');
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
    $('#menuMessage').textContent = '“Go outside for five minutes. The code will still be here.”';
  });

  $('#dialogueNext').addEventListener('click', () => {
    dialogueIndex = (dialogueIndex + 1) % dialogue.length;
    $('#dialogueText').textContent = dialogue[dialogueIndex];
    setStatus(`dialogue line ${dialogueIndex + 1}/${dialogue.length}`);
  });

  function showPoem() {
    poemModal.hidden = false;
    setStatus('opened cupcake.txt');
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
      ['#59627f', '#a89fbd'],
      ['#79a5a3', '#d5ded5'],
      ['#b18a9f', '#e1c5cf'],
      ['#8b9db1', '#d7dfdf'],
      ['#8f8470', '#e6d8b7'],
      ['#65617c', '#b8b0c5']
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
      'commands: help, about, stack, projects, github, neofetch, poem, date, clear'
    ],
    about: [
      'nesi56 // building useful, strange, and playful things on the web',
      'portfolio // plain HTML, CSS, and JavaScript'
    ],
    stack: ['html  css  javascript  arch-linux  shell  curiosity'],
    projects: ['Opening projects.exe...'],
    github: ['Opening github.com/nesi56...'],
    neofetch: [
      '       /\\        guest@nesi56',
      '      /  \\       os: calmOS 98.56',
      '     / /\\ \\      base: Arch-ish',
      '    / ____ \\     shell: imagination',
      '   /_/    \\_\\    wm: beveled-dreams',
      '                  uptime: still learning'
    ],
    poem: [
      'pink pixels / quiet keys',
      'a stubborn little program',
      'refuses to crash'
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

  // Dragging is enabled on non-mobile layouts and disabled while maximized.
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
