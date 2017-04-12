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
var flag = {
        FirstFlagM: true,
        FirstFlagN: true
    },
    total = {},
    // url = strU + '/GongGaoLieBiao.ashx',
    // url1 =strU +  '/XiaoXiLieBiao.ashx',
    // url2 =strU +  '/GongGaoLieBiao.ashx';
    url = './json/myMessage.json',
    url1 = './json/myMessage.json',
    url2 = './json/notice.json';
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

function toHeight() {
    var li = $(strBox).find('li');
    var height = parseInt(li.css('height'))*li.length;
    if(height<screenHeight){
        $('#move').css('height',screenHeight-headHeight);
    }else{
        $('#move').css('height',height);
    }
}

function doClass(add) {
    $('.headClass').removeClass('click');
    $(add).addClass('click')
}

var moRenDaoHang = GetQueryString('mrdh') ? GetQueryString('mrdh') : 'gg';

if (moRenDaoHang == 'xx') {
    $('#xx').addClass('click');
    toM();
} else {
    $('#gg').addClass('click');
    toN();
    $('#move').css('left',-screenWidth)
}

$('.head').find('div').click(function () {
    if (!$(this).hasClass('click')) {
        clearLoading();
        if ($(this).hasClass('myM')) {
            doClass('.myM');
            toM();
            toHeight();
            $('#move').animate({left: 0}, 200, 'ease-out');
        } else {
            doClass('.notice');
            toN();
            toHeight();
            $('#move').animate({left: -screenWidth}, 200, 'ease-out');
        }
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
           toHeight()
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
            isGo = false;
        IsYiDu = parseInt(item.IsYiDu) == 0 ? './images/WeiDuXiaoXi.png' : './images/YiDuXiaoXi.png';
        if (lj != '') {
            lianjie = lj;
            isGo = true;
        };

        if (lj == '' && id != 0) {
            lianjie = './text.html?xxid=' + id + sQuery(url)
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
    var that = this;
    if (isGo) {
        window.location.reload();
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
                    window.location.reload();
                }
            }
        });
    }
}

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
    if (Math.abs(this.difference) > 30) {
        var setLeft = this.left + this.difference;
        if (setLeft > (-screenWidth - 40) && setLeft < 40) {
            $(this).css('left', this.left + this.difference);
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
                $(this).animate({left: -screenWidth}, 200, 'ease-out');
                doClass('.notice');
                toN();
                toHeight()
            }
            if (this.difference > 0) {
                $(this).animate({left: 0}, 200, 'ease-out');
                doClass('.myM');
                toM();
                toHeight()
            }
        } else {
            $(this).animate({left: this.left}, 200, 'ease-out')
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
