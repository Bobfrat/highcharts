/* *
 *
 *  Popup generator for Stock tools
 *
 *  (c) 2009-2021 Sebastian Bochan
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

import type AnnotationsOptions from '../AnnotationsOptions';
import type { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType';
import type Popup from './Popup';

import H from '../../../Core/Globals.js';
const {
    doc,
    isFirefox
} = H;
import PopupHTML from './PopupHTML.js';
const {
    DIV,
    PREFIX,
    SPAN
} = PopupHTML;
import U from '../../../Core/Utilities.js';
const {
    createElement,
    isArray,
    isObject,
    objectEach,
    pick,
    stableSort
} = U;

/* *
 *
 *  Constants
 *
 * */

const indexFilter = /\d/g;

/* *
 *
 *  Functions
 *
 * */

/**
 * Create annotation simple form.
 * It contains fields with param names.
 * @private
 * @param {Highcharts.Chart} chart
 * Chart
 * @param {Object} options
 * Options
 * @param {Function} callback
 * On click callback
 * @param {boolean} [isInit]
 * If it is a form declared for init annotation
 */
function addForm(
    this: Popup,
    chart: Highcharts.AnnotationChart,
    options: AnnotationsOptions,
    callback: Function,
    isInit?: boolean
): void {
    let popupDiv = this.container,
        lang = this.lang,
        bottomRow,
        lhsCol;

    if (!chart) {
        return;
    }

    // create title of annotations
    lhsCol = createElement('h2', {
        className: PREFIX + 'popup-main-title'
    }, void 0, popupDiv);
    lhsCol.appendChild(
        doc.createTextNode(
            lang[options.langKey as any] || options.langKey || ''
        )
    );

    // left column
    lhsCol = createElement(
        DIV,
        {
            className: (
                PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            )
        },
        void 0,
        popupDiv
    );

    bottomRow = createElement(
        DIV,
        {
            className: PREFIX + 'popup-bottom-row'
        },
        void 0,
        popupDiv
    );

    addFormFields.call(
        this,
        lhsCol,
        chart,
        '',
        options,
        [],
        true
    );

    this.addButton(
        bottomRow,
        isInit ?
            (lang.addButton || 'add') :
            (lang.saveButton || 'save'),
        isInit ? 'add' : 'save',
        popupDiv,
        callback
    );
}

/**
 * Create annotation simple form. It contains two buttons
 * (edit / remove) and text label.
 * @private
 * @param {Highcharts.Chart} - chart
 * @param {Highcharts.AnnotationsOptions} - options
 * @param {Function} - on click callback
 */
function addToolbar(
    this: Popup,
    chart: Highcharts.AnnotationChart,
    options: AnnotationsOptions,
    callback: Function
): void {
    let _self = this,
        lang = this.lang,
        popupDiv = this.container,
        showForm = this.showForm,
        toolbarClass = PREFIX + 'annotation-toolbar',
        button;

    // set small size
    if (popupDiv.className.indexOf(toolbarClass) === -1) {
        popupDiv.className += ' ' + toolbarClass;
    }

    // set position
    if (chart) {
        popupDiv.style.top = chart.plotTop + 10 + 'px';
    }

    // create label
    createElement(SPAN, void 0, void 0, popupDiv).appendChild(
        doc.createTextNode(pick(
            // Advanced annotations:
            lang[options.langKey as any] || options.langKey,
            // Basic shapes:
            options.shapes && options.shapes[0].type,
            ''
        ))
    );

    // add buttons
    button = this.addButton(
        popupDiv,
        lang.removeButton || 'remove',
        'remove',
        popupDiv,
        callback
    );

    button.className += ' ' + PREFIX + 'annotation-remove-button';
    button.style['background-image' as any] = 'url(' +
        this.iconsURL + 'destroy.svg)';

    button = this.addButton(
        popupDiv,
        lang.editButton || 'edit',
        'edit',
        popupDiv,
        function (): void {
            showForm.call(
                _self,
                'annotation-edit',
                chart,
                options,
                callback
            );
        }
    );

    button.className += ' ' + PREFIX + 'annotation-edit-button';
    button.style['background-image' as any] = 'url(' +
        this.iconsURL + 'edit.svg)';

}

/**
 * Create annotation's form fields.
 * @private
 * @param {Highcharts.HTMLDOMElement} parentDiv
 * Div where inputs are placed
 * @param {Highcharts.Chart} chart
 * Chart
 * @param {string} parentNode
 * Name of parent to create chain of names
 * @param {Highcharts.AnnotationsOptions} options
 * Options
 * @param {Array<unknown>} storage
 * Array where all items are stored
 * @param {boolean} [isRoot]
 * Recursive flag for root
 */
function addFormFields(
    this: Popup,
    parentDiv: HTMLDOMElement,
    chart: Highcharts.AnnotationChart,
    parentNode: string,
    options: AnnotationsOptions,
    storage: Array<unknown>,
    isRoot?: boolean
): void {
    let _self = this,
        addInput = this.addInput,
        lang = this.lang,
        parentFullName,
        titleName;

    if (!chart) {
        return;
    }

    objectEach(options, function (value, option: string): void {

        // create name like params.styles.fontSize
        parentFullName = parentNode !== '' ?
            parentNode + '.' + option : option;

        if (isObject(value)) {
            if (
                // value is object of options
                !isArray(value) ||
                // array of objects with params. i.e labels in Fibonacci
                (isArray(value) && isObject(value[0]))
            ) {
                titleName = lang[option] || option;

                if (!titleName.match(indexFilter)) {
                    storage.push([
                        true,
                        titleName,
                        parentDiv
                    ]);
                }

                addFormFields.call(
                    _self,
                    parentDiv,
                    chart,
                    parentFullName,
                    value as any,
                    storage,
                    false
                );
            } else {
                storage.push([
                    _self,
                    parentFullName,
                    'annotation',
                    parentDiv,
                    value
                ]);
            }
        }
    });

    if (isRoot) {
        stableSort(storage, function (a: any): number {
            return a[1].match(/format/g) ? -1 : 1;
        });

        if (isFirefox) {
            storage.reverse(); // (#14691)
        }

        storage.forEach(function (genInput: any): void {
            if (genInput[0] === true) {
                createElement(
                    SPAN, {
                        className: PREFIX + 'annotation-title'
                    },
                    void 0,
                    genInput[2]
                ).appendChild(doc.createTextNode(
                    genInput[1]
                ));

            } else {
                genInput[4] = {
                    value: genInput[4][0],
                    type: genInput[4][1]
                };
                addInput.apply(genInput[0], genInput.splice(1));
            }
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */

const PopupAnnotations = {
    addForm,
    addToolbar
};

export default PopupAnnotations;
