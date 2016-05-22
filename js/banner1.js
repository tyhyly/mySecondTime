var banner = document.getElementById("banner");
var bannerTipWrap = document.getElementById("bannerTipWrap"),
    bannerInner = document.getElementById("bannerInner"),
    bannerTip = document.getElementById("bannerTip");
var divList = bannerInner.getElementsByTagName("div"),
    imgList = bannerInner.getElementsByTagName("img"),
    oLis = bannerTip.getElementsByTagName("li");
var jsonData = null;
~function () {
    var xhr = new XMLHttpRequest;
    xhr.open("get", "json/banner.txt?_=" + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            jsonData = utils.formatJSON(xhr.responseText);
        }
    };
    xhr.send(null);
}();
//2、数据绑定
~function () {
    var str = "", str2 = "";
    if (jsonData) {
        for (var i = 0, len = jsonData.length; i < len; i++) {
            var curData = jsonData[i];
            str += "<a href='" + curData["href"] + "' target='_blank'><div><img src='' trueImg='" + curData["img"] + "'/></div></a>";
            i === 0 ? str2 += "<li class='bg'><a href='" + curData["href"] + "' target='_blank'>" + curData["desc"] + "</a></li>" : str2 += "<li><a href='" + curData["href"] + "' target='_blank'>" + curData["desc"] + "</a></li>";
        }
    }
    bannerInner.innerHTML = str;
    bannerTip.innerHTML = str2;
}();
//3、图片的延迟加载
window.setTimeout(lazyImg, 300);
function lazyImg() {
    for (var i = 0, len = imgList.length; i < len; i++) {
        ~function (i) {
            var curImg = imgList[i];
            var oImg = new Image;
            oImg.src = curImg.getAttribute("trueImg");
            oImg.onload = function () {
                curImg.src = this.src;
                curImg.style.display = "block";
                //->只对第一张做处理:z-index=1 opacity=1
                if (i === 0) {
                    var curDiv = curImg.parentNode;
                    curDiv.style.zIndex = 1;
                    zhufengAnimate(curDiv, {opacity: 1}, 200);
                }
                oImg = null;
            }
        }(i);
    }
}
//4、实现我们的自动轮播
var interval = 3000, autoTimer = null, step = 0;//->记录当前展示图片的索引
autoTimer = window.setInterval(autoMove, interval);
function autoMove() {
    if (step === (jsonData.length - 1)) {
        step = -1;
    }
    step++;
    setBanner();
}
//->实现轮播图切换效果的代码:
function setBanner() {
    //->实现轮播图切换效果
    for (var i = 0, len = divList.length; i < len; i++) {
        var curDiv = divList[i];
        if (i === step) {
            utils.css(curDiv, "zIndex", 1);
            zhufengAnimate(curDiv, {opacity: 1}, 200, function () {
                var curDivSib = utils.siblings(this);
                for (var k = 0, len = curDivSib.length; k < len; k++) {
                    utils.css(curDivSib[k], "opacity", 0);
                }
            });
            continue;
        }
        utils.css(curDiv, "zIndex", 0);
    }

    //->实现焦点对齐
    for (i = 0, len = oLis.length; i < len; i++) {
        var curLi = oLis[i];
        i === step ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
    }
}
//5、实现鼠标悬停停止自动轮播和离开在开启自动轮播的效果
banner.onmouseover = function () {
    window.clearInterval(autoTimer);
};
banner.onmouseout = function () {
    autoTimer = window.setInterval(autoMove, interval);
};
//6、实现点击焦点切换
~function () {
    for (var i = 0, len = oLis.length; i < len; i++) {
        var curLi = oLis[i];
        curLi.index = i;
        curLi.onmouseenter = function () {
            step = this.index;
            setBanner();
        }
    }
}();
