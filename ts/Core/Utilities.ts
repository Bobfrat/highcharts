/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart/Chart';
import type CSSObject from './Renderer/CSSObject';
import type {
    DOMElementType,
    HTMLDOMElement
} from './Renderer/DOMElementType';
import type EventCallback from './EventCallback';
import type HTMLAttributes from './Renderer/HTML/HTMLAttributes';
import type SVGAttributes from './Renderer/SVG/SVGAttributes';
import type Time from './Time';

import H from './Globals.js';
const {
    charts,
    doc,
    win
} = H;

/* *
 *
 *  Declarations
 *
 * */

type NonArray<T> = T extends Array<unknown> ? never : T;
type NonFunction<T> = T extends Function ? never : T;
type NullType = (null|undefined);

/* *
 *
 *  Functions
 *
 * */

/**
 * Provide error messages for debugging, with links to online explanation. This
 * function can be overridden to provide custom error handling.
 *
 * @sample highcharts/chart/highcharts-error/
 *         Custom error handler
 *
 * @function Highcharts.error
 *
 * @param {number|string} code
 *        The error code. See
 *        [errors.xml](https://github.com/highcharts/highcharts/blob/master/errors/errors.xml)
 *        for available codes. If it is a string, the error message is printed
 *        directly in the console.
 *
 * @param {boolean} [stop=false]
 *        Whether to throw an error or just log a warning in the console.
 *
 * @param {Highcharts.Chart} [chart]
 *        Reference to the chart that causes the error. Used in 'debugger'
 *        module to display errors directly on the chart.
 *        Important note: This argument is undefined for errors that lack
 *        access to the Chart instance. In such case, the error will be
 *        displayed on the last created chart.
 *
 * @param {Highcharts.Dictionary<string>} [params]
 *        Additional parameters for the generated message.
 *
 * @return {void}
 */
function error(
    code: (number|string),
    stop?: boolean,
    chart?: Chart,
    params?: Record<string, string>
): void {
    const severity = stop ? 'Highcharts error' : 'Highcharts warning';
    if (code === 32) {
        code = `${severity}: Deprecated member`;
    }

    const isCode = isNumber(code);
    let message = isCode ?
        `${severity} #${code}: www.highcharts.com/errors/${code}/` :
        code.toString();
    const defaultHandler = function (): void {
        if (stop) {
            throw new Error(message);
        }
        // else ...
        if (
            win.console &&
            error.messages.indexOf(message) === -1 // prevent console flooting
        ) {
            console.warn(message); // eslint-disable-line no-console
        }
    };

    if (typeof params !== 'undefined') {
        let additionalMessages = '';
        if (isCode) {
            message += '?';
        }
        objectEach(params, function (value, key): void {
            additionalMessages += `\n - ${key}: ${value}`;
            if (isCode) {
                message += encodeURI(key) + '=' + encodeURI(value);
            }
        });
        message += additionalMessages;
    }

    fireEvent(
        H,
        'displayError',
        { chart, code, message, params },
        defaultHandler
    );

    error.messages.push(message);
}
namespace error {
    export const messages: Array<string> = [];
}

function merge<T = object>(
    extend: true,
    a?: T,
    ...n: Array<DeepPartial<T>|undefined>
): (T);
function merge<
    T1 extends object = object,
    T2 = unknown,
    T3 = unknown,
    T4 = unknown,
    T5 = unknown,
    T6 = unknown,
    T7 = unknown,
    T8 = unknown,
    T9 = unknown
>(
    a?: T1,
    b?: T2,
    c?: T3,
    d?: T4,
    e?: T5,
    f?: T6,
    g?: T7,
    h?: T8,
    i?: T9,
): (T1&T2&T3&T4&T5&T6&T7&T8&T9);

/* eslint-disable valid-jsdoc */
/**
 * Utility function to deep merge two or more objects and return a third object.
 * If the first argument is true, the contents of the second object is copied
 * into the first object. The merge function can also be used with a single
 * object argument to create a deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {boolean} extend
 *        Whether to extend the left-side object (a) or return a whole new
 *        object.
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 *//**
 * Utility function to deep merge two or more objects and return a third object.
 * The merge function can also be used with a single object argument to create a
 * deep copy of an object.
 *
 * @function Highcharts.merge<T>
 *
 * @param {T|undefined} a
 *        The first object to extend. When only this is given, the function
 *        returns a deep copy.
 *
 * @param {...Array<object|undefined>} [n]
 *        An object to merge into the previous one.
 *
 * @return {T}
 *         The merged object. If the first argument is true, the return is the
 *         same as the second argument.
 */
function merge<T>(): T {
    /* eslint-enable valid-jsdoc */
    let i,
        args = arguments,
        ret = {} as T;
    const doCopy = function (copy: any, original: any): any {
        // An object is replacing a primitive
        if (typeof copy !== 'object') {
            copy = {};
        }

        objectEach(original, function (value, key): void {

            // Prototype pollution (#14883)
            if (key === '__proto__' || key === 'constructor') {
                return;
            }

            // Copy the contents of objects, but not arrays or DOM nodes
            if (isObject(value, true) &&
                !isClass(value) &&
                !isDOMElement(value)
            ) {
                copy[key] = doCopy(copy[key] || {}, value);

            // Primitives and arrays are copied over directly
            } else {
                copy[key] = original[key];
            }
        });
        return copy;
    };

    // If first argument is true, copy into the existing object. Used in
    // setOptions.
    if (args[0] === true) {
        ret = args[1];
        args = Array.prototype.slice.call(args, 2) as any;
    }

    // For each argument, extend the return
    const len = args.length;
    for (i = 0; i < len; i++) {
        ret = doCopy(ret, args[i]);
    }

    return ret;
}

/**
 * Constrain a value to within a lower and upper threshold.
 *
 * @private
 * @param {number} value The initial value
 * @param {number} min The lower threshold
 * @param {number} max The upper threshold
 * @return {number} Returns a number value within min and max.
 */
