export default class List {
  constructor(root) {
    this.root = root;

    this.multiselect = this.root.getAttribute('aria-multiselectable') === 'true';
    this.iconGrid = this.root.children.length > 0 && this.root.children[0].classList.contains('icon-grid');
    this.options = this.root.querySelectorAll('[role="option"], [role="treeitem"]');
    this.selectedOption = -1;
    this.prefix = '';
    this.prefixTimeout = null;

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      option.addEventListener('mousedown', e => {
        e.stopPropagation();
        e.preventDefault();
        this.select(i, e.shiftKey, e.ctrlKey, true);
      });
      option.addEventListener('keydown', e => {
        if (e.key === ' ' && !this.prefix) {
          e.preventDefault();
          this.select(i, e.shiftKey, true, true);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (this.prefixTimeout) {
            clearTimeout(this.prefixTimeout);
          }
          this.prefix += e.key.toLowerCase();
          for (let j = 0; j < this.options.length; j++) {
            if (this.options[j].textContent.trimLeft().toLowerCase().startsWith(this.prefix)) {
              this.select(j, false, false);
              break;
            }
          }
          this.prefixTimeout = setTimeout(() => {
            this.prefixTimeout = null;
            this.prefix = '';
          }, 700);
        } else if (e.key === 'a' && e.ctrlKey && this.multiselect) {
          e.preventDefault();
          for (let option of this.options) {
            option.setAttribute('aria-selected', true);
          }
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.select(0, e.shiftKey, e.ctrlKey);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.select(this.options.length - 1, e.shiftKey, e.ctrlKey);
        } else if (this.iconGrid) {
          if (this.options.length > 0) {
            let columns;
            const y0 = this.options[0].getBoundingClientRect().top;
            for (columns = 1; columns < this.options.length; columns++) {
              const y1 = this.options[columns].getBoundingClientRect().top;
              if (y1 !== y0) {
                break;
              }
            }
            const x = i % columns;
            const y = (i / columns) | 0;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              this.select(x + (y + 1) * columns, e.shiftKey, e.ctrlKey);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              this.select(x + (y - 1) * columns, e.shiftKey, e.ctrlKey);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              if (x > 0) {
                this.select(i - 1, e.shiftKey, e.ctrlKey);
              }
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              if (x < columns - 1) {
                this.select(i + 1, e.shiftKey, e.ctrlKey);
              }
            }
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.select(i + 1, e.shiftKey, e.ctrlKey);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.select(i - 1, e.shiftKey, e.ctrlKey);
        }
      });
      if (option.getAttribute('aria-selected') !== 'true') {
        option.setAttribute('tabindex', -1);
      } else {
        this.selectedOption = i;
        option.setAttribute('tabindex', 0);
      }
    }
    if (this.selectedOption < 0 && this.options.length) {
      this.options[0].setAttribute('tabindex', 0);
    }
    this.root.addEventListener('mousedown', () => {
      if (this.multiselect) {
        for (let option of this.options) {
          option.setAttribute('aria-selected', false);
        }
      }
      if (this.selectedOption >= 0) {
        this.options[this.selectedOption].focus();
      } else if (this.options.length) {
        this.options[0].focus();
      }
    });
  }

  select(index, shift, ctrl, click) {
    if (index < 0 || index >= this.options.length) {
      return;
    }
    const option = this.options[index];
    for (let other of this.options) {
      if (!this.multiselect || !ctrl) {
        other.setAttribute('aria-selected', false);
      }
      other.setAttribute('tabindex', -1);
    }
    if (this.multiselect && (ctrl || shift)) {
      if (this.selectedOption < 0) {
        this.selectedOption = index;
      }
      if (shift) {
        if (this.selectedOption < index) {
          for (let i = this.selectedOption; i <= index; i++) {
            this.options[i].setAttribute('aria-selected', true);
          }
        } else {
          for (let i = this.selectedOption; i >= index; i--) {
            this.options[i].setAttribute('aria-selected', true);
          }
        }
      } else if (ctrl && click) {
        if (option.getAttribute('aria-selected') === 'true') {
          option.setAttribute('aria-selected', false);
        } else {
          option.setAttribute('aria-selected', true);
          this.selectedOption = index;
        }
      }
    } else {
      option.setAttribute('aria-selected', true);
      this.selectedOption = index;
    }
    option.setAttribute('tabindex', 0);
    option.focus();
  }

  static initDomElements() {
    window.addEventListener('DOMContentLoaded', () => {
      const lists = document.getElementsByClassName('list');
      for (let list of lists) {
        new List(list);
      }
    });
  }
}

List.initDomElements();
