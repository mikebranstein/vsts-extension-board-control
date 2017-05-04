define(["require", "exports", "TFS/WorkItemTracking/Services", "./InputParser", "./model", "./view", "./errorView", "VSS/Utils/Core", "q"], function (require, exports, WitService, InputParser_1, model_1, view_1, errorView_1, VSSUtilsCore, Q) {
    "use strict";
    exports.__esModule = true;
    var Controller = (function () {
        function Controller() {
            var _this = this;
            this._fieldName = "";
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
            this._initialize();
        }
        Controller.prototype._initialize = function () {
            var _this = this;
            this._inputs = VSS.getConfiguration().witInputs;
            this._fieldName = InputParser_1.InputParser.getFieldName(this._inputs);
            WitService.WorkItemFormService.getService().then(function (service) {
                Q.spread([service.getAllowedFieldValues(_this._fieldName), service.getFieldValue(_this._fieldName)], function (allowedValues, currentValue) {
                    if (typeof (currentValue) === 'number') {
                        allowedValues = allowedValues.sort(function (a, b) { return Number(a) - Number(b); });
                    }
                    var options = InputParser_1.InputParser.getOptions(_this._inputs, allowedValues);
                    _this._model = new model_1.Model(options, String(currentValue));
                    _this._view = new view_1.colorControl(_this._model, function (val) {
                        //when value changes by clicking rows
                        _this._updateInternal(val);
                    }, function () {
                        _this._model.selectNextOption();
                        _this._updateInternal(_this._model.getSelectedValue());
                    }, function () {
                        _this._model.selectPreviousOption();
                        _this._updateInternal(_this._model.getSelectedValue());
                    });
                    _this.resize();
                }, _this._handleError).then(null, _this._handleError);
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
            this._model.setSelectedValue(value);
            this._view.update(value, focus);
        };
        Controller.prototype.updateExternal = function (value) {
            this._update(String(value), false);
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