function clamp(value: number, min: number, max: number): number {
    return value > min ? value < max ? value : max : min;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Remove settings that have not changed, to avoid unnecessary rendering or
 * computing (#9197).
 * @private
 */
function cleanRecursively<TNew extends AnyRecord, TOld extends AnyRecord>(
    newer: TNew,
    older: TOld
): TNew & TOld {
    const result: AnyRecord = {};

    objectEach(newer, function (_val: unknown, key: (number|string)): void {
        let ob;

        // Dive into objects (except DOM nodes)
        if (
            isObject(newer[key], true) &&
            !newer.nodeType && // #10044
            older[key]
        ) {
            ob = cleanRecursively(
                newer[key],
                older[key]
            );
            if (Object.keys(ob).length) {
                result[key] = ob;
            }

        // Arrays, primitives and DOM nodes are copied directly
        } else if (
            isObject(newer[key]) ||
            newer[key] !== older[key] ||
            // If the newer key is explicitly undefined, keep it (#10525)
            (key in newer && !(key in older))
        ) {
            result[key] = newer[key];
        }
    });

    return result;
}

/**
 * Shortcut for parseInt
 *
 * @private
 * @function Highcharts.pInt
 *
 * @param {*} s
 *        any
 *
 * @param {number} [mag]
 *        Magnitude
 *
 * @return {number}
 *         number
 */
function pInt(s: any, mag?: number): number {
    return parseInt(s, mag || 10);
}

/**
 * Utility function to check for string type.
 *
 * @function Highcharts.isString
 *
 * @param {*} s
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a string.
 */
function isString(s: unknown): s is string {
    return typeof s === 'string';
}

/**
 * Utility function to check if an item is an array.
 *
 * @function Highcharts.isArray
 *
 * @param {*} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is an array.
 */
function isArray(obj: unknown): obj is Array<unknown> {
    const str = Object.prototype.toString.call(obj);

    return str === '[object Array]' || str === '[object Array Iterator]';
}

function isObject<T>(obj: T, strict: true): obj is object & NonArray<NonFunction<NonNullable<T>>>;
function isObject<T>(obj: T, strict?: false): obj is object & NonFunction<NonNullable<T>>;
/**
 * Utility function to check if an item is of type object.
 *
 * @function Highcharts.isObject
 *
 * @param {*} obj
 *        The item to check.
 *
 * @param {boolean} [strict=false]
 *        Also checks that the object is not an array.
 *
 * @return {boolean}
 *         True if the argument is an object.
 */
function isObject<T>(
    obj: T,
    strict?: boolean
): obj is object & NonFunction<NonNullable<T>> {
    return (
        !!obj &&
        typeof obj === 'object' &&
        (!strict || !isArray(obj))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Utility function to check if an Object is a HTML Element.
 *
 * @function Highcharts.isDOMElement
 *
 * @param {*} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a HTML Element.
 */
function isDOMElement(obj: unknown): obj is HTMLDOMElement {
    return isObject(obj) && typeof (obj as any).nodeType === 'number';
}

/**
 * Utility function to check if an Object is a class.
 *
 * @function Highcharts.isClass
 *
 * @param {object|undefined} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a class.
 */
function isClass<T>(obj: (object|undefined)): obj is Class<T> {
    const c: (Function|undefined) = obj && obj.constructor;

    return !!(
        isObject(obj, true) &&
        !isDOMElement(obj) &&
        (c && (c as any).name && (c as any).name !== 'Object')
    );
}

/**
 * Utility function to check if an item is a number and it is finite (not NaN,
 * Infinity or -Infinity).
 *
 * @function Highcharts.isNumber
 *
 * @param {*} n
 *        The item to check.
 *
 * @return {boolean}
 *         True if the item is a finite number
 */
function isNumber(n: unknown): n is number {
    return typeof n === 'number' && !isNaN(n) && n < Infinity && n > -Infinity;
}

/**
 * Remove the last occurence of an item from an array.
 *
 * @function Highcharts.erase
 *
 * @param {Array<*>} arr
 *        The array.
 *
 * @param {*} item
 *        The item to remove.
 *
 * @return {void}
 */
function erase(arr: Array<unknown>, item: unknown): void {
    let i = arr.length;

    while (i--) {
        if (arr[i] === item) {
            arr.splice(i, 1);
            break;
        }
    }
}

/**
 * Check if an object is null or undefined.
 *
 * @function Highcharts.defined
 *
 * @param {*} obj
 *        The object to check.
 *
 * @return {boolean}
 *         False if the object is null or undefined, otherwise true.
 */
function defined<T>(obj: T): obj is NonNullable<T> {
    return typeof obj !== 'undefined' && obj !== null;
}

function attr(
    elem: DOMElementType,
    prop: (HTMLAttributes|SVGAttributes)
): undefined;
function attr(
    elem: DOMElementType,
    prop: string,
    value?: undefined
): (string|null);
function attr(
    elem: DOMElementType,
    prop: string,
    value: (number|string)
): undefined;
/**
 * Set or get an attribute or an object of attributes.
 *
 * To use as a setter, pass a key and a value, or let the second argument be a
 * collection of keys and values. When using a collection, passing a value of
 * `null` or `undefined` will remove the attribute.
 *
 * To use as a getter, pass only a string as the second argument.
 *
 * @function Highcharts.attr
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} elem
 *        The DOM element to receive the attribute(s).
 *
 * @param {string|Highcharts.HTMLAttributes|Highcharts.SVGAttributes} [keyOrAttribs]
 *        The property or an object of key-value pairs.
 *
 * @param {number|string} [value]
 *        The value if a single property is set.
 *
 * @return {string|null|undefined}
 *         When used as a getter, return the value.
 */
function attr(
    elem: DOMElementType,
    keyOrAttribs: (string|HTMLAttributes|SVGAttributes),
    value?: (number|string)
): (string|null|undefined) {

    const isGetter = isString(keyOrAttribs) && !defined(value);

    let ret: string|null|undefined;

    const attrSingle = (
        value: number|string|boolean|undefined,
        key: string
    ): void => {

        // Set the value
        if (defined(value)) {
            elem.setAttribute(key, value);

        // Get the value
        } else if (isGetter) {
            ret = elem.getAttribute(key);

            // IE7 and below cannot get class through getAttribute (#7850)
            if (!ret && key === 'class') {
                ret = elem.getAttribute(key + 'Name');
            }

        // Remove the value
        } else {
            elem.removeAttribute(key);
        }
    };

    // If keyOrAttribs is a string
    if (isString(keyOrAttribs)) {
        attrSingle(value, keyOrAttribs);

    // Else if keyOrAttribs is defined, it is a hash of key/value pairs
    } else {
        objectEach(keyOrAttribs, attrSingle);
    }
    return ret;
}

/**
 * Check if an element is an array, and if not, make it into an array.
 *
 * @function Highcharts.splat
 *
 * @param {*} obj
 *        The object to splat.
 *
 * @return {Array}
 *         The produced or original array.
 */
function splat(obj: any): Array<any> {
    return isArray(obj) ? obj : [obj];
}

/**
 * Set a timeout if the delay is given, otherwise perform the function
 * synchronously.
 *
 * @function Highcharts.syncTimeout
 *
 * @param {Function} fn
 *        The function callback.
 *
 * @param {number} delay
 *        Delay in milliseconds.
 *
 * @param {*} [context]
 *        An optional context to send to the function callback.
 *
 * @return {number}
 *         An identifier for the timeout that can later be cleared with
 *         Highcharts.clearTimeout. Returns -1 if there is no timeout.
 */
function syncTimeout(
    fn: Function,
    delay: number,
    context?: unknown
): number {
    if (delay > 0) {
        return setTimeout(fn, delay, context);
    }
    fn.call(0, context);
    return -1;
}

/**
 * Internal clear timeout. The function checks that the `id` was not removed
 * (e.g. by `chart.destroy()`). For the details see
 * [issue #7901](https://github.com/highcharts/highcharts/issues/7901).
 *
 * @function Highcharts.clearTimeout
 *
 * @param {number|undefined} id
 * Id of a timeout.
 */
function internalClearTimeout(id: (number|undefined)): void {
    if (defined(id)) {
        clearTimeout(id);
    }
}

/* eslint-disable valid-jsdoc */
/**
 * Utility function to extend an object with the members of another.
 *
 * @function Highcharts.extend<T>
 *
 * @param {T|undefined} a
 *        The object to be extended.
 *
 * @param {Partial<T>} b
 *        The object to add to the first one.
 *
 * @return {T}
 *         Object a, the original object.
 */
function extend<T extends object>(a: (T|undefined), b: Partial<T>): T {
    /* eslint-enable valid-jsdoc */
    let n;

    if (!a) {
        a = {} as T;
    }
    for (n in b) { // eslint-disable-line guard-for-in
        (a as any)[n] = (b as any)[n];
    }
    return a;
}

function pick<T1, T2, T3, T4, T5>(...args: [T1, T2, T3, T4, T5]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ?
            T4 extends NullType ?
                T5 extends NullType ? undefined : T5 : T4 : T3 : T2 : T1;
function pick<T1, T2, T3, T4>(...args: [T1, T2, T3, T4]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ?
            T4 extends NullType ? undefined : T4 : T3 : T2 : T1;
function pick<T1, T2, T3>(...args: [T1, T2, T3]):
T1 extends NullType ?
    T2 extends NullType ?
        T3 extends NullType ? undefined : T3 : T2 : T1;
function pick<T1, T2>(...args: [T1, T2]):
T1 extends NullType ?
    T2 extends NullType ? undefined : T2 : T1;
function pick<T1>(...args: [T1]):
T1 extends NullType ? undefined : T1;
function pick<T>(...args: Array<T|null|undefined>): T|undefined;
/* eslint-disable valid-jsdoc */
/**
 * Return the first value that is not null or undefined.
 *
 * @function Highcharts.pick<T>
 *
 * @param {...Array<T|null|undefined>} items
 *        Variable number of arguments to inspect.
 *
 * @return {T}
 *         The value of the first argument that is not null or undefined.
 */
function pick<T>(): T|undefined {
    const args = arguments;
    const length = args.length;
    for (let i = 0; i < length; i++) {
        const arg = args[i];
        if (typeof arg !== 'undefined' && arg !== null) {
            return arg;
        }
    }
}

/**
 * Set CSS on a given element.
 *
 * @function Highcharts.css
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} el
 *        An HTML DOM element.
 *
 * @param {Highcharts.CSSObject} styles
 *        Style object with camel case property names.
 *
 * @return {void}
 */
function css(
    el: DOMElementType,
    styles: CSSObject
): void {
    if (H.isMS && !H.svg) { // #2686
        if (styles && defined(styles.opacity)) {
            styles.filter = `alpha(opacity=${styles.opacity * 100})`;
        }
    }
    extend(el.style, styles as any);
}

/**
 * Utility function to create an HTML element with attributes and styles.
 *
 * @function Highcharts.createElement
 *
 * @param {string} tag
 *        The HTML tag.
 *
 * @param {Highcharts.HTMLAttributes} [attribs]
 *        Attributes as an object of key-value pairs.
 *
 * @param {Highcharts.CSSObject} [styles]
 *        Styles as an object of key-value pairs.
 *
 * @param {Highcharts.HTMLDOMElement} [parent]
 *        The parent HTML object.
 *
 * @param {boolean} [nopad=false]
 *        If true, remove all padding, border and margin.
 *
 * @return {Highcharts.HTMLDOMElement}
 *         The created DOM element.
 */
function createElement(
    tag: string,
    attribs?: HTMLAttributes,
    styles?: CSSObject,
    parent?: HTMLDOMElement,
    nopad?: boolean
): HTMLDOMElement {
    const el = doc.createElement(tag);

    if (attribs) {
        extend(el, attribs);
    }
    if (nopad) {
        css(el, { padding: '0', border: 'none', margin: '0' });
    }
    if (styles) {
        css(el, styles);
    }
    if (parent) {
        parent.appendChild(el);
    }
    return el;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Extend a prototyped class by new members.
 *
 * @function Highcharts.extendClass<T>
 *
 * @param {Highcharts.Class<T>} parent
 *        The parent prototype to inherit.
 *
 * @param {Highcharts.Dictionary<*>} members
 *        A collection of prototype members to add or override compared to the
 *        parent prototype.
 *
 * @return {Highcharts.Class<T>}
 *         A new prototype.
 */
function extendClass <T, TReturn = T>(
    parent: Class<T>,
    members: any
): Class<TReturn> {
    const obj: Class<TReturn> = (function (): void {}) as any;

    obj.prototype = new parent(); // eslint-disable-line new-cap
    extend(obj.prototype, members);
    return obj;
}

/**
 * Left-pad a string to a given length by adding a character repetitively.
 *
 * @function Highcharts.pad
 *
 * @param {number} number
 *        The input string or number.
 *
 * @param {number} [length]
 *        The desired string length.
 *
 * @param {string} [padder=0]
 *        The character to pad with.
 *
 * @return {string}
 *         The padded string.
 */
function pad(number: number, length?: number, padder?: string): string {
    return new Array(
        (length || 2) +
        1 -
        String(number)
            .replace('-', '')
            .length
    ).join(padder || '0') + number;
}

/**
 * Return a length based on either the integer value, or a percentage of a base.
 *
 * @function Highcharts.relativeLength
 *
 * @param {Highcharts.RelativeSize} value
 *        A percentage string or a number.
 *
 * @param {number} base
 *        The full length that represents 100%.
 *
 * @param {number} [offset=0]
 *        A pixel offset to apply for percentage values. Used internally in
 *        axis positioning.
 *
 * @return {number}
 *         The computed length.
 */
function relativeLength(
    value: Utilities.RelativeSize,
    base: number,
    offset?: number
): number {
    return (/%$/).test(value as any) ?
        (base * parseFloat(value as any) / 100) + (offset || 0) :
        parseFloat(value as any);
}

/**
 * Wrap a method with extended functionality, preserving the original function.
 *
 * @function Highcharts.wrap
 *
 * @param {*} obj
 *        The context object that the method belongs to. In real cases, this is
 *        often a prototype.
 *
 * @param {string} method
 *        The name of the method to extend.
 *
 * @param {Highcharts.WrapProceedFunction} func
 *        A wrapper function callback. This function is called with the same
 *        arguments as the original function, except that the original function
 *        is unshifted and passed as the first argument.
 */
function wrap<T, K extends FunctionNamesOf<T>>(
    obj: T,
    method: K,
    func: Utilities.WrapProceedFunction<T[K]&ArrowFunction>
): void {
    const proceed = obj[method] as T[K]&ArrowFunction;

    obj[method] = function (this: T): ReturnType<typeof func> {
        const outerArgs = arguments,
            scope = this;

        return func.apply(this, [
            function (): ReturnType<typeof proceed> {
                return proceed.apply(
                    scope,
                    arguments.length ? arguments : outerArgs
                );
            }
        ].concat(
            [].slice.call(arguments)
        ) as Parameters<typeof func>);
    } as T[K];
}

/**
 * Get the magnitude of a number.
 *
 * @function Highcharts.getMagnitude
 *
 * @param {number} num
 *        The number.
 *
 * @return {number}
 *         The magnitude, where 1-9 are magnitude 1, 10-99 magnitude 2 etc.
 */
function getMagnitude(num: number): number {
    return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
}

/**
 * Take an interval and normalize it to multiples of round numbers.
 *
 * @deprecated
 * @function Highcharts.normalizeTickInterval
 *
 * @param {number} interval
 *        The raw, un-rounded interval.
 *
 * @param {Array<*>} [multiples]
 *        Allowed multiples.
 *
 * @param {number} [magnitude]
 *        The magnitude of the number.
 *
 * @param {boolean} [allowDecimals]
 *        Whether to allow decimals.
 *
 * @param {boolean} [hasTickAmount]
 *        If it has tickAmount, avoid landing on tick intervals lower than
 *        original.
 *
 * @return {number}
 *         The normalized interval.
 *
 * @todo
 * Move this function to the Axis prototype. It is here only for historical
 * reasons.
 */
function normalizeTickInterval(
    interval: number,
    multiples?: Array<number>,
    magnitude?: number,
    allowDecimals?: boolean,
    hasTickAmount?: boolean
): number {
    let i,
        retInterval = interval;

    // round to a tenfold of 1, 2, 2.5 or 5
    magnitude = pick(magnitude, getMagnitude(interval));
    const normalized = interval / magnitude;

    // multiples for a linear scale
    if (!multiples) {
        multiples = hasTickAmount ?
            // Finer grained ticks when the tick amount is hard set, including
            // when alignTicks is true on multiple axes (#4580).
            [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] :

            // Else, let ticks fall on rounder numbers
            [1, 2, 2.5, 5, 10];


        // the allowDecimals option
        if (allowDecimals === false) {
            if (magnitude === 1) {
                multiples = multiples.filter(function (num: number): boolean {
                    return num % 1 === 0;
                });
            } else if (magnitude <= 0.1) {
                multiples = [1 / magnitude];
            }
        }
    }

    // normalize the interval to the nearest multiple
    for (i = 0; i < multiples.length; i++) {
        retInterval = multiples[i];
        // only allow tick amounts smaller than natural
        if (
            (
                hasTickAmount &&
                retInterval * magnitude >= interval
            ) ||
            (
                !hasTickAmount &&
                (
                    normalized <=
                    (
                        multiples[i] +
                        (multiples[i + 1] || multiples[i])
                    ) / 2
                )
            )
        ) {
            break;
        }
    }

    // Multiply back to the correct magnitude. Correct floats to appropriate
    // precision (#6085).
    retInterval = correctFloat(
        retInterval * (magnitude as any),
        -Math.round(Math.log(0.001) / Math.LN10)
    );

    return retInterval;
}


/**
 * Sort an object array and keep the order of equal items. The ECMAScript
 * standard does not specify the behaviour when items are equal.
 *
 * @function Highcharts.stableSort
 *
 * @param {Array<*>} arr
 *        The array to sort.
 *
 * @param {Function} sortFunction
 *        The function to sort it with, like with regular Array.prototype.sort.
 */
function stableSort<T>(
    arr: Array<T>,
    sortFunction: (a: T, b: T) => number
): void {

    // @todo It seems like Chrome since v70 sorts in a stable way internally,
    // plus all other browsers do it, so over time we may be able to remove this
    // function
    const length = arr.length;
    let sortValue,
        i;

    // Add index to each item
    for (i = 0; i < length; i++) {
        (arr[i] as any).safeI = i; // stable sort index
    }

    arr.sort(function (a: any, b: any): number {
        sortValue = sortFunction(a, b);
        return sortValue === 0 ? a.safeI - b.safeI : sortValue;
    });

    // Remove index from items
    for (i = 0; i < length; i++) {
        delete (arr[i] as any).safeI; // stable sort index
    }
}

/**
 * Non-recursive method to find the lowest member of an array. `Math.min` raises
 * a maximum call stack size exceeded error in Chrome when trying to apply more
 * than 150.000 points. This method is slightly slower, but safe.
 *
 * @function Highcharts.arrayMin
 *
 * @param {Array<*>} data
 *        An array of numbers.
 *
 * @return {number}
 *         The lowest number.
 */
function arrayMin(data: Array<any>): number {
    let i = data.length,
        min = data[0];

    while (i--) {
        if (data[i] < min) {
            min = data[i];
        }
    }
    return min;
}

/**
 * Non-recursive method to find the lowest member of an array. `Math.max` raises
 * a maximum call stack size exceeded error in Chrome when trying to apply more
 * than 150.000 points. This method is slightly slower, but safe.
 *
 * @function Highcharts.arrayMax
 *
 * @param {Array<*>} data
 *        An array of numbers.
 *
 * @return {number}
 *         The highest number.
 */
function arrayMax(data: Array<any>): number {
    let i = data.length,
        max = data[0];

    while (i--) {
        if (data[i] > max) {
            max = data[i];
        }
    }
    return max;
}

/**
 * Utility method that destroys any SVGElement instances that are properties on
 * the given object. It loops all properties and invokes destroy if there is a
 * destroy method. The property is then delete.
 *
 * @function Highcharts.destroyObjectProperties
 *
 * @param {*} obj
 *        The object to destroy properties on.
 *
 * @param {*} [except]
 *        Exception, do not destroy this property, only delete it.
 */
function destroyObjectProperties(obj: any, except?: any): void {
    objectEach(obj, function (val, n): void {
        // If the object is non-null and destroy is defined
        if (val && val !== except && val.destroy) {
            // Invoke the destroy
            val.destroy();
        }

        // Delete the property from the object.
        delete obj[n];
    });
}


/**
 * Discard a HTML element
 *
 * @function Highcharts.discardElement
 *
 * @param {Highcharts.HTMLDOMElement} element
 *        The HTML node to discard.
 */
function discardElement(element?: HTMLDOMElement): void {
    if (element && element.parentElement) {
        element.parentElement.removeChild(element);
    }
}


/**
 * Fix JS round off float errors.
 *
 * @function Highcharts.correctFloat
 *
 * @param {number} num
 *        A float number to fix.
 *
 * @param {number} [prec=14]
 *        The precision.
 *
 * @return {number}
 *         The corrected float number.
 */
function correctFloat(num: number, prec?: number): number {

    // When the number is higher than 1e14 use the number (#16275)
    return num > 1e14 ? num : parseFloat(
        num.toPrecision(prec || 14)
    );
}

/**
 * The time unit lookup
 *
 * @ignore
 */

const timeUnits: Record<Time.TimeUnit, number> = {
    millisecond: 1,
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 24 * 3600000,
    week: 7 * 24 * 3600000,
    month: 28 * 24 * 3600000,
    year: 364 * 24 * 3600000
};

/**
 * Easing definition
 *
 * @private
 * @function Math.easeInOutSine
 *
 * @param {number} pos
 *        Current position, ranging from 0 to 1.
 *
 * @return {number}
 *         Ease result
 */
Math.easeInOutSine = function (pos: number): number {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
};

/**
 * Returns the value of a property path on a given object.
 *
 * @private
 * @function getNestedProperty
 *
 * @param {string} path
 * Path to the property, for example `custom.myValue`.
 *
 * @param {unknown} obj
 * Instance containing the property on the specific path.
 *
 * @return {unknown}
 * The unknown property value.
 */
function getNestedProperty(path: string, parent: unknown): unknown {

    const pathElements = path.split('.');

    while (pathElements.length && defined(parent)) {
        const pathElement = pathElements.shift();

        // Filter on the key
        if (
            typeof pathElement === 'undefined' ||
            pathElement === '__proto__'
        ) {
            return; // undefined
        }

        const child = (parent as Record<string, unknown>)[
            pathElement
        ] as Record<string, unknown>;

        // Filter on the child
        if (
            !defined(child) ||
            typeof child === 'function' ||
            typeof child.nodeType === 'number' ||
            child as unknown === win
        ) {
            return; // undefined
        }

        // Else, proceed
        parent = child;
    }
    return parent;
}

function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt: true
): (number|undefined);
function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt?: false
): (number|string|undefined);
/**
 * Get the computed CSS value for given element and property, only for numerical
 * properties. For width and height, the dimension of the inner box (excluding
 * padding) is returned. Used for fitting the chart within the container.
 *
 * @function Highcharts.getStyle
 *
 * @param {Highcharts.HTMLDOMElement} el
 * An HTML element.
 *
 * @param {string} prop
 * The property name.
 *
 * @param {boolean} [toInt=true]
 * Parse to integer.
 *
 * @return {number|string|undefined}
 * The style value.
 */
function getStyle(
    el: HTMLDOMElement,
    prop: string,
    toInt?: boolean
): (number|string|undefined) {
    const customGetStyle: typeof getStyle = (
        (H as any).getStyle || // oldie getStyle
        getStyle
    );

    let style: (number|string|undefined);

    // For width and height, return the actual inner pixel size (#4913)
    if (prop === 'width') {

        let offsetWidth = Math.min(el.offsetWidth, el.scrollWidth);

        // In flex boxes, we need to use getBoundingClientRect and floor it,
        // because scrollWidth doesn't support subpixel precision (#6427) ...
        const boundingClientRectWidth = el.getBoundingClientRect &&
            el.getBoundingClientRect().width;
        // ...unless if the containing div or its parents are transform-scaled
        // down, in which case the boundingClientRect can't be used as it is
        // also scaled down (#9871, #10498).
        if (
            boundingClientRectWidth < offsetWidth &&
            boundingClientRectWidth >= offsetWidth - 1
        ) {
            offsetWidth = Math.floor(boundingClientRectWidth);
        }

        return Math.max(
            0, // #8377
            (
                offsetWidth -
                (customGetStyle(el, 'padding-left', true) || 0) -
                (customGetStyle(el, 'padding-right', true) || 0)
            )
        );
    }

    if (prop === 'height') {
        return Math.max(
            0, // #8377
            (
                Math.min(el.offsetHeight, el.scrollHeight) -
                (customGetStyle(el, 'padding-top', true) || 0) -
                (customGetStyle(el, 'padding-bottom', true) || 0)
            )
        );
    }

    if (!win.getComputedStyle) {
        // SVG not supported, forgot to load oldie.js?
        error(27, true);
    }

    // Otherwise, get the computed style
    const css = win.getComputedStyle(el, void 0); // eslint-disable-line no-undefined
    if (css) {
        style = css.getPropertyValue(prop);
        if (pick(toInt, prop !== 'opacity')) {
            style = pInt(style);
        }
    }

    return style;
}

/**
 * Search for an item in an array.
 *
 * @function Highcharts.inArray
 *
 * @deprecated
 *
 * @param {*} item
 *        The item to search for.
 *
 * @param {Array<*>} arr
 *        The array or node collection to search in.
 *
 * @param {number} [fromIndex=0]
 *        The index to start searching from.
 *
 * @return {number}
 *         The index within the array, or -1 if not found.
 */
function inArray(item: any, arr: Array<any>, fromIndex?: number): number {
    error(32, false, void 0, { 'Highcharts.inArray': 'use Array.indexOf' });
    return arr.indexOf(item, fromIndex);
}

/**
 * Return the value of the first element in the array that satisfies the
 * provided testing function.
 *
 * @function Highcharts.find<T>
 *
 * @param {Array<T>} arr
 *        The array to test.
 *
 * @param {Function} callback
 *        The callback function. The function receives the item as the first
 *        argument. Return `true` if this item satisfies the condition.
 *
 * @return {T|undefined}
 *         The value of the element.
 */
const find = (Array.prototype as any).find ?
    function<T> (
        arr: Array<T>,
        callback: Utilities.FindCallback<T>
    ): (T|undefined) {
        return (arr as any).find(callback as any);
    } :
    // Legacy implementation. PhantomJS, IE <= 11 etc. #7223.
    function<T> (
        arr: Array<T>,
        callback: Utilities.FindCallback<T>
    ): (T|undefined) {
        let i;
        const length = arr.length;

        for (i = 0; i < length; i++) {
            if (callback(arr[i], i)) { // eslint-disable-line node/callback-return
                return arr[i];
            }
        }
    };

/**
 * Returns an array of a given object's own properties.
 *
 * @function Highcharts.keys
 * @deprecated
 *
 * @param {*} obj
 *        The object of which the properties are to be returned.
 *
 * @return {Array<string>}
 *         An array of strings that represents all the properties.
 */
function keys(obj: any): Array<string> {
    error(32, false, void 0, { 'Highcharts.keys': 'use Object.keys' });
    return Object.keys(obj);
}

/**
 * Get the element's offset position, corrected for `overflow: auto`.
 *
 * @function Highcharts.offset
 *
 * @param {global.Element} el
 *        The DOM element.
 *
 * @return {Highcharts.OffsetObject}
 *         An object containing `left` and `top` properties for the position in
 *         the page.
 */
function offset(el: Element): Utilities.OffsetObject {
    const docElem = doc.documentElement,
        box = (el.parentElement || el.parentNode) ?
            el.getBoundingClientRect() :
            { top: 0, left: 0, width: 0, height: 0 };

    return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) -
            (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) -
            (docElem.clientLeft || 0),
        width: box.width,
        height: box.height
    };
}

/* eslint-disable valid-jsdoc */
/**
 * Iterate over object key pairs in an object.
 *
 * @function Highcharts.objectEach<T>
 *
 * @param {*} obj
 *        The object to iterate over.
 *
 * @param {Highcharts.ObjectEachCallbackFunction<T>} fn
 *        The iterator callback. It passes three arguments:
 *        * value - The property value.
 *        * key - The property key.
 *        * obj - The object that objectEach is being applied to.
 *
 * @param {T} [ctx]
 *        The context.
 */
function objectEach<TObject, TContext>(
    obj: TObject,
    fn: Utilities.ObjectEachCallback<TObject, TContext>,
    ctx?: TContext
): void {
    /* eslint-enable valid-jsdoc */
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            fn.call(ctx || obj[key] as unknown as TContext, obj[key], key, obj);
        }
    }
}

/**
 * Iterate over an array.
 *
 * @deprecated
 * @function Highcharts.each
 *
 * @param {Array<*>} arr
 *        The array to iterate over.
 *
 * @param {Function} fn
 *        The iterator callback. It passes three arguments:
 *        - `item`: The array item.
 *        - `index`: The item's index in the array.
 *        - `arr`: The array that each is being applied to.
 *
 * @param {*} [ctx]
 *        The context.
 *
 * @return {void}
 */

/**
 * Filter an array by a callback.
 *
 * @deprecated
 * @function Highcharts.grep
 *
 * @param {Array<*>} arr
 *        The array to filter.
 *
 * @param {Function} callback
 *        The callback function. The function receives the item as the first
 *        argument. Return `true` if the item is to be preserved.
 *
 * @return {Array<*>}
 *         A new, filtered array.
 */

/**
 * Map an array by a callback.
 *
 * @deprecated
 * @function Highcharts.map
 *
 * @param {Array<*>} arr
 *        The array to map.
 *
 * @param {Function} fn
 *        The callback function. Return the new value for the new array.
 *
 * @return {Array<*>}
 *         A new array item with modified items.
 */

/**
 * Reduce an array to a single value.
 *
 * @deprecated
 * @function Highcharts.reduce
 *
 * @param {Array<*>} arr
 *        The array to reduce.
 *
 * @param {Function} fn
 *        The callback function. Return the reduced value. Receives 4
 *        arguments: Accumulated/reduced value, current value, current array
 *        index, and the array.
 *
 * @param {*} initialValue
 *        The initial value of the accumulator.
 *
 * @return {*}
 *         The reduced value.
 */

/**
 * Test whether at least one element in the array passes the test implemented by
 * the provided function.
 *
 * @deprecated
 * @function Highcharts.some
 *
 * @param {Array<*>} arr
 *        The array to test
 *
 * @param {Function} fn
 *        The function to run on each item. Return truty to pass the test.
 *        Receives arguments `currentValue`, `index` and `array`.
 *
 * @param {*} ctx
 *        The context.
 *
 * @return {boolean}
 */
objectEach({
    map: 'map',
    each: 'forEach',
    grep: 'filter',
    reduce: 'reduce',
    some: 'some'
} as Record<string, ('map'|'forEach'|'filter'|'reduce'|'some')>, function (val, key): void {
    (H as any)[key] = function (arr: Array<unknown>): any {
        error(32, false, void 0, { [`Highcharts.${key}`]: `use Array.${val}` });
        return (Array.prototype[val] as any).apply(
            arr,
            [].slice.call(arguments, 1)
        );
    };
});

/* eslint-disable valid-jsdoc */
/**
 * Add an event listener.
 *
 * @function Highcharts.addEvent<T>
 *
 * @param {Highcharts.Class<T>|T} el
 *        The element or object to add a listener to. It can be a
 *        {@link HTMLDOMElement}, an {@link SVGElement} or any other object.
 *
 * @param {string} type
 *        The event type.
 *
 * @param {Highcharts.EventCallbackFunction<T>|Function} fn
 *        The function callback to execute when the event is fired.
 *
 * @param {Highcharts.EventOptionsObject} [options]
 *        Options for adding the event.
 *
 * @return {Function}
 *         A callback function to remove the added event.
 */
function addEvent<T>(
    el: (Class<T>|T),
    type: string,
    fn: (EventCallback<T>|Function),
    options: Utilities.EventOptions = {}
): Function {
    /* eslint-enable valid-jsdoc */

    // Add hcEvents to either the prototype (in case we're running addEvent on a
    // class) or the instance. If hasOwnProperty('hcEvents') is false, it is
    // inherited down the prototype chain, in which case we need to set the
    // property on this instance (which may itself be a prototype).
    const owner = typeof el === 'function' && el.prototype || el;
    if (!Object.hasOwnProperty.call(owner, 'hcEvents')) {
        owner.hcEvents = {};
    }
    const events: Record<string, Array<any>> = owner.hcEvents;


    // Allow click events added to points, otherwise they will be prevented by
    // the TouchPointer.pinch function after a pinch zoom operation (#7091).
    if ((H as any).Point && // without H a dependency loop occurs
        el instanceof (H as any).Point &&
        (el as any).series &&
        (el as any).series.chart
    ) {
        (el as any).series.chart.runTrackerClick = true;
    }

    // Handle DOM events
    // If the browser supports passive events, add it to improve performance
    // on touch events (#11353).
    const addEventListener = (
        (el as any).addEventListener || H.addEventListenerPolyfill
    );
    if (addEventListener) {
        addEventListener.call(
            el,
            type,
            fn,
            H.supportsPassiveEvents ? {
                passive: options.passive === void 0 ?
                    type.indexOf('touch') !== -1 : options.passive,
                capture: false
            } : false
        );
    }

    if (!events[type]) {
        events[type] = [];
    }

    const eventObject = {
        fn,
        order: typeof options.order === 'number' ? options.order : Infinity
    };
    events[type].push(eventObject);

    // Order the calls
    events[type].sort((
        a: Utilities.EventWrapperObject<T>,
        b: Utilities.EventWrapperObject<T>
    ): number => a.order - b.order);

    // Return a function that can be called to remove this event.
    return function (): void {
        removeEvent(el, type, fn);
    };
}

/* eslint-disable valid-jsdoc */
/**
 * Remove an event that was added with {@link Highcharts#addEvent}.
 *
 * @function Highcharts.removeEvent<T>
 *
 * @param {Highcharts.Class<T>|T} el
 *        The element to remove events on.
 *
 * @param {string} [type]
 *        The type of events to remove. If undefined, all events are removed
 *        from the element.
 *
 * @param {Highcharts.EventCallbackFunction<T>} [fn]
 *        The specific callback to remove. If undefined, all events that match
 *        the element and optionally the type are removed.
 *
 * @return {void}
 */
function removeEvent<T>(
    el: (Class<T>|T),
    type?: string,
    fn?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */

    /**
     * @private
     */
    function removeOneEvent(
        type: string,
        fn: (EventCallback<T>|Function)
    ): void {
        const removeEventListener = (
            (el as any).removeEventListener || H.removeEventListenerPolyfill
        );

        if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
        }
    }

    /**
     * @private
     */
    function removeAllEvents(eventCollection: any): void {
        let types: Record<string, boolean>,
            len;

        if (!(el as any).nodeName) {
            return; // break on non-DOM events
        }

        if (type) {
            types = {};
            types[type] = true;
        } else {
            types = eventCollection;
        }

        objectEach(types, function (_val, n): void {
            if (eventCollection[n]) {
                len = eventCollection[n].length;
                while (len--) {
                    removeOneEvent(n as any, eventCollection[n][len].fn);
                }
            }
        });
    }

    const owner = typeof el === 'function' && el.prototype || el;
    if (Object.hasOwnProperty.call(owner, 'hcEvents')) {
        const events = owner.hcEvents;
        if (type) {
            const typeEvents = (
                events[type] || []
            ) as Utilities.EventWrapperObject<T>[];

            if (fn) {
                events[type] = typeEvents.filter(
                    function (obj): boolean {
                        return fn !== obj.fn;
                    }
                );
                removeOneEvent(type, fn);

            } else {
                removeAllEvents(events);
                events[type] = [];
            }
        } else {
            removeAllEvents(events);
            delete owner.hcEvents;
        }
    }
}

