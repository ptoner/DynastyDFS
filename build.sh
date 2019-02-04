#!/usr/bin/env bash


browserify  -s Fantasy -t [ babelify --presets [ @babel/preset-env ] --plugins [ @babel/plugin-proposal-class-properties ] ] ./js/index.ts -p [ tsify  ] -o ./www/js/fantasybaseball.js -v

rm -R -f dist
cp -R www dist
