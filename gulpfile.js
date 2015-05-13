//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
less        = require('gulp-less');
sourceMaps  = require('gulp-sourcemaps');
cachebust   = require('gulp-cachebust');
imagemin    = require('gulp-imagemin');
phpcs       = require('gulp-phpcs');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');

gulp.task('browserSync', function() {
    // browserSync({
    //     server: {
    //         baseDir: "app/"
    //     },
    //     options: {
    //         reloadDelay: 250
    //     },
    //     notify: false
    // });
});


//compressing images & handle SVG files
gulp.task('images', function(tmp) {
    // gulp.src(['app/images/*.jpg', 'app/images/*.png'])
    //     .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    //     .pipe(gulp.dest('app/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function() {
    // gulp.src(['app/images/**/*', '!app/images/README'])
    //     .pipe(gulp.dest('dist/images'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    // return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
    //             //this is the filename of the compressed version of our JS
    //            .pipe(concat('app.js'))
    //            //catch errors
    //            .on('error', gutil.log)
    //            //compress :D
    //            .pipe(uglify())
    //            //where we will store our finalized, compressed script
    //            .pipe(gulp.dest('app/scripts'))
    //            //notify browserSync to refresh
    //            .pipe(browserSync.reload({stream: true}));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('app.js'))
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('dist/scripts'));
});

//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('less/main.less')
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
               .pipe(less({
                      errLogToConsole: true,
                      includePaths: [
                          'less/components'
                      ]
               }))
               // .pipe(autoprefixer({
               //     browsers: autoPrefixBrowserList,
               //     cascade:  true
               // }))
               //catch errors
               .on('error', gutil.log)
               //the final filename of our combined css file
               .pipe(concat('main.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write('./maps'))
               //where to save our final, compressed css file
               .pipe(gulp.dest('./css'));
               //notify browserSync to refresh
               // .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    // return gulp.src('less/main.less')
    //             //include SCSS includes folder
    //            .pipe(sass({
    //                   includePaths: [
    //                       'less/components',
    //                   ]
    //            }))
    //            .pipe(autoprefixer({
    //                browsers: autoPrefixBrowserList,
    //                cascade:  true
    //            }))
    //            //the final filename of our combined css file
    //            .pipe(concat('styles.css'))
    //            .pipe(minifyCSS())
    //            //where to save our final, compressed css file
    //            .pipe(gulp.dest('dist/styles'));
});

gulp.task('php-codestandards', function () {
  return gulp.src(['library/*.php', 'templates/*.phtml'])
      .pipe(phpcs({
        bin: 'vendor/squizlabs/php_codesniffer/scripts/phpcs',
        standard: 'PSR2',
        // showSniffCode : true,
        // colors: true,
        warningSeverity: 0
      }))
      .pipe(phpcs.reporter('log'));
})


//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    // return gulp.src('app/*.html')
    //     .pipe(browserSync.reload({stream: true}))
    //    //catch errors
    //    .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    // gulp.src('app/*')
    //     .pipe(gulp.dest('dist'));
    // // gulp.src('templates/*')
    // //  //insert our cache busting logic 

    // //grab any hidden files too
    // gulp.src('app/.*')
    //     .pipe(gulp.dest('dist'));

    // gulp.src('app/fonts/**/*')
    //     .pipe(gulp.dest('dist/fonts'));

    // //grab all of the styles
    // gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
    //     .pipe(gulp.dest('dist/styles'));
});

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    // return shell.task([
    //   'rm -rf dist'
    // ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  // return shell.task([
  //     'mkdir dist',
  //     'mkdir dist/fonts',
  //     'mkdir dist/images',
  //     'mkdir dist/scripts',
  //     'mkdir dist/styles'
  //   ]
  // );
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and LESS files
gulp.task('default', ['browserSync', 'styles', 'php-codestandards'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('library/*.php', ['php-codestandards']);
    gulp.watch('templates/*.phtml', ['php-codestandards']);
    gulp.watch('less/**/*.less', ['styles']);
    gulp.watch('less/*.less', ['styles']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));
