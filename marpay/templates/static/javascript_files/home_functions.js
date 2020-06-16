 $(".get_user_form").submit(function(e){
	// alert("Submitted");
	e.preventDefault();
	e.stopPropagation();
	var form = $(this);
   	$.ajax({
        url: form.attr("action"),
        data: form.serialize(),
        type: form.attr("method"),
        dataType: 'json',
        success: function (data) {
            if (data.form_is_valid) {
              $("#user-table tbody").html(data.html_user_thw_list);
            }
          },
   		error : function(response){
   			var a = response;
            alert("failed");
   			console.log(response)
   		}
   	})     	  	
});
// $("#modal-book").on("submit", ".get_user_form", function(e){
// $(".get_user_form").click(function(e){
// .unbind('submit')