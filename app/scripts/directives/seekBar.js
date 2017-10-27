(function() {
     function seekBar($document) {

		 var calculatePercent = function(seekBar, event) {
		     var offsetX = event.pageX - seekBar.offset().left;
		     var seekBarWidth = seekBar.width();
		     var offsetXPercent = offsetX / seekBarWidth;
		     offsetXPercent = Math.max(0, offsetXPercent);
		     offsetXPercent = Math.min(1, offsetXPercent);
		     return offsetXPercent;
		 };

	     return {
	         templateUrl: '/templates/directives/seek_bar.html',
	         replace: true,
	         restrict: 'E',
	         scope: { },
	         link: function(scope,element,attributes) {
	         	// directive logic
	             scope.value = 0; // Holds the value of the seek bar, such as the currently playing song time or the current volume. Default value is 0.
	             scope.max = 100; // Holds the maximum value of the song and volume seek bars. Default value is 100.
	 
	 			 var seekBar = $(element);

	             var percentString = function () { // A function that calculates a percent based on the value and maximum value of a seek bar.
	                 var value = scope.value;
	                 var max = scope.max;
	                 var percent = value / max * 100;
	                 return percent + "%";
	             };
	 
	             scope.fillStyle = function() { // Returns the width of the seek bar fill element based on the calculated percent.
	                 return {width: percentString()};
	             };

		         scope.onClickSeekBar = function(event) {
		             var percent = calculatePercent(seekBar, event);
		             scope.value = percent * scope.max;
		         };

		         scope.thumbStyle = function() { // updates the position of the seek bar thumb
					return {left: percentString() };	
		         }


		          scope.trackThumb = function() {
				     $document.bind('mousemove.thumb', function(event) {
				         var percent = calculatePercent(seekBar, event);
				         scope.$apply(function() {
				             scope.value = percent * scope.max;
				         });
				     });
				 
				     $document.bind('mouseup.thumb', function() {
				         $document.unbind('mousemove.thumb');
				         $document.unbind('mouseup.thumb');
				     });
				 };

	         }
	     };     	
     }
 
     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();