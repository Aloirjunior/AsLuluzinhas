var z = 999;
var hOption = 19;

checkExternalClick = function(event)
{
	if ($(event.target).parents('.activedropdown').length === 0)
	{
		$('.activedropdown').removeClass('activedropdown');
		$('.options').hide();
	}
};



$(document).ready(function()
{
	$(document).mousedown(checkExternalClick);

	$('select').each(function() 
	{
		if(!$(this).parent().hasClass('enhanced'))
		{
			targetselect = $(this);
			targetselect.hide();

			// set our target as the parent and mark as such
			var target = targetselect.parent();
			target.addClass('enhanced');

			// prep the target for our new markup
			target.append('<dl class="dropdown '+targetselect.attr('name')+'"><dt><a class="dropdown_toggle" href="#"></a></dt><dd><div class="options"><ul></ul></div></dd></dl>');
			target.find('.dropdown').css('zIndex',z);
			z--;

			// we don't want to see it yet
			target.find('.options').hide();
			
			if(targetselect.attr('rel'))
			{
				target.find('.dropdown .options').css('height',(targetselect.attr('rel')*hOption)+"px");
			}

			// parse all options within the select and set indices
			var i = 0;
			targetselect.find('option').each(function() 
			{
				// add the option
				target.find('.options ul').append('<li><a href="#"><span class="value">' + $(this).text() + '&nbsp;</span><span class="hidden index">' + i + '</span></a></li>');

				// check to see if this is what the default should be
				if($(this).attr('selected') == true)
				{
					targetselect.parent().find('a.dropdown_toggle').append('<span></span>').find('span').text($(this).text());
				}
				i++;
			});
			
			if(target.attr('rel'))
			{
				var n_max_itens = target.attr('rel');
				var n_itens = $('li',target).size();
				
				if(n_itens > n_max_itens)
				{
					$('.options',target).height(n_max_itens*hOption);
				}
				else
				{
					$('.options',target).height(n_itens*hOption).css("overflow-y","hidden");
				}
			}
		}
	});


	// let's hook our links, ya?
	$('a.dropdown_toggle').live('click', function() 
	{
		var theseOptions = $(this).parent().parent().find('.options');
		if(theseOptions.css('display')=='block')
		{
			$('.activedropdown').removeClass('activedropdown');
			theseOptions.hide();
		}
		else
		{
			theseOptions.parent().parent().addClass('activedropdown');
			theseOptions.show();
		}
		return false;
	});

	// bind to clicking a new option value
	$('.options a').live('click', function(e)
	{
		$('.options').hide();

		var enhanced = $(this).parent().parent().parent().parent().parent().parent();
		var realselect = enhanced.find('select');

		// set the proper index
		realselect[0].selectedIndex = $(this).find('span.index').text();
		
		// remover destaque o campo obrigatório
		objectSelect = $(".dropdown."+realselect.attr('name')+" a.dropdown_toggle");
		if(objectSelect.hasClass('focusCampoSelect'))
		{
			objectSelect.removeClass("focusCampoSelect");
		}

		// update the pseudo selected element
		//enhanced.find('.dropdown_toggle').empty().append('<span></span>').find('span').text($(this).find('span.value').text()); 			ORIGINAL
		if ($(".interna.terreno").size())
		{
			enhanced.find('.dropdown_toggle').empty().append('<i>*</i><span></span>').find('span').text($(this).find('span.value').text());
		}
		else
		{
			enhanced.find('.dropdown_toggle').empty().append('<i></i><span></span>').find('span').text($(this).find('span.value').text());
		}
		
		/////////////////////////////////// Mobile Saúde [início]
				
		if ($('.area-dados').size())
		{
			if($("dl",enhanced).hasClass('id_estados'))
			{
				//alert(realselect.val());
				$("li",$(".dropdown.id_cidades")).show()
				//$("dt a span",$(".dropdown.id_cidades")).text("Bairro:");
				$("select.id_cidades option").removeAttr('selected');
				if(realselect.val())
				{
					var index = 0;
					$("li",$(".dropdown.id_cidades")).each(
						function()
						{
							//alert($("select.bairro option:eq("+index+")").attr("rel"));
							if($("select.id_cidades option:eq("+index+")").attr("rel") != realselect.val())
							{
								$(this).hide();
							}
							index++;						
						}
					)
				}
			}
		}
				
		/////////////////////////////////// Mobile Saúde [fim]
		
		return false;
	});
});