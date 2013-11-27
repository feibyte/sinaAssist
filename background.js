/**
 * background
 * 该文件是后台处理程序，对页签新建、更新绑定处理。初始加载处理。
 * @author fedeoo <tragedymi[at]163.com>
 * @version 1.0
 */

(function () {
    function reloadContentScript () {
        chrome.tabs.query({}, function (tabs) { 
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.executeScript(tabs[i].id, { file: "contentscript.js" }, function () {
                });
            }
        });
    }
    function _getTabUpdateHandler(tabId, changeInfo, tab) {
        if (changeInfo.status === "complete" && /sina.com/.test(tab.url)) {
            chrome.tabs.sendMessage(tabId, {type: 'system', cmd: 'complete'}, function (response) {
            });
        }
    }
    reloadContentScript();
    chrome.tabs.onUpdated.addListener(_getTabUpdateHandler);
    var contextMuenuId = chrome.contextMenus.create({
        title : "高亮广告位",
        contexts : ["page"],
        // parentId : 0,
        checked : false,
        documentUrlPatterns : ["http://*.sina.com.cn/*", "https://*.sina.com.cn/*"],
        onclick : function (info, tab) {
            chrome.tabs.sendMessage(tab.id, {type: 'system', cmd: 'highlight'});
        }
    });
})();