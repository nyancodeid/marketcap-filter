angular.module('app', [])
	.controller('appCtrl', function($scope, $http) {
		// https://api.coinmarketcap.com/v1/ticker/
		$scope.profiles = [];
		window.coinFiltered = [];
		$scope.selectedProfile = "default";
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
				url: "https://api.coinmarketcap.com/v1/ticker/",
				method: "GET",
				crossdomain: true
			}).then(function(dataMarketCap) {
				$.ajax({
					url: "/proxy.php",
					method: "GET",
					crossdomain: true
				}).then(function(dataStrymex) {
					processingData(dataMarketCap, dataStrymex);
				});
			});
		}
		function processingData(dataMarketCap, dataStrymex) {
			var $counter = 0,
				$counterDeep = 0;
			dataMarketCap.forEach(function(marketcap, $index) {
				$counter++;
				Object.keys(dataStrymex).forEach(function(coinStrymex, $indexStr) {
					if (marketcap.symbol == dataStrymex[coinStrymex].symbol) {
						if (marketcap.symbol == "CAGE") {
							console.log(Object.keys(dataStrymex).length);
							console.log($indexStr);
						}
						dataMarketCap[$index]["percent_change_30d"] = dataStrymex[coinStrymex].change30days;
						dataMarketCap[$index]["percent_change_ytd"] = dataStrymex[coinStrymex].changeNewYear;
					}


					$counterDeep++;
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


			if (!reInit) {
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

								return "<a target='_blank' href='"+ link +"'>" + isi + "</a><a target='_blank' href='https://www.google.com/search?q=" + queryName + "&source=lnms&tbm=nws' class='google-icon'></a>";
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
			} else {
				var coins = [];
				for (var x in res) {
					coins.push(res[x].id);
				}

				getPastPrice(coins, function(results) {
					for (var i in results) {
						var result = results[i];

						for (var y in res) {
							var coinY = res[y];

							if (result.coin == coinY.id) {
								res[y]["percent_change_30d"] = calcPrice(Number(coinY.price_usd), result.lastPrice);
							}
						}
					}

					window.dataTable = $('#dataTable').dataTable({
						scrollX: true,
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

									return "<a target='_blank' href='"+ link +"'>" + isi + "</a><a target='_blank' href='https://www.google.com/search?q=" + queryName + "&source=lnms&tbm=nws' class='google-icon'></a>";
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
									if (Number(data) < 0) {
										return "<span class='negative_change'>" + data + "</span>";
									} else if (Number(data) > 0) {
										return "<span class='positive_change'>" + data + "</span>";
									} else {
										return "0";
									}
								}
							}
						]
					});
				});
			}

		}
		// Ambil data 30 hari yang lalu
		function getPastPrice(coins, callback) 
		{
			coins = coins.join(',');
			$.ajax({
				url: "https://script.google.com/macros/s/AKfycbwO6ggRzOD82KE0xi1e2dCz5xAOap8FC6shKiPWSz6P99vsd9E/exec?coins=" + coins,
				method: "GET",
				crossdomain: true,
				cache: true,
				dataType: 'jsonp'
			}).then(function(res) {
				var result = [];

				for (var i in res) {
					var coin = res[i];

					var Source = $(coin.result);

					Source.find('script').remove();
					Source.find('style').remove();
					Source.find('img').remove();
					Source.find('embed').remove();
					Source.find('iframe').remove();

					var lastPrice = Number(Source.find("table.table tbody tr:last-child td").eq(4).text());

					result.push({
						coin: coin.coin,
						lastPrice: lastPrice
					});
				}

				callback(result);
			});
		}
		function getPastPriceAllCoin(coins) {
			var i = 0;
			window.results = [];

			function getPrice(coin) {
				$.ajax({
					url: "/proxy.php?coin=" + coin,
					method: "GET",
					crossdomain: true,
					async: true
				}).then(function(res) {
					var Source = $(res);
					var lastPrice = Number(Source.find("table.table tbody tr:last-child td").eq(4).text());

					window.results.push({
						coin: coin,
						lastPrice: lastPrice
					});
				})
			}

			for (var x in coins) {
				getPrice(coins[x]);	
			}
		}

		if (localStorage.getItem('data') !== null) {
			if (diffTime() >= cacheTime) {
				startService();
			} else {
				var res = localStorage.getItem("data");
				callbackX(JSON.parse(res), false);
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