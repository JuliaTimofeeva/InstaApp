function getCreateDate(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1.0;
    var day = date.getDate();
    return 'Дата:' + day + '.' + month + '.' + year;
}

jQuery(function ($) {
    var tok = '3560678910.3a0ba83.ae876968b69c402882e5b6f69783e67c',
        userid = 3560678910,
        kolichestvo = 5;
    var generalResult;
    var firstCall = true;

    $.ajax({
        url: 'https://api.instagram.com/v1/users/self/', 
        dataType: 'jsonp',
        type: 'GET',
        data: {access_token: tok},
        success: function (response) {
            $('#insta_followed').text(' Подписчиков: ' + response.data.counts.followed_by); // количество подписчиков
            $('#insta_follows').text('Подписки: ' + response.data.counts.follows); // количество подписок
            $('#insta_media').text('Публикации: ' + response.data.counts.media); // количество фото и видео в аккаунте
            $('#profile_pic').append('<img src="' + response.data.profile_picture + '" class="round">');
        }
    });

    $('button').click(function () {
        if (firstCall) {
            firstCall = false;

            $.ajax({
                url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent',
                dataType: 'jsonp',
                type: 'GET',
                data: {access_token: tok, count: kolichestvo},
                success: function (result) {
                    generalResult = result;
                    console.log(result);
                    for (x in result.data) {
                        var formattedTime = getCreateDate(result.data[x].created_time);
                        if (result.data[x].caption != null) {
                            var textPhoto = result.data[x].caption.text;
                            $('#list1').append('<div class="container">' + '<div class="post">' + '<div class = "photo" style="overflow: hidden; weight: 300px; height: 300px;"><li><img src="' + result.data[x].images.low_resolution.url + '"></div>' + '<div class="description"></li>' + '<img src="like.png" class="like">' + '<p>' + result.data[x].likes.count + '</p>' + '<p>' + textPhoto + '</p>' + '<p class = "date">' + formattedTime + '</p></section></div></div></div>');
                        } else {
                            $('#list1').append('<div class="container">' + '<div class="post"><div class = "photo" style="overflow: hidden; weight: 300px; height: 300px;"><li><img src="' + result.data[x].images.low_resolution.url + '"></div>' + '<div class="description"></li>' + '<p>' + '<img src="like.png" class="like">' + result.data[x].likes.count + '</p>' + '<p class = "date">' + formattedTime + '</p></section></div></div></div>');
                        }
                    }
                    ;
                },
                error: function (result) {
                    console.log(result);
                }
            });
        } else {
            if (generalResult.pagination.next_url != undefined)
                $.ajax({
                    url: generalResult.pagination.next_url,
                    dataType: 'jsonp',
                    type: 'GET',
                    success: function (result2) {
                        console.log(result2);
                        for (x in result2.data) {
                            var formattedTime = getCreateDate(result2.data[x].created_time);
                            if (result2.data[x].caption != null) {
                                var textPhoto = result2.data[x].caption.text;
                                $('#list1').append('<div class="container">' + '<div class="post">' + '<div class = "photo" style="overflow: hidden; weight: 300px; height: 300px;"><li><img src="' + result2.data[x].images.low_resolution.url + '"></div>' + '<div class="description"></li>' + '<img src="like.png" class="like">' + '<p>' + result2.data[x].likes.count + '</p>' + '<p>' + textPhoto + '</p>' + '<p class = "date">' + formattedTime + '</p></section></div></div></div>');
                            } else {
                                $('#list1').append('<div class="container">' + '<div class="post">' + '<div class = "photo" style="overflow: hidden; weight: 300px; height: 300px;"><li><img src="' + result2.data[x].images.low_resolution.url + '"></div>' + '<div class="description"></li>' + '<img src="like.png" class="like">' + '<p>' + result2.data[x].likes.count + '</p>' + '<p class = "date">' + formattedTime + '</p></section></div></div></div>');
                            }

                        }
                        generalResult = result2;
                    },
                    error: function (result2) {
                        console.log(result2);
                    }
                });
        }
    });
});