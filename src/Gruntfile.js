module.exports = function (grunt) {

    grunt.initConfig({

        typescript: {
            base: {
                src: ['js/*.ts']
            }
        },

        cssUrlEmbed: {
            encodeDirectly: {
                files: {
                    'css/bootstrap.min.embed.css': ['css/bootstrap.min.css']
                }
            }
        },

        embed: {
            options: {
                threshold: '10000KB'
            },
            questionaire: {
                files: {
                    'questionnaire.html': 'questionnaire_base.html'
                }
            }
        },

        watch: {
            scripts: {
                files: ['js/*.ts'],
                tasks: ['typescript'],
            },

            styles: {
                files: ["css/*.css"],
                tasks: ['cssUrlEmbed', 'embed'],
            },

            html: {
                files: ['questionnaire_base.html'],
                tasks: ['embed'],
            }
        }

    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-css-url-embed');
    grunt.loadNpmTasks('grunt-embed');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['typescript', 'cssUrlEmbed', 'embed']);
    grunt.registerTask('html', ['embed']);
};


