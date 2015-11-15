module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	log: {
		foo: [1, 2, 3],
		bar: 'Hello world!',
		baz: false
	},
	
	imagemin: {
		dynamic: {
			files: [{
				expand: true,
				cwd: 'images/',
				src: ['**/*.{png,jpg,JPG,jpeg,gif}'],
				dest: 'images/'
			}]
		}
	},
	
	less: {
		development: {
			options: {
				paths: ['less/']
			},
			files: {
				'css/mainStyle.css' : 'less/mainStyle.less'
			}
		}
	},
	
	uncss: {
		dist: {
			files: {
				'css/main2.css' : ['index.html']
			}
		}
	},
		
	watch: {
		sass: {
			files: ['js/app/CoreApp/*.js', 'js/app/*.js'],
			tasks: ['concat', 'uglify']
		}
	},
	
	sass: {
		dist: {
			files: {
				'css/style.css' : 'sass/style.scss'
			}
		}
	},
	
	concat: {
		options: {
			separator: '/***** New File *****/',
			stripBanners: true,
			banner: '/** <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> **/ \n'
		},
		dist: {
			src: ['js/app/CoreApp/index.js', 'js/app/CoreApp/blueprint.js', 'js/app/CoreApp/physics.js', 'js/app/indexedDB.js'],
			dest: 'simuL8r.js'
		}
	},
  
	uglify: {
		options: {
			manage: false // manage => true means change variable and function names, safer to set it to false
		},
		my_target: {
			files: {
				'simuL8r.min.js' : ['simuL8r.js']
			}
		}	
	},
  
	cssmin: {
		my_target: {
			files:[{
				expand: true,
				cwd: 'css/',
				src: ['*.css', '!*.min.css'],
				dest: 'css/',
				ext: '.min.css'
			}]
		}
	}
  });
  
	//grunt.loadNpmTasks('grunt-uncss');
	//grunt.loadNpmTasks('grunt-contrib-imagemin'); 
	//grunt.loadNpmTasks('grunt-contrib-less');      
	//grunt.loadNpmTasks('grunt-contrib-sass'); 
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.loadNpmTasks('grunt-contrib-uglify');	
	grunt.loadNpmTasks('grunt-contrib-watch'); 	
	grunt.loadNpmTasks('grunt-contrib-concat');  
	grunt.registerTask('default', ['watch']);
  
};