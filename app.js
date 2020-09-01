$("#myform").submit(function(e) {
    $("#status").children().remove();
    $("#append").children().remove();
    e.preventDefault();
    var url = $("#url").val();
    if (url.length == 0) {
        $("#status").append(`<div class="alert alert-danger" role="alert">Please enter the URL!</div>`);
    } else if (url.search(".html") == -1 || url.search("https://zingmp3.vn/bai-hat/")) {
        $("#status").append(`<div class="alert alert-danger" role="alert">Invalid URL!</div>`);
    }

    var cut = url.split("//zingmp3");
    var mobileURL = cut[0] + "//m.zingmp3" + cut[1];
    var settings = {
        "url": mobileURL,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function(response) {
        var data = response.split("\n");
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.indexOf("/media/get-source?type=audio&key=") != -1) {
                var preUrl = element.split('data-source="')[1].split('" data-id=')[0];
                url = "https://m.zingmp3.vn/xhr" + preUrl;
                var settings = {
                    "url": url,
                    "method": "GET",
                    "timeout": 0,
                };
                $.ajax(settings).done(function(response) {
                    var json = response;
                    var mp3 = "http://vnso-zn-23-tf-" +
                        json.data.source["128"].replace("//", "") +
                        "&filename=" + json.data.name +
                        " - " + json.data.artists_names +
                        ".mp3";
                    var settings = {
                        "url": json.data.lyric,
                        "method": "GET",
                        "timeout": 0,
                    };
                    $.ajax(settings).done(function(response) {
                        var lyric = response;
                        var html = `
                                    <div style="padding-left: 1.25rem; padding-right: 1.25rem;">
                                        <video controls autoplay style="width: -webkit-fill-available; height: 50px;">
                                            <source src="` + mp3 + `" type="audio/mpeg">
                                        </video>
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="card" style="">
                                                    <img class="card-img-top" src="` + json.data.album.thumbnail_medium + `"
                                                        alt="Card image cap">
                                                    <div class="card-body">
                                                        <h5 class="card-title">` + json.data.name + `</h5>
                                                        <p class="card-text">` + json.data.artists_names + `</p>
                                                        <a href="` + mp3 + `" class="btn btn-primary" target="_blank">Download</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="card" style="height: 30rem; overflow: scroll;">
                                                    <div class="card-body">
                                                        <p class="card-text">` + lyric + `</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                        $("#append").append(html);
                    });
                });
                break;
            }
        }
    });
});