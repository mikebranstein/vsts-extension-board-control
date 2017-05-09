define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Model {
        /**
         * Model takes inputs of Options, an array of option objects from InputParser for each
         * value, along with its respective color and label, if present. Model also takes the
         * initialValue from View, which will be set as the selectedView to begin with.
         * This will change as click events occur within View.
         */
        constructor(options, initialValue) {
            // Array of objects from InputParser (originates from VSS API)
            this._options = [];
            this._options = options;
            this._selectedValue = initialValue;
            this._selectedOption = { value: "", color: "", label: "" };
        }
        // Checks if the selected value exists in the array of objects from InputParser.
        setSelectedValue(value) {
            if (value === undefined) {
                throw "Undefined value";
            }
            for (let option of this._options) {
                if (option.value === value) {
                    this._selectedValue = value;
                    this._selectedOption = option;
                    return;
                }
            }
            this._selectedValue = null;
            this._selectedOption = { value: null, color: "", label: "" };
        }
        selectPreviousOption() {
            let index = this._options.indexOf(this._selectedOption);
            if (index > 0 && index !== -1) {
                this.setSelectedValue(this._options[index - 1].value);
            }
            else {
                this.setSelectedValue(this._options[this._options.length - 1].value);
            }
        }
        selectNextOption() {
            let index = this._options.indexOf(this._selectedOption);
            if (index < (this._options.length - 1) && index !== -1) {
                this.setSelectedValue(this._options[index + 1].value);
            }
            else {
                this.setSelectedValue(this._options[0].value);
            }
        }
        // Returns the stored selected value to compare with field value from VSS API.
        getSelectedValue() {
            return this._selectedValue;
        }
        // Returns the stored selected option for View to update UI.
        getSelectedOption() {
            return this._selectedOption;
        }
        // Returns the stored array of Options for View to update the UI.
        getOptions() {
            return this._options;
        }
    }
    exports.Model = Model;
});
