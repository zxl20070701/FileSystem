ctrlapp.register.controller('LoginController', ['$scope', '$fetch', function ($scope, $fetch) {

    $scope.initMethod = function () {
        $scope.params = {
            username: "admin",
            password: "111111"
        };
    };

    $scope.doLogin = function () {
        $fetch.post("/verification/login", $scope.params).then(function (res) {
            sessionStorage.setItem('isLogin', 'yes');
            $scope.goto("index");
        });
    };

}]);
