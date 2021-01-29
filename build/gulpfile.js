'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

function compile() {
  return src('../src/assets/scss/index.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      // browsers: ['ie > 9', 'last 2 versions'],
      browsers: [
        '> 1%',
            'last 2 versions',
              'not dead'
      ],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(dest('../dist'));
}

// function copyfont() {
//   return src('./src/fonts/**')
//     .pipe(cssmin())
//     .pipe(dest('./lib/fonts'));
// }

exports.build = series(compile /* 如果还有其他任务，就这么写 copyfont*/);
