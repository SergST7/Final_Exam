
module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/styles/css/style.css': 'src/styles/css/*.css'
                }
            }
        },

        uglify: {
            build: {
                src: 'build/scripts/main.js',
                dest: 'build/scripts/main.min.js'
            }
        },

        image: {
            static: {
                options: {
                    pngquant: true,
                    optipng: false,
                    zopflipng: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    mozjpeg: true,
                    gifsicle: true,
                    svgo: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['*.{png,jpg,gif,svg}'],
                    dest: 'build/img/'
                }]
            },
        },


        rig: {
            compile: {
                files: {
                    'build/scripts/main.js': ['src/scripts/main.js']
                }
            }
        },

        clean: ["build/"],

        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html', 'fonts/**'],
                        dest: 'build/'
                    },

                    {
                        expand: true,
                        cwd: 'src/scripts',
                        src: ['html5shiv.js', 'css3-mediaqueries.js'],
                        dest: 'build/scripts/',
                        filter: 'isFile'
                    },

                    // includes files within path and its sub-directories
                    {
                        expand: true, cwd: 'src/',
                        src: ['styles/ie8/**'], dest: 'build/'
                    },

                ]
            }
        }

    });

    // 3. Тут мы указываем Grunt, что хотим использовать этот плагин
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
    grunt.registerTask('default', [
        'clean',
        'copy',
        'rig',
        'cssmin',
        'uglify',
        'image'
    ]);

};