/* eslint-disable valid-jsdoc */
/**
 * Fire an event that was registered with {@link Highcharts#addEvent}.
 *
 * @function Highcharts.fireEvent<T>
 *
 * @param {T} el
 *        The object to fire the event on. It can be a {@link HTMLDOMElement},
 *        an {@link SVGElement} or any other object.
 *
 * @param {string} type
 *        The type of event.
 *
 * @param {Highcharts.Dictionary<*>|Event} [eventArguments]
 *        Custom event arguments that are passed on as an argument to the event
 *        handler.
 *
 * @param {Highcharts.EventCallbackFunction<T>|Function} [defaultFunction]
 *        The default function to execute if the other listeners haven't
 *        returned false.
 *
 * @return {void}
 */
function fireEvent<T>(
    el: T,
    type: string,
    eventArguments?: (AnyRecord|Event),
    defaultFunction?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */
    let e,
        i;

    eventArguments = eventArguments || {};

    if (doc.createEvent &&
        (
            (el as any).dispatchEvent ||
            (
                (el as any).fireEvent &&
                // Enable firing events on Highcharts instance.
                (el as any) !== H
            )
        )
    ) {
        e = doc.createEvent('Events');
        e.initEvent(type, true, true);

        eventArguments = extend(e, eventArguments);

        if ((el as any).dispatchEvent) {
            (el as any).dispatchEvent(eventArguments);
        } else {
            (el as any).fireEvent(type, eventArguments);
        }

    } else if ((el as any).hcEvents) {

        if (!(eventArguments as any).target) {
            // We're running a custom event

            extend(eventArguments as any, {
                // Attach a simple preventDefault function to skip
                // default handler if called. The built-in
                // defaultPrevented property is not overwritable (#5112)
                preventDefault: function (): void {
                    (eventArguments as any).defaultPrevented = true;
                },
                // Setting target to native events fails with clicking
                // the zoom-out button in Chrome.
                target: el,
                // If the type is not set, we're running a custom event
                // (#2297). If it is set, we're running a browser event,
                // and setting it will cause en error in IE8 (#2465).
                type: type
            });
        }

        const events: Array<Utilities.EventWrapperObject<any>> = [];
        let object: any = el;
        let multilevel = false;

        // Recurse up the inheritance chain and collect hcEvents set as own
        // objects on the prototypes.
        while (object.hcEvents) {
            if (
                Object.hasOwnProperty.call(object, 'hcEvents') &&
                object.hcEvents[type]
            ) {
                if (events.length) {
                    multilevel = true;
                }
                events.unshift.apply(events, object.hcEvents[type]);
            }
            object = Object.getPrototypeOf(object);
        }

        // For performance reasons, only sort the event handlers in case we are
        // dealing with multiple levels in the prototype chain. Otherwise, the
        // events are already sorted in the addEvent function.
        if (multilevel) {
            // Order the calls
            events.sort((
                a: Utilities.EventWrapperObject<T>,
                b: Utilities.EventWrapperObject<T>
            ): number => a.order - b.order);
        }

        // Call the collected event handlers
        events.forEach((obj): void => {
            // If the event handler returns false, prevent the default handler
            // from executing
            if (obj.fn.call(el, eventArguments as any) === false) {
                (eventArguments as any).preventDefault();
            }
        });

    }

    // Run the default if not prevented
    if (defaultFunction && !eventArguments.defaultPrevented) {
        (defaultFunction as Function).call(el, eventArguments);
    }
}

