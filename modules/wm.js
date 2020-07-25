const drag = (() => {
  const instance = {};

  let object = null;
  let x, y, _threshold;

  instance.start = (obj, e, threshold) => {
    e.preventDefault();
    object = obj;
    _threshold = threshold || 0;
    _threshold *= _threshold;
    x = e.clientX;
    y = e.clientY;
  };

  document.addEventListener('mousemove', e => {
    if (object) {
      let dx = e.clientX - x;
      let dy = e.clientY - y;
      if (_threshold) {
        if (dx * dx + dy * dy < _threshold) {
          return;
        }
        _threshold = 0;
      }
      object.dragMove(dx, dy, e);
      x = e.clientX;
      y = e.clientY;
    }
  });
  document.addEventListener('mouseup', e => {
    if (object) {
      if (!_threshold) {
        object.dragEnd();
      }
      object = null;
    }
  });

  return instance;
})();

class WindowHost {
  constructor(root) {
    this.root = root;
    this.edgeMaximize = true;
    this.windows = [];
    this.activeWindow = null;

    this.root.addEventListener('mousedown', e => this.focus(null));

    window.addEventListener('resize', () => {
      for (let w of this.windows) {
        w.reposition();
      }
    });
  }

  create(windowElement) {
    const w = new Window(windowElement, this);
    this.windows.push(w);
    w.focus();
  }

  focus(w) {
    if (this.activeWindow) {
      this.activeWindow.setActive(false);
    }
    this.activeWindow = w;
    if (this.activeWindow) {
      this.activeWindow.setActive(true);
    }
  }
}

class Window {
  constructor(root, host) {
    this.root = root;
    this.root.csWindow = this;
    this.host = host;
    this.titleBarText = root.querySelector('.title-bar-text');
    this.resizeX = 0;
    this.resizeY = 0;
    this.resizeCursor = '';
    this.resizing = false;
    this.maximized = false;
    this.oldPosition = null;

    this.init();
    this.initButtons();

    this.titleBarText.addEventListener('mousedown', e => drag.start(this, e, this.maximized ? 10 : 0));

    this.titleBarText.addEventListener('dblclick', e => this.maximize());

    this.root.addEventListener('mousedown', e => {
      e.stopPropagation();
      this.focus();
    });

    this.root.addEventListener('mousemove', e => {
      if (!this.resizing) {
        this.resizeX = this.resizeY = 0;
        this.resizeCursor = '';
        if (e.target === this.root && !this.maximized) {
          const rect = this.root.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (y < 20) {
            this.resizeY = -1;
          } else if (y > rect.height - 20) {
            this.resizeY = 1;
          }
          if (x < 20) {
            this.resizeX = -1;
          } else if (x > rect.width - 20) {
            this.resizeX = 1;
          }
        }
        if (this.resizeX || this.resizeY) {
          this.resizeCursor = '';
          if (this.resizeY < 0) {
            this.resizeCursor += 'n';
          } else if (this.resizeY > 0) {
            this.resizeCursor += 's';
          }
          if (this.resizeX < 0) {
            this.resizeCursor += 'w';
          } else if (this.resizeX > 0) {
            this.resizeCursor += 'e';
          }
          this.resizeCursor += '-resize';
        }
        this.root.style.cursor = this.resizeCursor;
      }
    });

    this.root.addEventListener('mousedown', e => {
      if (e.target === this.root && !this.maximized && (this.resizeX || this.resizeY)) {
        e.stopPropagation();
        this.resizing = true;
        document.body.style.cursor = this.resizeCursor;
        drag.start(this, e, 0);
      }
    });
  }

  init() {
    const hostRect = this.host.root.getBoundingClientRect();
    const rect = this.root.getBoundingClientRect();
    this.root.style.position = 'absolute';
    this.x = rect.left - hostRect.left;
    this.y = rect.top - hostRect.top;
    this.width = rect.width;
    this.height = rect.height;
    this.updatePosition();
  }

  initButtons() {
    const buttons = this.root.querySelectorAll('.title-bar-buttons > button');
    for (let button of buttons) {
      if (button.hasAttribute('data-maximize')) {
        button.addEventListener('click', e => this.maximize());
      }
    }
  }

  setActive(active) {
    if (active) {
      this.root.classList.remove('inactive');
    } else {
      this.root.classList.add('inactive');
    }
  }

  focus() {
    this.host.focus(this);
  }

  dragMove(dx, dy, e) {
    if (this.resizing) {
      if (this.resizeX < 0) {
        this.x += dx;
      }
      if (this.resizeY < 0) {
        this.y += dy;
      }
      this.width += dx * this.resizeX;
      this.height += dy * this.resizeY;
      this.updatePosition();
    } else {
      const hostRect = this.host.root.getBoundingClientRect();
      if (this.host.edgeMaximize && e.clientY - hostRect.top < 5) {
        if (!this.maximized) {
          this.maximize();
        }
        return;
      } else if (this.maximized) {
        this.maximized = false;
        this.root.classList.remove('maximized');
        if (this.oldPosition) {
          this.width = this.oldPosition.width;
          this.height = this.oldPosition.height;
          this.x = Math.floor(e.clientX - hostRect.left - this.width * e.clientX / hostRect.width);
        }
      }
      this.x += dx;
      this.y += dy;
      this.updatePosition();
    }
  }

  dragEnd() {
    if (this.resizing) {
      this.resizing = false;
      this.resizeCursor = '';
      this.resizeX = this.resizeY = 0;
      this.root.style.cursor = '';
      document.body.style.cursor = '';
    }
    this.reposition();
  }

  reposition() {
    const hostRect = this.host.root.getBoundingClientRect();
    if (this.maximized) {
      this.x = 0;
      this.y = 0;
      this.width = hostRect.width;
      this.height = hostRect.height;
    } else {
      if (this.y < 0) {
        this.y = 0;
      } else if (this.y + 30 > hostRect.height) {
        this.y = hostRect.height - 30; 
      }
      if (this.x + this.width < 50) {
        this.x = 50 - this.width;
      } else if (this.x + 30 > hostRect.width) {
        this.x = hostRect.width - 30;
      }
    }
    this.updatePosition();
  }

  updatePosition() {
    this.root.style.left = this.x + 'px';
    this.root.style.top = this.y + 'px';
    this.root.style.width = this.width + 'px';
    this.root.style.height = this.height + 'px';
  }

  maximize() {
    this.maximized = !this.maximized;
    if (this.maximized) {
      this.root.classList.add('maximized');
      this.oldPosition = { x: this.x, y: this.y, width: this.width, height: this.height };
      this.reposition();
    } else {
      this.root.classList.remove('maximized');
      if (this.oldPosition) {
        Object.assign(this, this.oldPosition);
        this.reposition();
      }
    }
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const host = new WindowHost(document.getElementsByTagName('main')[0]);
  const windows = document.getElementsByClassName('window');
  for (let w of windows) {
    host.create(w);
  }
});
