/**
 * @desc andJS. A lightweight JavaScript helper library
 * @author Andrew Fisher
 * @copyright Copyright (c) 2015 Andrew Fisher (andfisher)
 * @version 0.0.1
 * @license The MIT License (MIT)
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

var andJS = (function() {
    
    'use strict';

    var undefined;

    function andJS() {

        var
        _stack = [],
        
        _typeOf = function(item, type) {
            if (typeof item === type) return true;
            if (type === 'array' && item.prototype && item.prototype.toString.call(this) === '[object Array]') return true;
            if (type === 'HTMLElement') {
                try {
                    return obj instanceof HTMLElement;
                } catch(e){
                    return /\HTML.+Element/.test(item.constructor.toString());
                }
            }
            return false;
        },
        _console = function(type, args) {
            if (console && console[type]) {
                console[type].apply(console, args);
            }
        },
        _log = function() {
            _console('log', arguments);
            return this;
        },
        _warn = function() {
            _console('warn', arguments);
            return this;
        },
        _debug = function() {
            _console('debug', arguments)
            return this;
        },
        _error = function() {
            _console('error', arguments)
            return this;
        },

        _add = function(_el) {
            _stack.push(_el);
        },
        _addFromList = function() {
            _add(arguments[1]);
        },
        _last = function() {
          return _stack.slice(-1).pop();  
        },
        _each = function(items, callback, context) {
            for (var n in items) {
                if (items.hasOwnProperty(n)) {
                    callback.call(context, n, items[n]);
                }
            }
            return this;
        },
        _prop = function(prop, value) {
            if (typeof prop === 'object') {
                _each(prop, _prop, this);
            } else {
                this[prop] = value;
            }
        },
        _attr = function(attr, value) {
            if (typeof attr === 'object') {
                _each(attr, _attr, this);
            } else {
                if (attr === 'text') {
                    this.appendChild(
                        document.createTextNode(value));
                } else {
                    this.setAttribute(attr, value);
                }
            }
        },
        _append = function(tag, attrs) {
            var _node = document.createElement(tag);
            _attr.call(_node, attrs);
            this.appendChild(_node);
        },

        fns = {
            go: function() {
                _each(arguments, function(i, _el) {
                    _add(_el);
                });
                return this;  
            },
            id: function(_id) {
                var _el = document.getElementById(_id);
                if (_el) _add(_el);
                return this;
            },
            tags: function(_tagname) {
                _add(document.getElementsByTagName(_tagname));
                return this;
            },
            query: function(_query) {
                if (document.querySelectorAll) {
                    _add(document.querySelectorAll(_query));
                }
                return this;
            },
            html: function() {
                var _el = _last();
                return _el ? _el.innerHTML : '';    
            },
            append: function(tag, attrs) {
                var last = _last();
                if (_typeOf(last, 'HTMLElement')) {
                    _append.call(last, tag, attrs);
                } else {
                    _each(last, function() {
                        _append.call(arguments[1], tag, attrs);
                    });
                }
                return this;
            },
            jsonp: function(url, fn) {
                fns.tags('head').append('script', {
                    src: url + (url.indexOf('?') < 0 ? '?' : '&') + 'jsonp=' + fn 
                });
                _stack.pop();
                return this;
            },
            attr: function(attr, value){
                var last = _last();
                if (_typeOf(last, 'HTMLElement')) {
                    _attr.call(last, attr, value);
                } else {
                    _each(last, function() {
                        _attr.call(arguments[1], attr, value);
                    });
                }
                return this;
            },
            prop: function(prop, value){
                var last = _last();
                if (_typeOf(last, 'HTMLElement')) {
                    _prop.call(last, prop, value);
                } else {
                    _each(last, function() {
                        _prop.call(arguments[1], prop, value);
                    });
                }
                return this;
            },
            up: function() {
                _stack.pop();
                return this;
            },
            each: _each,
            log: _log,
            warn: _warn,
            typeOf: _typeOf
        };
        
        return fns;
    }
    
    return new andJS();
    
})();