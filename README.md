# [jquery.area_onhover.js](https://github.com/warren-bank/jquery-area-onhover)

## Summary

  * The purpose of this jQuery plugin is to inspect an HTML image map
    for `area` tags that match the criteria:
      * `shape` attribute === "rect"
      * has the css `class`: "onhover"

```
<img src="image.jpg" usemap="#image_map" />
<map name="image_map">
    <area class="onhover" shape="rect" coords="0,0,100,100" href="#example" />
</map>
```

  * For each `area` tag that satisfies these criteria,
    an absolutely positioned `anchor` element is overlaid on top

  * The purpose for wanting to do so..
    is to apply css rules to these absolutely positioned `anchor` elements.
    Specifically, using the `:hover` pseudo class.

## Example

  * [demo.html](http://warren-bank.github.io/jquery-area-onhover/demo.html)

    > note: the publicly available version of this demo (ie: the link above) will always correspond to the most recent commit in the `master` branch

## Options <sub>(with default values)</sub>

```javascript
    {
        "image_element"             : false,
        "image_element_wrapper"     : false,
        "image_element_container"   : false,
        "positioned_element_class"  : false,

        // helpers
        "wrap_image_element"        : false
    }
```

  * `image_element`:

    * acceptable values:
      * string <sub>(sizzle selector)</sub>
      * DOM node
      * jQuery match set <sub>(length === 1)</sub>

    * only applicable to an obscure use-case:

      when the plugin is called on the `<map>` element (rather than the `<img>`) __AND__ the `<img>` needs to be wrapped.

  * `image_element_wrapper`:

    * acceptable values:
      * string <sub>(html, one root element)</sub>

    * allows the user to specify a custom DOM wrapper.
      This DOM element will be created and injected into the DOM such that `<img>` becomes its child node.
      The main requirement is that it use either `relative` or `absolute` positioning.

    * this string may contain the following variables,
      which will be interpolated prior to DOM construction:
        * `{{img_width}}`
        * `{{img_height}}`

      > both return integers

    * when this option is not specified,

      a default value may be applied by setting the option `wrap_image_element` to _TRUE_:

      > `<div style="display:inline-block; position:relative; z-index:0; width:{{img_width}}px; height:{{img_height}}px;"></div>`

  * `image_element_container`:

    * acceptable values:
      * string <sub>(sizzle selector)</sub>
      * DOM node
      * jQuery match set <sub>(length === 1)</sub>

    * when the dynamic creation of a DOM element to wrap the `<img>` is unnecessary,

      then neither of the following options should be assigned any value:
        * `image_element_wrapper`
        * `wrap_image_element`

    * instead, the user simply needs to identify a pre-existing element in the DOM
      that can serve as a wrapper for the `<img>`

      > though, strictly speaking, it could be dynamically pre-constructed and currently detached from the DOM

  * `positioned_element_class`:

    * acceptable values:
      * string
      * array of strings

    * if the value is a string,
      then it is a css class name that is added to each absolutely positioned anchor element
      that is dynamically created and inserted into the DOM wrapper element.

    * if the value is an array of strings,
      then a group of `<div>` elements will be created and inserted into each
      of the absolutely positioned anchor elements that are dynamically created
      and inserted into the DOM wrapper element.

      each value in the array represents a class name for one `<div>` element in this group.

      the `<div>` elements are stacked on top of one-another,
      such that the first css class in the array is at the bottom of the stack;
      conversely, the last css class in the array is at the top.

      how these stacked `<div>` elements are used is entirely up to the developer.
      They can each be individually styled in css rules using the corresponding css class name.

## Usage

  * `js/init_onhover.js`

```javascript
jQuery(document).ready(function($){

    $('#demo_01 img').area_onhover({
        "image_element_container"   : "#demo_01",
        "positioned_element_class"  : "hoverable"
    });

    $('#demo_02 img').area_onhover({
        "wrap_image_element"        : true,
        "positioned_element_class"  : "hoverable"
    });

    $('#demo_03 img').area_onhover({
        "wrap_image_element"        : true,
        "positioned_element_class"  : ["overlay","caption"]
    });

});
```

## Notes (<sub>copied directly from comments in the source code</sub>)

```
 ****************************************
 * usage patterns:
 * ===============
 *   - selecting an image element:
 *     * must either:
 *       - specify an existing container element
 *       - wrap the image element with a new container element
 *   - selecting a map element:
 *     * must either:
 *       - specify an existing container element
 *       - specify the image element, AND
 *         wrap the image element with a new container element
 *
 * helpers:
 * ========
 *   - since wrapping an image element with a new container element
 *     is a common usage pattern,
 *     the (boolean) helper option: "wrap_image_element"
 *     when set to TRUE, will pre-populate the option: "image_element_wrapper"
 *     with a DOM string that creates an inline-block element
 *     having the same width/height dimensions as the image element.
 *
 * other options:
 * ==============
 *   - "positioned_element_class":
 *
 *     * Value may contain a string.
 *       For each `<area.onhover>`:
 *         - 1 absolutely positioned anchor element will be added to the container element.
 *           The anchor element will be assigned the css class: "positioned_element_class"
 *
 *     * Value may contain an array of strings.
 *       For each `<area.onhover>`:
 *         - 1 absolutely positioned anchor element will be added to the container element.
 *         - For each `options.positioned_element_class`:
 *             * 1 div element will be added to the absolutely positioned anchor element.
 *               It will be assigned the css class name: `options.positioned_element_class[i]`
 *               It will be assigned the css inline style: `z-index: i`
 *
 *       Additional data can be contained in the DOM element: `area.onhover[i]`:
 *         - within outer loop:
 *             * any css classes (excluding `.onhover`)
 *               will be copied to the absolutely positioned anchor element
 *         - within inner loop:
 *             * if the area element contains the attribute: x-`options.positioned_element_class[i]`,
 *               then its value is treated as html content and is inserted into the div element
 *
 *             * if html content is to be inserted into the div,
 *               and the area element contains the attribute: x-`options.positioned_element_class[i]`-valign,
 *               and its value equals: "middle",
 *               then the html content is wrapped in html,
 *               such that it is displayed both vertically and horizontally centered
 *               within the absolutely positioned element.
 *
 *       example:
 *         - "positioned_element_class":
 *               ["background-overlay","caption-text"]
 *         - area tag:
 *               <area shape="rect" coords="0,0,100,100" href="#example" class="onhover odd not-even" x-caption-text="hello world" x-caption-text-valign="middle" />
 ****************************************
```

## Limitations

  * only rectangular `<area shape="rect">` elements are supported.

    > no: circles, polygons, etc..

  * if the script is passed options to wrap an `<img>`,

    and the position of the `<img>` is normally determined by some css trickery,

    then things aren't going to display properly.

    > where:

    >     `<div><img /></div>`

    > ex #1:

    > * if:

    >     `img {display:block; margin:0px auto;}`

    > * then:
        * the `<div>` will be the correct size, same as the `<img>`
        * the absolutely positioned anchor elements will display at the correct coordinates
        * though the `<img>` was horizontally centered within its parent block element,
          the `<div>` will not be. It will be left-aligned, since it doesn't inherit the margin.

    > ex #2:

    > * if:

    >     `img {display:block; position:relative; top:-5em;}`

    > * then:
        * the `<div>` will be the correct size, same as the `<img>`.
          However, the two elements won't perfectly overlap;
          the `<img>` will raise itself vertically.
        * the absolutely positioned anchor elements will NOT display at the correct coordinates.
          While the pointing device (ie: mouse) is hovering over an area of the `<img>`,
          the absolutely positioned element will appear 5em too low.
          This is because its coordinates are relative to the `<div>`,
          which is itself positioned beneath the `<img>`.

    > &nbsp;

    > ___in summary___:

    > follow this rule-of-thumb and you'll be happy:

    > * display the `<img>` element inline

    > * wrap it inside a block-level element if you need to, but display it inline

## Closing Comments

  * This is just a little script that is the by-product of a request made to me at work.
  * The core functionality of the script took about an hour to write.
    A few additional enhancements have been made while preparing the code for github.
    But this is about as far as I intend to take the plugin.
  * Everything works really well.
    A page can be built very quickly using this script and an image map.
  * I see two possible ways to use this script,
    and both are perfectly acceptable:
    1. Allowing the plugin to run client-side on a web page.
    2. Running the plugin as a development tool.

       Since:
         * the purpose of the script is DOM creation
         * the script doesn't bind any event handlers to the DOM it constructs

       Rather than deploying the script to production,
       another option is to run the script in development,
       and to statically copy the DOM elements it creates into a production version.

       By doing so, the following page elements can then be removed from the production version,
       replaced by this static output:
         * the jquery plugin
         * the `<script>` that calls the plugin
         * the `<area>` tags with the css class: "onhover"
