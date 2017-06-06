import { BoardModel } from "../board-form/boardModel";
import { BoardService } from "../board-form/board-service";
import WitService = require("TFS/WorkItemTracking/Services");

var provider = () => {
    return {
        // Called when the menu item is clicked.
        execute: (args) => {
            var selectedProvider = parseProviderArgs(args);
            selectedProvider.execute();
        }
    }
};

var workItemFormProvider = function(workItemId: number) {
    return {
        execute : () => {

            VSS.getService(VSS.ServiceIds.Dialog).then(async (dialogService:IHostDialogService) => {
                let formInstance;
                let dialogInstance:IExternalDialog;
                var extensionCtx = VSS.getExtensionContext();

                // Build absolute contribution ID for dialogContent
                let contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".board-form";

                // assemble list of work items to update
                let workItemIds = new Array<number>();
                workItemIds.push(workItemId);

                // Show dialog
                var dialogOptions = {
                    title: "Move Work Item",
                    width: 400,
                    height: 300,
                    getDialogResult: async () => {
                        // this happens when the Ok button is clicked
                        var value = formInstance ? await formInstance.getFormData(workItemIds) : null;
                        return value;
                    },
                    okCallback: (result:BoardModel) => {
                        // If a call to getDialogResult returns a non-null value, this value is then
                        // passed to the function specified by okCallback (also in the options) and the dialog is closed.
                        dialogInstance.close();
                    }
                };

                dialogService.openDialog(contributionId, dialogOptions)
                    .then((dialog) => {
                        dialogInstance = dialog;
                        dialog
                            .getContributionInstance(contributionId)
                            .then((instance:any) => {
                                formInstance = instance;

                                // initialization code goes here
                                formInstance.initialize(workItemIds, true);
                            }).then(() => {
                                dialog.updateOkButton(true);
                            });
                    });
            });
        }
    };
};
var backlogProvider = function(workItemIds: Array<number>) {
    return {
        execute : () => {
            console.log("backlog provider executed");
            $.each(workItemIds, (index, workItemId) => {
                console.log("index: " + index, ", workItemId: " + workItemId);
            });

            VSS.getService(VSS.ServiceIds.Dialog).then(async (dialogService:IHostDialogService) => {
                let formInstance;
                let dialogInstance:IExternalDialog;
                var extensionCtx = VSS.getExtensionContext();

                // Build absolute contribution ID for dialogContent
                let contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".board-form";

                // Show dialog
                var dialogOptions = {
                    title: "Move Work Item(s)",
                    width: 400,
                    height: 300,
                    getDialogResult: async () => {
                        // this happens when the Ok button is clicked
                        return formInstance ? await formInstance.getFormData(workItemIds) : null;
                    },
                    okCallback: (result:BoardModel) => {
                        // If a call to getDialogResult returns a non-null value, this value is then
                        // passed to the function specified by okCallback (also in the options) and the dialog is closed.
                        dialogInstance.close();
                    }
                };

                dialogService.openDialog(contributionId, dialogOptions)
                    .then((dialog) => {
                        dialogInstance = dialog;
                        dialog
                            .getContributionInstance(contributionId)
                            .then((instance:any) => {
                                formInstance = instance;

                                // initialization code goes here
                                if (workItemIds.length == 1) {
                                    // for a single item selected, we can pre-pop the drop downs
                                    formInstance.initialize(workItemIds, true);
                                } 
                                else {
                                    // doesn't make sense to pre-pop the drop downs when multiple items are selected
                                    formInstance.initialize(workItemIds, false);
                                }
                            }).then(() => {
                                dialog.updateOkButton(true);
                            });
                    });


            });


        }
    };
};
var notSupportedProvider = function() {
    return {
        execute : () => {
            console.log("Use of this context menu item is not supported in this context.");
            alert("You cannot perform this operation from here.");
            // TODO: disable the context menu item, raise alert message
        }
    };
};

function parseProviderArgs(args) {
    if (args.workItemId !== undefined) {
        return workItemFormProvider(args.workItemId);
    }
    else if (args.workItemIds !== undefined) {
        return backlogProvider(args.workItemIds);
    }
    else if (args.id !== undefined) {
        return notSupportedProvider();
    }
    return notSupportedProvider();
}

VSS.register(VSS.getContribution().id, provider);
