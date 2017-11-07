/**
 * Copyright (c) 2011 - 2015,social-touch Inc. All rights reserved.
 * @fileoverview social-touch  template模板替换函数
 * @author  weijialu | @social-touch.com
 * @version 1.0 | 2015-10-15
 * @param
 * @example
 */
    var replaceTemplate = function(tpl, json) {
        var html = tpl.replace(/\{([^\{|^\}]+)\}/ig, function($0, $1) {
            if ($0 && $1) {
                return json[$1] || json[$1] === 0 ? json[$1] : '';
            }
        });
        return html;
    }
    export default replaceTemplate;