let serialMode: (boolean|undefined);
/**
 * Get a unique key for using in internal element id's and pointers. The key is
 * composed of a random hash specific to this Highcharts instance, and a
 * counter.
 *
 * @example
 * let id = uniqueKey(); // => 'highcharts-x45f6hp-0'
 *
 * @function Highcharts.uniqueKey
 *
 * @return {string}
 * A unique key.
 */
const uniqueKey = (function (): () => string {

    const hash = Math.random().toString(36).substring(2, 9) + '-';

    let id = 0;

    return function (): string {
        return 'highcharts-' + (serialMode ? '' : hash) + id++;
    };

}());
/**
 * Activates a serial mode for element IDs provided by
 * {@link Highcharts.uniqueKey}. This mode can be used in automated tests, where
 * a simple comparison of two rendered SVG graphics is needed.
 *
 * **Note:** This is only for testing purposes and will break functionality in
 * webpages with multiple charts.
 *
 * @example
 * if (
 *   process &&
 *   process.env.NODE_ENV === 'development'
 * ) {
 *   Highcharts.useSerialIds(true);
 * }
 *
 * @function Highcharts.useSerialIds
 *
 * @param {boolean} [mode]
 * Changes the state of serial mode.
 *
 * @return {boolean|undefined}
 * State of the serial mode.
 */
