$(document).ready(function () {
    $("#imgPreview").hide();
    $("#addNewP_step1_div").show();
    $("#addNewP_step1_btn").show();
    $("#addNewP_step2_div").hide();
    $("#addNewP_step2_btn").hide();
});

$("#addNewP_step1_btn").on("click", function () {
    $("#addNewP_step1_div").hide();
    $("#addNewP_step1_btn").hide();
    $("#addNewP_step2_div").show();
    $("#addNewP_step2_btn").show();
});
$("#addNewP_step2_btn").on("click", function () {
    $("#modal-header").children("h4:first");
    $("#addNewP_step1_div").show();
    $("#addNewP_step1_btn").show();
    $("#addNewP_step2_div").hide();
    $("#addNewP_step2_btn").hide();
});
$("#addNewP_addSong_btn").on("click", function () {
    $("#addNewP_songList").append("<div class='addNewP_song'><label class='control-label' for='pSongURL'>Song URL<input type='text' class='form-control pSongURL' name='pSongURL[]' required pattern='.+\.mp3$'></label>&nbsp;<label class='control-label' for='pSongName'>Song Name<input type='text' class='form-control pSongName' name='pSongName[]' required></label></div>");
});

$("input[id='pImage']").on("change", function (event) {
    var src = $("input[id='pImage']").val();

    if (!src) {
        $("#imgPreview").hide();
        $("#imgPreview").attr("src", "");
    } else {
        $("#imgPreview").show();
        $("#imgPreview").attr("src", $("input[id='pImage']").val());
    }
});

$("#modalNewListForm").on("submit", function (event) {
    event.preventDefault();
    // $("#addNewP_save").on("click", function () {
    var pName = "",
        pImage = "",
        songs_Arr = [],
        temp_songs_urls = "",
        temp_songs_names = "",
        i = 0;


    pName = $("input[id='pName']").val();
    pImage = $("input[id='pImage']").val();
    temp_songs_names = $("input[name='pSongName[]']").map(function () { return $(this).val(); }).get();
    temp_songs_urls = $("input[name='pSongURL[]']").map(function () { return $(this).val(); }).get();

    if (!pImage) {
        pImage = 'music_files/default_record.png';
    }

    for (i = 0; i < temp_songs_names.length; i++) {
        songs_Arr.push({ name: temp_songs_names[i], url: temp_songs_urls[i] });
        console.log(songs_Arr[i], i);
    }

    console.log(songs_Arr);

    $.post("api/playlist", { name: pName, image: pImage, songs: songs_Arr })
        .done(function () {
            $("#modalNewListForm").trigger("reset");
            location.reload();
        });
    // $("#modalNewListForm").reset();
});