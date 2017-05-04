// import { IOption } from "./IOption";
// import { Model } from "./model";

import Controls = require("VSS/Controls");
import Combos = require("VSS/Controls/Combos");

// export class columnOption {
//     private _columnOption: JQuery;

//     constructor(public allowedValue: string) {

//     }

//     public create(): JQuery {
//         this._columnOption = $("<li> </li>").attr("role", "option");
//         this._columnOption.text(this.allowedValue);

//         return this._columnOption;
//     }

// //     public select(focus: boolean): void {
// //         this._row.addClass("selected");
// //         this._row.attr("aria-checked", "true");
// //         this._row.attr("tabindex", 0);
// //         if (focus) {
// //             this._row.focus();
// //         }
// //     }

// //     public unselect(): void {
// //         this._row.removeClass("selected");
// //         this._row.attr("aria-checked", "false");
// //         this._row.attr("tabindex", -1);
// //     }

// }



/**
 * Class colorControl returns a container that renders each row, the selected value,
 * and a function that allows the user to change the selected value.
 */
export class boardColumnControl {

    // public columns: columnOption[] = [];

    constructor(private onItemClicked: Function, private onNextItem: Function, private onPreviousItem: Function) {
        this.init();
    }

    // creates the container
    public init(): void {

        // <div aria-label="Tag" role="combobox" aria-expanded="true" aria-owns="owned_listbox" aria-haspopup="listbox">
        //     <input type="text" aria-autocomplete="list" aria-controls="owned_listbox" aria-activedescendant="selected_option">
        // </div>
        // <ul role="listbox" id="owned_listbox">
        //     <li role="option">Zebra</li>
        //     <li role="option" id="selected_option">Zoom</li>
        // </ul>

        // control container
        var container = $("<div> </div>");

        // Create the combo in a container element
        var options = <Combos.IComboOptions>{
            source: ["New","Deferred","Approved"],
            change: function() {
                console.log("changed");
            },
            indexChanged: function(index: number) {
                console.log("indexchanged: " + index);
            }
        };
        Controls.create<Combos.Combo, Combos.IComboOptions>(Combos.Combo, container, options);


        // container.addClass("combo input-text-box list drop");

        // // wrap for combo
        // var wrap = $("<div> </div>");
        // wrap.addClass("wrap");

        // // text to hold combobox selected value
        // var text = $("<input />").attr("type", "text");
        // text.attr("autocomplete", "off");
        // text.attr("role", "combobox");
        // wrap.append(text);
        // container.append(wrap);

        // // button
        // var button = $("<div> </div>").attr("role", "button");
        // button.addClass("drop bowtie-chevron-don-light bowtie-icon");
        // container.append(button);

        // // ul for the combobox contents
        // var ul = $("<ul> </ul>").attr("role", "listbox");
        // ul.attr("id", "owned_listbox");

        // var options: string[] = ["New","Deferred","Approved"];
        // for (let option of options) {
        //     var column = new columnOption(option);
        //     this.columns.push(column);
        //     ul.append(column.create());
        // }
        // container.append(ul);

        // // allows user to click, keyup, or keydown to change the selected value.
        // $(document).click((evt: JQueryMouseEventObject) => {
        //     this._click(evt);
        // }).bind('keydown', (evt: JQueryKeyEventObject) => {
        //     if (evt.keyCode == 40 || evt.keyCode == 39) {
        //         // According to ARIA accessibility guide, both down and right arrows should be used.
        //         if (this.onNextItem) {
        //             this.onNextItem();
        //             evt.preventDefault();
        //         }
        //     }
        //     else if (evt.keyCode == 38 || evt.keyCode == 37) {
        //         // According to ARIA accessibility guide, both up and left arrows should be used.
        //         if (this.onPreviousItem) {
        //             this.onPreviousItem();
        //             evt.preventDefault();
        //         }
        //     }
        // });

        $('body').empty().append(container);

        $(document).ready(() => {
            this._scroll();
        });
    }

    public update(value: string, focus: boolean): void {
        // for (let row of this.rows) {
        //     if (row.allowedValue == value) {
        //         row.select(focus);
        //     }
        //     else {
        //         row.unselect();
        //     }
        // }
        // this._scroll();
    }

    private _scroll(): void {
        // let scrollTo = $("div.row.selected");

        // if (scrollTo.length) {
        //     if (scrollTo.offset().top > $(".container").height()) {
        //         $(".container").scrollTop(
        //             scrollTo.offset().top - $(".container").offset().top + $(".container").scrollTop()
        //         );
        //     }
        // }
    }

    private _click(evt: JQueryMouseEventObject): void {
        // let itemClicked = $(evt.target).closest(".row").data("value");
        // if (itemClicked != null && $.isFunction(this.onItemClicked)) {
        //     this.onItemClicked(itemClicked);
        // }
    }
}