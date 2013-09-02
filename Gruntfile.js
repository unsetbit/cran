module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy'); 
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-hug');
  grunt.loadTasks('./dev/tasks');

  var config = {
    meta: {
      banner: '/*! cran 0.1.0 - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> Ozan Turgut */'
    },
    properties: {
      scriptsDir: './ui/scripts',
      stylesDir: './ui/styles',
      staticDir: './ui/static',
      testsDir: './ui/tests',
      componentsDir: './ui/components',
      templatesDir: './ui/templates',
      tmpDir: './tmp',
      devServerDir: './devServer',
      distDir: './dist'
    },

    clean: {
      tmp: ['<%= properties.tmpDir %>'],
      dev: ['<%= properties.devServerDir %>'],
      dist: ['<%= properties.distDir %>']
    },

    copy:{
      devIndex: {
        files: [{ 
                  dest: '<%= properties.devServerDir %>/index.html',
                  src: '<%= properties.templatesDir %>/main.html',
              }]
      },
      devTemplates:{
        files: [
          {
            dest: '<%= properties.devServerDir %>/template/',
            cwd: '<%= properties.templatesDir %>/',
            src: '**',
            expand: true
          }
        ]
      },
      devStyles: {
        files: [
          { 
            dest: '<%= properties.devServerDir %>',
            cwd: '<%= properties.tmpDir %>',
            expand: true,
            src: ['cran.css', 'images/**']
          },
          { 
            dest: '<%= properties.devServerDir %>/fonts',
            cwd: '<%= properties.componentsDir %>/bootstrap/fonts',
            expand: true,
            src: ['**']
          },
          {
            dest: '<%= properties.devServerDir %>/static',
            cwd: '<%= properties.staticDir %>',
            expand: true,
            src: ['**']
          }
        ]
      },
      devScripts: {
        files: [
          {
            dest: '<%= properties.devServerDir %>',
            cwd: '<%= properties.tmpDir %>',
            expand: true,
            src: ['cran.js']
          },
          { 
              dest: '<%= properties.devServerDir %>/worker-javascript.js',
              src: '<%= properties.componentsDir %>/ace-builds/src/worker-javascript.js',
          }
        ]
      },
      dist:{
        files: [
          { 
              dest: '<%= properties.distDir %>/index.html',
              src: '<%= properties.templatesDir %>/main.html',
          },
          {
            dest: '<%= properties.distDir %>/template/',
            cwd: '<%= properties.templatesDir %>/',
            src: '**',
            expand: true
          },
          { 
            dest: '<%= properties.distDir %>/fonts',
            cwd: '<%= properties.componentsDir %>/bootstrap/fonts',
            expand: true,
            src: ['**']
          },
          { 
            dest: '<%= properties.distDir %>',
            cwd: '<%= properties.tmpDir %>',
            expand: true,
            src: ['images/**', 'fonts/**']
          },
          {
            dest: '<%= properties.distDir %>/static',
            cwd: '<%= properties.staticDir %>',
            expand: true,
            src: ['**']
          },
          { 
              dest: '<%= properties.distDir %>/worker-javascript.js',
              src: '<%= properties.componentsDir %>/ace-builds/src/worker-javascript.js',
          },
          { 
              dest: '<%= properties.devServerDir %>/worker-javascript.js',
              src: '<%= properties.componentsDir %>/ace-builds/src/worker-javascript.js',
          }
        ]
      }
    },

    hug: {
      cran:{
        src: ['<%= properties.scriptsDir %>/*'],
        dest: '<%= properties.tmpDir %>/app.js'
      }
    },

    concat: {
      scripts: {
        src: [
          '<%= properties.componentsDir %>/jquery/jquery.js',
          '<%= properties.componentsDir %>/angular/angular.js',
          '<%= properties.componentsDir %>/angular-route/angular-route.js',
          '<%= properties.componentsDir %>/ace-builds/src/ace.js',
          '<%= properties.componentsDir %>/ace-builds/src/mode-javascript.js',
          '<%= properties.componentsDir %>/angular-ui-ace/ui-ace.js',
          '<%= properties.componentsDir %>/bootstrap/dist/js/bootstrap.js',
          '<%= properties.componentsDir %>/angular-bootstrap/ui-bootstrap.js',
          '<%= properties.componentsDir %>/angular-bootstrap/ui-bootstrap-tpls.js',
          '<%= properties.componentsDir %>/later/later.js',
          '<%= properties.componentsDir %>/moment/moment.js',
          '<%= hug.cran.dest %>'
        ],
        dest: '<%= properties.tmpDir %>/cran.js'
      },
      styles: {
        src: [
          '<%= properties.componentsDir %>/bootstrap/dist/css/bootstrap.css',
          '<%= properties.tmpDir %>/app.css'
        ],
        dest: '<%= properties.tmpDir %>/cran.css'
      }
    },

    watch: {
      options: {
        livereload: 9102,
      },
      templates: {
        files: ['<%= properties.templatesDir %>/**'],
        tasks: ["copy:devTemplates", "copy:devIndex"]
      },
      scripts: {
        files: ['<%= properties.scriptsDir %>/**'],
        tasks: ["hug", 'concat:scripts', 'copy:devScripts']
      },
      styles: {
        files: ['<%= properties.stylesDir %>/**'],
        tasks: ["sass", "concat:styles", 'copy:devStyles']
      }
    },

    sass: {
      cran: {
        files: {
          '<%= properties.tmpDir %>/app.css': '<%= properties.stylesDir %>/main.scss'
        },
        options: {
          compass: true
        }
      }
    },
    
    uglify: {
      webapp: {
        src: ['<%= concat.scripts.dest %>'],
        dest: '<%= properties.distDir %>/cran.js'
      }
    },

    cssmin: {
      dist: {
        files: {
          "<%= properties.distDir %>/cran.css": "<%= properties.tmpDir %>/cran.css"
        }
      }
    },

    jshint: {
      dev: {
        options: {
          force: true,
        },
        files: {
          src: [
            "<%= properties.scriptsDir %>/**.js"
          ]
        }
      },

      dist: {
        files: {
          src: [
            "<%= properties.scriptsDir %>/**.js"
          ]
        }
      },
      
      options: {
        jshintrc: '.jshintrc'
      }
    },

    server: {
      dev: {
        port:1080
      }
    }
  };

  grunt.registerTask('build', [
    'clean:tmp',
    'hug',
    'sass',
    'concat:scripts',
    'concat:styles'
  ]);

  grunt.registerTask('build-dev', [
    'build',
    'clean:dev',
    'jshint:dev',
    'copy:devIndex',
    'copy:devTemplates',
    'copy:devScripts',
    'copy:devStyles'
  ]);

  grunt.registerTask('dev', [
    'build-dev',
    'server',
    'watch'
  ]);

  grunt.registerTask('dev-proxy', [
    'build-dev',
    'watch'
  ]);

  grunt.registerTask('release', [
    'build',
    'clean:dist',
    'jshint:dist',
    'uglify',
    'cssmin',
    'copy:dist'
  ]);

  grunt.registerTask('lint', 'jshint:dist');
  grunt.registerTask('default', 'release');

  grunt.registerTask('test', [
    'build',
    'hug:test',
    'jasmine'
  ]);

  grunt.initConfig(config);
};
