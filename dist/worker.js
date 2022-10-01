/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.91 Safari/537.36',
    acceptHeader: 'video/mp4, video/webm;q=0.9, image/jpeg, image/png, image/gif;q=0.8, application/octet-stream;q=0.7, */*;q=0.6, text/html;q=0.5',
};
exports["default"] = config;


/***/ }),

/***/ "./src/fetch/image.ts":
/*!****************************!*\
  !*** ./src/fetch/image.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.image = void 0;
const jsonError_1 = __webpack_require__(/*! ../jsonError */ "./src/jsonError.ts");
const config_1 = __importDefault(__webpack_require__(/*! ../config */ "./src/config.ts"));
async function image(uri, event) {
    let id = uri.pathname.substring(1);
    let url = `https://i.imgur.com/${id}`;
    const cache = caches.default;
    const options = {
        headers: {
            'User-Agent': config_1.default.userAgent,
            Accept: config_1.default.acceptHeader,
        },
    };
    if (id.includes('.gifv')) {
        id = id.replace('.gifv', '.mp4');
        return Response.redirect(`${uri.origin}/${id}`);
    }
    let response = await cache.match(url);
    if (!response) {
        const imageResponse = await fetch(url, options);
        const headers = {
            'cache-control': 'public, max-age=31536000',
        };
        const cloned = imageResponse.clone();
        response = new Response(cloned.body, {
            ...cloned,
            headers,
        });
        const type = imageResponse.headers.get('content-type');
        if (type &&
            imageResponse.status >= 200 &&
            imageResponse.status <= 300 &&
            imageResponse.redirected == false // Imgur redirect on 404 error
        ) {
            event.waitUntil(cache.put(url, imageResponse.clone()));
        }
        else {
            return (0, jsonError_1.jsonError)('Not found', 404);
        }
    }
    if (response?.url?.includes('.mp4')) {
        response.headers.set('content-type', 'video/mp4');
    }
    return response;
}
exports.image = image;


/***/ }),

/***/ "./src/handler.ts":
/*!************************!*\
  !*** ./src/handler.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleRequest = void 0;
const image_1 = __webpack_require__(/*! ./fetch/image */ "./src/fetch/image.ts");
const jsonError_1 = __webpack_require__(/*! ./jsonError */ "./src/jsonError.ts");
async function handleRequest(event) {
    const { request } = event;
    const uri = new URL(request.url);
    const path = uri.pathname.substring(1);
    try {
        if (!path)
            return (0, jsonError_1.jsonError)('No Filename', 406);
        return await (0, image_1.image)(uri, event);
    }
    catch (err) {
        return (0, jsonError_1.jsonError)(err.toString(), 500);
    }
}
exports.handleRequest = handleRequest;


/***/ }),

/***/ "./src/jsonError.ts":
/*!**************************!*\
  !*** ./src/jsonError.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jsonError = void 0;
function jsonError(error, status = 400) {
    return new Response(JSON.stringify({
        error,
        status,
        success: false,
    }), {
        status,
        headers: {
            'content-type': 'application/json',
        },
    });
}
exports.jsonError = jsonError;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const handler_1 = __webpack_require__(/*! ./handler */ "./src/handler.ts");
addEventListener('fetch', (event) => {
    event.respondWith((0, handler_1.handleRequest)(event));
});

})();

/******/ })()
;
//# sourceMappingURL=worker.js.map