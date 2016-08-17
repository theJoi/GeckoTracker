/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular, Promise, response */

angular.module('geckoTracker')
    .factory('geckoService', function ($http, $log) {
        // We store our list of geckos here so that we can refer to it from the functions
        // in the object we return. Because of function scope, those functions can always
        // reference it.
        var geckos = [];
        // We use this to hold a promise, created in fetchGeckos, to avoid multiple
        // controllers trying to fetch the geckos list at the same time. See below.
        var fetchPromise = null;

        // Actually fetch the list of geckos from the server
        function fetchGeckos() {
            // Save this promise so that we can check it later in getGeckos
            fetchPromise = new Promise(function (fulfill, reject) {
                $http({
                    method: 'GET',
                    url: '/api/geckos'
                }).then(function success(response) {
                    // We've got a response
                    // Check it for an error
                    if (response.data.error) {
                        $log.error("Server side error! " + response.data.error);
                        // If there was an error, we want to reject() the promise
                        reject(response.data.error);
                    } else {
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

        return {
            // Get the list of geckos from the service
            // Returns a promise
            getGeckos: function () {
                // Since we're returning a promise (something that has a ".then()" method), we can just return the
                // promise that we create in fetchGeckos. If fetchGeckos() has already been called, we
                // saved that promise and return it here. If not, we need to call fetchGeckos() and return it.
                if (!fetchPromise)
                    return fetchGeckos();
                else
                    return fetchPromise;
            },

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
                                if (response.data.birthdate)
                                    response.data.birthdate = new Date(response.data.birthdate);
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
                return new Promise(function (fulfill, reject) {
                    $http({
                        method: 'GET',
                        url: "/api/geckos/" + geckoId + "/events"
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
                            fulfill(response.data);
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
                            fulfill(response.data);
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
            }
        };
    });
