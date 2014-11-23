#!/bin/sh
#  s/(^|\b|\.\s|\?\s|)([A-Z]([A-Z]|[0-9])+)(\b|s|\.|;|,|:|\?|$)/$1<span class="smcp">$2</span>$4/g
#  s/(^|\?\s|\.\s)<span class="smcp">/$1<span class="lgcp">/g
#
cat src/text/*.md      | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/intro.kit
cat src/text/ch1/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap01.kit
cat src/text/ch2/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap02.kit
cat src/text/ch3/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap03.kit
cat src/text/ch4/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap04.kit
cat src/text/ch5/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap05.kit
cat src/text/ch6/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap06.kit
cat src/text/ch7/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/chap07.kit
cat src/text/apA/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/apndA.kit
cat src/text/apB/*.md  | sed -e 's_NEXTFIGURENUMBER_\<span class="nextfigure"/\>_g' -e 's_LASTFIGURENUMBER_\<span class="lastfigure"/\>_g' | pandoc --smart -f markdown -t html5 -o build/apndB.kit
