define(["require", "exports", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/Core/RestClient", "TFS/Work/RestClient"], function (require, exports, WitClient, WitContracts, CoreClient, WorkClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoardService {
        constructor(workItemId) {
            this.workItemId = workItemId;
            this.witClient = WitClient.getClient();
            this.coreClient = CoreClient.getClient();
            this.workClient = WorkClient.getClient();
        }
        loadBoardDataAsync() {
            return new Promise((resolve, reject) => {
                if (this.boardColumns !== null && this.boardRows !== null)
                    resolve();
                this.boardColumns = new Array();
                this.boardRows = new Array();
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
                    board.columns.forEach((column) => {
                        this.boardColumns.push(column.name);
                    });
                    board.rows.forEach((row) => {
                        this.boardRows.push(row.name);
                    });
                    resolve();
                });
            });
        }
        getBoardColumnsAsync() {
            return this.loadBoardDataAsync()
                .then(() => {
                return this.boardColumns;
            });
        }
        getSwimlanesAsync() {
            return this.loadBoardDataAsync()
                .then(() => {
                return this.boardRows;
            });
        }
    }
    exports.BoardService = BoardService;
});
