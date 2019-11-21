#!/usr/bin/env bash


browserify -s Fantasy -t [ babelify --presets [ @babel/preset-env ] --plugins [ @babel/plugin-proposal-class-properties ] ] ./src/index.ts -p [ tsify --target es2017 --experimentalDecorators ] -o ./www/js/fantasybaseball.js -v

rm -R -f dist
cp -R www dist
