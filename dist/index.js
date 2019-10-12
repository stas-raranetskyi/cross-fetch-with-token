"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./services/token");
var settings_1 = require("./settings");
exports.settings = settings_1.default;
var fetchWithToken_1 = require("./services/fetchWithToken");
exports.default = fetchWithToken_1.default;
exports.tokenService = token_1.Token.getInstance();
//# sourceMappingURL=index.js.map