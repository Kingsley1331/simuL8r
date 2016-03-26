/**
 * @author mrdoob / http://mrdoob.com/
 */

(function rateFrame(){
		var script=document.createElement('script');
		script.onload=function(){
			var stats=new Stats();
			stats.domElement.style.cssText='position:fixed;right:10px;top:110px;z-index:10000;';
			document.body.appendChild(stats.domElement);
			requestAnimationFrame(function loop(){
				stats.update();
				requestAnimationFrame(loop)}
			);
			$('#fps').css({display: 'none'});
		};
		//script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
		script.src='js/app/stats/Stats.js';
		document.head.appendChild(script);
})();


