var listOfplaylists = [],
    currentPlaylist = "",
    currentSongsList,
    playing = true,
    isON = false,
    data = "";

$(document).ready(function () {
    $.get("api/playlist", JSON, function (data, status) {
        let construction = "";
        var img = "";

        data.data.forEach(element => {

            img = element.image;
            construction += `<div class='record col-xs-4 col-sm-4 col-md-2 col-lg-2'><h5 id='record_${element.id}'>${element.name}</h5><img src='${img}'><div class='recordCtrlButtons'><div class='recordEditBtn' onclick='editMe(${element.id})' data-toggle="modal" data-target="#editListModal"><i class='fas fa-edit'></i></div><div class='recordDeleteBtn' onclick='deleteMe(${element.id})'><i class='fas fa-trash'></i></div><div class='recordPlayBtn' onclick='playMe(${element.id})'><i class='fas fa-play'></i></div></div></div>`;
            listOfplaylists.push(element);
        });
        finish("playlists", construction);

        data.data.forEach(element => {
            new CircleType(document.getElementById(`record_${element.id}`)).radius(160);;
        });
    });

    // $.post("api/playlist", { data_string }).done(function (data) {
    //     alert("done" + data);
    // });
});

function finish(element, data) {
    $("#" + element).append(data);
}

function playMe(playlistID) {
    var construction = "";
    $("#player").empty();

    $.get(`api/playlist/${playlistID}`, JSON, function (data, status) {
        var currentSong = 0,
            i = 0,
            currentSongsListLengeth;
        currentPlaylist = data.data;
        $("audio").attr("currently_playing", 0);
        construction = `<div id='playingNow' class='player hidden'><div class='recordImg'><img id='currentImg' class='rotating' src='${currentPlaylist.image}'><div class='recordPauseBtn'><i class='fas fa-pause'></i></div></div><div class='recordEditBtn_player' onclick='editMe(${currentPlaylist.id})' data-toggle="modal" data-target="#editListModal"><i class='fas fa-edit'></i></div><div class='recordDeleteBtn_player' onclick='deleteMe(${currentPlaylist.id})'><i class='fas fa-trash'></i></div><div style='margin-left: 5%;'><audio autoplay controls currently_playing='0'>Your browser does not support the audio element.</audio><div id='nowPlaying'></div><div><ul id='currentSongsList'></ul></div></div>`;
        finish("player", construction);

        $.get(`api/playlist/${playlistID}/songs`, JSON, function (data, status) {
            currentSongsList = data.data.songs;
            currentSongsListLengeth = data.data.songs.length;
            currentSongsList.forEach(element => {

                if ($("audio").attr("src") == null) {
                    $("audio").attr("src", element.url);
                }

                $("#currentSongsList").append(`<li>${element.name}</li>`);
                $("li:last").attr("id", i);
                $("li:last").attr("class", "song");
                $("li:last").attr("name", element.name);
                $("li:last").attr("url", element.url);
                $("li:last").attr("onclick", `playNow(${i})`);
                $("li").attr("style", `content: "►"`);
                $("#playingNow").removeClass("hidden");
                i++;
            });
            $("audio").attr("onclick", "play()");
            playNow(0);
        });

        $("audio").on("ended", function () {
            currentSong = $("audio").attr("currently_playing");
            currentSong++;
            $("audio").attr("currently_playing", currentSong);
            $("audio").attr("src", $(`#${currentSong}`).attr("url"));
            playNow(currentSong);
        });
        isON = true;
    });
}

function playNow(id) {
    var titleVal = currentPlaylist.name,
        name = $(`li#${id}`).attr("name"),
        url = $(`li#${id}`).attr("url");
    // console.log($(`li#${id}`));

    console.log(`currently playing: ${name}`);
    $("title").text(`${name} - ${titleVal}`);

    $("audio").attr("src", url);

    $("#nowPlaying").html(`Now Playing : ${name}`);
    $("#nowPlaying").css("font-weight", "bold");

    $(`li`).css("opacity", 0.5);
    $(`#${id}`).css("opacity", 1);
    // $(`#${id}`).css("content", "\U+25B6");

    $(".recordPauseBtn i").on("click", function () {
        if (isON) { // on play
            $(".recordPauseBtn i").removeClass("fa-play");
            $(".recordPauseBtn i").addClass("fa-pause");
            $("img#currentImg").addClass("rotating");
        } else { // on pause
            $(".recordPauseBtn i").removeClass("fa-pause");
            $(".recordPauseBtn i").addClass("fa-play");
            $("img#currentImg").removeClass("rotating");
        }
    })

    $("audio").on("play", function () {
        $(".recordPauseBtn i").removeClass("fa-play");
        $(".recordPauseBtn i").addClass("fa-pause");
        isON = true;
    });

    $("audio").on("pause", function () {
        $(".recordPauseBtn i").removeClass("fa-pause");
        $(".recordPauseBtn i").addClass("fa-play");
        isON = false;
    });
}

