var strHref = window.location;
var urlReg =/XiaoXiLieBiao/i;
var obj = {
   xt:GetQueryString('xt'),
   wybs:GetQueryString('wybs'),
   zdsbm:GetQueryString('zdsbm'),
   sqm:GetQueryString('sqm'),
   xxid:GetQueryString('xxid')
};
var url = null;
if (urlReg.test(strHref)) {
    url =strU + "/XiaoXiNeiRong.ashx"
} else {
    url =strU +  "/GongGaoNeiRong.ashx"
}
$.ajax({
    url: url,
    type: 'get',
    data: obj,
    dataType: 'json',
    success: function (data) {
        if (data.Ret < 0) {
            $('#load').css('textAlign','center').html(data.ErrInfo);
             return
        }
        $('#load').hide();
        $('.headTitle').html(data.ShuJu[0].BiaoTi);
        $('.title').css('color', data.ShuJu[0].BiaoTiYanSe).html(data.ShuJu[0].BiaoTi);
        $('.time').html(data.ShuJu[0].FaBuRiQi);
        // $('.count').html(data.ShuJu[0].FangWenShu);
        $('.text_box').html(data.ShuJu[0].NeiRong)
    },
    error:function (xhr,type,error) {
        $('#load').css('textAlign','center').html(error);
    }
});

