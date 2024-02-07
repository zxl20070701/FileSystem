
(function (window, angular, undefined) {

    "use strict";

    angular.module("ui.libraries").factory('$upload', function () {

        var instance = {

            // 上传单个文件
            uploadFile: function (currentPath, file, callback) {
                var filepath = file.webkitRelativePath || file.name;
                var formData = new FormData();

                formData.append('file', file);
                formData.append('path', currentPath);
                formData.append('filename', encodeURIComponent(file.name));
                formData.append('filepath', encodeURIComponent(filepath));

                fetch("/handler/upload", {
                    method: "POST",
                    body: formData
                }).then(function (response) {
                    response.json().then(function (res) {
                        callback(res, filepath);
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            },

            // 上传多文件
            uploadMultFile: function (currentPath, files, processback, callback) {
                var index = -1;

                var hadLen = 0;
                var updateProcess = function (res, filepath) {
                    hadLen += 1;
                    processback(hadLen / files.length, "#" + hadLen + "/" + files.length + " [上传成功] " + filepath);
                    if (hadLen == files.length) {
                        callback();
                    }
                };

                var doUploadCallback = function () {
                    index += 1;

                    if (index == files.length - 1) {
                        instance.uploadFile(currentPath, files[index], updateProcess);
                    } else {
                        instance.uploadFile(currentPath, files[index], function (res, filepath) {
                            updateProcess(res, filepath);
                            doUploadCallback();
                        });
                    }
                };

                if (files.length > 0) {
                    doUploadCallback();
                }
            }

        };

        return instance;
    });

})(window, window.angular);
