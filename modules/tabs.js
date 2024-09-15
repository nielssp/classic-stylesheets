export default class Tabs {
  static instances = new WeakMap();

  constructor(root) {
    Tabs.instances.set(root, this);

    this.root = root;
    this.tabList = root.querySelector('[role="tablist"]');
    this.panels = root.querySelectorAll('[role="tabpanel"]');
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
    for (let other of this.tabList.children) {
      other.setAttribute('aria-selected', false);
      other.setAttribute('tabindex', -1);
    }
    tab.setAttribute('aria-selected', true);
    tab.setAttribute('tabindex', 0);
    tab.focus();
    this.selectedTab = tab;
    this.panels.forEach(p => p.setAttribute('hidden', true));
    tabPage.removeAttribute('hidden');
  }

  static initDomElements() {
    window.addEventListener('DOMContentLoaded', () => {
      const tabContainers = document.getElementsByClassName('tabs');
      for (const tabContainer of tabContainers) {
        new Tabs(tabContainer);
      }
    });
  }
}

Tabs.initDomElements();