function useSerialIds(mode?: boolean): (boolean|undefined) {
    return (serialMode = pick(mode, serialMode));
}

function isFunction(obj: unknown): obj is Function { // eslint-disable-line
    return typeof obj === 'function';
}

// Register Highcharts as a plugin in jQuery
if ((win as any).jQuery) {

    /**
     * Highcharts-extended JQuery.
     *
     * @external JQuery
     */

    /**
     * Helper function to return the chart of the current JQuery selector
     * element.
     *
     * @function external:JQuery#highcharts
     *
     * @return {Highcharts.Chart}
     *         The chart that is linked to the JQuery selector element.
     *//**
     * Factory function to create a chart in the current JQuery selector
     * element.
     *
     * @function external:JQuery#highcharts
     *
     * @param {'Chart'|'Map'|'StockChart'|string} [className]
     *        Name of the factory class in the Highcharts namespace.
     *
     * @param {Highcharts.Options} [options]
     *        The chart options structure.
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     *        Function to run when the chart has loaded and and all external
     *        images are loaded. Defining a
     *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     *        handler is equivalent.
     *
     * @return {JQuery}
     *         The current JQuery selector.
     */
    (win as any).jQuery.fn.highcharts = function (): any {
        const args = [].slice.call(arguments) as any;

        if (this[0]) { // this[0] is the renderTo div

            // Create the chart
            if (args[0]) {
                new (H as any)[ // eslint-disable-line computed-property-spacing, no-new
                    // Constructor defaults to Chart
                    isString(args[0]) ? args.shift() : 'Chart'
                ](this[0], args[0], args[1]);
                return this;
            }

            // When called without parameters or with the return argument,
            // return an existing chart
            return charts[(attr(this[0], 'data-highcharts-chart') as any)];
        }
    };
}

