var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "./board-service", "./boardModel"], function (require, exports, board_service_1, boardModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var provider = function () {
        function init(workItemIds, populateDropDownDefaults) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var boardService, selectColumn, selectDoingDone, selectRow;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            boardService = new board_service_1.BoardService(workItemIds[0]);
                            selectColumn = $(".board-column-select");
                            selectDoingDone = $(".board-doing-done-select");
                            selectRow = $(".board-row-select");
                            selectColumn.change(function (eventData) {
                                var selectedColumn = $(".board-column-select option:selected").first();
                                boardService.getBoardColumnSplitAsync(selectedColumn.val())
                                    .then(function (isSplit) {
                                    if (isSplit) {
                                        selectDoingDone.prop("disabled", false);
                                        if (populateDropDownDefaults) {
                                            boardService.getBoardColumnDoneAsync()
                                                .then(function (isDone) {
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
                            return [4 /*yield*/, boardService.getBoardColumnsAsync()
                                    .then(function (boardColumns) {
                                    boardColumns.forEach(function (boardColumn) {
                                        var option = $("<option></option>");
                                        option.attr("value", boardColumn);
                                        option.append(boardColumn);
                                        selectColumn.append(option);
                                    });
                                }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var column;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, boardService.getBoardColumnAsync()];
                                            case 1:
                                                column = _a.sent();
                                                if (populateDropDownDefaults) {
                                                    selectColumn.val(column);
                                                    selectColumn.change();
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, boardService.getSwimlanesAsync()
                                    .then(function (swimlanes) {
                                    swimlanes.forEach(function (swimlane) {
                                        var option = $("<option></option>");
                                        option.attr("value", swimlane);
                                        option.append(swimlane);
                                        selectRow.append(option);
                                    });
                                }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var row;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, boardService.getBoardRowAsync()];
                                            case 1:
                                                row = _a.sent();
                                                if (populateDropDownDefaults) {
                                                    selectRow.val(row);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function getFormData(workItemIds) {
            return __awaiter(this, void 0, void 0, function () {
                var boardModel, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            boardModel = new boardModel_1.BoardModel();
                            boardModel.boardColumnIndex = $(".board-column-select").prop("selectedIndex");
                            boardModel.boardColumn = $(".board-column-select").val();
                            boardModel.boardRow = $(".board-row-select").val();
                            boardModel.boardIsDone = ($(".board-doing-done-select").prop("disabled") === false
                                && $(".board-doing-done-select").val() === "Done");
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < workItemIds.length)) return [3 /*break*/, 4];
                            return [4 /*yield*/, updateBoard(workItemIds[i], boardModel.boardColumn, boardModel.boardIsDone, boardModel.boardColumnIndex, boardModel.boardRow)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, boardModel];
                    }
                });
            });
        }
        return {
            initialize: function (workItemIds, populateDropDownDefaults) {
                return init(workItemIds, populateDropDownDefaults);
            },
            getFormData: function (workItemIds) {
                return getFormData(workItemIds);
            }
        };
    };
    function updateBoard(workItemId, boardColumn, boardIsDone, boardColumnIndex, boardRow) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var boardService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boardService = new board_service_1.BoardService(workItemId);
                        return [4 /*yield*/, boardService.updateBoardColumnAsync(boardColumn, boardIsDone)
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(boardColumnIndex !== 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, boardService.updateBoardRowAsync(boardRow)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    VSS.register(VSS.getContribution().id, provider);
});
