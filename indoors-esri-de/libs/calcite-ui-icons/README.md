# calcite-ui-icons
Contains the collections of svg icons used by the different ArcGIS applications such as Workforce, Dashboard, etc.

### The icon reference page can be found here: http://clidev.esri.com/calcite/calcite-ui-icons/

## Installation

`npm install git@github.com:ArcGIS/calcite-ui-icons.git --save`

## Description and usage
Icons come in two styles: **filled** and **outlined**.

### Outline icons are the standard
By default, outline icons have the default name. For eample, `trash-16.svg` will render the default outline icon. 

If needed, appending `-f` (`trash-16-f.svg`) will render the filled version.

**Outline icons should be the primary icons to be used.**

### Icons are stored in category directories
Additionally, both outline and filled icons live within directories, which are named by category of icons.
For example, both outline and filled version of the `trash` icon live together inside:

```
icons/Objects/
```

### Sprite packages
Furtheremore, sprites are available in 3 packages:
* sprite-16.svg
* sprite-24.svg
* sprite-32.svg

All sprite packages contain both outline (default) and filled `-f` icons.

### How to use
All the individual SVG icons have a common file structure:
This is what the `close-16.svg` looks like:
```
<svg id="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path d="M0 10V7h10.965l-5-5H9.5L16 8.5 9.5 15H5.964l5-5H0z"/>
</svg>
```

**16x16, 24x24 and 32x32 are the icon sizes available.** <br>

The main group in the svg file has always the same identification attribute: `id="icons"`. 
This permits to load svg files with the `<use>` element in an svg element as:
```
<svg id="icons" viewBox="0 0 16 16" class="icon">
  <use xlink:href="pathToIcons/close-16.svg#icons"></use>
</svg>
```

The viewBox must be set to the icon's corresponding size, as either `viewBox="0 0 16 16"`, `viewBox="0 0 24 24"` or `viewBox="0 0 32 32"`.

sprite usage:
```
<svg id="icons" viewBox="0 0 16 16" class="icon">
  <use xlink:href="pathToIcons/sprite-16.svg#close-16"></use>
</svg>
```

None of the monochrome icons have `fill` attributes embedded in the SVG files (for both outline and filled styles). The `fill` attribute can be defined with css:
```
.icon {
  fill: red;
}
```

All the other styling properties applicable to the whole svg element are applicable.
```
.icon:hover {
  transform: rotate(90deg);
}
```

### Using the icons in ember
The recommended way is:
* Install the calcite-ui-icons package in your ember project:

	```
	npm install git@github.com:ArcGIS/calcite-ui-icons.git --save-dev
	```

* Install broccoli-funnel:

	```
	npm i broccoli-funnel --save-dev
	```

* Update your ember-cli-build.js file by:
	* Adding an import at the top: `var Funnel = require('broccoli-funnel');`
	* Adding at the end of the exported function:
		```
		  // Use funnel to copy svg icons
		  var svgIcons = new Funnel('node_modules/calcite-ui-icons', {
		    srcDir: '/',
		    include: ['icons/*.svg'],
		    destDir: 'assets'
		  });

		  return app.toTree([svgIcons]);
	  	```
* Rebuild your application. You should have all the monochrome icons copied under the `dist/assets/svgs`.
* To use the icon add the following code in your templates:

	```
	<svg id="icons" viewBox="0 0 16 16" class="apps-icon">
	  <use xlink:href="assets/icons/sprite-16.svg#close-16"></use>
	</svg>
	```
* Style your svg icons

	```
	.apps-icon {
	  fill: blue;
	}
	.apps-icon:hover {
	  transform: rotate(90deg);
	}
	```

Note that SVG <use> is not supported on IE11. 
	
**<p style="color:red">SVG `<use>` security issue:</p>**
> For security reasons, some browsers could apply a same-origin policy on use elements and could refuse to load a cross-origin URI within the href attribute.

> Since SVG 2, the xlink:href attribute is deprecated in favor of simply href. See xlink:href page for more information.

More info about SVG `<use>` security issue [click here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)


### Why 3 Sizes?
More info on what happens when you scale vector based icons [here](https://github.com/ArcGIS/interactive-design/wiki/What-Happens-When-You-Scale-Vector-Based-Icons)


- - - 

## Contributing

Please read the [contribute document](CONTRIBUTE.md).
