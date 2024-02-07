ctrlapp.register.controller('IndexController', ['$scope', '$fetch', '$url', '$upload', '$download', function ($scope, $fetch, $url, $upload, $download) {

    $scope.initMethod = function () {
        if (sessionStorage.getItem('isLogin') != 'yes') {
            $scope.goto("login");
        }

        $scope.fileList = [];

        // 初始化列表
        var url = decodeURIComponent($url.urlFormat().params.current || "");
        $scope.currentPath = url.length > 0 ? url : "./";
        $scope.updateFileList();

        // 进度
        $scope.process = {
            display: "none",
            value: 0,
            info: ""
        };

        // 右键菜单
        $scope.rightmenu = {
            display: "none",
            left: 0,
            top: 0,
            value: "",
            isZip: false,
            type: ""
        };
    };

    // 判断是否是zip压缩包
    $scope.isZipFile = function (filename) {
        var temp = filename.split('.');
        if (temp.length < 2) return false;
        return ['zip'].indexOf(temp.pop()) > -1;
    };

    // 刷新当前路径下内容
    $scope.updateFileList = function () {
        return new Promise(function (resolve) {
            $fetch.get("/handler/queryAll?path=" + $scope.currentPath).then(function (res) {
                $scope.fileList = res.filelist;
                $scope.$digest();
                window.location.href = "#/index?current=" + encodeURIComponent($scope.currentPath);
                resolve();
            });
        });
    };

    // 打开文件或文件夹
    $scope.openBtn = function (item) {
        if (item) {

            // 打开文件夹
            if (item.isDirectory) {
                $scope.currentPath = $scope.currentPath + item.name + "/";
                $scope.updateFileList();
            }

            // 打开文件
            else {
                // 打开文件研发中
            }

        }

        // 返回上一页
        else if ($scope.currentPath != "./") {
            $scope.currentPath = $scope.currentPath.replace(/\/[^\/]+\/$/, "/");
            $scope.updateFileList();
        } else {
            alert("已经是首页了哦～");
        }
    };

    $scope.doExit = function () {
        sessionStorage.setItem('isLogin', 'no');
        $scope.goto('login');
    };

    $scope.goHome = function () {
        $scope.currentPath = "./";
        $scope.updateFileList();
    };

    $scope.doFresh = function (msg) {
        $scope.updateFileList().then(function () {
            alert(msg || "列表刷新完毕～");
        });
    };

    $scope.doDragstart = function (event, item) {
        event.originalEvent.dataTransfer.effectAllowed = "copyMove";
        var url = $scope.currentPath + item.name;

        if (item.isDirectory) {
            // 文件夹下载先不支持
        } else {
            event.originalEvent.dataTransfer.setData("DownloadURL", "text/plain:" + item.name + ":" + window.location.origin + url.replace(/^\./, '/userspace'));
            console.log("<文件>下载：" + url);
        }
    };

    $scope.doUploadFile = function (event) {
        $scope.uploadFile(event.target.files);
    };

    $scope.uploadFile = function (files) {
        $upload.uploadMultFile($scope.currentPath, files, function (value, info) {
            $scope.process = {
                display: "block",
                value: value,
                info: info
            };
            $scope.$digest();
        }, function () {
            $scope.process = {
                display: "none",
                value: 0,
                info: ""
            };
            $scope.doFresh("上传完成～");
        });
    };

    $scope.doRightmenu = function (event) {
        event.preventDefault();

        var filename = event.target.getAttribute("name");
        var filetype = event.target.getAttribute("filetype") || "";

        $scope.rightmenu = {
            display: "block",
            left: event.clientX,
            top: event.clientY - 5,
            value: filename,
            isZip: filetype == 'file' && $scope.isZipFile(filename),
            type: filetype
        };

        $scope.$digest();
    };

    $scope.doClickView = function () {
        $scope.rightmenu = {
            display: "none",
            left: 0,
            top: 0,
            value: "",
            isZip: false,
            type: ""
        };
    };

    // 右键菜单 / 复制
    $scope.doCopy = function () {
        sessionStorage.setItem('clipboard-path', $scope.currentPath);
        sessionStorage.setItem('clipboard-name', $scope.rightmenu.value);
        sessionStorage.setItem('clipboard-type', 'copy');
    };

    // 右键菜单 / 剪切
    $scope.doCut = function () {
        sessionStorage.setItem('clipboard-path', $scope.currentPath);
        sessionStorage.setItem('clipboard-name', $scope.rightmenu.value);
        sessionStorage.setItem('clipboard-type', 'cut');
    };

    // 右键菜单 / 粘贴
    $scope.doPaste = function () {
        var sourcePath = sessionStorage.getItem('clipboard-path');
        var sourceName = sessionStorage.getItem('clipboard-name');
        var type = sessionStorage.getItem('clipboard-type');

        if (sourcePath) {
            $fetch.get("/handler/paste?sourcePath=" + sourcePath + "&targetPath=" + $scope.currentPath + "&type=" + type + "&sourceName=" + sourceName).then(function (res) {
                if (type == 'cut') {
                    sessionStorage.removeItem("clipboard-path");
                    sessionStorage.removeItem("clipboard-name");
                    sessionStorage.removeItem("clipboard-type");
                }

                $scope.doFresh(res.msg);
            });
        } else {
            setTimeout(function () {
                alert('剪切板无内容～');
            }, 200);
        }

    };

    // 右键菜单 / 下载到本地
    $scope.doDownload = function () {
        $download.downloadFile($scope.rightmenu.value, $scope.currentPath + $scope.rightmenu.value);
    };

    // 右键菜单 / 压缩文件夹
    $scope.doZip = function () {
        $fetch.get("/handler/zip?sourcePath=" + $scope.currentPath + "&sourceName=" + $scope.rightmenu.value).then(function (res) {
            $scope.doFresh(res.msg);
        });
    };

    // 右键菜单 / 解压
    $scope.doUnzip = function () {
        $fetch.get("/handler/unzip?sourcePath=" + $scope.currentPath + "&sourceName=" + $scope.rightmenu.value).then(function (res) {
            $scope.doFresh(res.msg);
        });
    };

    // 右键菜单 / 删除
    $scope.doDelete = function () {
        $fetch.get("/handler/deleteFile?fullPath=" + $scope.currentPath + "/" + $scope.rightmenu.value).then(function (res) {
            $scope.doFresh(res.msg);
        });
    };

}]);
