// Generated on 2014-09-03 using generator-angular 0.9.5
'use strict';

// # Globbing regular expressions (regex)
// use regex ** to recursively match all subfolders
// 'test/spec/**/*.js'
// use regex {,*/} to match one subfolder
// 'styles/{,*/}*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Rewrite library to support HTML5 pushstate
  var modRewrite = require('connect-modrewrite');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    site   : grunt.file.readYAML('_config.yml'),
    pkg    : grunt.file.readJSON('package.json'),
    vendor : grunt.file.readJSON('.bowerrc').directory,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= site.app %>/**/*.js',],
        tasks: ['ngAnnotate','browserify:dev'],
        //tasks: ['ngAnnotate'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      hbs: {
        files: ['templates/**/*.hbs'],
        tasks: ['assemble','wiredep:dev','ngtemplates'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },      
      sass: {
        files: ['<%= site.app %>/**/*.scss',
                '<%= site.assets %>/styles/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= site.app %>/**/*.html',
          '.tmp/styles/**/*.css'
          //'<%= site.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['copy:staticFiles','ngtemplates']
      }
    },

    /*

    #ngAnnotate

    */
    ngAnnotate: {
      options: {
          singleQuotes: true,
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= site.app %>',
          src: ['**/*.js'],
          dest: '<%= site.temp %>/scripts'
        }]
      },
    },
        cssmin: {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1
        },
        target: {
            files: [{
              expand: true,
              cwd: '<%= site.dist %>/styles',
              src: ['<%= site.dist %>/styles/*.css', '!*.min.css'],
              dest: '<%= site.dist %>/styles',
              ext: '.css'
            }]
        }
    },
// css split 
     csssplit: {
     target: {
      src: ['<%= site.temp %>/styles/styles.css'],
      dest: '<%= site.temp %>/styles/min-styles.css',
      options: {
          maxSelectors: 4095,
          maxPages: 6,
          suffix: '_page_'
      }
    },
  },
   
