// Keeps the current file or folder visible while the tree restores its expanded folders
// after a page load. Stops once the user expands or collapses a folder, so the tree
// doesn't jump back to it.
let enabled = true;

export function stopAutoScroll() {
  enabled = false;
}

// scroll only the tree (not the page)
export function scrollToCurrent(element) {
  const tree = enabled && element && element.closest('.file-tree');
  const current = tree && tree.querySelector('li.current');
  if (!current) {
    return;
  }
  const item = current.firstElementChild.getBoundingClientRect();
  const view = tree.getBoundingClientRect();
  if (item.top < view.top || item.bottom > view.bottom) {
    tree.scrollTop += (item.top - view.top) - ((view.height - item.height) / 2);
  }
}
