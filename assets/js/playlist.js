$(".create-form").on("submit", function(e) {
  $.post(
    "https://72bc04a9.ngrok.com/playlist",
    $(".create-form").serialize(),
    function(res) {
      $(".response").html(res);
    }
  );
  return false;
});

function create(res) {
  alert('helo');
}
