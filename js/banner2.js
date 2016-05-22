(function () {
    var smallBanner=document.getElementById("smallBanner"),
        smallBannerInner=document.getElementById("smallBannerInner"),
        divList=smallBannerInner.getElementsByTagName("div"),
        imgList=smallBannerInner.getElementsByTagName("img"),
        bannerLeft=smallBannerInner.getElementsByTagName("a")[0],
        bannerRight=smallBannerInner.getElementsByTagName("a")[1];

    var jsonData=null,count=null;
    ~function () {
        var xhr=new XMLHttpRequest;
        xhr.open("get","json/smallBanner.txt",false);
        xhr.onreadystatechange= function () {
            if(xhr.readyState===4&&/^2\d{2}$/.test(xhr.status)){
                jsonData=utils.formatJSON(xhr.responseText);
            }
        };
        xhr.send(null);
    }();
    //2、数据绑定
    ~function () {
        var str = "";
        if (jsonData) {
            for (var i = 0, len = jsonData.length; i < len; i++) {
                var curData = jsonData[i];
                str += "<a href='" + curData["href"] + "' target='_blank'><div><img src='' trueImg='" + curData["img"] + "'/></div></a>";
            }
        }
        smallBannerInner.innerHTML = str;
        count = jsonData.length + 1;
        utils.css(smallBannerInner, "width", count * 380);
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
    //4、实现自动轮播
    //->记录的是步长(当前是哪一张图片,零是第一张图片)
    var step = 0, interval = 1000, autoTimer = null;
    smallBannerInner.autoTimer = window.setInterval(function () {
        autoMove();
    }, interval);
    function autoMove() {
        step++;
        if (step <= 0) {
            step = count-1;
            utils.css(smallBannerInner, "left", -step * 380);
        }
        zhufengAnimate(smallBannerInner, {left: -step * 380}, 5);
        if(step>=2){
            step=0;
            utils.css(smallBannerInner, "left", 0);
            zhufengAnimate(smallBannerInner, {left: -step * 380}, 5);
        }

    }
    //function move(){
    //    zhufengAnimate(smallBannerInner,{left: 0},8);
    //}




})();