/*
    #assemble

      Build HTML from templates and data

    */
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',    // can use {{assets}} to specify this dir
        postprocess: require('pretty'),  // cleans up HTML output

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        // views included as partial for static page generation
        partials: ['<%= site.partials %>/**/*.hbs','<%= site.templates %>/views/**/*.hbs'],
        layoutdir: '<%= site.layouts %>',
        // layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      myuvo: {
          files: [
            {
              expand: true,
              cwd: '<%= site.templates %>',
              src: ['views/**/*.hbs','*.hbs'],
              dest: '<%= site.temp %>'
            }
          ]
      }
    },

    /*
    
    #connect

      The actual grunt server settings

    */
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname:'localhost',
        //hostname:'10.119.166.96',
        //hostname:'192.168.1.137',
        livereload: 35729
      },
      livereload: {
        options: {
          open: {
            appName:'Chrome'
          },
          base: '<%= site.temp %>',
          middleware: function (connect, options) {
            return [
              //HTML5 push-state support
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              connect.static(options.base[0])
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static('app')
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= site.dist %>'
        }
      }
    },


    /*
    
    #clean

      Empties folders to start fresh

    */
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['<%= site.dist %>/**/*']
        }]
      },
      server: '<%= site.temp %>/**/*',
      noimages: {
        files: [{
          dot: true,
          src: ['<%= site.temp %>/*.html', '<%= site.temp %>/scripts', '<%= site.temp %>/styles', '<%= site.temp %>/views']
        }]
      },
      html: '<%= site.temp %>/**/*.html'
    },

    /*
    
    #autoprefixer

      Add vendor prefixed styles

    */
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= site.temp %>/styles/',
          src: '**/*.css',
          dest: '<%= site.temp %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
      },
      dev: {
        devDependencies: true,
        src: ['<%= site.temp %>/*.html'],
        ignorePath:  /\.\.\//
      },
      app: {
        src: ['<%= site.temp %>/*.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= site.app %>/styles/**/*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    browserify: {
      dist: {
        files: {
          '<%= site.temp %>/scripts/bundle.js': ['<%= site.temp %>/scripts/app.js'],
          //'<%= site.dist %>/scripts/minify.js': ['<%= site.temp %>/scripts/raphel.js'],
        },
        options: {
          transform: ['debowerify'],
        }
      },
      dev: {
        files: {
          '<%= site.temp %>/scripts/bundle.js': ['<%= site.temp %>/scripts/app.js'],
        },
        options: {
          transform: ['debowerify'],
          //watch:true,
          browserifyOptions: {
            debug: true
          }
        },
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        bundleExec: true,
        config: 'app/config.rb',
        importPath: 'bower_components/bootstrap-sass/assets',
        basePath: 'app'
      },
      dist: {
        httpPath: 'https://stg.myuvo.com',
        basePath: '.',
        options: {
          environment: 'production',
          watch: false,
          sourcemap: true,
          debugInfo: false,
          trace: false
        }
      },
      server: {
        httpPath: 'http://localhost:9000',
        basePath: '.',
        options: {
          environment: 'development',
          watch: false,
          sourcemap: true,
          debugInfo: true,
          trace: false
        }
      }
    },

    //faster sass compile based on libsass
    sass: {
      options: {
          sourceMap: true,
          includePaths: ['./bower_components'],
          imagePath: './assets/images',
      },
      dist: {
          files: {
            '<%= site.temp %>/styles/styles.css' : './<%= site.assets %>/styles/styles.scss',
//            '<%= site.temp %>/styles/styles2.css' : './<%= site.assets %>/styles/styles2.scss'
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= site.dist %>/scripts/**/*.js',
          '<%= site.dist %>/styles/**/*.css',
          // Disabling image file rename, because image paths come from json data
          // '<%= site.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= site.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= site.temp %>/index.html'],
      options: {
        dest: '<%= site.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
       html: ['<%= site.dist %>/**/*.html'],
       css: ['<%= site.dist %>/styles/**/*.css'],
       options: {
         assetsDirs: ['<%= site.dist %>','<%= site.dist %>/images']
       }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: ['*.html', 'views/**/*.html'],
         dest: '<%= site.dist %>'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= site.dist %>/*.html']
      },
      dev: {
        html: ['<%= site.temp %>/*.html']
      }
    },

    rewrite: {
      removeMock:{
        src: '<%= site.app %>/app.js',
        editor: function(contents, filePath) {
          return contents.replace(/'ngMockE2E',/,'//\'ngMockE2E\',').replace(/require\('\.\/mock'\)/,'//require(\'./mock\')');
        }
      },
      applyMock:{
        src: '<%= site.app %>/app.js',
        editor: function(contents, filePath) {
          return contents.replace(/\/\/'ngMockE2E',/,'\'ngMockE2E\',').replace(/\/\/require\('\.\/mock'\)/,'require(\'./mock\')');
        }
      },
      baseHref: {
        src: '<%= site.dist %>/index.html',
        editor: function(contents, filePath) {
          return contents.replace(/<base href="\/" \/>/, '<base href="/ccw/"');
        }
      }
    },

    /*
    
    #ngtemplates\

      Put html templates into templateCache

    */
    ngtemplates: {
      app : {
        cwd: '<%= site.temp %>',
        src: '**/*.html',
        dest: '<%= site.temp %>/scripts/templates.js'
      },
      options : {
        module : 'uvo'
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      webapp: {
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          dest: 'C:/GTMS/workspace_responsive/ccw-rsp/src/main/webapp',
          src:['**/*']
        }]
      },
      dist2: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= site.app %>',
          dest: '<%= site.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess'
          ]
        },
        {
          expand: true,
          cwd: '.',
          src: 'bower_components/**/*',
          dest: '<%= site.dist %>'
        },
        {
          expand: true,
          cwd: '<%= site.temp %>',
          dest: '<%= site.dist %>',
          src: ['**/*.html']
        }
      ]},
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= site.app %>',
          dest: '<%= site.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess'
          ]
        },
        {
          expand: true,
          cwd: '.',
          src: 'bower_components/**/*',
          dest: '<%= site.dist %>'
        },
        {
          expand:true,
          cwd: './assets',
          dest: '<%= site.dist %>',
          src: ['images/**/*', 'fonts/**/*','scripts/**/*.js']
        },
        {
          expand: true,
          cwd: '<%= site.temp %>',
          dest: '<%= site.dist %>',
          src: ['**/*.html']
        }
      ]},
      server: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: 'bower_components/**/*',
            dest: '<%= site.temp %>'
          },
          {
            expand: true,
            cwd: './assets',
            src: ['images/**/*','fonts/**/*','scripts/*.js'],
            dest: '<%= site.temp %>'
          }
        ]
      },
      styles: {
        files: [
          {
            expand: true,
            cwd: '<%= site.temp %>',
            src: ['styles/*.css'],
            dest: '<%= site.dist %>'
          }
        ]
      },
      scripts: {
        files: [
          {
            expand: true,
            cwd: '<%= site.temp %>',
            src: ['scripts/**/*.js'],
            dest: '<%= site.dist %>'
          }
        ]
      },
      staticFiles: {
        files: [
          {
            expand: true,
            cwd: './assets',
            src: ['scripts/*.js', 'scripts/vCal/*.js'],
            dest: '<%= site.temp %>'
          },
          {
            expand:true,
            cwd: './app',
            src: ['**/*.html'],
            dest: '<%= site.temp %>/views'
          }
        ]
      }
    },
    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass'
      ],
      test: [
        'sass'
      ],
      dist: [
        'sass',
      ]
    },
  });
  grunt.loadNpmTasks('grunt-csssplit');// grunt csssplit
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-rewrite');

  grunt.registerTask('dev', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'assemble',
      'wiredep:dev',
      'sass',
      'ngAnnotate',
      'browserify:dev',
      'autoprefixer',
      'copy:server',
      'copy:staticFiles',
      'ngtemplates',
      //'clean:html',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('serve',[
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dev2', [
    'clean:noimages',
    'assemble',
    'wiredep:dev',
    'sass',
    'ngAnnotate',
    'browserify:dev',
    'autoprefixer',
    'copy:staticFiles',
    'ngtemplates',
    'connect:livereload',
    'watch'
    ]);

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'convert',
    'assemble',
    'wiredep',
    // 'concurrent:test',
    'sass',
    'ngAnnotate',
    'browserify:dist',
    'autoprefixer',
    'connect:test',
    'karma',
    //'protractor:run'
  ]);

  grunt.registerTask('jsTest', [
    'jshint'
    ]);

    grunt.registerTask('devbuild', [
      'clean:server',
      'clean:dist',
      'rewrite:removeMock',
      'assemble',
      'wiredep:dev',
      'sass',
      'ngAnnotate',
      'browserify:dev',
      'autoprefixer',
      'copy:staticFiles',
      'csssplit',
      'ngtemplates',
      'copy:dist',
      'copy:styles',
      'copy:scripts',
      'rewrite:baseHref',
      'rewrite:applyMock',
      'copy:webapp'
    ]);

  grunt.registerTask('build', [
    'clean:server',
    'clean:dist',
    'rewrite:removeMock',
    'assemble',
    'wiredep:app',
    'useminPrepare',
    'sass',
    'ngAnnotate',
    'browserify:dist',
    'autoprefixer',
    'concat',
    'copy:staticFiles',
    'csssplit',
    'copy:dist',
    'cssmin',
    'uglify',
    'rewrite',
    'filerev',
    'usemin',
    'rewrite:baseHref',
    'rewrite:applyMock',
    'copy:webapp',
  ]);

  grunt.registerTask('build2', [
    'clean:server',
    'clean:dist',
    'rewrite:removeMock',
    'assemble',
    'wiredep:app',
    'useminPrepare',
    'sass',
    'ngAnnotate',
    'browserify:dist',
    'autoprefixer',
    'concat',
    'copy:staticFiles',
    'copy:dist2',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'rewrite:baseHref',
    'rewrite:applyMock',
    'copy:webapp'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    // 'test',
    'build'
  ]);
};
