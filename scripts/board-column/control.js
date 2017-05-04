define(["require", "exports", "TFS/WorkItemTracking/Services", "./view", "./errorView", "VSS/Utils/Core"], function (require, exports, WitService, view_1, errorView_1, VSSUtilsCore) {
    "use strict";
    exports.__esModule = true;
    var Controller = (function () {
        function Controller() {
            var _this = this;
            this._fieldName = "WEF_FA17412CD1904315BDD8813D3E14CA67_Kanban.Column";
            this._minWindowWidthDelta = 10; // Minum change in window width to react to
            this._bodyElement = document.getElementsByTagName("body").item(0);
            this._windowResizeThrottleDelegate = VSSUtilsCore.throttledDelegate(this, 50, function () {
                _this._windowWidth = window.innerWidth;
                _this.resize();
            });
            this._windowWidth = window.innerWidth;
            $(window).resize(function () {
                if (Math.abs(_this._windowWidth - window.innerWidth) > _this._minWindowWidthDelta) {
                    _this._windowResizeThrottleDelegate.call(_this);
                }
            });
            // need to get the KanbanBoard 
            this._initialize();
        }
        Controller.prototype._initialize = function () {
            var _this = this;
            this._inputs = VSS.getConfiguration().witInputs;
            //this._fieldName = InputParser.getFieldName(this._inputs);
            // i think this monitors for changes in the control?
            // 
            // WitService.WorkItemFormService.getService().then(
            //     (service) => {
            //         Q.spread<any, any>(
            //             [service.getAllowedFieldValues(this._fieldName), service.getFieldValue(this._fieldName)],
            //             (allowedValues: string[], currentValue: (string | number)) => {
            //                 if (typeof (currentValue) === 'number') {
            //                     allowedValues = allowedValues.sort((a, b) => Number(a) - Number(b));
            //                 }
            //                 //let options = InputParser.getOptions(this._inputs, allowedValues);
            //                 this._model = new Model(options, String(currentValue));
            //                 this._view = new colorControl(this._model, (val) => {
            //                     //when value changes by clicking rows
            //                     this._updateInternal(val);
            //                 }, () => {//when down or right arrow is used
            //                     this._model.selectNextOption();
            //                     this._updateInternal(this._model.getSelectedValue());
            //                 }, () => {//when up or left arror is used
            //                     this._model.selectPreviousOption();
            //                     this._updateInternal(this._model.getSelectedValue());
            //                 });
            //                 this.resize();
            //             }, this._handleError
            //         ).then(null, this._handleError);
            //     },
            //     this._handleError);
            WitService.WorkItemFormService.getService().then(function (service) {
                //let options = InputParser.getOptions(this._inputs, allowedValues);
                _this._view = new view_1.boardColumnControl(function (val) {
                    //when value changes by clicking rows
                    //this._updateInternal(val);
                }, function () {
                    //this._updateInternal(this._model.getSelectedValue());
                }, function () {
                    //this._updateInternal(this._model.getSelectedValue());
                });
                _this.resize();
                // Q.spread<any, any>(
                //     [service.getAllowedFieldValues(this._fieldName), service.getFieldValue(this._fieldName)],
                //     (allowedValues: string[], currentValue: (string | number)) => {
                //         if (typeof (currentValue) === 'number') {
                //             allowedValues = allowedValues.sort((a, b) => Number(a) - Number(b));
                //         }
                //         //let options = InputParser.getOptions(this._inputs, allowedValues);
                //         this._view = new boardColumnControl((val) => {
                //             //when value changes by clicking rows
                //             //this._updateInternal(val);
                //         }, () => {//when down or right arrow is used
                //             //this._updateInternal(this._model.getSelectedValue());
                //         }, () => {//when up or left arror is used
                //             //this._updateInternal(this._model.getSelectedValue());
                //         });
                //         this.resize();
                //     }, this._handleError
            }, this._handleError);
        };
        Controller.prototype._handleError = function (error) {
            var errorView = new errorView_1.ErrorView(error);
        };
        Controller.prototype._updateInternal = function (value) {
            var _this = this;
            WitService.WorkItemFormService.getService().then(function (service) {
                service.setFieldValue(_this._fieldName, value).then(function () {
                    _this._update(value, true);
                }, _this._handleError);
            }, this._handleError);
        };
        Controller.prototype._update = function (value, focus) {
            //this._model.setSelectedValue(value);
            //this._view.update(value, focus);
        };
        Controller.prototype.updateExternal = function (value) {
            //this._update(String(value), false);
        };
        Controller.prototype.getFieldName = function () {
            return this._fieldName;
        };
        Controller.prototype.resize = function () {
            // Cast as any until declarations are updated
            VSS.resize(null, this._bodyElement.offsetHeight);
        };
        return Controller;
    }());
    exports.Controller = Controller;
});
