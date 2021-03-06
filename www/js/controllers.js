angular.module('starter.controllers', [ 'angular.filter' ])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/acerca.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeAcerca = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.acerca= function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeAcerca();
            }, 1000);
        };
        $scope.salir = function(){
            ionic.Platform.exitApp(); // para la aplicacion

        }
    })


    .controller("IntroCtrl", function($scope ,$state,$timeout){
        //$scope.logo='img/logo-unerg-750.png'

        $scope.logo='img/UNERG.png';
        $scope.intro_fondo='img/Intro_fondo.gif';
        setTimeout(function(){
            $state.go('Logins');
        },20000);


    })
    .controller("LoginCtrl", function($scope ,$state,$timeout,$http,$httpParamSerializerJQLike){
        //$scope.logo='img/logo-unerg-750.png'
        //$scope.loginData=[];
        $scope.data={};
        $scope.datapersonal= [];
        $scope.logo='img/UNERG.jpg';



        $scope.doLogin= function(data2){
            // $scope.username="";
            //$scope.password="";
            //var data=JSON.stringify(data);
            $scope.login=$http({
                method: 'POST',
                url: 'http://api',
                data: $httpParamSerializerJQLike(data2),
                headers: {'Content-Type': 'application/x-www-form-urlencoded','Access-Control-Allow-Control':'*'}
            })
                .success(function(response) {
                    // handle success things
                    //console.log(response);
                    //console.log(response.status);
                    if (response.status=="success") {
                        //console.log(response);
                        $scope.datapersonal = response;
                        console.log($scope.datapersonal.data.User.nombres+" "+ $scope.datapersonal.data.User.id+" "+$scope.datapersonal.data.User.password+" "+$scope.datapersonal.data.User.ingreso);
                        $state.go('app.playlists',{user:$scope.datapersonal.data.User.nombres,ape:$scope.datapersonal.data.User.apellidos,cedula:$scope.datapersonal.data.User.id,token:$scope.datapersonal.data.User.password,ingHora:$scope.datapersonal.data.User.ingreso});
                    }if(response.status=="error") {
                        console.log(response.mensaje);
                        alert(response.mensaje);
                    }
                })
                .error(function(data, status, headers, config) {
                    // handle error things
                    console.error(data,status);
                });
        };

    })
    .controller('PlaylistsCtrl', function($scope,$state,$ionicLoading,$timeout,$http,$stateParams,$httpParamSerializerJQLike) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
        $scope.logo='img/UNERG.jpg';
        $scope.NombreUser=$stateParams.user;
        $scope.ApellidoUser=$stateParams.ape;
        $scope.Cedula=$stateParams.cedula;
        $scope.Token=$stateParams.token;
        $scope.ingresoHora=$stateParams.ingHora;
        //$scope.year= $httpParamSerializerJQLike($scope.Year);
        $scope.listOfOptions = ['2015', '2016', '2017'];
        // console.log($scope.NombreUser)

        $scope.doYear=function(){
            //console.log(dataYear);
            // alert(this.Year);
            console.log($scope.NombreUser+" "+ $scope.ApellidoUser+" "+$scope.Cedula+" "+$scope.Token+" "+this.Year);
            $ionicLoading.show({
                templateUrl: 'resp.html'
                // noBackdrop: true
            });
            $timeout(function() {
                $ionicLoading.hide();

                $state.go('app.recibosAll',{cedula:$scope.Cedula,token:$scope.Token,year:this.Year});
            }, 4000);
        };


    })

    .controller('recibosAllCtrl', function($scope, $stateParams,$http) {
        $scope.dataRecibos=[];
        $scope.yearRecibos=[];
        $scope.userRecibos=[];
        //$scope.byTime = [];
        $http.get("http://api/"+$stateParams.cedula+"/"+$stateParams.token+"/"+$stateParams.year)
            .success(function(response){
                if (response.status=="success"){
                    var hasta=0;
                    //console.log(response);
                    //console.log(response.data);
                    //console.log(response.data.Nomina[0].hasta);
                    //console.log(response.data.Nomina.length);
                    console.log(response.data.User);
                    //var dataRecibos = angular.toJson(response);
                    //$state.go('app.recibosAll',{r:response});
                    $scope.yearRecibos=response.data.Nomina[0].hasta;
                    $scope.userRecibos=response.data.User;

                    Array.prototype.groupBy = function(prop) {
                        return this.reduce(function(groups, item) {
                            var val = item[prop];
                            groups[val] = groups[val] || [];
                            groups[val].push(item);
                            return groups;
                        },{});
                    };

                    $scope.dataRecibos = response.data.Nomina.groupBy('hasta');
                    console.log($scope.dataRecibos);
                    /*angular.forEach($scope.dataRecibos.Nomina, function(value, key){
                        console.log(key + ': ' + value);
                    });*/
                }

            }).error(function(data, status, headers, config) {
                // handle error things
                console.error(data,status);
            });
    })
    .controller('reciboDetalleCtrl', function($scope, $stateParams,$http) {
        $scope.reciboDetalle = [];
        $scope.reciboDetalleVista=[];
        $http.get("api/"+$stateParams.idRecibo+"/"+$stateParams.Cedula+"/"+$stateParams.Token)
            .success(function(response){
                if (response.status=="success"){
                    var hasta=0;
                    //console.log(response.data);
                    $scope.reciboDetalleVista=response.data;
                    /*for(var i=0;i<=response.data.Detalle.length;i++){
                    // console.log(response.data.Detalle[i]);
                        $scope.reciboDetalle.push(response.data.Detalle[i]);
                    }
                    $scope.reciboDetalleVista=$scope.reciboDetalle;
                    console.log($scope.reciboDetalleVista);*/
                    Array.prototype.groupBy = function(prop) {
                        return this.reduce(function(groups, item) {
                            var val = item[prop];
                            groups[val] = groups[val] || [];
                            groups[val].push(item);
                            return groups;
                        },{});
                    };

                    //$scope.reciboDetalleVista = response.data.Detalle.groupBy('tipo');
                    console.log($scope.reciboDetalleVista);

                    $scope.Nombres=$scope.reciboDetalleVista.User[0].nombres;

                    $scope.Apellidos=$scope.reciboDetalleVista.User[0].apellidos;

                    $scope.Cedula=$scope.reciboDetalleVista.User[0].id;

                }

            }).error(function(data, status, headers, config) {
                // handle error things
                console.error(data,status);
            });
    });
