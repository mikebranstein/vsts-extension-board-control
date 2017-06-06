var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./board-service", "./boardModel"], function (require, exports, board_service_1, boardModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var provider = () => {
        function init(workItemIds, populateDropDownDefaults) {
            return __awaiter(this, void 0, void 0, function* () {
                let boardService = new board_service_1.BoardService(workItemIds[0]);
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
                        }
                        else {
                            selectDoingDone.prop("disabled", "disabled");
                            selectDoingDone.val("Doing");
                        }
                    });
                });
                yield boardService.getBoardColumnsAsync()
                    .then((boardColumns) => {
                    boardColumns.forEach((boardColumn) => {
                        let option = $("<option></option>");
                        option.attr("value", boardColumn);
                        option.append(boardColumn);
                        selectColumn.append(option);
                    });
                }).then(() => __awaiter(this, void 0, void 0, function* () {
                    var column = yield boardService.getBoardColumnAsync();
                    if (populateDropDownDefaults) {
                        selectColumn.val(column);
                        selectColumn.change();
                    }
                }));
                yield boardService.getSwimlanesAsync()
                    .then((swimlanes) => {
                    swimlanes.forEach((swimlane) => {
                        let option = $("<option></option>");
                        option.attr("value", swimlane);
                        option.append(swimlane);
                        selectRow.append(option);
                    });
                }).then(() => __awaiter(this, void 0, void 0, function* () {
                    var row = yield boardService.getBoardRowAsync();
                    if (populateDropDownDefaults) {
                        selectRow.val(row);
                    }
                }));
            });
        }
        function getFormData(workItemIds) {
            return __awaiter(this, void 0, void 0, function* () {
                // is called when the dialog Ok button is clicked. should return the data
                let boardModel = new boardModel_1.BoardModel();
                boardModel.boardColumnIndex = $(".board-column-select").prop("selectedIndex");
                boardModel.boardColumn = $(".board-column-select").val();
                boardModel.boardRow = $(".board-row-select").val();
                boardModel.boardIsDone = ($(".board-doing-done-select").prop("disabled") === false
                    && $(".board-doing-done-select").val() === "Done");
                for (let i = 0; i < workItemIds.length; i++) {
                    yield updateBoard(workItemIds[i], boardModel.boardColumn, boardModel.boardIsDone, boardModel.boardColumnIndex, boardModel.boardRow);
                }
                return boardModel;
            });
        }
        return {
            initialize: (workItemIds, populateDropDownDefaults) => {
                return init(workItemIds, populateDropDownDefaults);
            },
            getFormData: (workItemIds) => {
                return getFormData(workItemIds);
            }
        };
    };
    function updateBoard(workItemId, boardColumn, boardIsDone, boardColumnIndex, boardRow) {
        return __awaiter(this, void 0, void 0, function* () {
            let boardService = new board_service_1.BoardService(workItemId);
            yield boardService.updateBoardColumnAsync(boardColumn, boardIsDone)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (boardColumnIndex !== 0) {
                    yield boardService.updateBoardRowAsync(boardRow);
                }
            }));
        });
    }
    VSS.register(VSS.getContribution().id, provider);
});
