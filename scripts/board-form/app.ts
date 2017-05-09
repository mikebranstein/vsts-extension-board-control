import { BoardService } from "./board-service";

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
                })
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
                })
            });


    }
    return {
        initialize: (workItemId:number) => {
            return init(workItemId);
        }
    }
};

VSS.register(VSS.getContribution().id, provider);
