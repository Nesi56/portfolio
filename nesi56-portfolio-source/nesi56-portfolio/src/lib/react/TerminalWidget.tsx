import { useMemo, useState } from 'react';

const commands: Record<string, string[]> = {
  help: ['commands: help, about, stack, projects, clear, neofetch'],
  about: ['nesi56 // building strange, useful things on the web'],
  stack: ['sveltekit  react  typescript  css  linux'],
  projects: ['01. night-radio', '02. soft-kernel', '03. pixel-garden'],
  neofetch: [
    '      /\\        nesi56@portfolio',
    '     /  \\       os: calmOS 98',
    '    / /\\ \\      shell: imagination',
    '   / ____ \\     wm: windowed-dreams',
    '  /_/    \\_\\    uptime: always learning'
  ]
};

type Line = { kind: 'command' | 'output'; text: string };

export default function TerminalWidget() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([
    { kind: 'output', text: 'React terminal mounted successfully.' },
    { kind: 'output', text: 'Type “help” and press Enter.' }
  ]);

  const prompt = useMemo(() => 'guest@nesi56 ~ %', []);

  function runCommand() {
    const raw = input.trim();
    if (!raw) return;

    if (raw.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    const response = commands[raw.toLowerCase()] ?? [
      `command not found: ${raw}`,
      'try: help'
    ];

    setHistory((lines) => [
      ...lines,
      { kind: 'command', text: `${prompt} ${raw}` },
      ...response.map((text) => ({ kind: 'output' as const, text }))
    ]);
    setInput('');
  }

  return (
    <div className="react-terminal" aria-label="Interactive React terminal">
      <div className="terminal-screen">
        {history.map((line, index) => (
          <pre key={`${line.text}-${index}`} className={line.kind}>
            {line.text}
          </pre>
        ))}
        <div className="terminal-input-row">
          <span>{prompt}</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') runCommand();
            }}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="terminal-hint">React island · try “neofetch”</div>
    </div>
  );
}
