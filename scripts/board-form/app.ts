import { BoardService } from "./board-service";
import { BoardModel } from "./boardModel";
import * as Q from "q";

var provider = () => {
    
    async function init(workItemIds:Array<number>, populateDropDownDefaults:boolean) {
        let boardService = new BoardService(workItemIds[0]);

        // populate the drop down
        let selectColumn = $(".board-column-select");
        let selectDoingDone = $(".board-doing-done-select");
        let selectRow = $(".board-row-select");

        selectColumn.change((eventData) => {
            let selectedColumn = $(".board-column-select option:selected").first();
            boardService.getBoardColumnSplitAsync(selectedColumn.val())
                .then((isSplit) => {
                    if (isSplit) {
                        selectDoingDone.prop("disabled", false);

                        if (populateDropDownDefaults) {
                            boardService.getBoardColumnDoneAsync()
                                .then((isDone) => {
                                    if (isDone) {
                                        selectDoingDone.val("Done");
                                    }
                                    else {
                                        selectDoingDone.val("Doing");
                                    }
                                });
                        }
                    } else {
                        selectDoingDone.prop("disabled", "disabled");
                        selectDoingDone.val("Doing");
                    }
                });
        });

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
                if (populateDropDownDefaults) {
                    selectColumn.val(column);
                    selectColumn.change();
                }
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
                if (populateDropDownDefaults) {
                    selectRow.val(row);
                }
            });
    }

    async function getFormData(workItemIds:Array<number>) { 
        // is called when the dialog Ok button is clicked. should return the data
        let boardModel = new BoardModel();
        boardModel.boardColumnIndex = $(".board-column-select").prop("selectedIndex");
        boardModel.boardColumn = $(".board-column-select").val();
        boardModel.boardRow = $(".board-row-select").val();
        boardModel.boardIsDone = (
            $(".board-doing-done-select").prop("disabled") === false 
            && $(".board-doing-done-select").val() === "Done");

        for (let i = 0; i < workItemIds.length; i++) {
            await updateBoard(workItemIds[i], boardModel.boardColumn, boardModel.boardIsDone, boardModel.boardColumnIndex, boardModel.boardRow);
        }
        return boardModel
    }

    return {
        initialize: (workItemIds:Array<number>, populateDropDownDefaults: boolean) => {
            return init(workItemIds, populateDropDownDefaults);
        },
        getFormData: (workItemIds:Array<number>) => {
            return getFormData(workItemIds);
        }
    }
};

async function updateBoard(workItemId: number, boardColumn: string, boardIsDone: boolean, boardColumnIndex: number, boardRow: string) {
    let boardService = new BoardService(workItemId);
    await boardService.updateBoardColumnAsync(boardColumn, boardIsDone)
        .then(async () => {
            if (boardColumnIndex !== 0) {
                await boardService.updateBoardRowAsync(boardRow);
            }
        });
}

VSS.register(VSS.getContribution().id, provider);