/* *
 *
 *  Namespace
 *
 * */

namespace Utilities {
    export type RelativeSize = (number|string);
    export interface ErrorMessageEventObject {
        chart?: Chart;
        code: number;
        message?: string;
        params?: Record<string, string>;
    }
    export interface EventOptions {
        order?: number;
        passive?: boolean;
    }
    export interface EventWrapperObject<T> {
        fn: EventCallback<T>;
        order: number;
    }
    export interface FindCallback<T> {
        (
            value: T,
            index: number
        ): unknown;
    }
    export interface ObjectEachCallback<TObject, TContext> {
        (
            this: TContext,
            value: TObject[keyof TObject],
            key: keyof TObject,
            obj: TObject
        ): void;
    }
    export interface OffsetObject {
        height: number;
        left: number;
        top: number;
        width: number;
    }
    export interface WrapProceedFunction<T extends ArrowFunction> {
        (proceed: (T&ArrowFunction), ...args: Array<any>): ReturnType<T>;
    }
}

/* *
 *
 *  Default Export
 *
 * */

// TODO use named exports when supported.
const Utilities = {
    addEvent,
    arrayMax,
    arrayMin,
    attr,
    clamp,
    cleanRecursively,
    clearTimeout: internalClearTimeout,
    correctFloat,
    createElement,
    css,
    defined,
    destroyObjectProperties,
    discardElement,
    erase,
    error,
    extend,
    extendClass,
    find,
    fireEvent,
    getMagnitude,
    getNestedProperty,
    getStyle,
    inArray,
    isArray,
    isClass,
    isDOMElement,
    isFunction,
    isNumber,
    isObject,
    isString,
    keys,
    merge,
    normalizeTickInterval,
    objectEach,
    offset,
    pad,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    splat,
    stableSort,
    syncTimeout,
    timeUnits,
    uniqueKey,
    useSerialIds,
    wrap
};

