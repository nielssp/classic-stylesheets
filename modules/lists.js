class List {
  constructor(root) {
    this.root = root;

    this.isIconGrid = this.root.children.length > 0 && this.root.children[0].classList.contains('icon-grid');
    this.options = this.root.querySelectorAll('[role="option"]');
    this.selectedOption = -1;
    this.prefix = '';
    this.prefixTimeout = null;

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      option.addEventListener('click', e => {
        e.stopPropagation();
        this.select(i);
      });
      option.addEventListener('keydown', e => {
        if (e.key === ' ' && !this.prefix) {
          e.preventDefault();
          this.select(i);
        } else if (e.key.length === 1) {
          e.preventDefault();
          if (this.prefixTimeout) {
            clearTimeout(this.prefixTimeout);
            this.prefixTimeout = null;
          }
          this.prefix += e.key.toLowerCase();
          for (let j = 0; j < this.options.length; j++) {
            if (this.options[j].textContent.trimLeft().toLowerCase().startsWith(this.prefix)) {
              this.select(j);
              break;
            }
          }
          this.prefixTimeout = setTimeout(() => {
            this.prefixTimeout = null;
            this.prefix = '';
          }, 700);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.select(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.select(this.options.length - 1);
        } else if (this.isIconGrid) {
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
              this.select(x + (y + 1) * columns);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              this.select(x + (y - 1) * columns);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              if (x > 0) {
                this.select(i - 1);
              }
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              if (x < columns - 1) {
                this.select(i + 1);
              }
            }
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.select(i + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.select(i - 1);
        }
      });
      if (!option.getAttribute('aria-selected')) {
        option.setAttribute('tabindex', -1);
      } else {
        this.selectedOption = i;
        option.setAttribute('tabindex', 0);
      }
    }
    if (this.selectedOption < 0 && this.options.length) {
      this.options[0].setAttribute('tabindex', 0);
    }
    this.root.addEventListener('click', () => {
      if (this.selectedOption >= 0) {
        this.options[this.selectedOption].focus();
      } else if (this.options.length) {
        this.options[0].focus();
      }
    });
  }

  select(index) {
    if (index < 0 || index >= this.options.length) {
      return;
    }
    const option = this.options[index];
    for (let other of this.options) {
      other.setAttribute('aria-selected', false);
      other.setAttribute('tabindex', -1);
    }
    option.setAttribute('aria-selected', true);
    option.setAttribute('tabindex', 0);
    option.focus();
    this.selectedOption = index;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const lists = document.getElementsByClassName('list');
  for (let list of lists) {
    new List(list);
  }
});
