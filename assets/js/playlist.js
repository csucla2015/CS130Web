$(".create-form").on("submit", function() {
  $.post(
    "https://2aaf6ee1.ngrok.com/playlist",
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
