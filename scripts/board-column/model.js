define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Model = (function () {
        /**
         * Model takes inputs of Options, an array of option objects from InputParser for each
         * value, along with its respective color and label, if present. Model also takes the
         * initialValue from View, which will be set as the selectedView to begin with.
         * This will change as click events occur within View.
         */
        function Model(options, initialValue) {
            // Array of objects from InputParser (originates from VSS API)
            this._options = [];
            this._options = options;
            this._selectedValue = initialValue;
            this._selectedOption = { value: "", color: "", label: "" };
        }
        // Checks if the selected value exists in the array of objects from InputParser.
        Model.prototype.setSelectedValue = function (value) {
            if (value === undefined) {
                throw "Undefined value";
            }
            for (var _i = 0, _a = this._options; _i < _a.length; _i++) {
                var option = _a[_i];
                if (option.value === value) {
                    this._selectedValue = value;
                    this._selectedOption = option;
                    return;
                }
            }
            this._selectedValue = null;
            this._selectedOption = { value: null, color: "", label: "" };
        };
        Model.prototype.selectPreviousOption = function () {
            var index = this._options.indexOf(this._selectedOption);
            if (index > 0 && index !== -1) {
                this.setSelectedValue(this._options[index - 1].value);
            }
            else {
                this.setSelectedValue(this._options[this._options.length - 1].value);
            }
        };
        Model.prototype.selectNextOption = function () {
            var index = this._options.indexOf(this._selectedOption);
            if (index < (this._options.length - 1) && index !== -1) {
                this.setSelectedValue(this._options[index + 1].value);
            }
            else {
                this.setSelectedValue(this._options[0].value);
            }
        };
        // Returns the stored selected value to compare with field value from VSS API.
        Model.prototype.getSelectedValue = function () {
            return this._selectedValue;
        };
        // Returns the stored selected option for View to update UI.
        Model.prototype.getSelectedOption = function () {
            return this._selectedOption;
        };
        // Returns the stored array of Options for View to update the UI.
        Model.prototype.getOptions = function () {
            return this._options;
        };
        return Model;
    }());
    exports.Model = Model;
});
