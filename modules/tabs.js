class Tabbed {
  constructor(root) {
    this.root = root;

    this.tabList = this.root.querySelector('[role="tablist"]');
    this.panels = this.root.querySelectorAll('[role="tabpanel"]');
    this.selectedTab = null;

    for (let tab of this.tabList.children) {
      tab.addEventListener('click', () => this.change(tab));
      if (!tab.getAttribute('aria-selected')) {
        tab.setAttribute('tabindex', -1);
      } else {
        this.selectedTab = tab;
      }
    }
    this.tabList.addEventListener('keydown', e => {
      if (this.selectedTab) {
        if (e.key === 'ArrowRight' && this.selectedTab.nextElementSibling) {
          this.change(this.selectedTab.nextElementSibling);
        } else if (e.key === 'ArrowLeft' && this.selectedTab.previousElementSibling) {
          this.change(this.selectedTab.previousElementSibling);
        }
      }
    });
  }

  change(tab) {
    const tabPage = document.getElementById(tab.getAttribute('aria-controls'));
    for (let tab of this.tabList.children) {
      tab.setAttribute('aria-selected', false);
      tab.setAttribute('tabindex', -1);
    }
    tab.setAttribute('aria-selected', true);
    tab.setAttribute('tabindex', 0);
    tab.focus();
    this.selectedTab = tab;
    this.panels.forEach(p => p.setAttribute('hidden', true));
    tabPage.removeAttribute('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const tabContainers = document.getElementsByClassName('tabs');
  for (let tabContainer of tabContainers) {
    new Tabbed(tabContainer);
  }
});