export default Utilities;


/* *
 *
 *  API Declarations
 *
 * */

/**
 * An animation configuration. Animation configurations can also be defined as
 * booleans, where `false` turns off animation and `true` defaults to a duration
 * of 500ms and defer of 0ms.
 *
 * @interface Highcharts.AnimationOptionsObject
 *//**
 * A callback function to exectute when the animation finishes.
 * @name Highcharts.AnimationOptionsObject#complete
 * @type {Function|undefined}
 *//**
 * The animation defer in milliseconds.
 * @name Highcharts.AnimationOptionsObject#defer
 * @type {number|undefined}
 *//**
 * The animation duration in milliseconds.
 * @name Highcharts.AnimationOptionsObject#duration
 * @type {number|undefined}
 *//**
 * The name of an easing function as defined on the `Math` object.
 * @name Highcharts.AnimationOptionsObject#easing
 * @type {string|Function|undefined}
 *//**
 * A callback function to execute on each step of each attribute or CSS property
 * that's being animated. The first argument contains information about the
 * animation and progress.
 * @name Highcharts.AnimationOptionsObject#step
 * @type {Function|undefined}
 */

/**
 * Creates a frame for the animated SVG element.
 *
 * @callback Highcharts.AnimationStepCallbackFunction
 *
 * @param {Highcharts.SVGElement} this
 *        The SVG element to animate.
 *
 * @return {void}
 */

/**
 * Interface description for a class.
 *
 * @interface Highcharts.Class<T>
 * @extends Function
 *//**
 * Class costructor.
 * @function Highcharts.Class<T>#new
 * @param {...Array<*>} args
 *        Constructor arguments.
 * @return {T}
 *         Class instance.
 */

