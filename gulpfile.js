const { src, dest, watch, parallel } = require('gulp'); // para extrae multiples valores de utiliza claves 
//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); // se encarga de que ande en el navegador que eliga
const cssnano = require('cssnano'); // comprime el codigo css
const postcss = require('gulp-postcss'); // le hace algunas tranformaciones 
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JS
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss') // identificar el archivo .SCSS a complilar
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // compilarlo       
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')) //almacenarla en disco duro 
    done();
}


function Imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();

}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))


    done();

}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();

}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {

    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}


exports.css = css;
exports.js = javascript;
exports.Imagenes = Imagenes;
//exports.versionWebp = versionWebp;
//exports.versionAvif = versionAvif;
exports.dev = parallel(Imagenes, javascript, dev);

//parallel ejecuta todo al mismo tiempo en paralelo
//serial una despues de otra