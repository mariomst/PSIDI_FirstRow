var ModalLogs = function ($http, $scope, $modalInstance, object, $cookieStore, PrescriptionLog, Labprotshare) {

    $scope.object = object;

    $http.get(Labprotshare.getUrl_Prefix() + "/api/prescription_logs?prescription="+object.id).success(function(data){
        $scope.logs = data;
    });

    $scope.log = {};

    $scope.comment = function() {
        $scope.log.date = new Date().toISOString();
        $scope.log.user = $cookieStore.get("labprot-user").id;
        $scope.log.phase = object.phase;
        $scope.log.objective_phase = object.objective_phase;
        $scope.log.prescription = object.id;

        PrescriptionLog.save($scope.log, function(log){
            log.user = {};
            log.user.first_name = $cookieStore.get("labprot-user").first_name;
            log.user.last_name = $cookieStore.get("labprot-user").last_name;
            $scope.logs.push(log);
            $scope.show_info = true;
            $scope.notification = "Comentário adicionado com sucesso.";
        }, function(error){
            $scope.show_error = true;
            $scope.error = "Ocorreu um erro ao adicionar o comentário.";
        });
        $scope.log = {};
    };

    $scope.ok = function () {
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalExpandPrescription = function ($scope, $http, $modalInstance, object) {

    $scope.object = object;

    try{
        var json = JSON.parse($scope.object.products[0].arch_json);
        $scope.object.arch_teeth = JSON.parse(json.arch_teeth);
        $scope.object.arch_colors = JSON.parse(json.arch_colors);
    } catch(err){}

    $scope.superior_small = [18, 17, 16, 15, 14, 13];
    $scope.superior_middle = [12, 11, 21, 22, 23, 24];
    $scope.superior_big = [25, 26, 27, 28];

    $scope.inferior_small = [48, 47, 46, 45, 44, 43];
    $scope.inferior_middle = [42, 41, 31, 32, 33, 34];
    $scope.inferior_big = [35, 36, 37, 38];

    $scope.ok = function () {
        $modalInstance.close($scope.object.id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalSendPrescription = function ($cookieStore, $scope, $modalInstance, PrescriptionLog, object) {

    $scope.object = object;

    $scope.log = {};
    $scope.log.date = new Date().toISOString();
    $scope.log.user = $cookieStore.get("labprot-user").id;
    $scope.log.phase = object.phase;
    $scope.log.objective_phase = object.objective_phase;
    $scope.log.prescription = object.id;

    $scope.ok = function () {
        $scope.object.log = $scope.log;
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalConfirmObject = function ($scope, $modalInstance, object) {

    $scope.object = object;

    $scope.ok = function () {
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalUpdatePhase = function($scope, $modalInstance, $cookieStore, object){

    $scope.object = object;

    $scope.log = {};
    $scope.log.date = new Date().toISOString();
    $scope.log.user = $cookieStore.get("labprot-user").id;
    $scope.log.phase = object.phase;
    $scope.log.objective_phase = object.objective_phase;
    $scope.log.prescription = object.id;

    $scope.objective_phases = [
        {
            "id": 1,
            "name": "Prova 1"
        },
        {
            "id": 2,
            "name": "Prova Biscuit"
        },
        {
            "id": 3,
            "name": "Prova de Estrutura"
        },
        {
            "id": 4,
            "name": "Pronto"
        }
    ];

    $scope.ok = function () {
        var objective_phase_text = $('#objective_phase').find('option:selected').text();
        $scope.log.comment = "A fase objectivo da prescrição foi alterada para " + objective_phase_text + ".";
        $scope.object.log = $scope.log;
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};