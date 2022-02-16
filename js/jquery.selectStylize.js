/*
	Input Clear Value plugin by Backstage Digital Versão 1.1
*/

(function($) {	
	$.fn.selectStylize = function(options)
	{
	   var settings = $.extend( {
		  'z'	: 999,
		  'hOption'	: 19
		}, options);
				
		jQuery.expr[':'].contains = function(a, i, m)
		{
		  return jQuery(a).text().toUpperCase()
			  .indexOf(m[3].toUpperCase()) >= 0;
		};		
			
		return this.each(
			function()
			{
				var strSelect;
				
				if(!$(this).parent().hasClass('enhanced'))
				{
					var target
					
					targetselect = $(this);
					targetselect.hide();
		
					// set our target as the parent and mark as such
					target = targetselect.parent();
					target.addClass('enhanced');
		
					// prep the target for our new markup
					var htmlSelect = '<dl class="dropdown '+targetselect.attr('name')+'">';
					htmlSelect += '	<input name="input_'+targetselect.attr('name')+'" type="text" value="" >';
					htmlSelect += '	<dt>';
					htmlSelect += '		<a class="dropdown_toggle" href="#">';
					htmlSelect += '			<p>';
					htmlSelect += '				<span></span>';
					htmlSelect += '			</p>';	
					htmlSelect += '		</a>';
					htmlSelect += '	</dt>';
					htmlSelect += '	<dd>';
					htmlSelect += '		<div class="options">';
					htmlSelect += '			<ul></ul>';
					htmlSelect += '		</div>';
					htmlSelect += '	</dd>';
					htmlSelect += '</dl>';
					
					target.append(htmlSelect);
					target.find('.dropdown').css('zIndex',settings['z']);
									
					// parse all options within the select and set indices
					var i = 0;
					targetselect.find('option').each(function() 
					{
						// add the option
						target.find('.options ul').append('<li><a href="#"><span class="value">' + $(this).text() + '&nbsp;</span><span class="hidden index">' + i + '</span></a></li>');
		
						// check to see if this is what the default should be
						if($(this).attr('selected'))
						{
							targetselect.parent().find('a.dropdown_toggle p span').append('<i></i><strong></strong>').find('strong').text($(this).text());
						}
						i++;
					});
					
					strSelect = $(".dropdown_toggle p span strong",target).text();
					
					resizeOptions();
					
					//DEFININDO O TAMANHO DA DIV DO SELECT
					
					var maxOptions = $('.options',target).width();
					
					$('.options',target).width(1000);
					$('.options',target).css({"visibility":"hidden","display":"block"})
					$('.options ul li a span.value',target).each(function(index, element)
					{
						var getPadding = getSize($(this).parent(),"padding-left")+getSize($(this).parent(),"padding-right");
						
						if($('.options',target).css("overflow-y") != "hidden")
						{
							getPadding += 16;
						}
                        
						if($(this).width()+getPadding > maxOptions)
						{
							maxOptions = $(this).width()+getPadding;
						}
                    });
					
					$('.options',target).width(maxOptions+5);
					$('a.dropdown_toggle span',target).width(maxOptions);
					$('.options',target).css({"visibility":"visible","display":"none"})
				}

				// let's hook our links, ya?
				$('a.dropdown_toggle',$(this).parent()).click(function() 
				{
					var theseOptions = $(this).parent().parent().find('.options');
					if(theseOptions.css('display')=='block')
					{
						//fechar select
						$('.activedropdown').removeClass('activedropdown');
						theseOptions.hide();
						
						unbindKeydown(false);
					}
					else
					{
						//abrir select
						theseOptions.parent().parent().addClass('activedropdown');
						theseOptions.show();
						
						//filtrar resultados
						strSelect = $(".dropdown_toggle p span strong",target).text();
						
						$(".options ul li a span.value",target).parent().parent().show();
						$("input",target).val('');
						resizeOptions();
						
						target.keyup(
							function(event)
							{	
								if (event.which == 13) {
									event.preventDefault();
								}
								
								var key = event.charCode || event.keyCode || 0;

								if(key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) || (key >= 48 && key <= 90) || (key >= 96 && key <= 105))
								{
									$(".options ul li a span.value",$(this)).parent().parent().hide();
									$(".options ul li a span.value:contains('"+$("input",$(this)).val()+"')",$(this)).parent().parent().show();								
									
									$(".dropdown_toggle p span strong",$(this)).text($("input",$(this)).val());
									
									resizeOptions();
								}
								
								switch(event.keyCode)
								{
									case 13: //enter
										break;
									case 38: //seta cima
										break;
									case 40: //seta baixo
										break;
								}
							}
						);
						
						$("input",target).focus();
					}
					return false;
				});
			
				// bind to clicking a new option value
				$('.options a',$(this).parent()).click(function(e)
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
					strSelect = $(this).find('span.value').text();
					enhanced.find('.dropdown_toggle p span').empty().append('<i></i><strong></strong>').find('strong').text($(this).find('span.value').text());
					
					unbindKeydown(true);
					
					/////////////////////////////////// Mobile Saúde [início]
					
					if ($('.area-dados').size())
					{
						if(realselect.attr('name') == "id_estados")
						{
							loadCidades(realselect.val());
						}
					}

					if ($('.rota').size())
					{
						if(realselect.attr('name') == "id_estado")
						{
							loadCidades(realselect.val());
						}
					}
					
					if ($('.area-usuarios-cadastro').size())
					{
						if(realselect.attr('name') == "id_estado")
						{
							loadCidades(realselect.val());
						}
						
						if(realselect.attr('name') == "id_produto")
						{
							loadAcessos(realselect.val());
						}
					}
					
					if($('#formBusca').size())
					{
                                                 
                        // Clicou em PLANOS.                               
                        if(realselect.attr('name') == "plano") {
                            // Atualiza os estados pelo plano.
                            loadSelectAjax("ajaxEstado","include.guia-online-ajax.php?faz=loadEstado&plano="+realselect.val());                                                       
                                                       
                            // Reseta municipios para ser redefinido quando selecionar o estado, com base no cadastro de prestadores.
                            loadSelectAjax("ajaxMunicipio","include.guia-online-ajax.php?faz=loadMunicipios&id=","ZY");
                                                       
                            // Reseta bairros para ser redefinido quando selecionar o municipio, com base no cadastro de prestadores.
                            loadSelectAjax("ajaxBairro","include.guia-online-ajax.php?faz=loadBairros&id=","ZY");
                                                       
                            // Reseta Tipo de Prestadores para ser redefinido quando selecionar municipio ou bairro, com base no cadastro de prestadores.
                            loadSelectAjax("ajaxTipoPrestador","include.guia-online-ajax.php?faz=loadTipoPrestador&plano='ZY'&estado='ZY'&cidade='ZY'" );                                                    
                                                       
                            // Reseta Especialidades para ser redefinida quando seleciona o municipio ou bairro ou tipo de prestador.                           
                            loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+"ZY");
                        }

                        // Clicou em ESTADOS
						if(realselect.attr('name') == "estado")
						{
                            // Redefine conteudo dos municipios.
							loadSelectAjax("ajaxMunicipio","include.guia-online-ajax.php?faz=loadMunicipios&plano="+$('select[name=plano]').val(),realselect.val());                                                       
                            
                            // Reseta contudo dos bairros para ser redefinido quando selecionar municipios, com base no cadastro de prestadores.
							loadSelectAjax("ajaxBairro","include.guia-online-ajax.php?faz=loadBairros",'ZY');
						}
						
                        // Clicou em MUNICIPIOS
						if(realselect.attr('name') == "municipio")
						{
                            // Redefine conteudo dos bairros.
							loadSelectAjax("ajaxBairro","include.guia-online-ajax.php?faz=loadBairros&plano="+$('select[name=plano]').val(),realselect.val());
                                                       
                            // Redefine o conteudo dos tipos de prestadores.
                            loadSelectAjax("ajaxTipoPrestador","include.guia-online-ajax.php?faz=loadTipoPrestador&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+realselect.val(),realselect.val());                                                                                                           
  
                            // Redefine o conteudo das especialidades.
                            loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+realselect.val(),realselect.val());                                                        

						}                        
                                                       
                        // Clicou em BAIRROS.
                        if(realselect.attr('name') == "bairro")
                        {
                            // Refina o conteudo dos tipos de prestadores, agora considerando o bairro selecionado.                                                       
                            loadSelectAjax("ajaxTipoPrestador","include.guia-online-ajax.php?faz=loadTipoPrestador&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+$('select[name=municipio]').val()+"&bairro="+realselect.val(),realselect.val());                                                                                                           

                                                       
                            // Refina o conteudo das especialidades, agora considerando o bairro selecionado.
                            loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+$('select[name=municipio]').val()+"&bairro="+realselect.val(),realselect.val());
                        }                        

                        // Clicou em TIPO DE PRESTADOR
						if(realselect.attr('name') == "tipo_prestador")
						{
//							loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+$('select[name=plano]').val()+"&tipo_prestador="+realselect.val(),realselect.val());
                                                       
                        // Refina ainda mais o conteudo das especialidades, agora considerando tambem o tipo de prestador - FUNCIONANDO.
//                        loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+$('select[name=municipio]').val()+"&bairro="+$('select[name=bairro]').val(),realselect.val());                                                       

                        loadSelectAjax("ajaxEspecialidades","include.guia-online-ajax.php?faz=loadEspecialidades&plano="+$('select[name=plano]').val()+"&estado="+$('select[name=estado]').val()+"&cidade="+$('select[name=municipio]').val()+"&bairro="+$('select[name=bairro]').val()+"&tipo_prestador="+realselect.val(),realselect.val());

                        }
					}
					
					if($('#formPersonalizar').size())
					{
						if(realselect.attr('name') == "pers_tipo_inclusao")
						{
							savePersonalizar($("#formPersonalizar").serialize());
							
							switch(realselect.val())
							{
								case "1":
									$("#boxBotoes").show();
									break;
									
								default:
									$("#boxBotoes").hide();
									$("#boxBotoes a").removeClass("ativo");
									break;
							}
						}

						if(realselect.attr('name') == "pers_tipo_aba")
						{
							savePersonalizar($("#formPersonalizar").serialize());
						}
					}
							
					/////////////////////////////////// Mobile Saúde [fim]
                    return false;
				});
				
				function getSize(_obj,_css)
				{
					var _regExp = new RegExp("[a-z][A-Z]","g");
					return parseFloat(_obj.css(_css).replace(_regExp, ""));
				}
				
				function resizeOptions()
				{
					if(target.attr('rel'))
					{
						var n_max_itens = target.attr('rel');
						var n_itens = $('li:visible',target).size();
						
						if(n_itens > n_max_itens)
						{
							$('.options',target).height((n_max_itens*settings['hOption'])).css("overflow-y","scroll");
						}
						else
						{
							$('.options',target).height(n_itens*settings['hOption']).css("overflow-y","hidden");
						}
												
						if(n_itens == 0)
						{
							$('.options',target).css("visibility","hidden");
						}
						else
						{
							$('.options',target).css("visibility","visible");
						}
					}					
				}
				
				function unbindKeydown(status)
				{
					if(status == false)
					{
						$(".dropdown_toggle p span strong",target).text(strSelect);
					}
					
					$(document).unbind('keydown');
				}
				
				checkExternalClick = function(event)
				{
					if ($(event.target).parents('.activedropdown').length === 0)
					{
						$('.activedropdown').removeClass('activedropdown');
						$('.options').hide();
						
						unbindKeydown(false);
					}
				};
				
				$(document).mousedown(checkExternalClick);		
			}
		)
	}
			  
	})(jQuery);