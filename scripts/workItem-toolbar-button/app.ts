import { BoardModel } from "../board-form/boardModel";
import { BoardService } from "../board-form/board-service";
import WitService = require("TFS/WorkItemTracking/Services");

var provider = () => {
    return {
        // Called when the menu item is clicked.
        execute: () => {

            // display a dialog  
            VSS.getService(VSS.ServiceIds.Dialog).then(async (dialogService:IHostDialogService) => {
                let formInstance;
                let dialogInstance:IExternalDialog;
                var extensionCtx = VSS.getExtensionContext();

                // Build absolute contribution ID for dialogContent
                let contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".board-form";
                let wifService:WitService.IWorkItemFormService = await WitService.WorkItemFormService.getService();
                let hasActiveWorkItem = await wifService.hasActiveWorkItem();
                let id = await wifService.getId();

                // Show dialog 
                var dialogOptions = {
                    title: "Move Work Item",
                    width: 400,
                    height: 275,
                    getDialogResult: () => {
                        // this happens when the Ok button is clicked
                        console.log(id);

                        return formInstance ? formInstance.getFormData(id) : null;
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
                                formInstance.initialize(id);
                            }).then(() => {
                                dialog.updateOkButton(true);
                            });
                    });
            });
        }
    }
};

VSS.register(VSS.getContribution().id, provider);
