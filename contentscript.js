/**
 * contentscript
 * 真正能够操作页面DOM的脚本程序。在每个页面的独立环境执行
 * 该脚本监听background的指示。负责往页面插入、移除相应js/css文件。
 * 因为代码片段不利管理，采用整个文件的方式。
 * @author fedeoo <zhangfei1[at]staff.sina.com.cn>
 * @version 1.0
 */

/**
 * [接收消息并执行对应操作]
 * @param  {[type]} request      [消息请求正文]
 * @param  {[type]} sender       [description]
 * @param  {[type]} sendResponse [description]
 */
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "system") {
        var cmd = request.cmd;
        if (cmd === 'complete') {
            addStyleFile(chrome.extension.getURL("aero.css"));
            addStyleFile(chrome.extension.getURL("sinaadAssist.css"));
            var js_arr = [chrome.extension.getURL("artDialog.js"), "http://fedeoo.github.io/accumulation/res/ZeroClipboard.min.js",
                chrome.extension.getURL("sinaadAssist.js")];
            // addStyleFile("http://d1.sina.com.cn/litong/zhitou/sinaads/zhitou/sinaadAssist.css");
            // var js_arr = [chrome.extension.getURL("artDialog.js"), "http://d1.sina.com.cn/litong/zhitou/sinaads/zhitou/ZeroClipboard.min.js",
            //     "http://d1.sina.com.cn/litong/zhitou/sinaads/zhitou/sinaadAssist.js"];
            var callback = function () {
                var url = js_arr.shift();
                if (url) { 
                    addJsFile(url, callback);  
                }
            };
            addJsFile(js_arr.shift(), callback);
            addBgmask();
        }
        else if (cmd === 'highlight'){
            if (!document.getElementById('bgmask')) {
                addBgmask();
            }
            var bgmask = document.getElementById('bgmask');
            bgmask.style.display = "";
            highlightAd();
        } else if (cmd === 'cancelHighlight') {
            var bgmask = document.getElementById('bgmask');
            if (bgmask) {
                bgmask.style.display = 'none';
                cancleHighlightAd();
            }
        }
    }
    
});

function addBgmask() {
    var bgmask = document.createElement("div");  
    bgmask.setAttribute("id", "bgmask");  
    bgmask.style.background = "#000";  
    bgmask.style.width = "100%";  
    bgmask.style.height = "20000px";  
    bgmask.style.position = "absolute";  
    bgmask.style.top = "0";  
    bgmask.style.left = "0";  
    bgmask.style.zIndex = "50";  
    bgmask.style.opacity = "0.5"; 
    bgmask.style.display = "none";
    document.body.appendChild(bgmask); 
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 27) {//esc
            var bgmask = document.getElementById('bgmask');
            bgmask.style.display = 'none';
            cancleHighlightAd();
        }
    });
    var style = document.createElement('style');
    style.innerHTML = ".ad_highlight {"
        + "position: relative;"
        + "display: block;"
        + "overflow: hidden;"
        + "background: white;"
        + "z-index: 51;"
    + "}";
    document.body.appendChild(style);
}

function highlightAd() {
    var adDoms = document.querySelectorAll('.sinaads') || [];
    for (var i = adDoms.length - 1; i >= 0; i--) {
        var aDom = adDoms[i];
        aDom.classList.add('ad_highlight');
    }
}

function cancleHighlightAd() {
    var adDoms = document.querySelectorAll('.sinaads') || [];
    for (var i = adDoms.length - 1; i >= 0; i--) {
        var aDom = adDoms[i];
        aDom.classList.remove('ad_highlight');
    }
}


/**
 * [addJsFile 在页面插入JS文件]
 * @param {[String]} fileName [文件名称，包括全部路径]
 */
function addJsFile (fileName, onload) {
    if (document.head.querySelector('script[src="' + fileName + '"]')) {
        return ;
    }
    var script = document.createElement("script"); 
    script.type = "text/javascript"; 
    script.charset = "utf-8";
    script.src = fileName; 
    script.onload = onload;
    script.defer = true;
    (document.head || document.documentElement).appendChild(script); 
}
/**
 * [removeJsFile 在页面移除已插入的JS文件]
 * @param  {[type]} fileName [文件名称，包括全部路径]
 */
function removeJsFile (fileName) {
    var script = document.head.querySelector('script[src="' + fileName + '"]');
    if (script) {
        script.remove();
    }
}
/**
 * [addStyleFile 在页面插入css文件，当然也可以是网络资源，如果是扩展资源需要在清单中配置]
 * @param {[String]} fileName [文件名称，包括全部路径]
 */
function addStyleFile (fileName) {
    if (document.head.querySelector('link[href="' + fileName + '"]')) {
        return ;
    }
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = fileName;
    (document.head || document.documentElement).appendChild(style);
}

/**
 * [removeStyleFile 在页面移除之前添加的css文件]
 * @param  {[String]} fileName [文件名称，包括全部路径]
 */
function removeStyleFile (fileName) {
    var style = document.head.querySelector('link[href="' + fileName + '"]');
    if (style) {
        style.remove();
    }
}
