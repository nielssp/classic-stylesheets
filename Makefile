SOURCES := $(wildcard themes/*/theme.scss) $(wildcard themes/winxp/skins/*.scss)
OBJECTS := $(SOURCES:.scss=.css)

.PHONY: all
all: $(OBJECTS)

.PHONY: watch
watch:
	sass --no-source-map -w $(foreach I,$(SOURCES:.scss=),$I.scss:$I.css)

%.css: %.scss
	sass --no-source-map $< $@
