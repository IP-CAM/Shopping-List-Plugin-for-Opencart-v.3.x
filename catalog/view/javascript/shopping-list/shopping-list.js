angular.module('ShoppingList', ['ngCookies'])
        .controller('ShoppingListController', ['$scope', '$timeout', '$cookies', 'shoppingListService', function ($scope, $timeout, $cookies, shoppingListService) {
                $scope.listItems = []; //collection of products
                $scope.productList = []; //Collection of products retrieved while typing
                $scope.item;
                $scope.showList = false;
                $scope.totalQuantity = 0;
                $scope.totalPrice = 0;
                $scope.error = {
                    cart: false,
                    item: false
                };
                var cookie_key = 'shopping_list_items';
                var cookies = $cookies.getObject(cookie_key);
                if (cookies) {
                    $scope.listItems = cookies;
                }

                $scope.$watch('item', function (newValue, oldValue) {
                    $scope.showList = false;
                    if (!newValue || (newValue === oldValue)) {
                        return;
                    }
                    shoppingListService.getProducts(newValue)
                            .then(function (response) {
                                if (response.success) {
                                    $scope.productList = [];
                                    fillProductList(response.products);
                                    if (!$scope.productList.length) {
                                        $scope.showList = false;
                                        return;
                                    }
                                    $scope.showList = true;
                                }
                            });
                });

                $scope.$watch('listItems', function (newValue) {
                    var totalQuantity = 0;
                    var totalPrice = 0;
                    $timeout(function () {
                        angular.forEach(newValue, function (item) {
                            item.customer_quantity = parseInt(item.customer_quantity);
                            if (!item.customer_quantity) {
                                item.customer_quantity = 1;
                            }
                            totalQuantity += item.customer_quantity;
                            totalPrice += (item.price * item.customer_quantity);
                        });
                        $scope.totalQuantity = totalQuantity;
                        $scope.totalPrice = totalPrice;
                        $scope.$broadcast('EVENT_ITEM_CHANGED');
                    }, 1500);
                }, true);

                $scope.$on('EVENT_ITEM_CHANGED', function () {
                    var err = false;
                    angular.forEach($scope.listItems, function (item) {
                        if (item.error) {
                            err = true;
                            return;
                        }
                    });
                    $scope.error.cart = err;
                });

                $scope.addItem = function (item) {
                    $scope.showList = false;
                    var push = true;
                    $scope.item = '';
                    item.id = parseInt(item.id);
                    angular.forEach($scope.listItems, function (product) {
                        if (parseInt(product.id) === item.id) {
                            push = false;
                            return;
                        }
                    });
                    if (push) {
                        $scope.listItems.push(item);
                        $cookies.putObject(cookie_key, $scope.listItems);
                    }
                };

                $scope.removeItem = function (item) {
                    angular.forEach($scope.listItems, function (product, key) {
                        if (product.id === item.id) {
                            $scope.listItems.splice(key, 1);
                            $cookies.putObject(cookie_key, $scope.listItems);
                            return;
                        }
                    });
                };

                $scope.addToCart = function () {
                    shoppingListService.addProductsToCart($scope.listItems);
                };

                $scope.addToWishList = function () {
                    shoppingListService.addProductsToWishList($scope.listItems);
                };

                $scope.clearAll = function () {
                    $scope.listItems = [];
                    $cookies.putObject(cookie_key, $scope.listItems);
                };

                function fillProductList(products) {
                    for (var i = 0; i < products.length; i++) {
                        var product = products[i];
                        var data = {
                            id: product.product_id,
                            name: product.name,
                            price: product.price,
                            total_quantity: parseInt(product.quantity),
                            image: product.image,
                            customer_quantity: 1,
                            error: false
                        };
                        $scope.productList.push(data);
                    }
                }

//                function itemIsInProduct(item, products){
//                    /*
//                     * @todo use regular expression to check if product.name matches item
//                     */
//                    angular.forEach(products, function(product){
//                        
//                    })
//                }
            }])
        .factory('shoppingListService', ['$http', function ($http) {
                var getProducts = function (product_name) {
                    var url = 'index.php?route=shoppinglist/shoppinglist';
                    return $http.get(url + '&filter_name=' + product_name)
                            .then(function (response) {
                                return response.data;
                            });
                };

                var addProductsToCart = function (products) {

                    for (var i = 0; i < products.length; i++) {
                        var product = products[i];
                        var quantity = product.customer_quantity;
                        cart.add(product.id, quantity);
                    }
                };
                var addProductsToWishList = function (products) {
                    for (var i = 0; i < products.length; i++) {
                        var product = products[i];
                        wishlist.add(product.id);
                    }
                };

                return {
                    getProducts: getProducts,
                    addProductsToCart: addProductsToCart,
                    addProductsToWishList: addProductsToWishList
                };
            }]);