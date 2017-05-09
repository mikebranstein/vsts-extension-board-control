define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class colorRow returns the view of a single value, given the parameters allowedValue, color,
     * label, and whether or not it's selected.
     */
    class colorRow {
        constructor(allowedValue, color, label) {
            this.allowedValue = allowedValue;
            this.color = color;
            this.label = label;
        }
        // creates the row
        create() {
            // row div
            this._row = $("<div> </div>").attr("role", "radio");
            this._row.data("value", this.allowedValue);
            this._row.addClass("row");
            // color div
            var valueColor = $("<div> </div>");
            valueColor.addClass("valueColor");
            var color = this.color;
            valueColor.css("background-color", this.color);
            this._row.append(valueColor);
            // label div
            var valueLabel = $("<div> </div>");
            valueLabel.addClass("valueLabel");
            valueLabel.attr("title", this.label);
            if (!this.label) {
                valueLabel.text(this.allowedValue);
            }
            else {
                valueLabel.text(this.allowedValue + " - " + this.label);
            }
            ;
            this._row.append(valueLabel);
            // return the entire row to the control
            return this._row;
        }
        select(focus) {
            this._row.addClass("selected");
            this._row.attr("aria-checked", "true");
            this._row.attr("tabindex", 0);
            if (focus) {
                this._row.focus();
            }
        }
        unselect() {
            this._row.removeClass("selected");
            this._row.attr("aria-checked", "false");
            this._row.attr("tabindex", -1);
        }
    }
    exports.colorRow = colorRow;
    /**
     * Class colorControl returns a container that renders each row, the selected value,
     * and a function that allows the user to change the selected value.
     */
    class colorControl {
        constructor(model, onItemClicked, onNextItem, onPreviousItem) {
            this.model = model;
            this.onItemClicked = onItemClicked;
            this.onNextItem = onNextItem;
            this.onPreviousItem = onPreviousItem;
            this.rows = [];
            this.init();
        }
        // creates the container
        init() {
            var container = $("<div role='radiogroup'> </div>");
            container.addClass("container");
            container.attr('tabindex', '0');
            var options = this.model.getOptions();
            for (let option of options) {
                var row = new colorRow(option.value, option.color, option.label);
                this.rows.push(row);
                container.append(row.create());
                // checks if the row is selected and displays accordingly
                if (String(option.value) === this.model.getSelectedValue()) {
                    row.select(true);
                }
                else {
                    row.unselect();
                }
            }
            // allows user to click, keyup, or keydown to change the selected value.
            $(document).click((evt) => {
                this._click(evt);
            }).bind('keydown', (evt) => {
                if (evt.keyCode == 40 || evt.keyCode == 39) {
                    // According to ARIA accessibility guide, both down and right arrows should be used.
                    if (this.onNextItem) {
                        this.onNextItem();
                        evt.preventDefault();
                    }
                }
                else if (evt.keyCode == 38 || evt.keyCode == 37) {
                    // According to ARIA accessibility guide, both up and left arrows should be used.
                    if (this.onPreviousItem) {
                        this.onPreviousItem();
                        evt.preventDefault();
                    }
                }
            });
            $('body').empty().append(container);
            $(document).ready(() => {
                this._scroll();
            });
        }
        update(value, focus) {
            for (let row of this.rows) {
                if (row.allowedValue == value) {
                    row.select(focus);
                }
                else {
                    row.unselect();
                }
            }
            this._scroll();
        }
        _scroll() {
            let scrollTo = $("div.row.selected");
            if (scrollTo.length) {
                if (scrollTo.offset().top > $(".container").height()) {
                    $(".container").scrollTop(scrollTo.offset().top - $(".container").offset().top + $(".container").scrollTop());
                }
            }
        }
        _click(evt) {
            let itemClicked = $(evt.target).closest(".row").data("value");
            if (itemClicked != null && $.isFunction(this.onItemClicked)) {
                this.onItemClicked(itemClicked);
            }
        }
    }
    exports.colorControl = colorControl;
});
