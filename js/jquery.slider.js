/*
	Slider plugin by Backstage Digital
	$(".slider").slider({'time':.7,'nItens':5,'orientation':'vertical'});
*/

(function($) {	
	$.fn.slider = function(options)
	{
	   var settings = $.extend( {
		  'nItens'		: 4,
		  'time'		: 1,
		  'auto'		: false,
		  'timeAuto'	: 5,
		  'slideGroup'	: false,
		  'orientation' : "horizontal"
		}, options);
	
		return this.each(
			function()
			{
		  		var box = $(this);
		  		var nItens = settings['nItens'];
		  		var time = settings['time'];
		  		var orientation = settings['orientation'];
				
		  		var setaDir = $('.setaDir',box);
		  		var setaEsq = $('.setaEsq',box);
		  		var setaUp = $('.setaUp',box);
		  		var setaDown = $('.setaDown',box);
		  		var container = $('.container',box);
		  		var content = $('.content',box);
		  		var item = $('.item',box);
		  		
		  		var _item = item.eq(0);
		  		var wItem = objectSize(_item,'width');
		  		var hItem = objectSize(_item,'height') ;
				
				var tamanhoContent = 0;
				
				var statusMove = false;
				
				if(orientation == "horizontal")
				{
					var tamanhoContainer = container.width();
					var tamanhoItem = wItem;
					var margin_previous = "margin-left";
					var seta_previous = setaEsq;
					var seta_next = setaDir;
					
				}
				else
				{
					var tamanhoContainer = container.height();
					var tamanhoItem = hItem;
					var margin_previous = "margin-top";
					var seta_previous = setaUp;
					var seta_next = setaDown;
				}
				
				function initSlider()
				{
					if(settings['auto'] != false)
					{
						item.eq(0).clone().insertAfter(item.eq(item.size()-1));
						item = $('.item',content);
						
						autoSlider();
					}
					
					if(orientation == "horizontal")
					{
						container.attr('rel',0).scrollLeft(0);
						item.each(
							function(index)
							{
								tamanhoContent += objectSize($(this),'width');
							}
						)
						content.width(tamanhoContent);
					}
					else
					{
						container.attr('rel',0).scrollTop(0);
						item.each(
							function(index)
							{
								tamanhoContent += objectSize($(this),'height');
							}
						)
						content.height(tamanhoContent);

					}
					
					if(tamanhoContainer >= tamanhoContent)
					{
						if(orientation == "horizontal")
						{
							_newMargin = getSize(container,margin_previous)+objectSize(seta_previous,'width');
						}
						else
						{
							_newMargin = getSize(container,margin_previous)+objectSize(seta_previous,'height');
							
						}
						container.css(margin_previous,_newMargin);
						
						seta_previous.hide();
						seta_next.hide();
					}
					else
					{
						seta_previous.css('visibility','visible');
						seta_next.css('visibility','visible');
					}
				}
				
				function autoSlider()
				{
					box.oneTime(1000*settings['timeAuto'], function(){
						if(container.attr('rel') == item.size()-1)
						{
							if(orientation = "horizontal")
							{
								container.scrollLeft(tamanhoItem*0);
							}
							else
							{
								container.scrollTop(tamanhoItem*0);
							}
							container.attr('rel',0);
						}
						sliderMove('next');
					});			
				}
				
				function initNav()
				{
					seta_next.mouseover(
						function()
						{
							var _rel = parseInt(container.attr('rel'));
							
							if(_rel < item.size()-nItens && !statusMove || settings['auto'] && !statusMove)
							{
								$(this).css('cursor','pointer');
								$(this).addClass('over');
							}
							else
							{
								$(this).css('cursor','default');
							}
						}
					).mouseout(
						function()
						{
							$(this).css('cursor','default');
							$(this).removeClass('over');
						}
					).click(
						function()
						{
							box.stopTime();
							sliderMove('next');
							return false;
						}
					)
					
					seta_previous.mouseover(
						function()
						{
							var _rel = parseInt(container.attr('rel'));
							
							if(_rel > 0 && !statusMove || settings['auto'] && !statusMove)
							{
								$(this).css('cursor','pointer');
								$(this).addClass('over');
							}
							else
							{
								$(this).css('cursor','default');
							}
						}
					).mouseout(
						function()
						{
							$(this).removeClass('over');
						}
					).click(
						function()
						{
							box.stopTime();
							sliderMove('previous');
							return false;
						}
					)
				}				

				function sliderMove(_type)
				{
					if(!statusMove)
					{
						var nSlideMove = 1;
						var rel = parseInt(container.attr('rel'));
						
						switch(_type)
						{
							case 'next':
								_bt = seta_next;
								
								if(settings['slideGroup'] && !settings['auto'])
								{
									if(rel+settings['slideGroup'] > item.size()-nItens)
									{
										nSlideMove = item.size()-nItens-rel;
									}
									else
									{
										nSlideMove = settings['slideGroup'];
									}
								}
								
								_n = rel+nSlideMove;
								
								break;
							case 'previous':
								_bt = seta_previous;

								if(settings['slideGroup'] && !settings['auto'])
								{
									if(rel-settings['slideGroup'] < 0)
									{
										nSlideMove = rel;
									}
									else
									{
										nSlideMove = settings['slideGroup'];
									}
								}

								_n = rel-nSlideMove;
								
								break;
						}
						
						if(_n >= 0 && _n <= item.size()-nItens)
						{
							if(_n == 0 && !settings['auto'] || _n == item.size()-nItens && !settings['auto'])
							{
								_bt.css('cursor','default');
								_bt.removeClass('over');
							}				
							
							slideTransition(_n);
						}
					}	
				}
				
				function slideTransition(n)
				{
					statusMove = true;
					
					if(orientation == "horizontal")
					{
						container.stop().animate({scrollLeft: tamanhoItem*n}, time*1000,
							function()
							{
								statusMove = false;
								
								container.attr('rel',n);
								
								if(settings['auto'] != false)
								{
									switch(n)
									{
										case 0:
											container.scrollLeft(tamanhoItem*item.size()-1);
											container.attr('rel',item.size()-1);
											break;
										case item.size()-1:
											container.scrollLeft(tamanhoItem*0);
											container.attr('rel',0);
											break;
									}
									
									autoSlider();
								}
							}
						);
					}
					else
					{
						container.stop().animate({scrollTop: tamanhoItem*n}, time*1000,
							function()
							{
								statusMove = false;
								
								container.attr('rel',n);
								
								if(settings['auto'] != false)
								{
									switch(n)
									{
										case 0:
											container.scrollTop(tamanhoItem*item.size()-1);
											container.attr('rel',item.size()-1);
											break;
										case item.size()-1:
											container.scrollTop(tamanhoItem*0);
											container.attr('rel',0);
											break;
									}
									
									autoSlider();
								}
							}
						);
					}
				}

				function objectSize(_item,_type)
				{
					var _size;
					
					switch(_type)
					{
						case 'width':
							_size = _item.width() + getSize(_item,'margin-left') + getSize(_item,'margin-right') + getSize(_item,'padding-left') + getSize(_item,'padding-right') + getSize(_item,"border-left-width") + getSize(_item,"border-right-width");
							break;
						case 'height':
							_size = _item.height() + getSize(_item,'margin-top') + getSize(_item,'margin-bottom') + getSize(_item,'padding-top') + getSize(_item,'padding-bottom') + getSize(_item,"border-top-width") + getSize(_item,"border-bottom-width");
							break;
					}
					
					return _size;
				}
				
				function getSize(_obj,_css)
				{
					var _regExp = new RegExp("[a-z][A-Z]","g");
					return parseFloat(_obj.css(_css).replace(_regExp, ""));
				}
				
		  		initSlider();
				initNav();
			}
		)
	}
			  
	})(jQuery);