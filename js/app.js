(function(){
	
	var app = angular.module('4ReelMovieApp',[]);

	app.controller('MovieController', function($scope,$http){
		
		var submitTimer;
		

		function getMovieData(){
			$http.get("http://www.omdbapi.com/?t=" + $scope.searchMovie + "&plot=full&r=json")
			.success(function(data){
				$scope.movieDetails = data;
				$scope.ratings = [{
					current: data.imdbRating,
					max: 10
				}];

				if(data.Response === 'True'){
					updateRecentlyViewed(data.Title,data.Poster);	
				} 
			});	
			$scope.searchMovie = null;
		};

		
		$scope.submit = function() {	
			if($scope.searchMovie){
				if(submitTimer){
					clearTimeout(submitTimer);	
				}
				submitTimer = setTimeout(getMovieData,800);		
			}
      	};


      	if (($scope.searchMovie === undefined) && (localStorage.getItem("storeLastViewed")!==null)) {
      		$scope.searchMovie = localStorage.getItem("storeLastViewed");
      		getMovieData();
    	}


      	var recentlyViewed = JSON.parse(localStorage.getItem("storeRecentlyViewed"));
		$scope.movielinks = recentlyViewed;

      	
      	function updateRecentlyViewed(movieName,posterLink){

      		var arrayMovie;
      		
      		if (localStorage.getItem("storeRecentlyViewed") === null) {
      			arrayMovie = [{"movieTitle":movieName,"moviePosterLink":posterLink}];
			}else{
				arrayMovie = JSON.parse(localStorage.getItem("storeRecentlyViewed"));
				$scope.movielinks = arrayMovie;	
				
				if(arrayMovie.length >= 4 ){
					arrayMovie.pop();
				}

				arrayMovie.unshift({
		            movieTitle: movieName,
		            moviePosterLink: posterLink
		        });    
			}

			localStorage.setItem("storeRecentlyViewed",JSON.stringify(arrayMovie));
			localStorage.setItem("storeLastViewed",movieName);
      	}

		
		$scope.update = function(movie) {
		  	$scope.searchMovie = movie;
		  	getMovieData();
		};
		
	});	
	

	app.directive('starRating', function () {

		return {
			restrict: 'A',
			template: '<ul class="rating">' +
				'<li ng-repeat="star in stars" class="star glyphicon glyphicon-star" ng-class="{filled: star.filled}">' +
				'</li>' +
				'</ul>',
			scope: {
				ratingValue: '=',
				max: '='
			},
			link: function (scope, elem, attrs) {
				scope.stars = [];
				for (var i = 0; i < scope.max; i++) {
					scope.stars.push({
						filled: i < scope.ratingValue
					});
				}
			}
		}
		
	});

})();