import { BoardService } from "./board-service";
import { BoardModel } from "./boardModel";

var provider = () => {
    
    function init(workItemId:number) {

        // define the control here...
        var boardService = new BoardService(workItemId);
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
                        })
                    });
            });
    }

    function getFormData(workItemId):BoardModel { 
        // is called when the dialog Ok button is clicked. should return the data
        var boardModel = new BoardModel();
        boardModel.boardColumn = $(".board-column-select").val();
        boardModel.boardRow = $(".board-row-select").val();

        var boardService = new BoardService(workItemId);
        boardService.updateBoardColumnAsync(boardModel.boardColumn)
            .then(() => {
                console.log("here");
            return boardModel;

            });
        //var rowPromise = boardService.updateBoardRowAsync(boardModel.boardRow);
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
