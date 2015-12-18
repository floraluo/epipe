module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {				     // Target options
					style: 'expanded',
					sourcemap: 'none',
				},
				files: [{
					expand: true,
					cwd: './scss',
					src: ['**/*.{scss,sass}'],
					dest: './www/css',
					ext: '.app.css'
				}]
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			dist: {
				src: "./www/js/supplier/*.js",
				dest: "./www/js/supplier.min.js"
			}
		},
		watch: {
			sass: {
				files: ['scss/**/*.{scss,sass}'],
				// tasks: ['sass','autoprefixer','cssmin']
				tasks: ['sass']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			}
    }
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify']);
	// grunt.loadNpmTasks('grunt-autoprefixer');
	// grunt.loadNpmTasks('grunt-contrib-sass');
	// grunt.loadNpmTasks('grunt-concat-css');
	// grunt.loadNpmTasks('grunt-spritesmith');
	// grunt.loadNpmTasks('grunt-contrib-compass');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	// grunt.loadNpmTasks('grunt-contrib-htmlmin');
	// grunt.loadNpmTasks('grunt-contrib-imagemin');
	// grunt.registerTask('default', ['watch']);
	// grunt.registerTask('build', ['sass' , 'autoprefixer','cssmin' , 'htmlmin:dev' , 'uglify' , 'imagemin']);
	// grunt.registerTask('build_sprite', ['sprite' , 'concat_css:index', 'cssmin']);	
}