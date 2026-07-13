<script lang="ts">
  import { onMount } from 'svelte';

  let mountNode: HTMLDivElement;

  onMount(() => {
    let disposed = false;
    let root: import('react-dom/client').Root | undefined;

    Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./react/TerminalWidget')
    ]).then(([React, ReactDOM, module]) => {
      if (disposed) return;
      root = ReactDOM.createRoot(mountNode);
      root.render(React.createElement(module.default));
    });

    return () => {
      disposed = true;
      root?.unmount();
    };
  });
</script>

<div bind:this={mountNode} class="react-mount"></div>
