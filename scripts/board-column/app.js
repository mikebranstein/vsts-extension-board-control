define(["require", "exports", "./control", "TFS/WorkItemTracking/Services"], function (require, exports, control_1, Services_1) {
    "use strict";
    exports.__esModule = true;
    // save on ctr + s
    $(window).bind("keydown", function (event) {
        if (event.ctrlKey || event.metaKey) {
            if (String.fromCharCode(event.which) === "S") {
                event.preventDefault();
                Services_1.WorkItemFormService.getService().then(function (service) { return service.beginSaveWorkItem($.noop, $.noop); });
            }
        }
    });
    var control;
    var provider = function () {
        return {
            onLoaded: function (workItemLoadedArgs) {
                control = new control_1.Controller();
            } //,
            // onFieldChanged: (fieldChangedArgs: ExtensionContracts.IWorkItemFieldChangedArgs) => {
            //     var changedValue = fieldChangedArgs.changedFields[control.getFieldName()];
            //     if (changedValue !== undefined) {
            //         control.updateExternal(changedValue);
            //     }
            // }
        };
    };
    VSS.register(VSS.getContribution().id, provider);
});
