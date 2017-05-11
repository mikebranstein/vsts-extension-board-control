define(["require", "exports", "./view", "./errorView"], function (require, exports, view_1, errorView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor() {
            this._fieldName = "WEF_FA17412CD1904315BDD8813D3E14CA67_Kanban.Column";
            this._initialize();
        }
        _initialize() {
            this._inputs = VSS.getConfiguration().witInputs;
            this._view = new view_1.BoardColumnControl();
        }
        _handleError(error) {
            let errorView = new errorView_1.ErrorView(error);
        }
        getFieldName() {
            return this._fieldName;
        }
    }
    exports.Controller = Controller;
});