/**
 * A style object with camel case property names to define visual appearance of
 * a SVG element or HTML element. The properties can be whatever styles are
 * supported on the given SVG or HTML element.
 *
 * @example
 * {
 *    fontFamily: 'monospace',
 *    fontSize: '1.2em'
 * }
 *
 * @interface Highcharts.CSSObject
 *//**
 * @name Highcharts.CSSObject#[key:string]
 * @type {boolean|number|string|undefined}
 *//**
 * Background style for the element.
 * @name Highcharts.CSSObject#background
 * @type {string|undefined}
 *//**
 * Background color of the element.
 * @name Highcharts.CSSObject#backgroundColor
 * @type {Highcharts.ColorString|undefined}
 *//**
 * Border style for the element.
 * @name Highcharts.CSSObject#border
 * @type {string|undefined}
 *//**
 * Radius of the element border.
 * @name Highcharts.CSSObject#borderRadius
 * @type {number|undefined}
 *//**
 * Color used in the element. The 'contrast' option is a Highcharts custom
 * property that results in black or white, depending on the background of the
 * element.
 * @name Highcharts.CSSObject#color
 * @type {'contrast'|Highcharts.ColorString|undefined}
 *//**
 * Style of the mouse cursor when resting over the element.
 * @name Highcharts.CSSObject#cursor
 * @type {Highcharts.CursorValue|undefined}
 *//**
 * Font family of the element text. Multiple values have to be in decreasing
 * preference order and separated by comma.
 * @name Highcharts.CSSObject#fontFamily
 * @type {string|undefined}
 *//**
 * Font size of the element text.
 * @name Highcharts.CSSObject#fontSize
 * @type {string|undefined}
 *//**
 * Font weight of the element text.
 * @name Highcharts.CSSObject#fontWeight
 * @type {string|undefined}
 *//**
 * Height of the element.
 * @name Highcharts.CSSObject#height
 * @type {number|undefined}
 *//**
 * Width of the element border.
 * @name Highcharts.CSSObject#lineWidth
 * @type {number|undefined}
 *//**
 * Opacity of the element.
 * @name Highcharts.CSSObject#opacity
 * @type {number|undefined}
 *//**
 * Space around the element content.
 * @name Highcharts.CSSObject#padding
 * @type {string|undefined}
 *//**
 * Behaviour of the element when the mouse cursor rests over it.
 * @name Highcharts.CSSObject#pointerEvents
 * @type {string|undefined}
 *//**
 * Positioning of the element.
 * @name Highcharts.CSSObject#position
 * @type {string|undefined}
 *//**
 * Alignment of the element text.
 * @name Highcharts.CSSObject#textAlign
 * @type {string|undefined}
 *//**
 * Additional decoration of the element text.
 * @name Highcharts.CSSObject#textDecoration
 * @type {string|undefined}
 *//**
 * Outline style of the element text.
 * @name Highcharts.CSSObject#textOutline
 * @type {string|undefined}
 *//**
 * Line break style of the element text. Highcharts SVG elements support
 * `ellipsis` when a `width` is set.
 * @name Highcharts.CSSObject#textOverflow
 * @type {string|undefined}
 *//**
 * Top spacing of the element relative to the parent element.
 * @name Highcharts.CSSObject#top
 * @type {string|undefined}
 *//**
 * Animated transition of selected element properties.
 * @name Highcharts.CSSObject#transition
 * @type {string|undefined}
 *//**
 * Line break style of the element text.
 * @name Highcharts.CSSObject#whiteSpace
 * @type {string|undefined}
 *//**
 * Width of the element.
 * @name Highcharts.CSSObject#width
 * @type {number|undefined}
 */

/**
 * All possible cursor styles.
 *
 * @typedef {'alias'|'all-scroll'|'auto'|'cell'|'col-resize'|'context-menu'|'copy'|'crosshair'|'default'|'e-resize'|'ew-resize'|'grab'|'grabbing'|'help'|'move'|'n-resize'|'ne-resize'|'nesw-resize'|'no-drop'|'none'|'not-allowed'|'ns-resize'|'nw-resize'|'nwse-resize'|'pointer'|'progress'|'row-resize'|'s-resize'|'se-resize'|'sw-resize'|'text'|'vertical-text'|'w-resize'|'wait'|'zoom-in'|'zoom-out'} Highcharts.CursorValue
 */

/**
 * All possible dash styles.
 *
 * @typedef {'Dash'|'DashDot'|'Dot'|'LongDash'|'LongDashDot'|'LongDashDotDot'|'ShortDash'|'ShortDashDot'|'ShortDashDotDot'|'ShortDot'|'Solid'} Highcharts.DashStyleValue
 */

/**
 * Generic dictionary in TypeScript notation.
 * Use the native `AnyRecord` instead.
 *
 * @deprecated
 * @interface Highcharts.Dictionary<T>
 *//**
 * @name Highcharts.Dictionary<T>#[key:string]
 * @type {T}
 */

/**
 * The function callback to execute when the event is fired. The `this` context
 * contains the instance, that fired the event.
 *
 * @callback Highcharts.EventCallbackFunction<T>
 *
 * @param {T} this
 *
 * @param {Highcharts.Dictionary<*>|Event} [eventArguments]
 *        Event arguments.
 *
 * @return {boolean|void}
 */

/**
 * The event options for adding function callback.
 *
 * @interface Highcharts.EventOptionsObject
 *//**
 * The order the event handler should be called. This opens for having one
 * handler be called before another, independent of in which order they were
 * added.
 * @name Highcharts.EventOptionsObject#order
 * @type {number}
 *//**
 * Whether an event should be passive or not.
 * When set to `true`, the function specified by listener will never call
 * `preventDefault()`.
 * @name Highcharts.EventOptionsObject#passive
 * @type boolean
 */

/**
 * Formats data as a string. Usually the data is accessible throught the `this`
 * keyword.
 *
 * @callback Highcharts.FormatterCallbackFunction<T>
 *
 * @param {T} this
 *        Context to format
 *
 * @return {string}
 *         Formatted text
 */

/**
 * An object of key-value pairs for HTML attributes.
 *
 * @typedef {Highcharts.Dictionary<boolean|number|string|Function>} Highcharts.HTMLAttributes
 */

/**
 * An HTML DOM element. The type is a reference to the regular HTMLElement in
 * the global scope.
 *
 * @typedef {global.HTMLElement} Highcharts.HTMLDOMElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 */

/**
 * The iterator callback.
 *
 * @callback Highcharts.ObjectEachCallbackFunction<T>
 *
 * @param {T} this
 *        The context.
 *
 * @param {*} value
 *        The property value.
 *
 * @param {string} key
 *        The property key.
 *
 * @param {*} obj
 *        The object that objectEach is being applied to.
 */

/**
 * An object containing `left` and `top` properties for the position in the
 * page.
 *
 * @interface Highcharts.OffsetObject
 *//**
 * Left distance to the page border.
 * @name Highcharts.OffsetObject#left
 * @type {number}
 *//**
 * Top distance to the page border.
 * @name Highcharts.OffsetObject#top
 * @type {number}
 */

/**
 * Describes a range.
 *
 * @interface Highcharts.RangeObject
 *//**
 * Maximum number of the range.
 * @name Highcharts.RangeObject#max
 * @type {number}
 *//**
 * Minimum number of the range.
 * @name Highcharts.RangeObject#min
 * @type {number}
 */

/**
 * If a number is given, it defines the pixel length. If a percentage string is
 * given, like for example `'50%'`, the setting defines a length relative to a
 * base size, for example the size of a container.
 *
 * @typedef {number|string} Highcharts.RelativeSize
 */

/**
 * Proceed function to call original (wrapped) function.
 *
 * @callback Highcharts.WrapProceedFunction
 *
 * @param {*} [arg1]
 *        Optional argument. Without any arguments defaults to first argument of
 *        the wrapping function.
 *
 * @param {*} [arg2]
 *        Optional argument. Without any arguments defaults to second argument
 *        of the wrapping function.
 *
 * @param {*} [arg3]
 *        Optional argument. Without any arguments defaults to third argument of
 *        the wrapping function.
 *
 * @return {*}
 *         Return value of the original function.
 */

/**
 * The Highcharts object is the placeholder for all other members, and various
 * utility functions. The most important member of the namespace would be the
 * chart constructor.
 *
 * @example
 * let chart = Highcharts.chart('container', { ... });
 *
 * @namespace Highcharts
 */

''; // detach doclets above
