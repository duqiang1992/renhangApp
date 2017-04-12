var strU = 'http://192.168.100.7:7107/JieKou';
function GetQueryString(str) {
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(location), tmp;
    if (tmp = rs) {
        return decodeURIComponent(tmp[2]);
    }
    //该参数不存在
    return null;
}
