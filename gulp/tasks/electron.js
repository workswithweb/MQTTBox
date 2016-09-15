var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task('electronBuild', function(callback) {
    gulp.src("src/app/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("build"));
});