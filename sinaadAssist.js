(function (window) {
    // var clip ;
    // window.onload = function () {
    //     init();
    // }
    init();
    
    function init () {

        var adDoms = document.querySelectorAll('.sinaads') || [];
        for (var i = adDoms.length - 1; i >= 0; i--) {
            var pdps = adDoms[i].getAttribute('data-ad-pdps');
            if (pdps && _sinaadsCacheData[pdps]) {
                if (_sinaadsCacheData[pdps].type === "textlink"
                    || _sinaadsCacheData[pdps].type === "embed") {
                    adDoms[i].onmouseover = getInsMouseOverHandler();
                    adDoms[i].onmouseout = getInsMouseOutHandler();
                }
            }
        }
        ZeroClipboard.setDefaults({
            moviePath: 'http://d1.sina.com.cn/litong/zhitou/sinaads/zhitou/ZeroClipboard.swf',
            trustedOrigins: [window.location.protocol + "//" + window.location.host]
        });
        window.clip = new ZeroClipboard();
        clip.setHandCursor(true);
        // clip.glue(document.querySelectorAll('.ad_copy'));
        clip.on("complete", function(client, args) {
            var contentDom = document.createElement('span');
            contentDom.innerHTML = args.text;
            contentDom.classList.add('ad_content');
            art.dialog({
                title : '已复制到剪贴板',
                // lock : true,
                time : 1,
                width : 500,
                content : contentDom
            });
            //再次点击时，如果没有重新setText将不会弹出。下面这行代码处理的就是复制之后鼠标没有移动没有执行getMouseOverHandler中的setText
            clip.setText(args.text);
        });
        var contentDom = document.createElement('div');
        contentDom.classList.add('float_box');
        contentDom.id = 'ad_float_box';
        contentDom.innerHTML = "<div class='ad_form_group'>"
                                + "<span></span>"
                                + "<button class='ad_copy'>复制t串</button>"
                            + "</div>"
        // contentDom.innerHTML = "<div class='ad_form_group'>"
        //                         + "<label>pdps</label>"
        //                         + "<input type='text'/>"
        //                         + "<button class='ad_copy'>复制t串</button>"
        //                     + "</div>"
        //                     + "<div class='ad_form_group'>"
        //                         + "<label>monitor</label>"
        //                         + "<textarea class='ad_form_control'></textarea>"
        //                     + "</div>";
        document.body.appendChild(contentDom);
        contentDom.onmouseover = getFloatBoxMouseOverHandler();
        contentDom.onmouseout = getFloatBoxMouseOutHandler();
        clip.glue(contentDom.querySelector('.ad_copy'));
    }

    function getFloatBoxMouseOverHandler () {
        return function (event) {
            timer && clearTimeout(timer);
            // var floatBox = document.getElementById('ad_float_box');
            // floatBox.style.visibility = 'visible';
        };
    }
    function getFloatBoxMouseOutHandler () {
        return function (event) {
            // setTimeout(function () {
            if (this.contains(event.relatedTarget)) {//不是移到其它子节点
                return ;
            }
            if (event.relatedTarget && (event.relatedTarget.src || '').indexOf('ZeroClipboard.swf') !== -1) { //移到那个复制按钮上
                return ;
            }
            var floatBox = document.getElementById('ad_float_box');
            // floatBox.style.visibility = 'hidden';
            floatBox.style.left = '-999px';
            floatBox.style.top = '-999px';
            // }, 1000);
        };
    }
    /**
     * [getInsMouseOverHandler 这个函数有点长---作用是：显示浮层并填充数据，中间一片top left width height 是计算位置的。]
     * @return {[type]} [description]
     */
    function getInsMouseOverHandler () {
        var viewWidth = document.body.offsetWidth;
        return function (event) {
            timer && clearTimeout(timer);
            var pdps = this.getAttribute('data-ad-pdps');
            var data = _sinaadsCacheData[pdps];
            var monitor = _sinaadsCacheData[pdps].content[0].monitor;
            var tStr = "";
            for (var i = monitor.length - 1; i >= 0; i--) {
                if(0 === monitor[i].indexOf('http://sax.sina.com.cn/click?')) {
                    var tIndex = monitor[i].indexOf('t=');
                    tStr = monitor[i].substr(tIndex + 2);
                    break;
                }
            };
            clip.setText(tStr);
            var position = sinaadToolkit.dom.getPosition(this);
            var left = position.left;
            var top = position.top;
            var floatBoxLeft = left;
            var floatBoxTop = top - 23;
            // var adWidth = this.offsetWidth;
            // var adHeight = this.offsetHeight;
            // var floatWidth = 514;
            // var floatHeight = 264;
            // if (left > floatWidth) {//左侧有足够区域
            //     floatBoxLeft = left - floatWidth;
            //     floatBoxTop = top;
            // } else if (viewWidth - left - adWidth > floatWidth) {//右侧有足够区域
            //     floatBoxLeft = left + adWidth;
            //     floatBoxTop = top;
            // } else if (top - document.body.scrollTop > floatHeight) {//上方有足够区域
            //     floatBoxTop = top - floatHeight;
            //     floatBoxLeft = (viewWidth - floatWidth) / 2;
            // } else {
            //     floatBoxTop = top + adHeight;
            //     floatBoxLeft = (viewWidth - floatWidth) / 2;
            // }
            var floatBox = document.getElementById('ad_float_box');
            floatBox.childNodes[0].childNodes[0].innerText = pdps;
            // floatBox.childNodes[1].childNodes[1].innerText = data.content[0].monitor && data.content[0].monitor.join(' ');
            floatBox.style.left = floatBoxLeft + 'px';
            floatBox.style.top = floatBoxTop + 'px';
            // floatBox.style.visibility = 'visible';
            var a = floatBox.offsetHeight;
            // console.log(floatBox.offsetHeight); 
        };
    }
    var timer;
    function getInsMouseOutHandler () {
        return function (event) {
            if (!this.contains(event.relatedTarget)) {
                timer = setTimeout(function () {
                    var floatBox = document.getElementById('ad_float_box');
                    // floatBox.style.visibility = 'hidden';
                    floatBox.style.left = '-999px';
                    floatBox.style.top = '-999px';
                }, 500);
            }
        };
    }

    function _getReplaceAdHandler () {
        return function (event) {

        };
    }
    
})(window);