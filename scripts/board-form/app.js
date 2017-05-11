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
        function init(workItemId) {
            return __awaiter(this, void 0, void 0, function* () {
                // populate the drop down
                let selectColumn = $(".board-column-select");
                let selectRow = $(".board-row-select");
                // define the control here...
                let boardService = new board_service_1.BoardService(workItemId);
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
                    selectColumn.val(column);
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
                    selectRow.val(row);
                }));
            });
        }
        function getFormData(workItemId) {
            return __awaiter(this, void 0, void 0, function* () {
                // is called when the dialog Ok button is clicked. should return the data
                let boardModel = new boardModel_1.BoardModel();
                boardModel.boardColumnIndex = $(".board-column-select").prop("selectedIndex");
                boardModel.boardColumn = $(".board-column-select").val();
                boardModel.boardRow = $(".board-row-select").val();
                var boardService = new board_service_1.BoardService(workItemId);
                var success = yield boardService.updateBoardColumnAsync(boardModel.boardColumn)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    if (boardModel.boardColumnIndex !== 0) {
                        yield boardService.updateBoardRowAsync(boardModel.boardRow);
                    }
                    return;
                }))
                    .then(() => { return true; }, () => { return false; });
                if (success) {
                    return boardModel;
                }
                return null;
            });
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
