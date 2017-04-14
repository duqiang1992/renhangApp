//接口调用参数对象
var objMy = {
    xt: GetQueryString('xt'),
    wybs: GetQueryString('wybs'),
    zdsbm: GetQueryString('zdsbm'),
    sqm: GetQueryString('sqm'),
    dqym: 0,
    myts: 6
};
var objNo = {
    xt: GetQueryString('xt'),
    wybs: GetQueryString('wybs'),
    zdsbm: GetQueryString('zdsbm'),
    sqm: GetQueryString('sqm'),
    dqym: 0,
    myts: 3
};
var obj = {};
var strBox = '';
var screenWidth = screen.width;
var screenHeight = screen.height;
var headHeight = parseInt($('.head').css('height'));
var that;
var flag = {
        FirstFlagM: true,
        FirstFlagN: true
    },
    total = {},
    url = strU + '/GongGaoLieBiao.ashx',
    url1 =strU +  '/XiaoXiLieBiao.ashx',
    url2 =strU +  '/GongGaoLieBiao.ashx';

//切换预设
function toM() {
    url = url1;
    obj = objMy;
    strBox = '.myMe';
    // 首次加载调用
    if (flag.FirstFlagM) {
        myMessage(url);
        flag.FirstFlagM = false
    }
}

function toN() {
    url = url2;
    obj = objNo;
    strBox = '.myNo';
    var height = $('.bn .box-ms').css(height);
    // 首次加载调用
    if (flag.FirstFlagN) {
        myMessage(url);
        flag.FirstFlagN =false
    }
}

// 切换高度重置
// function toHeight() {
//     var li = $(strBox).find('li');
//     var height = parseInt(li.css('height'))*li.length;
//     if(height<screenHeight){
//         $('#move').css('height',screenHeight-headHeight);
//     }else{
//         $('#move').css('height',height);
//     }
// }

//切换头样式添加
function doClass(add) {
    $('.headClass').removeClass('click');
    $(add).addClass('click')
}
//默认选中的导航条
var moRenDaoHang = GetQueryString('mrdh') ? GetQueryString('mrdh') : 'gg';
if (moRenDaoHang == 'xx') {
    $('#xx').addClass('click');
    toM();
    $(strBox).show();
} else {
    $('#gg').addClass('click');
    toN();
    $(strBox).show();
}

history.replaceState({page: 1}, "title 1", "?page=1");

// 点击导航切换
$('.head').find('div').click(function () {
    if (!$(this).hasClass('click')) {
        clearLoading();
        if ($(this).hasClass('myM')) {
            doClass('.myM');
            toM();
            $('.myNo').hide();
            $('.myMe').show();
            $('#move').css('left',-screenWidth);
        } else {
            doClass('.notice');
            toN();
            $('.myMe').hide();
            $('.myNo').show();
            $('#move').css('left',screenWidth);
        }
        $('#move').animate({left: 0}, 200, 'ease-out');
    }
});

//ajax请求
function myMessage(url) {
    createLoading();
    if(obj.dqym*obj.myts>=total[strBox] ){
        endLoading();
        return
    }
    obj.dqym += 1;
    $.ajax({
        url: url,
        type: "GET",
        data: obj,
        dataType: 'json',
        success: function (data) {
            if (data.Ret >= 0) {
                clearLoading();
                total[strBox] = parseInt(data.Total);
                //模板拼接
                list(data);
            } else {
                errLoading(data.ErrInfo)
            }
        },
        error: function (xhr, type, error) {
            errLoading(error)
        }
    })
}

//模板拼接
function list(data) {
    var fs = document.createDocumentFragment();
    $(data.ShuJu).each(function (index, item) {
        var str = '';
        var li = document.createElement('li');
        var id = item.XinXiID,
            lj = item.LianJie,
            lianjie = 'javascript:;',
            isGo = '\'No\'';
        IsYiDu = parseInt(item.IsYiDu) == 0 ? './images/WeiDuXiaoXi.png' : './images/YiDuXiaoXi.png';
        if (lj != '') {
            lianjie = lj;
            isGo =  parseInt(item.IsYiDu) == 0?'\'tohrefWeiDu\'':'\'tohrefYiDu\''
        };

        if (lj == '' && id != 0) {
            isGo =  parseInt(item.IsYiDu) == 0?'\'toTextWeiDu\'':'\'toTextYiDu\''
            // lianjie = './text.html?xxid=' + id + sQuery(url)
        };
        str += '<a onclick="go.call(this,' + id + ',' + isGo + ')" href="' + lianjie + '"><div title="' + item.BiaoTi + '" class="text-title" style="color:' + item.BiaoTiYanSe + '">'
            + '<div class="isWeiDu"><img src="' + IsYiDu + '" alt=""></div>'
            + item.BiaoTi
            + '</div> </a>'
            + '<div class="time">' + item.FaBuRiQi + '</div>';
        li.innerHTML = str;
        fs.appendChild(li)
    });
    $(strBox).append(fs);
    fs = null;
    str = null;
}

//strQuery
function sQuery(url) {
    return '&xt=' + obj.xt + '&wybs=' + obj.wybs + '&zdsbm=' + obj.zdsbm + '&sqm=' + obj.sqm + '&target=' + url
}

