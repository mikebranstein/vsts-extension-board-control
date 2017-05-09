define(["require", "exports", "TFS/WorkItemTracking/Services", "./InputParser", "./model", "./view", "./errorView", "VSS/Utils/Core", "q"], function (require, exports, WitService, InputParser_1, model_1, view_1, errorView_1, VSSUtilsCore, Q) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor() {
            this._fieldName = "";
            this._minWindowWidthDelta = 10; // Minum change in window width to react to
            this._bodyElement = document.getElementsByTagName("body").item(0);
            this._windowResizeThrottleDelegate = VSSUtilsCore.throttledDelegate(this, 50, () => {
                this._windowWidth = window.innerWidth;
                this.resize();
            });
            this._windowWidth = window.innerWidth;
            $(window).resize(() => {
                if (Math.abs(this._windowWidth - window.innerWidth) > this._minWindowWidthDelta) {
                    this._windowResizeThrottleDelegate.call(this);
                }
            });
            this._initialize();
        }
        _initialize() {
            this._inputs = VSS.getConfiguration().witInputs;
            this._fieldName = InputParser_1.InputParser.getFieldName(this._inputs);
            WitService.WorkItemFormService.getService().then((service) => {
                Q.spread([service.getAllowedFieldValues(this._fieldName), service.getFieldValue(this._fieldName)], (allowedValues, currentValue) => {
                    if (typeof (currentValue) === 'number') {
                        allowedValues = allowedValues.sort((a, b) => Number(a) - Number(b));
                    }
                    let options = InputParser_1.InputParser.getOptions(this._inputs, allowedValues);
                    this._model = new model_1.Model(options, String(currentValue));
                    this._view = new view_1.colorControl(this._model, (val) => {
                        //when value changes by clicking rows
                        this._updateInternal(val);
                    }, () => {
                        this._model.selectNextOption();
                        this._updateInternal(this._model.getSelectedValue());
                    }, () => {
                        this._model.selectPreviousOption();
                        this._updateInternal(this._model.getSelectedValue());
                    });
                    this.resize();
                }, this._handleError).then(null, this._handleError);
            }, this._handleError);
        }
        _handleError(error) {
            let errorView = new errorView_1.ErrorView(error);
        }
        _updateInternal(value) {
            WitService.WorkItemFormService.getService().then((service) => {
                service.setFieldValue(this._fieldName, value).then(() => {
                    this._update(value, true);
                }, this._handleError);
            }, this._handleError);
        }
        _update(value, focus) {
            this._model.setSelectedValue(value);
            this._view.update(value, focus);
        }
        updateExternal(value) {
            this._update(String(value), false);
        }
        getFieldName() {
            return this._fieldName;
        }
        resize() {
            // Cast as any until declarations are updated
            VSS.resize(null, this._bodyElement.offsetHeight);
        }
    }
    exports.Controller = Controller;
});
