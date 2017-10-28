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
	         scope: { 
	         	onChange: '&'
	         },
	         link: function(scope,element,attributes) {
	         	// directive logic
	             scope.value = 0; // Holds the value of the seek bar, such as the currently playing song time or the current volume. Default value is 0.
	             scope.max = 100; // Holds the maximum value of the song and volume seek bars. Default value is 100.
	 
	 			 var seekBar = $(element);

				 attributes.$observe('value', function(newValue) {
				     scope.value = newValue;
				 });
				 
				 attributes.$observe('max', function(newValue) {
				     scope.max = newValue;
				 });	 			 

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
		             notifyOnChange(scope.value);
		         };


		          scope.trackThumb = function() {
				     $document.bind('mousemove.thumb', function(event) {
				         var percent = calculatePercent(seekBar, event);
				         scope.$apply(function() {
				             scope.value = percent * scope.max;
				             notifyOnChange(scope.value);
				         });
				     });
				 
				     $document.bind('mouseup.thumb', function() {
				         $document.unbind('mousemove.thumb');
				         $document.unbind('mouseup.thumb');
				     });
				 };

				 
				 var notifyOnChange = function(newValue) {
				     if (typeof scope.onChange === 'function') {
				         scope.onChange({value: newValue});
				     }
				 };

		         scope.thumbStyle = function() { // updates the position of the seek bar thumb
					return {left: percentString() };	
		         }				 

	         }
	     };     	
     }
 
     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();