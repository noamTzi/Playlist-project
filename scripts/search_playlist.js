$(document).ready(function () {
    $("#searchBox").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".record").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});