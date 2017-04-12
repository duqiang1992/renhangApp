var obj = {
    xt:GetQueryString('xt'),
    wybs:GetQueryString('wybs'),
    zdsbm:GetQueryString('zdsbm'),
    sqm:GetQueryString('sqm')
};

$.ajax({
    url: strU + '/XueXiJiLu.ashx',
    type: 'get',
    data:obj,
    dataType: 'json',
    success: function (data) {
        if(data.Ret<0){
            $('#load').css('textAlign','center').html(data.ErrInfo);
            return
        }
        $('#load').hide();
        str(data)
    },
    error:function (xhr,type,error) {
        $('#load').css('textAlign','center').html(error);
    }
});

function str(data) {
    var str = '', bgColor, fColor ,cColor,fen1,fen2,xueShi = [];
    $(data.ShuJu).each(function (index, item) {
        var all = parseInt(item.ZongChengJi);
        switch (all){
            case all >= 60:
                fColor = '#E66255';
                cColor ='#000000';
                break;
            case all < 60 && all >= 0 :
                fColor = '#E66255';
                cColor = '#000000';
                break;
            case -1:
                all = '无';
                fColor = '#BCBCBC';
                cColor = '#BCBCBC';
                break
        }
        if(parseInt(item.YiHuoXueShi) == 0){
            bgColor ='#BCBCBC'
        }else{
            bgColor ='#E66255';
            xueShi.push(item.YiHuoXueShi)
        }
        item.JieDuanChengJi?fen1='分':fen1='';
        item.ZhongJieChengJi?fen2='分':fen2='';
        str +='<li class="item">'
            +'<div class="title"> <i class="red"></i><span>'+item.KeChengMingCheng+'</span></div>'
            +'<div class="content">'
            +'<div class="left">'
            +'<div class="left_item">'
            +'<div>章节学完数:&nbsp;'+item.XueWanZhangJieShu+'/'+item.ZhangJieZongShu+'</div>'
            +'</div>'
            +'<div class="left_item">'
            +'<div>阶段性测试:</div>'
            +'<div class="active">'+item.JieDuanChengJi+'</div>'
            +'&nbsp;'+fen1
            +'</div>'
            +'<div class="left_item last_item">'
            +'<div>终结性测试:</div>'
            +'<div class="active">'+item.ZhongJieChengJi+'</div>'
            +'&nbsp;'+fen2
            +'</div>'
            +'</div>'
            +'<div class="center" style="color:'+cColor+'">'
            +'<div class="all" style="color:'+fColor+'">'+all+'</div>'
            +'总成绩'
            +'</div>'
            +'<div class="right">'
            +'<div class="radio" style="background:'+bgColor+'">'
            +'<div class="learnTime">'+item.YiHuoXueShi+'</div>'
            +'<div class="learnTime_t">学时</div>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</li>'
    });
    $('.box').html(str);
    str = null;
    $('.count').eq(0).text(data.ShuJu.length);
    $('.count').eq(1).text(xueShi.length);
    $('.count').eq(2).text(eval(xueShi.join('+')))
}