function editMe(playlistID) {
    $(document).ready(function () {
        var playlistToEdit = "",
            playlistToEditSongs = "",
            playlistToEditLength,
            i = 0;

        $.get(`api/playlist/${playlistID}`, JSON, function (data, status) {
            playlistToEdit = data.data;
            $("#editListModal-header h4").html(`Edit '${playlistToEdit.name}'`);
            $("input[id='editpName']").val(`${playlistToEdit.name}`);
            $("input[id='editpImage']").val(`${playlistToEdit.image}`);
            $(`#editimgPreview`).attr("src", playlistToEdit.image);
            $(`#editimgPreview`).removeAttr("style");
        });

        $.get(`api/playlist/${playlistID}/songs`, JSON, function (data, status) {
            playlistToEditSongs = data.data.songs;
            playlistToEditLength = data.data.songs.length;
            playlistToEditSongs.forEach(element => {

                $("#editP_songList").append(`<div class='editP_song'><label class='control-label' for='editpSongURL'>Song URL<input type='text' class='form-control editpSongURL' name='editpSongURL[]' id='editpSongURL${i}' required pattern='.+\.mp3$'></label><label class='control-label' for='editpSongName'>Song Name<input type='text' class='form-control editpSongName' name='editpSongName[]' id='editpSongName${i}' required></label></div>`);
                $(`input[id='editpSongURL${i}']`).val(element.url);
                $(`input[id='editpSongName${i}']`).val(element.name);
                i++;
            });
        });

        $("#editListModal-header h4").html();
        $("#editimgPreview").hide();
        $("#editP_step1_div").show();
        $("#editP_step1_btn").show();
        $("#editP_step2_div").hide();
        $("#editP_step2_btn").hide();
    });

    $("#editP_step1_btn").on("click", function () {
        $("#editP_step1_div").hide();
        $("#editP_step1_btn").hide();
        $("#editP_step2_div").show();
        $("#editP_step2_btn").show();
    });
    $("#editP_step2_btn").on("click", function () {
        $("#editListModal-header").children("h4:first");
        $("#editP_step1_div").show();
        $("#editP_step1_btn").show();
        $("#editP_step2_div").hide();
        $("#editP_step2_btn").hide();
    });

    $("#editP_addSong_btn").on("click", function () {
        $("#editP_songList").append("<div class='editP_song'><label class='control-label' for='editpSongURL'>Song URL<input type='text' class='form-control editpSongURL' name='editpSongURL[]' required pattern='.+\.mp3$'></label><label class='control-label' for='editpSongName'>Song Name<input type='text' class='form-control editpSongName' name='editpSongName[]' required></label></div>");
    });

    $("input[id='editpImage']").on("change", function (event) {
        var src = $("input[id='editpImage']").val();

        if (!src) {
            $("#editimgPreview").hide();
            $("#editimgPreview").attr("src", "");
        } else {
            $("#editimgPreview").show();
            $("#editimgPreview").attr("src", $("input[id='editpImage']").val());
        }
    });

    $("#modalEditForm").on("submit", function (event) {
        event.preventDefault();
        var pName = "",
            pImage = "",
            songs_Arr = [],
            temp_songs_urls = "",
            temp_songs_names = "",
            j = 0;

        pName = $("input[id='editpName']").val();
        pImage = $("input[id='editpImage']").val();
        temp_songs_names = $("input[name='editpSongName[]']").map(function () { return $(this).val(); }).get();
        temp_songs_urls = $("input[name='editpSongURL[]']").map(function () { return $(this).val(); }).get();

        // console.log(pName);
        // console.log(pImage);
        // console.log(temp_songs_names);
        // console.log(temp_songs_urls);

        if (!pImage) {
            pImage = 'music_files/default_record.png';
        }

        for (j = 0; j < temp_songs_names.length; j++) {
            songs_Arr.push({ name: temp_songs_names[j], url: temp_songs_urls[j] });
            console.log("song edit in place" + j, songs_Arr[j]);
        }

        $.post(`api/playlist/${playlistID}`, { name: pName, image: pImage });
        $.post(`api/playlist/${playlistID}/songs`, { songs: songs_Arr })
            .done(function () {
                $("#modalEditForm").trigger("reset");
                location.reload();
            });
        if (isON) {
            playMe(playlistID);
        }
    });
}

function deleteMe(playlistID) {
    if (confirm("Are you sure?")) {
        $.ajax({
            url: `api/playlist/${playlistID}`,
            type: 'DELETE',
            success: function () { location.reload() }
        });
    }
}