//点击消息标题跳转
function go(id, isGo) {
    if(isGo == 'No')return;
    that = this;
    if (/WeiDu/i.test(isGo)) {
        $.ajax({
            url: strU + '/JiLuGongGaoFangWenJiLu.ashx',
            type: 'get',
            dataType: 'json',
            data: {
                xt: obj.xt,
                wybs: obj.wybs,
                zdsbm: obj.zdsbm,
                sqm: obj.sqm,
                xxid: id
            },
            success: function (data) {
                if(data.Ret>0){
                }
            }
        });
    }
    if(/toText/i.test(isGo)){
        $('.MessageList').hide();
        $('.MessageContent').show();
        history.pushState({page: 2}, "title 2", "?page=2");
        history.replaceState({page: 2}, "title 2", "?page=2");
        if (strBox == '.myMe') {
            url =strU + "/XiaoXiNeiRong.ashx"
        }
        if(strBox == '.myNo') {
            url =strU +  "/GongGaoNeiRong.ashx"
        }
        $.ajax({
            url: url,
            type: 'get',
            data: {
                xt: obj.xt,
                wybs: obj.wybs,
                zdsbm: obj.zdsbm,
                sqm: obj.sqm,
                xxid: id
            },
            dataType: 'json',
            success: function (data) {
                if (data.Ret < 0) {
                    $('#loadText').css('textAlign','center').html(data.ErrInfo);
                    return
                }
                $('#loadText').hide();
                $('.headTitle').html(data.ShuJu[0].BiaoTi);
                $('.title').css('color', data.ShuJu[0].BiaoTiYanSe).html(data.ShuJu[0].BiaoTi);
                $('.time').html(data.ShuJu[0].FaBuRiQi);
                // $('.count').html(data.ShuJu[0].FangWenShu);
                $('.text_box').html(data.ShuJu[0].NeiRong)
            },
            error:function (xhr,type,error) {
                $('#loadText').css('textAlign','center').html(error);
            }
        });
    }
}

//上拉加载 左右切换
$('#move').on("touchstart", onStart);

function onStart(e) {
    this.success = false;
    this.left = parseInt($(this).css('left'));
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    $('#move').on("touchmove", onMove);
    $('#move').on("touchend", onEnd);
}

function onMove(e) {
    this.differenceY = this.startY - e.touches[0].pageY;
    if(this.differenceY > 30){
        readyLoading();
    }
    if(this.differenceY > 60){
        shiFangLoading();
        this.success = true;
    }
    this.difference = e.touches[0].pageX - this.startX;
    if (Math.abs(this.difference) > 15) {
        var setLeft = this.left + this.difference;
        this.ps = setLeft;
        if(strBox=='.myMe'){
            if(setLeft<30&&setLeft>-screenWidth){
                $(this).css('left',setLeft)
            }
        }else{
            if(setLeft>-30&&setLeft<screenWidth){
                $(this).css('left',setLeft)
            }
        }
    }
}

function onEnd(e) {
    if(Math.abs(this.differenceY)>Math.abs(this.difference)){
        if(this.success){
            myMessage(url);
        }
        $(this).animate({left: this.left}, 200, 'ease-out')
    }
    if(Math.abs(this.differenceY)<=Math.abs(this.difference)){
        clearLoading();
        if (Math.abs(this.difference) > 100) {
            if (this.difference <0) {
                doClass('.notice');
                toN();
                $('.myMe').hide();
                $(strBox).show();
                $(this).css('left',screenWidth);
                $(this).animate({left: 0}, 200, 'ease-out');
            }
            if (this.difference > 0) {
                doClass('.myM');
                toM();
                $('.myNo').hide();
                $(strBox).show();
                $(this).css('left',-screenWidth);
                $(this).animate({left: 0}, 200, 'ease-out');
            }
        } else {
            $(this).animate({left: 0}, 200, 'ease-out')
        }
    }
    $('#move').off("touchmove", onMove);
    $('#move').off("touchend", onEnd);
}

function readyLoading() {
    var top =  document.body.scrollHeight-40;
    var str ='<div class="top_loading" id="load">↑上拉加载更多</div>';
    $('.bottom').css('top',top).html(str)
}

function shiFangLoading() {
    var str ='<div class="top_loading" id="load">↓释放加载</div>';
    $('.bottom').html(str)
}
function createLoading() {
    var str ='<div class="top_loading" id="load"><span></span>Loading.....</div>';
    $('.bottom').html(str)
}

function errLoading(err) {
    var str ='<div class="top_loading" id="load">'+err+'</div>';
    $('.bottom').html(str)
}

function endLoading() {
    var str ='<div class="top_loading" id="load">没有了~~！</div>';
    $('.bottom').html(str);
    setTimeout(function () {
        clearLoading()
    },2000)
}

function clearLoading() {
    $('.bottom').html('').css('top','95%')
}

window.onpopstate = function(event) {
    if(GetQueryString('page')==1){
        $(that).find('img').attr('src','./images/YiDuXiaoXi.png');
        $('.MessageList').show();
        $('.MessageContent').hide();
        clearText();
    }
};

function clearText() {
    $('.headTitle').html('');
    $('.title').html('');
    $('.time').html('');
    // $('.count').html('');
    $('.text_box').html('')
}