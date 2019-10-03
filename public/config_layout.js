$(document).ready(function(){
	$('.btnkey').click(function(){
		$('#google').show();
		var x = $(this).val()
		$('#searchval').val(x);
	});
	$('#3lv').click(function(){
		var value = $(this).val();
		$('.num').html(value)

		$('#3lv').css('display','none');
		$('#5lv').css('display','inline');
		$('#7lv').css('display','inline');
		$('#9lv').css('display','inline');

		$('.3lv').css('display','block');
		$('.5lv').css('display','none');
		$('.7lv').css('display','none');
		$('.9lv').css('display','none');
	});
	$('#5lv').click(function(){
		var value = $(this).val();
		$('.num').html(value)

		$('#3lv').css('display','inline');
		$('#5lv').css('display','none');
		$('#7lv').css('display','inline');
		$('#9lv').css('display','inline');

		$('.3lv').css('display','none');
		$('.5lv').css('display','block');
		$('.7lv').css('display','none');
		$('.9lv').css('display','none');
	});
	$('#7lv').click(function(){
		var value = $(this).val();
		$('.num').html(value)

		$('#3lv').css('display','inline');
		$('#5lv').css('display','inline');
		$('#7lv').css('display','none');
		$('#9lv').css('display','inline');

		$('.3lv').css('display','none');
		$('.5lv').css('display','none');
		$('.7lv').css('display','block');
		$('.9lv').css('display','none');
	});
	$('#9lv').click(function(){
		var value = $(this).val();
		$('.num').html(value)

		$('#3lv').css('display','inline');
		$('#5lv').css('display','inline');
		$('#7lv').css('display','inline');
		$('#9lv').css('display','none');

		$('.3lv').css('display','none');
		$('.5lv').css('display','none');
		$('.7lv').css('display','none');
		$('.9lv').css('display','block');
	});
});