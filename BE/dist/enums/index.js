"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.FolderStatus = exports.FolderType = void 0;
var FolderType;
(function (FolderType) {
    FolderType["PROJECT"] = "PROJECT";
    FolderType["AREA"] = "AREA";
    FolderType["RESOURCE"] = "RESOURCE";
    FolderType["ARCHIVE"] = "ARCHIVE";
})(FolderType || (exports.FolderType = FolderType = {}));
var FolderStatus;
(function (FolderStatus) {
    FolderStatus["ACTIVE"] = "ACTIVE";
    FolderStatus["INACTIVE"] = "INACTIVE";
})(FolderStatus || (exports.FolderStatus = FolderStatus = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["DONE"] = "DONE";
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
//# sourceMappingURL=index.js.map