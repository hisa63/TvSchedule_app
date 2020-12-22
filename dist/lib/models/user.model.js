"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var keyword_model_1 = require("./keyword.model");
var User = /** @class */ (function () {
    function User() {
        this.id = 1;
        this.name = 'hisa';
        this.keywords = [];
    }
    // public scanKeyword():void {
    //   let shudReservePrograms: string[] = []  //  program[]
    //   shudReservePrograms.forEach(program => {
    //     // new Reservation(program, this)
    //   })
    // }
    User.prototype.createKeyword = function (keyword, priority) {
        // this.keywords.indexOf()
        this.keywords.push(new keyword_model_1.Keyword(this, keyword, priority));
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map