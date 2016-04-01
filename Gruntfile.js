module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        dest: 'client-server/client/dist/bundle-all.min.js',
        src: [
          'client-server/client/js/jquery-2.1.1.min.js',
          'client-server/client/dist/bundle.min.js',
          'client-server/client/js/materialize.min.js',
          'client-server/client/js/code-mirror-scripts/all-cm-scripts.min.js'
          ]
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          'client-server/client/dist/bundle.min-safe.js': 'client-server/client/dist/bundle.js'
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'client-server/client/dist/bundle.min.js': 'client-server/client/dist/bundle.min-safe.js'
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'client-server/client/dist/style.min.css': ['client-server/client/styles/style.css', 'client-server/client/styles/materialize.css']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['ngAnnotate', 'uglify', 'cssmin', 'concat']);

};
