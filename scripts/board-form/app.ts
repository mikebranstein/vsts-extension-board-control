import { BoardService } from "./board-service";
import { BoardModel } from "./boardModel";

var provider = () => {
    
    async function init(workItemId:number) {

        // populate the drop down
        let selectColumn = $(".board-column-select");
        let selectRow = $(".board-row-select");

        // define the control here...
        let boardService = new BoardService(workItemId);
        await boardService.getBoardColumnsAsync()
            .then((boardColumns) => {
                boardColumns.forEach((boardColumn) => {
                    let option = $("<option></option>");
                    option.attr("value", boardColumn);
                    option.append(boardColumn);
                    selectColumn.append(option);
                });
            }).then(async () => {
                var column = await boardService.getBoardColumnAsync();
                selectColumn.val(column);
            });
        await boardService.getSwimlanesAsync()
            .then((swimlanes) => {
                swimlanes.forEach((swimlane) => {
                    let option = $("<option></option>");
                    option.attr("value", swimlane);
                    option.append(swimlane);
                    selectRow.append(option);
                })
            }).then(async () => {
                var row = await boardService.getBoardRowAsync();
                selectRow.val(row);
            });
    }

    async function getFormData(workItemId) { 
        // is called when the dialog Ok button is clicked. should return the data
        let boardModel = new BoardModel();
        boardModel.boardColumnIndex = $(".board-column-select").prop("selectedIndex");
        boardModel.boardColumn = $(".board-column-select").val();
        boardModel.boardRow = $(".board-row-select").val();

        var boardService = new BoardService(workItemId);
        var success = await boardService.updateBoardColumnAsync(boardModel.boardColumn)
            .then(async () => {
                if (boardModel.boardColumnIndex !== 0) {
                    await boardService.updateBoardRowAsync(boardModel.boardRow);
                }
                return;
            })
            .then(() => { return true;}, () => { return false; });

        if (success) { return boardModel; }
        return null;
    }

    return {
        initialize: (workItemId:number) => {
            return init(workItemId);
        },
        getFormData: (workItemId:number) => {
            return getFormData(workItemId);
        }
    }
};

VSS.register(VSS.getContribution().id, provider);
