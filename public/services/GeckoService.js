/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular, Promise, response */

angular.module('geckoTracker')
    .factory('geckoService', function ($http, $log, $q, $rootScope) {
        // We store our list of geckos here so that we can refer to it from the functions
        // in the object we return. Because of function scope, those functions can always
        // reference it.
        var geckos = [];
        // We use this to hold a promise, created in fetchGeckos, to avoid multiple
        // controllers trying to fetch the geckos list at the same time. See below.
        var fetchPromise = null;

        // Actually fetch the list of geckos from the server
        function fetchGeckos() {
			console.log("GeckoService.fetchGeckos");
            // Save this promise so that we can check it later in getGeckos
            fetchPromise = new Promise(function (fulfill, reject) {
				console.log("GeckoService.fetchGeckos fetching...")
                $http({
                    method: 'GET',
                    url: '/api/geckos'
                }).then(function success(response) {
                    // We've got a response
                    // Check it for an error
                    if (response.data.error) {
						console.error("GeckoService.fetchGeckos problem fetching");
                        $log.error("Server side error! " + response.data.error);
                        // If there was an error, we want to reject() the promise
                        reject(response.data.error);
                    } else {
						console.debug("GeckoService.fetchGeckos fetched");
                        // Tricky way to empty an array. We want to empty the array without replacing it,
                        // since controllers will have a reference to the array OBJECT. If we replace it,
                        // their scopes won't detect that it changed.
                        geckos.length = 0;
                        // Add all the geckos to the existing array through some trickery
                        geckos.push.apply(geckos, response.data);
                        // Fulfill the promise
                        fulfill(geckos);
                        // NOTE: I'm not really sure all this is necessary for our purpose, we might get
                        // by with just doing "geckos = response.data" since we're only loading it once
                        // when the app starts. But if we refreshed the list in the middle of things, it
                        // would probably be required.
                    }
                }, function error(response) {
                    reject("Failed to contact server");
                });
            });
            return fetchPromise;
        }

		function getGecko(id, cb) {
			getGeckos().then(function(geckos) {
				for(var i=0;i < geckos.length;i++) {
					if(geckos[i]._id == id) {
						cb(geckos[i]);
						return;
					}
				}
				cb(null);
			});
		}
	
		function updateGeckoProperties(props) {
			getGeckos().then(function(geckos) {
			console.log("UPDATE GECKO PROPERTIES", geckos, fetchPromise);
			for(var i=0;i < geckos.length;i++) {
				var gecko = geckos[i];
				console.log(gecko, props._id);
				if(gecko._id == props._id) {
					//console.debug("Found gecko to update");
					for(var prop in props) {
						//console.debug("Updating property " + prop);
						if(gecko.hasOwnProperty(prop) && prop.charAt(0) != '_') {
							gecko[prop] = props[prop];
						}
					}
				}
			}
			})
			//$rootScope.$apply();
		}
	
		var _notificationsPromise = null;
	
		function getGeckos() {
                // Since we're returning a promise (something that has a ".then()" method), we can just return the
                // promise that we create in fetchGeckos. If fetchGeckos() has already been called, we
                // saved that promise and return it here. If not, we need to call fetchGeckos() and return it.
				console.log("GeckoService.getGeckos");
                if (!fetchPromise) {
					console.log("GeckoService.getGeckos creating promise");
                    return fetchGeckos();
				} else {
					console.log("GeckoService.getGeckos returning promise");
                    return fetchPromise;
				}
		}

        var exports = {
            // Get the list of geckos from the service
            // Returns a promise
            getGeckos: getGeckos,

            // Fetch the list of geckos from the service
            // NOTE: Only the service itself (this thing) probably needs to call this directly (through getGeckos).
            fetchGeckos: fetchGeckos,

            getGeckoDetails: function (id) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'GET',
                        url: '/api/geckos/' + id
                    }).then(function success(response) {
                            if (response.data.error)
                                reject(response.data.error);
                            else {
                                if (response.data.hatchDate)
                                    response.data.hatchDate = new Date(response.data.hatchDate);
                                if (response.data.purchaseDate)
                                    response.data.purchaseDate = new Date(response.data.purchaseDate);
                                fulfill(response.data);
                            }
                        },
                        function error(response) {
                            reject("Failed to contact server");
                        });
                });
            },

            addGecko: function (properties) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'POST',
                        url: '/api/geckos',
                        data: properties
                    }).then(function success(response) {
                        if (response.data.error)
                            reject(response.data.error);
                        else {
                            geckos.push(response.data);
                            fulfill(response.data);
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            removeGecko: function (id) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'DELETE',
                        url: "/api/geckos/" + id
                    }).then(function success(response) {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
                            // Find gecko object in list and remove
                            for (var i = 0; i < geckos.length; i++) {
                                if (geckos[i]._id === id) {
                                    geckos.splice(i, 1);
                                    break;
                                }
                            }
                            fulfill();
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            updateGecko: function (properties) {
                return new Promise(function (fulfill, reject) {
                    if (!properties._id) {
                        reject("No _id specified");
                        return;
                    }

                    var _id = properties._id;
					delete properties._id;

                    $http({
                        method: 'PUT',
                        url: "/api/geckos/" + _id + "/edit",
                        data: properties
                    }).then(function success(response) {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
                            // Find gecko object in list and update
                            for (var i = 0; i < geckos.length; i++) {
                                if (geckos[i]._id === _id) {
                                    geckos.splice(i, 1, response.data);
                                    break;
                                }
                            }
                            fulfill(response.data);
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            getGeckoEvents: function (geckoId) {
				console.log("GeckoService.getGeckoEvents", geckoId);
                return new Promise(function (fulfill, reject) {
					// First, get the gecko
					getGecko(geckoId, function(gecko) {
						// Reject if no gecko was found
						if(!gecko) {
							console.log("GeckoService.getGeckoEvents", geckoId, "gecko missing");
							reject("Gecko not found");
							return;
						}
						
						// If we've already fetched, there should be a promise, so return it
						if(gecko._eventsPromise) {
							console.debug("GeckoService.getGeckoEvents", geckoId, "promise exists");
							gecko._eventsPromise.then(function(response) {
								if(response.data.error)
									reject(response.data);
								else {
									console.debug("GeckoService.getGeckoEvents", geckoId, "fulfill from cache");
									fulfill(response.data);
								}
							});
							return;
						}
						
						// Otherwise, we need a new Promise
						console.debug("GeckoService.getGeckoEvents", geckoId, "fetching events");
						gecko._eventsPromise =
						$http({
							method: 'GET',
							url: "/api/geckos/" + geckoId + "/events"
						});
						
						gecko._eventsPromise.then(function(response) {
							if (response.data.error) {
								console.error("GeckoService.getGeckoEvents", geckoId, "error fetching events");
								reject(response.data.error);
							} else {
								console.debug("GeckoService.getGeckoEvents", geckoId, "fetched", response.data.length, "events");
								console.debug("GeckoService.getGeckoEvents", geckoId, "fulfill from fetch");
								fulfill(response.data);
							}
						});
					});
                });
            },

            createGeckoEvent: function (geckoId, properties) {
                console.log("createGeckoEvent", geckoId, properties);
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'POST',
                        url: "/api/geckos/" + geckoId + "/events",
                        data: properties
                    }).then(function success(response) {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
							exports.getGeckoEvents(geckoId).then(function(events) {
								console.log("createGeckoEvent adding", response.data)
								events.push(response.data);
								fulfill(response.data);
							});
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            deleteGeckoEvent: function (eventId) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'DELETE',
                        url: "/api/events/" + eventId
                    }).then(function success(response) {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
							console.log("########################", response.data);
							var geckoId = response.data.geckoId;
							exports.getGeckoEvents(geckoId).then(function(events) {
								for(var i=0;i < events.length;i++)
									if(events[i]._id == eventId)
										events.splice(i, 1);
								fulfill(response.data);
							});
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            updateGeckoEvent: function (eventId, properties) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'PUT',
                        url: "/api/events/" + eventId + "/edit",
                        data: properties
                    }).then(function success(response) {
                        if (response.data.error) {
                            reject(response.data.error);
                        } else {
                            fulfill(response.data);
                        }
                    }, function error(response) {
                        reject("Failed to contact server");
                    });
                });
            },

            getMetrics: function () {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'GET',
                        url: '/api/metrics'
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
                        fulfill(response.data);
                    }, function error(response) {
                        reject("Failed to get gecko metrics from server");
                    });
                });
            },
			
			getGeckoPhotos: function(id) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'GET',
                        url: '/api/geckos/' + id + '/photos'
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
                        fulfill(response.data);
                    }, function error(response) {
                        reject("Failed to get gecko photos from server");
                    });
                });
			},

			updateGeckoPhoto: function(id, properties) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'PUT',
                        url: '/api/photos/' + id,
						data: properties
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
                        fulfill(response.data);
                    }, function error(response) {
                        reject("Failed to update photo");
                    });
                });
			},

			deleteGeckoPhoto: function(id) {
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'DELETE',
                        url: '/api/photos/' + id
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
                        fulfill(response.data);
                    }, function error(response) {
                        reject("Failed to delete photo");
                    });
                });
			},
			
			
			setPrimaryPhoto: function(geckoId, photoId) {
				return $q(function (fulfill, reject) {
                    $http({
                        method: 'PUT',
                        url: '/api/geckos/' + geckoId + '/setPrimaryPhoto',
						data: {
							photoId: photoId
						}
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
						var updatedGecko = response.data;
						updateGeckoProperties(updatedGecko);
                        fulfill(updatedGecko);
                    }, function error(response) {
                        reject("Failed to delete photo");
                    });
				});
			},
			
			setPhotoCaption: function(photoId, caption) {
				return $q(function(fulfill, reject) {
                    $http({
                        method: 'PUT',
                        url: '/api/photos/' + photoId,
						data: {
							caption: caption
						}
                    }).then(function success(response) {
                        if (response.data.error)
                            return reject(response.data.error);
                        fulfill(caption);
                    }, function error(response) {
                        reject("Failed to delete photo");
                    });
				});
			},
			
			getNotifications: function() {
				if(_notificationsPromise) return _notificationsPromise;
				_notificationsPromise = $http({
					method: 'GET',
					url: '/api/notifications'
				}).then(function success(response) {
					return response.data;
				});
				return _notificationsPromise;
			},
			
			createNotification: function(props) {
				var notification = null;
				return $http({
					method: 'POST',
					url: '/api/notifications',
					data: props
				}).then(function(response) {
					if(response.data.error)
						throw "Error creating notification: " + response.data.error;
					notification = response.data;
					return exports.getNotifications();
				}).then(function(notifications) {
					notifications.push(notification);
				});
			},
			
			deleteNotification: function(id) {
				var notification = null;
				return $http({
					method: 'DELETE',
					url: '/api/notifications/' + id,
				}).then(function(response) {
					if(response.data.error)
						throw "Error deleting notification: " + response.data.error;
					notification = response.data;
					return exports.getNotifications();
				}).then(function(notifications) {
					for(var i=0;i < notifications.length;i++)
						if(notifications[i]._id == notification._id) {
							console.debug("deleteNotification", "DELETIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIING");
							notifications.splice(i, 1);
							return;
						}
					console.error("deleteNotification", "Couldn't find notification!", notification._id);
				});
			},
			
			updateNotification: function(id, props) {
				var notification = null;
				return $http({
					method: 'PUT',
					url: '/api/notifications/' + id,
					data: props
				}).then(function(response) {
					if(response.data.error)
						throw "Error updating notification: " + response.data.error;
					notification = response.data;
					return exports.getNotifications();
				}).then(function(notifications) {
					for(var i=0;i < notifications.length;i++)
						if(notifications[i]._id == notification.id) {
							notifications.splice(i, 1, notification);
							return;
						}
				});
			}
		};
		return exports;
    });
