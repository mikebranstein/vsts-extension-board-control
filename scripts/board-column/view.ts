import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");
import WitService = require("TFS/WorkItemTracking/Services");
import WitClient = require("TFS/WorkItemTracking/RestClient");
import WitContracts = require("TFS/WorkItemTracking/Contracts");
import CoreContracts = require("TFS/Core/Contracts");
import CoreClient = require("TFS/Core/RestClient");
import WorkClient = require("TFS/Work/RestClient");
import VSS_WebApi = require("VSS/WebApi/RestClient");
import Dialogs = require("VSS/Controls/Dialogs");

/**
 * Class colorControl returns a container that renders each row, the selected value,
 * and a function that allows the user to change the selected value.
 */
export class BoardColumnControl {

    selectedColumn:string;
    private boardColumns:Array<string>;
    private wifService:WitService.IWorkItemFormService;
    private witClient:WitClient.WorkItemTrackingHttpClient3_2;
    private coreClient:CoreClient.CoreHttpClient3;
    private workClient:WorkClient.WorkHttpClient3_2;
    private workItemId:number;
    private workItem:WitContracts.WorkItem;
    private projectId:string;
    private teamId:string;
    private boardColumnReferenceName:string;

    constructor() {
        WitService.WorkItemFormService.getService()
            .then((wifService) => { 
                this.wifService = wifService;
                this.witClient = WitClient.getClient();
                this.coreClient = CoreClient.getClient();
                this.workClient = WorkClient.getClient();

                this.init();
            });
    }

    // creates the container
    public init(): void {

        this.getBoardColumnsAsync()
            .then((boardColumns) => {
                this.boardColumns = boardColumns;

                // control container
                let container = $(".container");

                // Create the combo in a container element
                let options = <Combos.IComboOptions>{
                    source: this.boardColumns,
                    change: () =>  {
                        console.log("changed");
                    },
                    indexChanged: (index: number) => {
                        this.selectedColumn = this.boardColumns[index];

                        

                        // this.witClient.updateWorkItem(
                        //     [{"op":"add","path":"/fields/" + this.boardColumnReferenceName,"value":this.selectedColumn}],
                        //     this.workItemId,
                        //     false,
                        //     false);

                        // also need to 
                        console.log(this.selectedColumn);
                    }
                };
                Controls.create<Combos.Combo, Combos.IComboOptions>(Combos.Combo, container, options);

                let wid = this.workItemId;
                VSS.getService(VSS.ServiceIds.Dialog).then((dialogService:IHostDialogService) => {
                    let formInstance;
                    var extensionCtx = VSS.getExtensionContext();
                    // Build absolute contribution ID for dialogContent
                    let contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".board-form";

                    // Show dialog
                    var dialogOptions = {
                        title: "Move Work Item",
                        width: 400,
                        height: 400
                    };

                    dialogService.openDialog(contributionId, dialogOptions)
                        .then((dialog) => {
                            dialog.getContributionInstance(contributionId).then((instance:any) => {
                                formInstance = instance;

                                console.log(this.workItemId);

                                // initialization code goes here
                                formInstance.initialize(wid);
                            })
                        })
                });
            });

    }

    private getBoardColumnsAsync(): IPromise<Array<string>> {
        let boardColumns: Array<string> = new Array<string>();

        return this.wifService.hasActiveWorkItem()
            .then((hasActiveWorkItem) => {
                if (hasActiveWorkItem) return this.wifService.getId();
            }).then((workItemId) => {
                this.workItemId = workItemId;
                return this.witClient.getWorkItem(this.workItemId, null, null, WitContracts.WorkItemExpand.All);
            }).then((workItem) => {
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
                    boardColumns.push(column.name);
                    console.log(column.name);
                }, this);

                return boardColumns;
            });
    }
}