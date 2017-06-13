import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");
import WitService = require("TFS/WorkItemTracking/Services");
import WitClient = require("TFS/WorkItemTracking/RestClient");
import * as WitContracts from "TFS/WorkItemTracking/Contracts";
import CoreContracts = require("TFS/Core/Contracts");
import CoreClient = require("TFS/Core/RestClient");
import WorkClient = require("TFS/Work/RestClient");

export class BoardService {

    private wifService:WitService.IWorkItemFormService;
    private witClient:WitClient.WorkItemTrackingHttpClient3_1;
    private coreClient:CoreClient.CoreHttpClient3;
    private workClient:WorkClient.WorkHttpClient3_2;
    private workItemId:number;
    private workItem:WitContracts.WorkItem;
    private projectId:string;
    private teamId:string;
    private boardColumnReferenceName:string;
    private boardDoingDoneReferenceName:string;
    private boardLaneReferenceName:string;
    private boardColumns = new Array<string>();
    private boardColumnSplits = new Array<boolean>();
    private boardRows = new Array<string>();

    constructor(workItemId:number) {
        this.workItemId = workItemId;
        this.witClient = WitClient.getClient();
        this.coreClient = CoreClient.getClient();
        this.workClient = WorkClient.getClient();
    }

    private loadBoardDataAsync(): IPromise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.boardColumns.length !== 0  && this.boardRows.length !== 0) {
                resolve();
            }
            else {
                this.witClient.getWorkItem(this.workItemId, null, null, WitContracts.WorkItemExpand.All)
                    .then((workItem) => {
                        this.workItem = workItem;
                        return this.coreClient.getProjects();
                    }).then((projects) => {
                        var project = <CoreContracts.TeamProjectReference>
                            projects.filter((project) => { 
                                return project.name === this.workItem.fields["System.TeamProject"]; 
                            })[0];
                        this.projectId = project.id;
                        return this.coreClient.getTeams(this.projectId, 1, 0);
                    }).then((teams) => {
                        this.teamId = teams[0].id;
                        return this.workClient.getBoard(<CoreContracts.TeamContext>{ projectId: this.projectId, teamId: this.teamId }, "Stories");
                    }).then((board) => {
                        this.boardColumnReferenceName = board.fields.columnField.referenceName;
                        this.boardDoingDoneReferenceName = board.fields.doneField.referenceName;
                        this.boardLaneReferenceName = board.fields.rowField.referenceName;

                        board.columns.forEach((column) => {
                            this.boardColumns.push(column.name);
                            this.boardColumnSplits.push(column.isSplit);
                        });
                        board.rows.forEach((row) => {
                            this.boardRows.push(row.name);
                        })

                        resolve();
                    });
            }
        });
    }

    getBoardColumnAsync(): IPromise<string> {
        return new Promise<string>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    resolve(this.workItem.fields[this.boardColumnReferenceName]);
                });
        });
    }

    getBoardColumnDoneAsync(): IPromise<string> {
        return new Promise<string>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    resolve(this.workItem.fields[this.boardDoingDoneReferenceName]);
                });
        });
    }

    getBoardColumnSplitAsync(columnName: string): IPromise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    let index = this.boardColumns.indexOf(columnName);
                    resolve(this.boardColumnSplits[index]);
                });
        });
    }

    getBoardRowAsync(): IPromise<string> {
        return new Promise<string>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    resolve(this.workItem.fields[this.boardLaneReferenceName]);
                });
        });
    }

    getBoardColumnsAsync(): IPromise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            this.loadBoardDataAsync()
            .then(() => {
                resolve(this.boardColumns);
            });
        });
    }

    getSwimlanesAsync(): IPromise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            this.loadBoardDataAsync()
            .then(() => {
                resolve(this.boardRows);
            });
        });
    }

    updateBoardColumnAsync(boardColumn:string, isDone:boolean): IPromise<void> {
        return new Promise<void>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    this.witClient.updateWorkItem(
                        [
                            {"op":"add","path":"/fields/" + this.boardColumnReferenceName,"value":boardColumn},
                            {"op":"add","path":"/fields/" + this.boardDoingDoneReferenceName,"value":isDone}
                        ],
                        this.workItemId,
                        false,
                        false)
                        .then((workItem) => {
                            resolve();
                        });
                });
        });
    }
    updateBoardRowAsync(boardRow:string): IPromise<void> {
        return new Promise<void>((resolve, reject) => {
            this.loadBoardDataAsync()
                .then(() => {
                    this.witClient.updateWorkItem(
                        [{"op":"add","path":"/fields/" + this.boardLaneReferenceName,"value":boardRow}],
                        this.workItemId,
                        false,
                        false)
                        .then((workItem) => {
                            resolve();
                        });
                });
        });
    }
}