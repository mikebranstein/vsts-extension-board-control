define(["require", "exports", "VSS/Controls", "VSS/Controls/Combos", "TFS/WorkItemTracking/Services", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/Core/RestClient", "TFS/Work/RestClient"], function (require, exports, Controls, Combos, WitService, WitClient, WitContracts, CoreClient, WorkClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class colorControl returns a container that renders each row, the selected value,
     * and a function that allows the user to change the selected value.
     */
    class BoardColumnControl {
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
        init() {
            this.getBoardColumnsAsync()
                .then((boardColumns) => {
                this.boardColumns = boardColumns;
                // control container
                let container = $(".container");
                // Create the combo in a container element
                let options = {
                    source: this.boardColumns,
                    change: () => {
                        console.log("changed");
                    },
                    indexChanged: (index) => {
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
                Controls.create(Combos.Combo, container, options);
                let wid = this.workItemId;
                VSS.getService(VSS.ServiceIds.Dialog).then((dialogService) => {
                    let formInstance;
                    let dialogInstance;
                    var extensionCtx = VSS.getExtensionContext();
                    // Build absolute contribution ID for dialogContent
                    let contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".board-form";
                    // Show dialog
                    var dialogOptions = {
                        title: "Move Work Item",
                        width: 400,
                        height: 275,
                        getDialogResult: () => {
                            // this happens when the Ok button is clicked
                            return formInstance ? formInstance.getFormData(wid) : null;
                        },
                        okCallback: (result) => {
                            // If a call to getDialogResult returns a non-null value, this value is then
                            // passed to the function specified by okCallback (also in the options) and the dialog is closed.
                            console.log("called");
                            dialogInstance.close();
                        }
                    };
                    dialogService.openDialog(contributionId, dialogOptions)
                        .then((dialog) => {
                        dialogInstance = dialog;
                        dialog
                            .getContributionInstance(contributionId)
                            .then((instance) => {
                            formInstance = instance;
                            // initialization code goes here
                            formInstance.initialize(wid);
                        }).then(() => {
                            dialog.updateOkButton(true);
                        });
                    });
                });
            });
        }
        getBoardColumnsAsync() {
            let boardColumns = new Array();
            return this.wifService.hasActiveWorkItem()
                .then((hasActiveWorkItem) => {
                if (hasActiveWorkItem)
                    return this.wifService.getId();
            }).then((workItemId) => {
                this.workItemId = workItemId;
                return this.witClient.getWorkItem(this.workItemId, null, null, WitContracts.WorkItemExpand.All);
            }).then((workItem) => {
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
                    boardColumns.push(column.name);
                    console.log(column.name);
                }, this);
                return boardColumns;
            });
        }
    }
    exports.BoardColumnControl = BoardColumnControl;
});
