/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};

    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {

        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId])
        /******/            return installedModules[moduleId].exports;

        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            exports: {},
            /******/            id: moduleId,
            /******/            loaded: false
            /******/
        };

        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ 		// Flag the module as loaded
        /******/
        module.loaded = true;

        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(0);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports, __webpack_require__) {

        /**
         * Created by laiyq@txtws.com on 2016/11/3.
         */
        var UXCollector = __webpack_require__(1);
        window.UXCollector = UXCollector;
        module.exports = UXCollector;

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports, __webpack_require__) {

        /**
         * Created by laiyq@txtws.com on 2016/11/17.
         */
        var UXCollector = {};
        //所有收集器
        var _collectorsHub = {};
        //所有收集器名称
        var _collectorsAll = [];

        //服务地址
        var _server = null;
        //启用哪些收集器
        var _collectors = [];
        //发送前调用
        var _beforeSend = null;
        //数据的所属站点
        var _siteHome = null;

        /**
         * 工具集
         */
        UXCollector.utils = __webpack_require__(2);

        /**
         * 配置
         * @param config
         * @returns {UXCollector}
         */
        UXCollector.setConfig = function (config) {
            _server = config['server'];
            _collectors = config['collectors'] || [];
            _beforeSend = config['beforeSend'] || null;
            _siteHome = config['siteHome'] || null;
            return this;
        };

        /**
         * 收集器启动
         */
        UXCollector.start = function () {
            if (!_collectors.length) {
                _collectors = _collectorsAll;
            }
            //执行收集器
            for (var i = 0; i < _collectors.length; i++) {
                var collector = _collectors[i];
                (function (collector) {
                    if (_collectorsHub[collector] instanceof Function) {
                        _collectorsHub[collector](function (data) {
                            _send(collector, data);
                        })
                    }
                })(collector);
            }
        };

        /**
         * 收集器
         * @param name
         * @param collectorFn
         */
        UXCollector.addCollector = function (name, collectorFn) {
            if (!_collectorsHub[name]) {
                _collectorsAll.push(name);
            }
            _collectorsHub[name] = collectorFn;
        };

        /**
         * 发送器
         * @param collector
         * @param data
         * @private
         */
        function _send(collector, data) {
            //发送拦截
            if (_beforeSend instanceof Function) {
                if (_beforeSend(collector, data) === false) {
                    return;
                }
            }
            // 设置全局的站点所属
            if (_siteHome != null) {
                data['siteHome'] = _siteHome;
            }
            //发送 使用img的方式进行请求解决跨域的问题
            (new Image()).src = UXCollector.utils.getUrl(_server, data);
        }

        /*----- 注册收集器 ----*/
        //页面追踪
        __webpack_require__(5)(UXCollector);
        //页面错误
        __webpack_require__(6)(UXCollector);
        //设备信息
        __webpack_require__(7)(UXCollector);
        //点击事件
        __webpack_require__(8)(UXCollector);
        //所在地和ip信息
        __webpack_require__(9)(UXCollector);
        module.exports = UXCollector;


        /***/
    }),
    /* 2 */
    /***/ (function (module, exports, __webpack_require__) {

        /**
         * Created by laiyq@txtws.com on 2016/11/17.
         */

        module.exports = {
            //获取完整的url
            getUrl: function (url, data) {
                data = data || {};
                var p = '';
                for (var i in data) {
                    p += i + "=" + encodeURIComponent(data[i]) + "&";
                }
                if (p.length > 0) {
                    p = (url.indexOf('?') > 0 ? "&" : "?") + p.substr(0, p.length - 1);
                }
                return url + p;
            },
            //DOM树已经加载完毕
            documentReady: function (callback) {
                ///兼容FF,Google
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function () {
                        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                        callback();
                    }, false)
                }
                //兼容IE
                else if (document.attachEvent) {
                    document.attachEvent('onreadytstatechange', function () {
                        if (document.readyState == "complete") {
                            document.detachEvent("onreadystatechange", arguments.callee);
                            callback();
                        }
                    })
                }
                else if (document.lastChild == document.body) {
                    callback();
                }
            },
            getBrowserInfo: function () {
                var Sys = {};
                var ua = navigator.userAgent.toLowerCase();
                var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
                var m = ua.match(re);
                Sys.browser = m[1].replace(/version/, "safari");
                Sys.version = m[2];
                return Sys;
            },
            Cookies: __webpack_require__(3),
            referAnalysis: __webpack_require__(4),
            //动态插入script标签
            createScript: function (url, callback) {
                var oScript = document.createElement('script');
                oScript.type = 'text/javascript';
                //oScript.async = true;
                oScript.src = url;
                /*
                 ** script标签的onload和onreadystatechange事件
                 ** IE6/7/8支持onreadystatechange事件
                 ** IE9/10支持onreadystatechange和onload事件
                 ** Firefox/Chrome/Opera支持onload事件
                 */
                // 判断IE8及以下浏览器
                var isIE = !-[1,];
                if (isIE) {
                    oScript.onreadystatechange = function () {
                        if (this.readyState == 'loaded' || this.readyState == 'complete') {
                            callback();
                        }
                    }
                } else {
                    // IE9及以上浏览器，Firefox，Chrome，Opera
                    oScript.onload = function () {
                        callback();
                    }
                }
                document.body.appendChild(oScript);
            }
        };

        /***/
    }),
    /* 3 */
    /***/ (function (module, exports, __webpack_require__) {

        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
        /*!
             * JavaScript Cookie v2.2.0
             * https://github.com/js-cookie/js-cookie
             *
             * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
             * Released under the MIT license
             */
        ;(function (factory) {
            var registeredInModuleLoader = false;
            if (true) {
                !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                registeredInModuleLoader = true;
            }
            if (true) {
                module.exports = factory();
                registeredInModuleLoader = true;
            }
            if (!registeredInModuleLoader) {
                var OldCookies = window.Cookies;
                var api = window.Cookies = factory();
                api.noConflict = function () {
                    window.Cookies = OldCookies;
                    return api;
                };
            }
        }(function () {
            function extend() {
                var i = 0;
                var result = {};
                for (; i < arguments.length; i++) {
                    var attributes = arguments[i];
                    for (var key in attributes) {
                        result[key] = attributes[key];
                    }
                }
                return result;
            }

            function init(converter) {
                function api(key, value, attributes) {
                    var result;
                    if (typeof document === 'undefined') {
                        return;
                    }

                    // Write

                    if (arguments.length > 1) {
                        attributes = extend({
                            path: '/'
                        }, api.defaults, attributes);

                        if (typeof attributes.expires === 'number') {
                            var expires = new Date();
                            expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                            attributes.expires = expires;
                        }

                        // We're using "expires" because "max-age" is not supported by IE
                        attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                        try {
                            result = JSON.stringify(value);
                            if (/^[\{\[]/.test(result)) {
                                value = result;
                            }
                        } catch (e) {
                        }

                        if (!converter.write) {
                            value = encodeURIComponent(String(value))
                                .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                        } else {
                            value = converter.write(value, key);
                        }

                        key = encodeURIComponent(String(key));
                        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                        key = key.replace(/[\(\)]/g, escape);

                        var stringifiedAttributes = '';

                        for (var attributeName in attributes) {
                            if (!attributes[attributeName]) {
                                continue;
                            }
                            stringifiedAttributes += '; ' + attributeName;
                            if (attributes[attributeName] === true) {
                                continue;
                            }
                            stringifiedAttributes += '=' + attributes[attributeName];
                        }
                        return (document.cookie = key + '=' + value + stringifiedAttributes);
                    }

                    // Read

                    if (!key) {
                        result = {};
                    }

                    // To prevent the for loop in the first place assign an empty array
                    // in case there are no cookies at all. Also prevents odd result when
                    // calling "get()"
                    var cookies = document.cookie ? document.cookie.split('; ') : [];
                    var rdecode = /(%[0-9A-Z]{2})+/g;
                    var i = 0;

                    for (; i < cookies.length; i++) {
                        var parts = cookies[i].split('=');
                        var cookie = parts.slice(1).join('=');

                        if (!this.json && cookie.charAt(0) === '"') {
                            cookie = cookie.slice(1, -1);
                        }

                        try {
                            var name = parts[0].replace(rdecode, decodeURIComponent);
                            cookie = converter.read ?
                                converter.read(cookie, name) : converter(cookie, name) ||
                                cookie.replace(rdecode, decodeURIComponent);

                            if (this.json) {
                                try {
                                    cookie = JSON.parse(cookie);
                                } catch (e) {
                                }
                            }

                            if (key === name) {
                                result = cookie;
                                break;
                            }

                            if (!key) {
                                result[name] = cookie;
                            }
                        } catch (e) {
                        }
                    }

                    return result;
                }

                api.set = api;
                api.get = function (key) {
                    return api.call(api, key);
                };
                api.getJSON = function () {
                    return api.apply({
                        json: true
                    }, [].slice.call(arguments));
                };
                api.defaults = {};

                api.remove = function (key, attributes) {
                    api(key, '', extend(attributes, {
                        expires: -1
                    }));
                };

                api.withConverter = init;

                return api;
            }

            return init(function () {
            });
        }));


        /***/
    }),
    /* 4 */
    /***/ (function (module, exports) {

        //来源分析
        module.exports = {
            getRefferInfo: function () {
                refferPage = document.referrer;
                var fromWhere = "直接访问";
                var keyword = "";
                if (refferPage && refferPage != unll && refferPage != "") {
                    var sosuo = refferPage.split(".")[1];
                    switch (sosuo) {
                        case "baidu":
                            fromWhere = "百度搜索";
                            grep = /wd\=.*\&/i;
                            str = refer.match(grep);
                            keyword = str.toString().split("=")[1].split("&")[0];
                            break;
                        case "google":
                            fromWhere = "谷歌搜索";
                            grep = /&q\=.*\&/i;
                            str = refer.match(grep);
                            keyword = str.toString().split("&")[1].split("=")[1];
                            break;
                        case "sogou":
                            fromWhere = "搜狗搜索";
                            grep = /query\=.*\&/i;
                            str = refer.match(grep)
                            keyword = str.toString().split("&")[0].split("=")[1];
                            break;
                        default:
                            fromWhere = "直接访问";
                            keyword = "";
                    }
                }
                return {
                    "fromWhere": fromWhere,
                    "keyword": keyword
                };

            }
        };

        /***/
    }),
    /* 5 */
    /***/ (function (module, exports) {

        /**
         * 页面追踪收集器
         * Created by laiyq@txtws.com on 2016/11/17.
         */
        module.exports = function (UXCollector) {
            var collector = "pageTracing";
            UXCollector.addCollector(collector, function (send) {
                UXCollector.utils.documentReady(function () {
                    setTimeout(function () {
                        collect(send);
                    }, 300)
                })
            });

            function collect(send) {
                //页面加载时间
                var pageLoadTime = 0;
                if (performance && performance.timing) {
                    pageLoadTime = performance.timing.domLoading - performance.timing.domainLookupStart;
                }
                var refferInfo = UXCollector.utils.referAnalysis.getRefferInfo();
                var sysInfo = UXCollector.utils.getBrowserInfo();

                var data = {
                    //收集器名称
                    "collector": collector,
                    //当前页面地址：通过请求的referrer获取
                    "url": window.location.href,
                    //页面来源地址
                    "referrer": document.referrer,
                    //页面加载时间,单位毫秒
                    "pageLoadTime": pageLoadTime,
                    //用户标识，若需要请在beforeSend中添加，规范命名：userId
                    "pageTitle": document.title,
                    // 识别页面搜索来源
                    "formSearch": refferInfo.fromWhere,
                    //识别搜索使用关键字
                    "searchKeyword": refferInfo.keyword,
                    // 使用流量器信息
                    "browser": sysInfo.browser,
                    // 使用流量器版本
                    "browserVersion": sysInfo.version
                };
                send(data);
            };
        };

        /***/
    }),
    /* 6 */
    /***/ (function (module, exports) {

        /**
         * 页面错误收集器
         * Created by laiyq@txtws.com on 2016/11/17.
         */
        module.exports = function (UXCollector) {
            var collector = "pageError";
            UXCollector.addCollector(collector, function (send) {
                var oldErrorHandle = window.onerror;
                //全局异常捕获
                window.onerror = function () {
                    var data = {
                        //收集器名称
                        "collector": collector,
                        //错误信息
                        "message": arguments[0],
                        //错误文件
                        "errorUrl": arguments[1],
                        //错误行号
                        "errorLine": arguments[2],
                        //错误列号
                        "errorColumn": arguments[3] || 0
                    };

                    send(data);

                    if (oldErrorHandle instanceof Function) {
                        oldErrorHandle.apply(this, arguments);
                    }
                }
            });
        };


        /***/
    }),
    /* 7 */
    /***/ (function (module, exports) {

        /**
         * 设备信息收集器
         * Created by laiyq@txtws.com on 2016/11/17.
         */
        module.exports = function (UXCollector) {
            var collector = "deviceInfo";
            var cookieName = "uxcDeviceInfo";
            UXCollector.addCollector(collector, function (send) {
                UXCollector.utils.documentReady(function () {
                    //一台设备值收集一次
                    if (UXCollector.utils.Cookies.get(cookieName)) {
                        return;
                    }
                    setTimeout(function () {
                        collect(send);
                        UXCollector.utils.Cookies.set(cookieName, 1, {expires: 365});
                    }, 300);
                })
            });

            function collect(send) {
                var screen = window.screen;
                var data = {
                    //收集器名称
                    "collector": collector,
                    //浏览器版本：通过请求头的User-Agent获取
                    // "userAgent":""
                    //分辨率宽度
                    "width": screen.width,
                    //分辨率高度
                    "height": screen.height,
                    //可用宽度
                    "availWidth": screen.availWidth,
                    //可用高度
                    "availHeight": screen.availHeight
                };
                send(data);
            }
        };


        /***/
    }),
    /* 8 */
    /***/ (function (module, exports) {

        /**
         * Created by zhouzihao on 2018/8/6.
         */
        module.exports = function (UXCollector) {
            var collector = "pageClick";
            UXCollector.addCollector(collector, function (send) {
                UXCollector.utils.documentReady(function () {
                    //监听全局点击事件
                    document.body.addEventListener("click", function (event) {
                        collect(send, event)
                    })
                })
            });

            function collect(send, event) {
                var point = event;
                // 获取当前点击的dom信息
                var dom = event.target;
                var data = {
                    "dom": dom.outerHTML,
                    "pointX": point.x,
                    "pointY": point.y
                };
                send(data)
            }
        };

        /***/
    }),
    /* 9 */
    /***/ (function (module, exports) {

        /**
         * 获取页面所在地和IP地址
         * Created by zhouzihao on 2018/8/7.
         */
        module.exports = function (UXCollector) {
            var collector = "pageLocation";
            UXCollector.addCollector(collector, function (send) {
                UXCollector.utils.createScript('http://pv.sohu.com/cityjson?ie=utf-8', function () {
                    collect(send);
                })
            });

            function collect(send) {
                var data = {
                    'ip': returnCitySN['cip'],
                    'city': returnCitySN['cname']
                };
                send(data);
            }
        };


        /***/
    })
    /******/]);