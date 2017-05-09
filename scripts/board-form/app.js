define(["require", "exports", "./board-service"], function (require, exports, board_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var provider = () => {
        function init(workItemId) {
            // define the control here...
            var boardService = new board_service_1.BoardService(workItemId);
            boardService
                .getBoardColumnsAsync()
                .then((boardColumns) => {
                // populate the drop down
                let select = $(".board-column-select");
                boardColumns.forEach((boardColumn) => {
                    let option = $("<option></option>");
                    option.attr("value", boardColumn);
                    option.append(boardColumn);
                    select.append(option);
                });
            });
            boardService
                .getSwimlanesAsync()
                .then((swimlanes) => {
                // populate the drop down
                let select = $(".swimlane-select");
                swimlanes.forEach((swimlane) => {
                    let option = $("<option></option>");
                    option.attr("value", swimlane);
                    option.append(swimlane);
                    select.append(option);
                });
            });
        }
        return {
            initialize: (workItemId) => {
                return init(workItemId);
            }
        };
    };
    VSS.register(VSS.getContribution().id, provider);
});
