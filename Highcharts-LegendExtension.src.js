// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/*

 The MIT License (MIT)

 Copyright (c) 2013 Jan Kowalleck <jan.kowalleck@googlemail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

*/

/**
 * Extension for Highcharts3 and Highstocks1.3 to add the Chart some functions:
 * legendHide() , legendShow() , legendToggle() 
 */
(function (Highcharts, UNDEFINED) {

	if ( ! Highcharts ) 
	{
		return;
	}

	
	var chartProto = Highcharts.Chart.prototype
	  , legendProto = Highcharts.Legend.prototype
	  ; 


	Highcharts.extend(chartProto , 
	{
	
		/**
		 * set the visibility of the legend
		 * 
		 * @param {Boolean} display Whether to show or hide the the legend
		 */
		legendSetVisibility : function (display) 
		{
			var chart = this
			  , legend = chart.legend , legendAllItems , legendAllItem , legendAllItemLength
			  , legendOptions = chart.options.legend
			  , scroller , extremes
			  ;

			if ( legendOptions.enabled == display ) 
			{
				return;
			}

			legendOptions.enabled = display;

			if ( ! display )
			{
				legendProto.destroy.call(legend);
				
				{  // fix for ex-rendered items - so they will be re-rendered if needed
					legendAllItems = legend.allItems;
					if ( legendAllItems )
					{
						for ( legendAllItem=0, legendAllItemLength=legendAllItems.length ; legendAllItem<legendAllItemLength ; ++legendAllItem )
						{
							legendAllItems[legendAllItem].legendItem = UNDEFINED;
						}
					}
				}
				
				{ // fix for chart.endResize-eventListener and legend.positionCheckboxes()
					legend.group = {};
				}
			}

			chartProto.render.call(chart);

			if ( ! legendOptions.floating )
			{
				scroller = chart.scroller;
				if ( scroller && scroller.render )
				{ // fix scrolller // @see renderScroller() in Highcharts
					extremes = chart.xAxis[0].getExtremes();
					scroller.render(extremes.min, extremes.max);
				}
			}
		},
	
		/**
		 * hide the legend 
		 */
		legendHide : function ()
		{
			this.legendSetVisibility(false);
		},

		/**
		 * show the legend 
		 */
		legendShow : function ()
		{
			this.legendSetVisibility(true);
		},

		/**
		 * toggle the visibility of the legend 
		 */
		legendToggle : function ()
		{
			this.legendSetVisibility(this.options.legend.enabled ^ true );
		}
		
	});
}(Highcharts));
