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
    private witClient:WitClient.WorkItemTrackingHttpClient3_2;
    private coreClient:CoreClient.CoreHttpClient3;
    private workClient:WorkClient.WorkHttpClient3_2;
    private workItemId:number;
    private workItem:WitContracts.WorkItem;
    private projectId:string;
    private teamId:string;
    private boardColumnReferenceName:string;
    private boardColumns:Array<string>;
    private boardRows:Array<string>;

    constructor(workItemId:number) {
        this.workItemId = workItemId;
        this.witClient = WitClient.getClient();
        this.coreClient = CoreClient.getClient();
        this.workClient = WorkClient.getClient();
    }

    private loadBoardDataAsync(): IPromise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this. boardColumns !== null && this.boardRows !== null) 
                resolve();

            this.boardColumns = new Array<string>();
            this.boardRows = new Array<string>();
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
                    board.columns.forEach((column) => {
                        this.boardColumns.push(column.name);
                    });
                    board.rows.forEach((row) => {
                        this.boardRows.push(row.name);
                    })
                    resolve();
                });
            });
    }

    getBoardColumnsAsync(): IPromise<Array<string>> {
        return this.loadBoardDataAsync()
            .then(() => {
                return this.boardColumns;
            })
    }

    getSwimlanesAsync(): IPromise<Array<string>> {
        return this.loadBoardDataAsync()
            .then(() => {
                return this.boardRows;
            })
    }
}