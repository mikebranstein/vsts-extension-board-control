define(["require", "exports", "./colors"], function (require, exports, colors_1) {
    "use strict";
    exports.__esModule = true;
    var InputParser = (function () {
        function InputParser() {
        }
        /**
         * Parses and gets a FieldName from a dictionary.
         * @param {IDictionaryStringTo<string>} inputs - The dictionary has the structure:
         *   {
         *      "FieldName": "Priority",
         *      "Colors": "red;orange;yellow;blue",
         *      "Values": "0;1;2;3",
         *      "Labels": "Critical;High;Medium;Low"
         *   }
         * @return {string} The FieldName
         * @throws Will throw an {string} error if a FieldName is not specified in the dictionary.
         */
        InputParser.getFieldName = function (inputs) {
            if (inputs["FieldName"]) {
                return inputs["FieldName"];
            }
            throw ("FieldName not specified.");
        };
        /**
         * Parses the inputs from a {IDictionaryStringTo<string>} dictionary.
         * @return an array of Interfaces of the structure: {
         *           value: values[i],
         *           color: colors[i],
         *           label: labels[i]
         *       }
         * @throws Will throw an {string} error if allowedValues are not specified.
         */
        InputParser.getOptions = function (inputs, allowedValues) {
            if (allowedValues && allowedValues.length) {
                var colors = [];
                var inputColors = [];
                var labels = [];
                var inputLabels = [];
                inputColors = InputParser._extractInputs(inputs["Colors"]);
                inputLabels = InputParser._extractInputs(inputs["Labels"]);
                colors = InputParser._getColors(inputColors, allowedValues);
                labels = InputParser._getLabels(inputLabels, allowedValues);
                return InputParser._buildOptions(allowedValues, colors, labels);
            }
            else {
                throw ("The backing field does not have allowed values.");
            }
        };
        /**
         * Parses {string} rawInput, converting the input to an array of values.
         * @param {string} rawInput - The string consists of colors or labels
         *                            separated by ";"
         * @return {string[]} inputs (either colors or labels)
         * @static
         * @private
         */
        InputParser._extractInputs = function (rawInput) {
            if (rawInput) {
                return rawInput.split(";");
            }
            return [];
        };
        /**
         * Takes {string[]} inputColors and string{[]} values, and maps {string} colors
         * to every value. Also, it checks if the colors were correctly inputed.
         * @return {string[]} newColors - An array of {string} colors that match
         *         the number of values.
         * @static
         * @private
         */
        InputParser._getColors = function (inputColors, values) {
            if (inputColors.length < values.length) {
                //append default colors if we are given less colors than values
                return inputColors.concat(colors_1.Colors.getColors(values.length).slice(inputColors.length));
            }
            else {
                return inputColors.slice(0, values.length);
            }
        };
        /**
         * Takes {string[]} inputLabels and string{[]} values, and maps {string} labels
         * to every value. If more values were provided, it ignores them. If less labels
         * than values were provided, it fills the array with empty strings ("");
         * @return {string[]} newLabels - An array of {string} labels that match
         *         the number of values.
         * @static
         * @private
         */
        InputParser._getLabels = function (inputLabels, values) {
            // Values length can never be 0, labels length can be 0 or more 
            // Defaults to empty string if less labels than values are provided
            return values.map(function (v, idx) { return inputLabels[idx] || ""; });
        };
        /**
         * Takes {string[]} values, colors and labels; and populates an array of interfaces of the
         * form {value: "string", color: "string", label: "string"}
         * @return {IOptions []} options
         * @static
         * @private
         */
        InputParser._buildOptions = function (values, colors, labels) {
            var options = [];
            var valuesLength = values.length;
            for (var i = 0; i < valuesLength; i++) {
                options.push({
                    value: values[i],
                    color: colors[i],
                    label: labels[i]
                });
            }
            return options;
        };
        return InputParser;
    }());
    exports.InputParser = InputParser;
});
