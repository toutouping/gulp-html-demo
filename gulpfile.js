'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var babelify = require('babelify');
var browserify = require('browserify');
var exorcist = require('exorcist');
var source = require('vinyl-source-stream');
var uglifyify = require('uglifyify');
var watchify = require('watchify');
var assign = require('lodash.assign');
var gutil = require('gulp-util');
var moment = require('moment');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var scsslint = require('gulp-scss-lint');
var puglint = require('gulp-pug-lint');


require('gulp-help')(gulp, {
    description: 'Help listing.'
});

var src_paths = {
    view: 'src/view/*.pug',
    all_view: 'src/view/**/*.pug',
    styles: 'src/style/style.scss',
    all_style: 'src/style/**/**/*',
    style_include: ['src/style/include','src/style/include/components'],
    script: 'src/script/main.js',
    image: 'src/image/**/*',
    font: 'src/font/*',
    extra: ['src/*.{txt,json,ico}']
}

var dist_paths = {
    view: 'dist/',
    styles: 'dist/asset/style/',
    script: 'dist/asset/script/',
    image: 'dist/asset/image/',
    font: 'dist/asset/font/',
    bundle_map: 'dist/asset/script/bundle.js.map',
    extra: 'dist'
}

var asset = {
  css_source: ['src/asset/*.css'],
  js_source: ['src/asset/*.js','node_modules/jquery/dist/jquery.min.js']
}

var task = {
    build_view: 'build_view',
    watch_view: 'watch_view',
    build_style: 'build_style',
    watch_style: 'watch_styles',
    build_script: 'build_script',
    watch_script: 'watch_script',
    build_image: 'build_image',
    build_font: 'build_font',
    build_asset: 'build_asset',
    extra: 'extra',
    linit: 'linit',
    develop: 'develop',
    server: 'server',
    reload: 'reload',
    watch: 'watch',
    build: 'build'
}


gulp.task(task.server,()=>{
  connect.server({
    root: 'dist/',
    port: 3002,
    livereload: true
  });
});


gulp.task(task.build_view, 'build view',()=>{
  return gulp.src(src_paths.view)
             .pipe(pug({pretty: true}))
             .pipe(gulp.dest(dist_paths.view))
             .pipe(connect.reload());
});

gulp.task(task.watch_view, 'watch view',()=>{
  return gulp.watch(src_paths.all_view,[task.build_view]);
});

gulp.task(task.build_style,'build style',()=>{
   gulp.src(src_paths.styles)
       .pipe(concat('bundle'))
       .pipe(sourcemaps.init())
       .pipe(sass({
           includePaths: src_paths.style_include
       }))
       .on('error',notify.onError('Error: <%= error.message %>'))
       .pipe(autoprefixer({
                  browsers: [
                    'ie >= 10',
                    'ie_mob >= 10',
                    'ff >= 30',
                    'chrome >= 34',
                    'safari >= 7',
                    'opera >= 23',
                    'ios >= 7',
                    'android >= 4.4'
                  ],
                  cascade: true,
                  remove:true
              }))

       .pipe(sourcemaps.write('./'))
       .pipe(gulp.dest(dist_paths.styles))
       .pipe(notify('Comiled sass ('+moment().format('MMM Do h:mm:ss A')+')'))
       .pipe(connect.reload());
});

gulp.task(task.watch_style, 'watch style',()=>{
   return gulp.watch(src_paths.all_style,[task.build_style]);
});

function init_browserify(){
  var opts = assign({}, watchify.args, {
    entries: [src_paths.script],
    debug: true
  });

  var br = browserify(opts)
            .transform(babelify,{
              presets: ['es2015'],
            })
            .transform(uglifyify,{global:true});

   return br;
}

function bundle_js(bundler){
    return bundler.bundle()
                  .on('error',notify.onError('Error: <%=error.message %>'))
                  .pipe(exorcist(dist_paths.bundle_map))
                  .pipe(source('bundle.js'))
                  .pipe(gulp.dest(dist_paths.script))
                  .pipe(notify('Compiled scripts (' + moment().format('MMM Do h:mm:ss A') + ')'))
                  .pipe(connect.reload());
}

gulp.task(task.build_script, ()=>{
      var bundler = init_browserify();
      bundle_js(bundler);
});

gulp.task(task.watch_script, ()=>{
      var br = init_browserify();
      var w = watchify(br)
      .on('update', function(){
          bundle_js(w);
      })
      .on('log', gutil.log);

      bundle_js(w);
});

gulp.task(task.build_font, 'copy fonts to dest dir', function(){
    return gulp.src(src_paths.font)
        .pipe(gulp.dest(dist_paths.font));
});

gulp.task(task.build_image, 'copy image to dest dir', function(){
    return gulp.src(src_paths.image)
        .pipe(gulp.dest(dist_paths.image));
});

gulp.task(task.extra, 'copy extra to dest dir', function(){
    return gulp.src(src_paths.extra)
        .pipe(gulp.dest(dist_paths.extra));
});

gulp.task(task.build_asset, ()=>{
   gulp.src(asset.css_source)
       .pipe(gulp.dest(dist_paths.styles));
   gulp.src(asset.js_source)
       .pipe(gulp.dest(dist_paths.script));
   return;
});

// @see http://eslint.org/docs/rules/

gulp.task(task.linit, ()=>{
  gulp.src(src_paths.all_view).pipe(puglint());
  gulp.src(src_paths.styles).pipe(scsslint());
  gulp.src(src_paths.script)
      .pipe(eslint({
              parserOptions: {
                  sourceType: 'module'
              },
              'rules':{
                'eqeqeq': 'error',
                'curly': 'error',
                'quotes': ['warn', 'single'],
              }
            }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  return;
});

gulp.task(task.build,[task.linit,task.build_asset,task.build_font,task.build_image,task.extra,task.build_style,task.build_script,task.build_view]);
gulp.task(task.develop,[task.build,task.watch_script,task.watch_style,task.watch_view,task.server]);
