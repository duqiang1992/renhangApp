var obj = {
//            xt:GetQueryString('xt'),
//            wybs:GetQueryString('wybs'),
//            zdsbm:GetQueryString('zdsbm'),
//            sqm:GetQueryString('sqm'),
    dqym:1,
    myts:10
};
var flag = true,
    time = null,
    url = './json/myMessage.json',
    url1 = './json/myMessage.json',
    url2 = './json/notice.json';


$('.head').find('div').click(function () {
    if($(this).hasClass('click')){
    }else{
        $(this).siblings().eq(0).removeClass('click');
        $(this).addClass('click');
        $('.box-ms').html('');
        if($(this).hasClass('myM')){
            url = url1;
            myMessage(url);
        }else{
            url = url2;
            myMessage(url);
        }
    }
});

function myMessage(url) {
    $.ajax({
        url:url,
        type:"POST",
        data:obj,
        dataType:'json',
        success:function (data) {
            if(data.Ret>=0){
                list(data);
                time = setTimeout(function () {
                    flag = true
                }, 500);
            }else{
                flag = false;
                alert(1)
            }
        }
    })
}

function list(data) {
    var str = '';
    $(data.ShuJu).each(function (index,item) {
        var id = item.XinXiID,
            lj = item.LianJie,
            lianjie = '#';
        if(lj!=''){lianjie=lj};
        if(lj==''&&id!=0){lianjie = './text.html?XinXiID='+id+'?'+url};
        str +='<li>'
            + '<a href="'+lianjie+'"><div class="text-title" style="color:'+item.BiaoTiYanSe+'">'+item.BiaoTi+'</div> </a>'
            + '<div class="time">'+item.FaBuRiQi+'</div>'
            +'</li>'
    });
    $('.box-ms').html( $('.box-ms').html()+str);
    str = null;
}

window.onscroll = function (e) {
    e = e || window.event;
    if(document.body.scrollTop + document.documentElement.clientHeight + 100 > document.body.scrollHeight&&flag){
        flag =false;
        obj.dqym +=1;
        myMessage(url)
    }
};

myMessage(url);