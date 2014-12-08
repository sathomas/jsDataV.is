BOOK = build/apndA.kit build/apndB.kit build/chap01.kit build/chap02.kit build/chap03.kit build/chap04.kit build/chap05.kit build/chap06.kit build/chap07.kit build/intro.kit
TALKS = build/intro-to-d3.kit

# Build an intermediate .kit file for the book.
#   stdin: Markdown source
#   stdout: html5 output
BUILDBOOK = sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5

# Build an intermediate .kit file for a talk.
#   stdin: Markdown source
#   stdout: html5 output
BUILDTALK = pandoc --smart --slide-level=2 -t dzslides

# Rules for building the book (hacked copy-and-paste for now)

build/intro.kit: src/text/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap01.kit: src/text/chap01/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap02.kit: src/text/chap02/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap03.kit: src/text/chap03/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap04.kit: src/text/chap04/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap05.kit: src/text/chap05/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap06.kit: src/text/chap06/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/chap07.kit: src/text/chap07/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/apndA.kit: src/text/apndA/*.md
	@cat $^ | $(BUILDBOOK) > $@

build/apndB.kit: src/text/apndB/*.md
	@cat $^ | $(BUILDBOOK) > $@

# Rules for building talks

build/intro-to-d3.kit: src/text/talks/intro-to-d3/*.md
	@cat $^ | $(BUILDTALK) > $@

# Targets for normal human beings

book: $(BOOK)

talks: $(TALKS)
	
all: book talks
	@echo Building everything $@