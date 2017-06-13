define(["require", "exports", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/Core/RestClient", "TFS/Work/RestClient"], function (require, exports, WitClient, WitContracts, CoreClient, WorkClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BoardService = (function () {
        function BoardService(workItemId) {
            this.boardColumns = new Array();
            this.boardColumnSplits = new Array();
            this.boardRows = new Array();
            this.workItemId = workItemId;
            this.witClient = WitClient.getClient();
            this.coreClient = CoreClient.getClient();
            this.workClient = WorkClient.getClient();
        }
        BoardService.prototype.loadBoardDataAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.boardColumns.length !== 0 && _this.boardRows.length !== 0) {
                    resolve();
                }
                else {
                    _this.witClient.getWorkItem(_this.workItemId, null, null, WitContracts.WorkItemExpand.All)
                        .then(function (workItem) {
                        _this.workItem = workItem;
                        return _this.coreClient.getProjects();
                    }).then(function (projects) {
                        var project = projects.filter(function (project) {
                            return project.name === _this.workItem.fields["System.TeamProject"];
                        })[0];
                        _this.projectId = project.id;
                        return _this.coreClient.getTeams(_this.projectId, 1, 0);
                    }).then(function (teams) {
                        _this.teamId = teams[0].id;
                        return _this.workClient.getBoard({ projectId: _this.projectId, teamId: _this.teamId }, "Stories");
                    }).then(function (board) {
                        _this.boardColumnReferenceName = board.fields.columnField.referenceName;
                        _this.boardDoingDoneReferenceName = board.fields.doneField.referenceName;
                        _this.boardLaneReferenceName = board.fields.rowField.referenceName;
                        board.columns.forEach(function (column) {
                            _this.boardColumns.push(column.name);
                            _this.boardColumnSplits.push(column.isSplit);
                        });
                        board.rows.forEach(function (row) {
                            _this.boardRows.push(row.name);
                        });
                        resolve();
                    });
                }
            });
        };
        BoardService.prototype.getBoardColumnAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    resolve(_this.workItem.fields[_this.boardColumnReferenceName]);
                });
            });
        };
        BoardService.prototype.getBoardColumnDoneAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    resolve(_this.workItem.fields[_this.boardDoingDoneReferenceName]);
                });
            });
        };
        BoardService.prototype.getBoardColumnSplitAsync = function (columnName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    var index = _this.boardColumns.indexOf(columnName);
                    resolve(_this.boardColumnSplits[index]);
                });
            });
        };
        BoardService.prototype.getBoardRowAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    resolve(_this.workItem.fields[_this.boardLaneReferenceName]);
                });
            });
        };
        BoardService.prototype.getBoardColumnsAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    resolve(_this.boardColumns);
                });
            });
        };
        BoardService.prototype.getSwimlanesAsync = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    resolve(_this.boardRows);
                });
            });
        };
        BoardService.prototype.updateBoardColumnAsync = function (boardColumn, isDone) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    _this.witClient.updateWorkItem([
                        { "op": "add", "path": "/fields/" + _this.boardColumnReferenceName, "value": boardColumn },
                        { "op": "add", "path": "/fields/" + _this.boardDoingDoneReferenceName, "value": isDone }
                    ], _this.workItemId, false, false)
                        .then(function (workItem) {
                        resolve();
                    });
                });
            });
        };
        BoardService.prototype.updateBoardRowAsync = function (boardRow) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadBoardDataAsync()
                    .then(function () {
                    _this.witClient.updateWorkItem([{ "op": "add", "path": "/fields/" + _this.boardLaneReferenceName, "value": boardRow }], _this.workItemId, false, false)
                        .then(function (workItem) {
                        resolve();
                    });
                });
            });
        };
        return BoardService;
    }());
    exports.BoardService = BoardService;
});
