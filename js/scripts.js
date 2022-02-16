jQuery(document).ready(
	function()
	{
		$('select').selectStylize({'hOption':20});
	}
)



///////////////////////////////////////CONTATO//////////////////////////////////////

stopSend = false;

function sendForm(idForm,address)
{
	if(stopSend == false)
	{
		var stopSubmit = validarCampos(idForm);
		var validadeSubmit = validate(idForm);
		
		$('#'+idForm+' input:submit').blur();
		
		if(!stopSubmit && !validadeSubmit)
		{

			stopSend = true;
			$('#'+idForm).fadeOut(500,
				function()
				{
					$('#'+idForm).next().text('enviando...');
					$('#'+idForm).next().fadeIn(500);
					
					$.ajax({
						url: address,
						type: "POST",
						dataType: "json",
						data: $("#"+idForm).serialize(),
						error: function(data) {
							$('#'+idForm+' .msg').text('erro interno no servidor (1000)!')					
						},
						success: function(data) {
							switch(data.status)
							{
								case 'true':							
									$('#'+idForm).next().css("color","#85C33F");									
									$('#'+idForm+' .clearValue').val('');
									$('#'+idForm+' .dropdown_toggle strong').html('');
									$('#'+idForm+' .clearSelect').removeAttr("selected");
									$('#'+idForm+' .resetValue').each( 
										function()
										{
											$(this).val($(this).attr('rel'));
										}
									);							
									$('#'+idForm+' .resetSelect').each(
										function()
										{
											$('.dropdown .dropdown_toggle strong',$(this).parent()).html($('select option:eq(0)',$(this).parent()).text());
											$('select option',$(this).parent()).removeAttr('selected');
										}
									);	
																				
									break;
								case 'false':
									$('#'+idForm).next().css("color","#E53000");							
									break;
							}
							$('#'+idForm).next().text(data.msg);							
						},
						complete: function(data) {
							stopSend = false;																
							$('#'+idForm).next().delay(2000).fadeOut(500,
								function()
								{
									$('#'+idForm).fadeIn(500);
								}
							);
							//$('#'+idForm+' .loader').fadeOut();					
						}
					});					
				}
			);
			//$('#'+idForm+' .msg').text('enviando...');
			//$('#'+idForm+' .loader').fadeIn();
			
			
		}
		else
		{
			var text;
			
			if(validadeSubmit)
			{
				text = "* preencha os campos corretamente!";
			}
			
			if(stopSubmit)
			{
				text = "* preencha os campos obrigatórios!'";
			}			

			
			$('#'+idForm).fadeOut(500,
				function()
				{
					$('#'+idForm).next().text(text).css("color","#E53000");
					$('#'+idForm).next().fadeIn(500).delay(2000).fadeOut(500,
						function()
						{
							$('#'+idForm).fadeIn(500);
						}
					);
				}
			)
		}
	}
}


function validarCampos(formId)
{
	var stopSubmit;
	
	if($("#"+formId+" .campoObrigatorio").size())
	{
		for(i=0;i<$("#"+formId+" .campoObrigatorio").size();i++)
		{
			var objectInput = $("#"+formId+" .campoObrigatorio:eq("+i+")");
			
			switch($("#"+formId+" .campoObrigatorio").get(i).tagName)
			{
				case "INPUT":
					switch(objectInput.attr('type'))
					{
						case "text":
						case "password":
							if(!objectInput.val() || objectInput.attr('rel') &&  objectInput.attr('rel') == objectInput.val())
							{
								objectInput.addClass("focusCampo");
								objectInput.blur(function(){
									if($(this).val() || $(this).attr('rel') && $(this).val() && $(this).attr('rel') != $(this).val())
									{
										$(this).removeClass("focusCampo");
										//$(this).unbind();
									}
								});
								
								stopSubmit = true;	
							}
							break;
					
						case "hidden":
							var objectRel = $("#"+objectInput.attr('rel'));
	
							if(!objectInput.val())
							{
								objectRel.addClass("focusCampo");
								objectRel.blur(function(){
									$(this).removeClass("focusCampo");
									//$(this).unbind();
								});
								
								stopSubmit = true;	
							}
							break;
					}
					break;
				case "SELECT":
					if(!objectInput.val())
					{
						objectInput.addClass("focusCampoSelect");
						objectInput.change(function(){
							$(this).removeClass("focusCampoSelect");
							$(this).unbind();
						});
						
						stopSubmit = true;	
					}
					break;
				case "TEXTAREA":
					if(!objectInput.val() || objectInput.attr('rel') &&  objectInput.attr('rel') == objectInput.val())
					{
						objectInput.addClass("focusCampo");
						objectInput.blur(function(){
							if($(this).val() || $(this).attr('rel') && $(this).val() && $(this).attr('rel') != $(this).val())
							{
								$(this).removeClass("focusCampo");
								//$(this).unbind();
							}
						});
						
						stopSubmit = true;	
					}
					break;
			}
		}
		
		if(stopSubmit == true)
		{
			return true;
		}
	}	
}

////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////UTIL////////////////////////////////////////

function urlencode(str)
{
    var histogram = {}, tmp_arr = [];
    var ret = (str+'').toString();
 
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };
 
    // The histogram is identical to the one in urldecode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
 
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);
 
    for (search in histogram) {
        replace = histogram[search];
        ret = replacer(search, replace, ret) // Custom replace. No regexing
    }
 
    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
 
    return ret;
}
 
 
function urldecode(str)
{
    var histogram = {};
    var ret = str.toString();
 
    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };
 
    // The histogram is identical to the one in urlencode.
    histogram["'"]   = '%27';
    histogram['(']   = '%28';
    histogram[')']   = '%29';
    histogram['*']   = '%2A';
    histogram['~']   = '%7E';
    histogram['!']   = '%21';
    histogram['%20'] = '+';
    histogram['\u20AC'] = '%80';
    histogram['\u0081'] = '%81';
    histogram['\u201A'] = '%82';
    histogram['\u0192'] = '%83';
    histogram['\u201E'] = '%84';
    histogram['\u2026'] = '%85';
    histogram['\u2020'] = '%86';
    histogram['\u2021'] = '%87';
    histogram['\u02C6'] = '%88';
    histogram['\u2030'] = '%89';
    histogram['\u0160'] = '%8A';
    histogram['\u2039'] = '%8B';
    histogram['\u0152'] = '%8C';
    histogram['\u008D'] = '%8D';
    histogram['\u017D'] = '%8E';
    histogram['\u008F'] = '%8F';
    histogram['\u0090'] = '%90';
    histogram['\u2018'] = '%91';
    histogram['\u2019'] = '%92';
    histogram['\u201C'] = '%93';
    histogram['\u201D'] = '%94';
    histogram['\u2022'] = '%95';
    histogram['\u2013'] = '%96';
    histogram['\u2014'] = '%97';
    histogram['\u02DC'] = '%98';
    histogram['\u2122'] = '%99';
    histogram['\u0161'] = '%9A';
    histogram['\u203A'] = '%9B';
    histogram['\u0153'] = '%9C';
    histogram['\u009D'] = '%9D';
    histogram['\u017E'] = '%9E';
    histogram['\u0178'] = '%9F';
 
    for (replace in histogram) {
        search = histogram[replace]; // Switch order when decoding
        ret = replacer(search, replace, ret) // Custom replace. No regexing   
    }
 
    // End with decodeURIComponent, which most resembles PHP's encoding functions
    ret = decodeURIComponent(ret);
 
    return ret;
}

////////////////////////////////////////////////////////////////////////////////////

