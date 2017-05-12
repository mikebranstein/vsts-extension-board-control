var gulp = require('gulp');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var del = require('del');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var merge = require('merge2');

gulp.task('build', function() {
    runSequence(
        'clean-dist',
        'copy-vss-sdk',
        'transpile-ts',
        'build-vsix',
        'copy-vsix',
        'clean-vsix');
});

gulp.task('publish', function() {
    runSequence(
        'clean-dist',
        'copy-vss-sdk',
        'transpile-ts',
        'build-vsix-publish',
        'copy-vsix',
        'clean-vsix');
});

gulp.task('clean-dist', function() {
   gulp.src(['dist/**', '!dist'])
        .pipe(clean({force: true}));
});

gulp.task('copy-vss-sdk', function () {
    gulp.src('node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js')
        .pipe(gulp.dest('sdk/scripts/'));
});

gulp.task('transpile-ts', function() {
    var tsResult = gulp.src('scripts/**/*.ts')
        .pipe((ts.createProject('tsconfig.json'))());

    return merge([
        // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('scripts')),
        tsResult.js.pipe(gulp.dest('scripts'))
    ]);
});

gulp.task('build-vsix', shell.task([
    'tfx extension create --manifest-globs vss-extension.json --rev-version'
]));

gulp.task('build-vsix-publish', shell.task([
    'tfx extension create --manifest-globs vss-extension.json'
]));

gulp.task('copy-vsix', function() {
    gulp.src('*.vsix', {base: "./"})
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean-vsix', function() {
    gulp.src('*.vsix')
        .pipe(clean({force: true}));
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['*.html', "scripts/**/*.ts", 'images/**'], ['build']);
});

gulp.task('default', ['build']);