var gulp = require('gulp');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var del = require('del');
var shell = require('gulp-shell');
var clean = require('gulp-clean');

var tsProject = ts.createProject({
    declaration: true
});

gulp.task('build', function() {
    runSequence(
        'clean-dist',
        'copy-vss-sdk',
        'transpile-ts',
        'build-vsix',
        'copy-vsix',
        'clean-vsix');
});

gulp.task('clean-dist', function() {
    gulp.src(['dist/**', '!dist'])
        .pipe(clean({force: true}));
});

gulp.task('transpile-ts', function() {
    gulp.src('scripts/*.ts')
        .pipe(tsProject());
});

gulp.task('build-vsix', shell.task([
    'tfx extension create --manifest-globs vss-extension.json --rev-version'
]));

gulp.task('copy-vss-sdk', function () {
    gulp.src('node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js')
        .pipe(gulp.dest('sdk/scripts/'));
});

gulp.task('copy-vsix', function() {
    gulp.src('*.vsix')
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean-vsix', function() {
    gulp.src('*.vsix')
        .pipe(clean({force: true}));
});

gulp.task('watch', function () {
    gulp.watch(['*.html', 'vss-extension.json', 'scripts/*.js', 'images/**'], ['build']);
});

gulp.task('default', ['build']);