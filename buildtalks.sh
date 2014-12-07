#!/bin/sh
cat src/text/talks/intro-to-d3/intro-to-d3.md | pandoc --smart --slide-level=2 -t dzslides -o build/intro-to-d3.kit
