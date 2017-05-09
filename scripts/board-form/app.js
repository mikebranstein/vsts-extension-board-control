define(["require", "exports", "./board-service", "./boardModel"], function (require, exports, board_service_1, boardModel_1) {
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
            })
                .then(() => {
                boardService
                    .getSwimlanesAsync()
                    .then((swimlanes) => {
                    // populate the drop down
                    let select = $(".board-row-select");
                    swimlanes.forEach((swimlane) => {
                        let option = $("<option></option>");
                        option.attr("value", swimlane);
                        option.append(swimlane);
                        select.append(option);
                    });
                });
            });
        }
        function getFormData(workItemId) {
            // is called when the dialog Ok button is clicked. should return the data
            var boardModel = new boardModel_1.BoardModel();
            boardModel.boardColumn = $(".board-column-select").val();
            boardModel.boardRow = $(".board-row-select").val();
            var boardService = new board_service_1.BoardService(workItemId);
            boardService.updateBoardColumnAsync(boardModel.boardColumn)
                .then(() => {
                console.log("here");
                return boardModel;
            });
            //var rowPromise = boardService.updateBoardRowAsync(boardModel.boardRow);
        }
        return {
            initialize: (workItemId) => {
                return init(workItemId);
            },
            getFormData: (workItemId) => {
                return getFormData(workItemId);
            }
        };
    };
    VSS.register(VSS.getContribution().id, provider);
});
