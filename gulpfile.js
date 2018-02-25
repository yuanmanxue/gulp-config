/**
 * @Author: yuanmanxue
 * @Date:   2018-01-29 02:53:24
 * @Last modified by:   yuanmanxue
 * @Last modified time: 2018-01-30 05:27:19
 */

// gulpfile.js
var gulp = require('gulp'),
    htmlmini = require('gulp-html-minify'),//压缩html
    autoprefixer = require('gulp-autoprefixer'),// 自动添加CSS3浏览器前缀
    sass = require('gulp-ruby-sass'), // sass/scss编译
    minifycss = require('gulp-minify-css'), //压缩css
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),//压缩js
    imagemin = require('gulp-imagemin'),//压缩图片
    pngquant = require('imagemin-pngquant'), // 深度压缩
    spriter = require('gulp-css-spriter'),
    useref = require('gulp-useref'),//解析构建块在HTML文件来代替引用未经优化的脚本和样式表。
    htmlreplace = require('gulp-html-replace'),
    RevAll = require('gulp-rev-all'),
    livereload = require('gulp-livereload'),//网页自动刷新
    webserver = require('gulp-webserver'),//静态服务器
    rename = require('gulp-rename'), // 通常为了表示该文件是压缩版，会在文件名后加上 .min 后缀。
    sourcemaps = require('gulp-sourcemaps'),//误信息中直接找到对应代码的原始位置
    concattt = require('gulp-concat'), //合并文件
    // filter = require('gulp-filter'), //在虚拟文件流中过滤文件
    del = require('del');

gulp.task('del', function() {
  del('./dist'); // 构建前先删除dist文件里的旧版本
})

gulp.task('html',function(){
    gulp.src('index.html')
    .pipe(useref())
    .pipe(htmlreplace({
       'css':'main.min.css',
       'js':'main.min.js'
     }))
    .pipe(htmlmini({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
})

gulp.task('css',function(){
    gulp.src('**/*.css')  //这里是指src目录下所有的css后缀文件
    .pipe(autoprefixer({
        browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
        cascade: false // 是否美化属性值
      }))
    .pipe(concattt('main.css'))    //合并文件
    .pipe(minifycss())           //压缩css
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(gulp.dest('dist/css'))
})

gulp.task('sass', function () {
  return sass('**/*.scss', { style: 'compressed' }) // 整个压缩成一行
    .pipe(autoprefixer({
      browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
      cascade: false // 是否美化属性值
    }))
    .pipe(gulp.dest('dist/sass')) // 输出路径
})

gulp.task('js',function(){
    gulp.src('js/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concattt('main.js'))
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(uglify()) // 使用uglify进行压缩，并保留部分注释
    .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
    .pipe(gulp.dest('dist/js'))
})

gulp.task('img',function(){
    gulp.src('images/*.{jpg,png,gif,ico}')         //压缩图片路径
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不要移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    }))               //压缩图片
    .pipe(gulp.dest('dist/images'))  //压缩图片输出路径
})

gulp.task('server', function() {
	gulp.src( './' ) // 服务器目录（./代表根目录）
	.pipe(webserver({ // 运行gulp-webserver
		livereload: true, // 启用LiveReload
		open: true // 服务器启动时自动打开网页
	}))
})

gulp.task('watch',function(){
  // 监听 html
  gulp.watch('*.html', ['html'])
  // 监听 css
  gulp.watch('css/*.css', ['css'])
  // 监听 scss
  gulp.watch('sass/*.scss', ['sass'])
  // 监听 images
  gulp.watch('images/*.{png,jpg,gif,svg}', ['img'])
  // 监听 js
  gulp.watch('js/*.js', ['js']);
})

gulp.task('build',['del','html','css','sass','js','img'])
gulp.task('default',['server','watch'])
