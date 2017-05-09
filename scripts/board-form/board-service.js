define(["require", "exports", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/Core/RestClient", "TFS/Work/RestClient"], function (require, exports, WitClient, WitContracts, CoreClient, WorkClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoardService {
        constructor(workItemId) {
            this.boardColumns = new Array();
            this.boardRows = new Array();
            this.workItemId = workItemId;
            this.witClient = WitClient.getClient();
            this.coreClient = CoreClient.getClient();
            this.workClient = WorkClient.getClient();
        }
        loadBoardDataAsync() {
            return new Promise((resolve, reject) => {
                if (this.boardColumns.length !== 0 && this.boardRows.length !== 0) {
                    resolve();
                }
                else {
                    this.witClient.getWorkItem(this.workItemId, null, null, WitContracts.WorkItemExpand.All)
                        .then((workItem) => {
                        this.workItem = workItem;
                        return this.coreClient.getProjects();
                    }).then((projects) => {
                        var project = projects.filter((project) => {
                            return project.name === this.workItem.fields["System.TeamProject"];
                        })[0];
                        this.projectId = project.id;
                        return this.coreClient.getTeams(this.projectId, 1, 0);
                    }).then((teams) => {
                        this.teamId = teams[0].id;
                        return this.workClient.getBoard({ projectId: this.projectId, teamId: this.teamId }, "Stories");
                    }).then((board) => {
                        this.boardColumnReferenceName = board.fields.columnField.referenceName;
                        this.boardLaneReferenceName = board.fields.rowField.referenceName;
                        board.columns.forEach((column) => {
                            this.boardColumns.push(column.name);
                        });
                        board.rows.forEach((row) => {
                            this.boardRows.push(row.name);
                        });
                        resolve();
                    });
                }
            });
        }
        getBoardColumnsAsync() {
            return new Promise((resolve, reject) => {
                this.loadBoardDataAsync()
                    .then(() => {
                    resolve(this.boardColumns);
                });
            });
        }
        getSwimlanesAsync() {
            return new Promise((resolve, reject) => {
                this.loadBoardDataAsync()
                    .then(() => {
                    resolve(this.boardRows);
                });
            });
        }
        updateBoardColumnAsync(boardColumn) {
            return new Promise((resolve, reject) => {
                this.loadBoardDataAsync()
                    .then(() => {
                    this.witClient.updateWorkItem([{ "op": "add", "path": "/fields/" + this.boardColumnReferenceName, "value": boardColumn }], this.workItemId, false, false)
                        .then((workItem) => {
                        console.log("wrote column");
                        resolve();
                    });
                });
            });
        }
        updateBoardRowAsync(boardRow) {
            return new Promise((resolve, reject) => {
                this.loadBoardDataAsync()
                    .then(() => {
                    this.witClient.updateWorkItem([{ "op": "add", "path": "/fields/" + this.boardLaneReferenceName, "value": boardRow }], this.workItemId, false, false)
                        .then((workItem) => {
                        resolve();
                    });
                });
            });
        }
    }
    exports.BoardService = BoardService;
});
