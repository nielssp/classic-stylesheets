VERSION := 2.1
THEMES := $(foreach I,$(wildcard themes/*),$(notdir $I))
SOURCES := $(wildcard themes/*/theme.scss) $(wildcard themes/winxp/skins/*.scss)
OBJECTS := $(SOURCES:.scss=.css)

.PHONY: all
all: $(OBJECTS)

.PHONY: watch
watch:
	sass --no-source-map -w $(foreach I,$(SOURCES:.scss=),$I.scss:$I.css)

%.css: %.scss
	sass --no-source-map $< $@

.PHONY: clean
clean:
	rm -rf build
	rm -rf dist

.PHONY: package
package: $(foreach I,$(THEMES),dist/classic-stylesheets-$I-$(VERSION).tar.gz) dist/classic-stylesheets-$(VERSION).tar.gz

dist/classic-stylesheets-$(VERSION).tar.gz: $(foreach I,$(THEMES),build/$I) build/layout.css build/layout.min.css build/LICENSE
	mkdir -p dist
	tar czf $@ -C build $(THEMES) layout.css layout.min.css LICENSE

dist/classic-stylesheets-%-$(VERSION).tar.gz: build/% build/LICENSE
	mkdir -p dist
	tar czf $@ -C build $(notdir $<) LICENSE

build/%: $(wildcard themes/%/*) $(wildcard themes/%/skins/*) build/layout.min.css
	mkdir -p $@/skins
	cp build/layout.min.css $@
	cp themes/$(notdir $@)/*.css $@
	-cp themes/$(notdir $@)/*.svg $@
	cp themes/$(notdir $@)/skins/*.css $@/skins
	-cp themes/$(notdir $@)/skins/*.svg $@/skins
	sass --no-source-map -s compressed $@/theme.css $@/theme.min.css
	cat layout.css $@/theme.css | sass --no-source-map --stdin -s compressed > $@/combined.min.css

build/LICENSE: LICENSE
	mkdir -p build
	cp $< $@

build/layout.css: layout.css
	mkdir -p build
	cp $< $@

build/layout.min.css: layout.css
	mkdir -p build
	sass --no-source-map -s compressed $< $@
