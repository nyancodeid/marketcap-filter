angular.module('app', [])
	.controller('appCtrl', function($scope, $http) {
		// https://api.coinmarketcap.com/v1/ticker/
		$scope.profiles = [];
		window.coinFiltered = [];
		$scope.selectedProfile = "default";
		$scope.displayCoin = 100;

		if (localStorage.getItem('profiles') === null) {
			localStorage.setItem('profiles', JSON.stringify([]));
		} else {
			$scope.profiles = JSON.parse(localStorage.getItem('profiles'));
		}

		var dataTable = null;
		var callbackX = function(res, reInit) {
			if (!reInit) {
				initDataTable(res, false);
			} else {
				window.dataTable.api().clear();
				window.dataTable.api().rows.add(res).draw();
			}

			var items = {
				prices: [],
				marketcap: [],
				supply: [],
				volume: [],
				hour: [],
				day: [],
				week: [],
				month: [],
				yearOfDate: []
			}
			setTimeout(function() {
				$scope.$apply(function() {
					$scope.search = {};
					for (var i in res) {
						var item = res[i];

						var yearOfDate = item.percent_change_ytd || 0,
							month = item.percent_change_30d || 0;

						items.prices.push(item.price_usd);
						items.marketcap.push(item.market_cap_usd);
						items.supply.push(item.total_supply);
						items.volume.push(item["24h_volume_usd"]);
						items.hour.push(item.percent_change_1h);
						items.day.push(item.percent_change_24h);
						items.week.push(item.percent_change_7d);
						items.month.push((month * 100).toFixed(2));
						items.yearOfDate.push((yearOfDate * 100).toFixed(2));
					}
					var prices = items.prices.sort(function(a, b){return a-b}),
						supply = items.supply.sort(function(a, b){return a-b}),
						marketcap = items.marketcap.sort(function(a, b){return a-b}),
						volume = items.volume.sort(function(a, b){return a-b}),
						change_1h = items.hour.sort(function(a, b){return a-b}),
						change_24h = items.day.sort(function(a, b){return a-b}),
						change_7d = items.week.sort(function(a, b){return a-b})
						change_30d = items.month.sort(function(a, b){return a-b}),
						change_ytd = items.yearOfDate.sort(function(a, b){return a-b});

					$scope.price = {
						min: prices[0],
						max: accounting.formatNumber(prices[prices.length - 1])
					}
					$scope.search.price = {
						start: prices[0],
						stop: prices[prices.length - 1]
					}
					$scope.supply = {
						min: accounting.formatNumber(supply[0]),
						max: accounting.formatNumber(supply[supply.length - 1])
					}
					$scope.search.supply = {
						start: accounting.formatNumber(supply[0]),
						stop: accounting.formatNumber(supply[supply.length - 1])
					}
					$scope.marketcap = {
						min: accounting.formatNumber(marketcap[0]),
						max: accounting.formatNumber(marketcap[marketcap.length - 1])
					}
					$scope.search.marketcap = {
						start: marketcap[0],
						stop: marketcap[marketcap.length - 1]
					}
					$scope.volume = {
						min: accounting.formatNumber(volume[0]),
						max: accounting.formatNumber(volume[volume.length - 1])
					}
					$scope.search.volume = {
						start: accounting.formatNumber(volume[0]),
						stop: accounting.formatNumber(volume[volume.length - 1])
					}
					$scope.change_1h = {
						min: change_1h[0],
						max: change_1h[change_1h.length - 1]
					}
					$scope.search.change_1h = {
						start: change_1h[0],
						stop: change_1h[change_1h.length - 1]
					}
					$scope.change_24h = {
						min: change_24h[0],
						max: change_24h[change_24h.length - 1]
					}
					$scope.search.change_24h = {
						start: change_24h[0],
						stop: change_24h[change_24h.length - 1]
					}
					$scope.change_7d = {
						min: change_7d[0],
						max: change_7d[change_7d.length - 1]
					}
					$scope.search.change_7d = {
						start: change_7d[0],
						stop: change_7d[change_7d.length - 1]
					}
					$scope.change_30d = {
						min: change_30d[0],
						max: change_30d[change_30d.length - 1]
					}
					$scope.search.change_30d = {
						start: change_30d[0],
						stop: change_30d[change_30d.length - 1]
					}
					$scope.change_ytd = {
						min: change_ytd[0] || 0,
						max: change_ytd[change_ytd.length - 1] || 0
					}
					$scope.search.change_ytd = {
						start: change_ytd[0] || 0,
						stop: change_ytd[change_ytd.length - 1] || 0
					}
				});
			}, 200);

			$scope.findMatch = function() {
				$.fn.dataTable.ext.search.push(
					function(settings, data, dataIndex) {
						var Next = [];

						if (typeof $scope.search.price !== "undefined") {
							var price = accounting.unformat(data[3]);
							var min = accounting.unformat($scope.search.price.start),
								max = accounting.unformat($scope.search.price.stop);

							if ($scope.search.price.start != "" && $scope.search.price.stop	!= "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									( isNaN( min ) && price <= max ) ||
									( min <= price && isNaN( max ) ) ||
									( min <= price && price <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.supply !== "undefined") {
							var supply = accounting.unformat(data[4]);
							var min = accounting.unformat($scope.search.supply.start),
								max = accounting.unformat($scope.search.supply.stop);

							if ($scope.search.supply.start != "" && $scope.search.supply.stop	!= "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && supply <= max ) ||
									 ( min <= supply && isNaN( max ) ) ||
									 ( min <= supply && supply <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.marketcap !== "undefined") {
							var marketcap = accounting.unformat(data[2]);
							var min = accounting.unformat($scope.search.marketcap.start),
								max = accounting.unformat($scope.search.marketcap.stop);

							if ($scope.search.marketcap.start != "" && $scope.search.marketcap.stop	!= "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && marketcap <= max ) ||
									 ( min <= marketcap && isNaN( max ) ) ||
									 ( min <= marketcap && marketcap <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.volume !== "undefined") {
							var volume = accounting.unformat(data[5]);
							var min = accounting.unformat($scope.search.volume.start),
								max = accounting.unformat($scope.search.volume.stop);

							if ($scope.search.volume.start != "" && $scope.search.volume.stop	!= "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && volume <= max ) ||
									 ( min <= volume && isNaN( max ) ) ||
									 ( min <= volume && volume <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}

						if (typeof $scope.search.change_1h !== "undefined") {
							var changeHour = accounting.unformat(data[6]);
							var min = accounting.unformat($scope.search.change_1h.start),
								max = accounting.unformat($scope.search.change_1h.stop);
							

							if (min != "" && max != "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && changeHour <= max ) ||
									 ( min <= changeHour && isNaN( max ) ) ||
									 ( min <= changeHour && changeHour <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.change_24h !== "undefined") {
							var changeDay = accounting.unformat(data[7]);
							var min = accounting.unformat($scope.search.change_24h.start),
								max = accounting.unformat($scope.search.change_24h.stop);

							if (min != "" && max != "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && changeDay <= max ) ||
									 ( min <= changeDay && isNaN( max ) ) ||
									 ( min <= changeDay && changeDay <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.change_7d !== "undefined") {
							var changeWeek = accounting.unformat(data[8]);
							var min = accounting.unformat($scope.search.change_7d.start),
								max = accounting.unformat($scope.search.change_7d.stop);

							if (min != "" && max != "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && changeWeek <= max ) ||
									 ( min <= changeWeek && isNaN( max ) ) ||
									 ( min <= changeWeek && changeWeek <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.change_30d !== "undefined") {
							var changeMonth = accounting.unformat(data[9]);
							var min = accounting.unformat($scope.search.change_30d.start),
								max = accounting.unformat($scope.search.change_30d.stop);

							if (min != "" && max != "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && changeMonth <= max ) ||
									 ( min <= changeMonth && isNaN( max ) ) ||
									 ( min <= changeMonth && changeMonth <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (typeof $scope.search.change_ytd !== "undefined") {
							var changeYearOfDate = accounting.unformat(data[10]);
							var min = accounting.unformat($scope.search.change_ytd.start),
								max = accounting.unformat($scope.search.change_ytd.stop);

							if (min != "" && max != "") {
								if ( ( isNaN( min ) && isNaN( max ) ) ||
									 ( isNaN( min ) && changeYearOfDate <= max ) ||
									 ( min <= changeYearOfDate && isNaN( max ) ) ||
									 ( min <= changeYearOfDate && changeYearOfDate <= max ) )
								{
									// do Lanjut
									Next.push(true);
								} else {
									return false;
								}
							}
						}
						if (Next.length != 0) {
							return true;
						}
					}
				);
				window.dataTable.api().order([3, 'asc']).draw();
			}
			$scope.resetResult = function() {
				// var data = JSON.parse(localStorage.getItem('data'));
				$.fn.dataTable.ext.search.pop();
				window.dataTable.api().draw();
			}
		}
		function diffTime() {
			var timestamp = new Date(Number(localStorage.getItem("timestamp"))),
				now = new Date();

			var difference = now - timestamp;

			var diffMins = Math.round(((difference % 86400000) % 3600000) / 60000); // minutes

        	return diffMins;
		}
		function startService() {
			$.ajax({
				url: "https://api.coinmarketcap.com/v1/ticker/?limit=0",
				method: "GET",
				crossdomain: true
			}).then(function(dataMarketCap) {
				var path = document.location.pathname.replace('/index.html', '');
					path += (path.endsWith('/') ? 'proxy.php' : '/proxy.php');

				$.ajax({
					url: path,
					method: "GET",
					crossdomain: true
				}).then(function(dataStrymex) {
					processingData(dataMarketCap, dataStrymex);
				});
			});
		}
		function processingData(dataMarketCap, dataStrymex) {
			var ratings = nyanStorage.get('ratings');

			dataMarketCap.forEach(function(marketcap, $index) {
				Object.keys(dataStrymex).forEach(function(coinStrymex, $indexStr) {
					if (marketcap.symbol == dataStrymex[coinStrymex].symbol) {
						dataMarketCap[$index]["percent_change_30d"] = dataStrymex[coinStrymex].change30days;
						dataMarketCap[$index]["percent_change_ytd"] = dataStrymex[coinStrymex].changeNewYear;
					}
				
					if ($index == (dataMarketCap.length - 1) && $indexStr == (Object.keys(dataStrymex).length - 1)) {
						localStorage.setItem("data", JSON.stringify(dataMarketCap));
						localStorage.setItem("timestamp", Date.now());

						callbackX(dataMarketCap, false);
					}
				});
			});
		}
		function initDataTable(res, reInit) {
			var d = new Date(),
				month = d.getMonth() + 1,
				day = d.getDate();

			var fullDate = (day<10 ? '0' : '') + day 
			        		+ (month<10 ? '0' : '') + month
			        		+ d.getFullYear();

			var ratings = nyanStorage.get('ratings') || [];
			var hideCoin = [];

			res.forEach(function(coin, $index) {
				ratings.forEach(function(rating) {
					if (rating.symbol == coin.symbol) {
						if (rating.rating <= 2) {
							hideCoin.push(coin.rank);
						}
						res[$index]['rating'] = rating.rating;
					}
				});
				
				if ($index == (res.length - 1)) {
					window.dataTable = $('#dataTable').dataTable({
						scrollX: true,
						searchDelay: 500,
						dom: '<Bl>frtip',
						buttons: [
							{
					            extend: 'excel',
					            text: 'Export Excel',
					            filename: fullDate
					        }, 
					        'print'
						],
						language: [ {
					        decimal: ".",
					        thousands: ","
					    } ],
					    order: [
					    	[3, 'asc']
					    ],
						lengthMenu: [[-1, 10, 25, 50], ["All", 10, 25, 50]],
						data: res,
						columns: [
							{
								data: "rank"
							},
							{
								data: "name",
								render: function(data, type, row) {
									var isi = data + " (" + row.symbol + ")";
									var nama = data.replace(/\s+/g, '-').toLowerCase();
									var queryName = data.replace(/\s+/g, '+').toLowerCase();
									var link = "https://coinmarketcap.com/currencies/" + nama + "/";

									var ratingsDom = "";
									var ratingsData = nyanStorage.get('ratings');
									var isDone = false;
									for (var ratingIndex in ratingsData) {
										var rating = ratingsData[ratingIndex];

										if (!isDone) {
											if (row.symbol == rating.symbol) {
												isDone = true;
												var ratingValue = rating.rating;
												for (var i = 1; i < 6; i++) {
													if (i <= 2) {
														var title = "Kurang";
													} else if (i == 3) {
														var title = "Sedang";
													} else {
														var title = "Excellent";
													}
													if (i <= ratingValue) {
														ratingsDom += "<li class='star selected' title='" + title + "' data-value='" + i + "'>\
										                               <i class='fa fa-star fa-fw'></i>\
											                       </li>";
											        } else {
											        	ratingsDom += "<li class='star' title='" + title + "' data-value='" + i + "'>\
										                               <i class='fa fa-star fa-fw'></i>\
											                       </li>";
											        } 
												}
											}
										}
									}
									if (!isDone) {
										for (var i = 1; i < 6; i++) {
											if (i <= 2) {
												var title = "Kurang";
											} else if (i == 3) {
												var title = "Sedang";
											} else {
												var title = "Excellent";
											}
											if (i <= 3) {
												ratingsDom += "<li class='star selected' title='" + title + "' data-value='" + i + "'>\
								                               <i class='fa fa-star fa-fw'></i>\
									                       </li>";
									        } else {
									        	ratingsDom += "<li class='star' title='" + title + "' data-value='" + i + "'>\
								                               <i class='fa fa-star fa-fw'></i>\
									                       </li>";
									        } 
										}
									}
									
									return "<a target='_blank' href='"+ link +"'>" + isi + "</a>\
											<a target='_blank' href='https://www.google.com/search?q=" + queryName + "&source=lnms&tbm=nws' class='google-icon'></a>\
											<i title='Note' data-symbol='" + row.symbol + "' style='margin-left:8px;cursor:pointer;' class='noteIcon fa fa-sticky-note-o'></i><br />\
											<div class='rating-stars text-center'>\
							                    <ul class='stars' data-symbol='" + row.symbol + "' data-coin='" + row.name + "'>\
							                    	"+ ratingsDom +"\
							                    </ul>\
							                </div>";
								}
							},
							{
								data: "market_cap_usd",
								render: function(data, type, row) {
									return accounting.formatMoney(data, {
										precision: 0
									});
								}
							},
							{
								data: "price_usd",
								render: function(data, type, row) {
									return accounting.formatMoney(data, {
										precision: 8
									});
								}
							},
							{
								data: "total_supply",
								render: function(data, type, row) {
									return accounting.formatNumber(data);
								}
							},
							{
								data: "24h_volume_usd",
								render: function(data, type, row) {
									return accounting.formatMoney(data);
								}
							},
							{
								data: "percent_change_1h",
								render: function(data, type, row) {
									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data + "</span>";
									} else {
										return "0";
									}
								}
							},
							{
								data: "percent_change_24h",
								render: function(data, type, row) {
									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data + "</span>";
									} else {
										return "0";
									}
								}
							},
							{
								data: "percent_change_7d",
								render: function(data, type, row) {
									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data + "</span>";
									} else {
										return "0";
									}
								}
							},
							{
								data: "percent_change_30d",
								render: function(data, type, row) {
									data = (data * 100);

									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data.toFixed(2) + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data.toFixed(2) + "</span>";
									} else {
										return "0";
									}
								}
							},
							{
								data: "percent_change_ytd",
								render: function(data, type, row) {
									data = (data * 100);

									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data.toFixed(2) + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data.toFixed(2) + "</span>";
									} else {
										return "0";
									}
								}
							}
						]
					});
					$.fn.dataTable.ext.search.push(
						function(settings, data, dataIndex) {
							var isHide = false;
							for (var i = 0; i < hideCoin.length; i++) {
								var hide = hideCoin[i];

								if (data[0] == hide) {
									isHide = true;
									return false;
								}
							}

							if (!isHide) {
								return true;
							}
						}
					);
					window.dataTable.api().order([3, 'asc']).draw();
					setTimeout(function() {
						$('.noteIcon').on('click', function() {
							var coin = $(this).data('symbol');
							var ratings = nyanStorage.get('ratings');

							ratings.forEach(function(rating) {
								if (rating.symbol == coin) {
									$scope.$apply(function() {
										$scope.noteContentSaved = rating.note;
									});
									$('#viewNoteModal').modal('show');
								}
							});
						});
						$('.stars li').on('mouseover', function(){
							var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
						 
							// Now highlight all the stars that's not after the current hovered star
							$(this).parent().children('li.star').each(function(e){
								if (e < onStar) {
									$(this).addClass('hover');
								}
								else {
									$(this).removeClass('hover');
								}
							});
							
						}).on('mouseout', function(){
							$(this).parent().children('li.star').each(function(e){
								$(this).removeClass('hover');
							});
						});
						
						/* 2. Action to perform on click */
						$('.stars li').on('click', function(){
							var onStar = parseInt($(this).data('value'), 10); // The star currently selected
							var stars = $(this).parent().children('li.star');
							
							for (i = 0; i < stars.length; i++) {
								$(stars[i]).removeClass('selected');
							}
							
							for (i = 0; i < onStar; i++) {
								$(stars[i]).addClass('selected');
							}
							
							// Response
							var ratingValue = parseInt($(this).parent().find('li.selected').last().data('value'), 10);
							var coin = {
								symbol: $(this).parent().data('symbol'),
								name: $(this).parent().data('coin')
							};
							callbackRatingSetter(ratingValue, coin);
						});
					}, 2000);

				}
			});

		}
		function callbackRatingSetter(rating, coin) {
			var options = {
				uniq: 'symbol',
				update: ['rating', 'note']
			};
			// nyanStorage.update('ratings', options, {
			// 	symbol: coin.symbol,
			// 	coin: coin.name,
			// 	rating: rating
			// });

			$('#noteModal').data('rating', JSON.stringify({
				symbol: coin.symbol,
				coin: coin.name,
				rating: rating
			}));
			$('#noteModal').data('options', JSON.stringify(options));
			$('#noteModal').modal('show');
		}
		$scope.saveNote = function() {
			if ($scope.noteContent !== "") {
				var ratings = JSON.parse($('#noteModal').data('rating'));
				var options = JSON.parse($('#noteModal').data('options'));

				ratings.note = $scope.noteContent;

				nyanStorage.update('ratings', options, ratings);
				$('#noteModal').modal('hide');

				$scope.noteContent = "";
			}
		}

		if (localStorage.getItem('data') !== null) {
			if (diffTime() >= cacheTime) {
				startService();
			} else {
				var res = nyanStorage.get('data');
				callbackX(res, false);
			}
		} else {
			startService();
		}

		$scope.loadProfile = function() {
			var findId = $scope.selectedProfile;

			$scope.profiles.forEach(function(profile) {
				if (profile.id == findId) {
					$scope.search = JSON.parse(atob(profile.code));
				}
			});
		}
		$scope.removeProfile = function() {
			var findId = $scope.selectedProfile;

			var tempProfile = _.reject($scope.profiles, function(profile) {
				return profile.id === Number(findId);
			});
			localStorage.setItem('profiles', JSON.stringify(tempProfile));
			$scope.profiles = tempProfile;
			$scope.selectedProfile = "default";
		}
		$scope.saveProfile = function() {
			$("#saveModal").modal("show");
		}
		$scope.saveProfileAction = function() {
			var code = btoa(JSON.stringify($scope.search));
			var payload = {
				id: Date.now(),
				name: $scope.profileName,
				code: code
			}
			var tempProfile = JSON.parse(localStorage.getItem("profiles"));
				tempProfile.push(payload);
				$scope.profiles = tempProfile;

			localStorage.setItem('profiles', JSON.stringify(tempProfile));

			$("#saveModal").modal("hide");
		}
		$scope.clearAllParams = function() {

			$scope.search = {};
		}
		$scope.showHiddenCoinDialog = function() {
			$scope.hiddenCoinList = nyanStorage.get('ratings');

			$("#hiddenCoinList").modal("show");

			setTimeout(function() {
				$('.stars li').on('mouseover', function(){
					var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
				 
					// Now highlight all the stars that's not after the current hovered star
					$(this).parent().children('li.star').each(function(e){
						if (e < onStar) {
							$(this).addClass('hover');
						}
						else {
							$(this).removeClass('hover');
						}
					});
					
				}).on('mouseout', function(){
					$(this).parent().children('li.star').each(function(e){
						$(this).removeClass('hover');
					});
				});
				
				/* 2. Action to perform on click */
				$('.stars li').on('click', function(){
					var onStar = parseInt($(this).data('value'), 10); // The star currently selected
					var stars = $(this).parent().children('li.star');
					
					for (i = 0; i < stars.length; i++) {
						$(stars[i]).removeClass('selected');
					}
					
					for (i = 0; i < onStar; i++) {
						$(stars[i]).addClass('selected');
					}
					
					// Response
					var ratingValue = parseInt($(this).parent().find('li.selected').last().data('value'), 10);
					var coin = {
						symbol: $(this).parent().data('symbol'),
						name: $(this).parent().data('coin')
					};
					callbackRatingSetter(ratingValue, coin);
				});
			}, 1000);
		}

		function calcPrice(priceNow, priceLast) {
			if (priceNow > priceLast) {
				// kenaikan
				var x = priceNow - priceLast;
				var y = (x/priceNow) * 100;
				return y.toFixed(2);
			} else {
				// penurunan
				var x = priceLast - priceNow;
				var y = (x/priceLast) * 100;
				return -y.toFixed(2);
			}
		}

		$('.numberFormat').on("keyup", function(event) {
			var selection = window.getSelection().toString();
            if ( selection !== '' ) {
                return;
            }
            
            // When the arrow keys are pressed, abort.
            if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
                return;
            }
            
            var $this = $( this );
            
            // Get the value.
            var input = $this.val();
            
            var input = input.replace(/[\D\s\._\-]+/g, "");
            input = input ? parseInt( input, 10 ) : 0;

            $this.val( function() {
                return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
            } );
		});
	});