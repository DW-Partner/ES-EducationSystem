/**
 * Copyright (c) 2011 - 2016,social-touch Inc. All rights reserved.
 * @fileoverview social-touch  dialog整合插件
 * @author  weijialu | @social-touch.com
 * @version 2.0 | 2016-03-24
 * @param
 * @example
 */
//    $.dialogFull = {
    let $dialogFull = {
        Pop: function(param) {
            var options = {
                    boxClass: '.DomPopClass',
                    title: '提示',//弹框标题
                    content: '',//弹框内容区
                    confirm: true,//是否显示“确定/取消”按钮，及只显示alert确定按钮
                    width: 'auto',
                    height: 'auto',
                    cover: true,//是否启用背景遮罩
                    coverClose: false,//其否启用点击遮罩关闭弹框
                    clear: true,//是否清楚之前弹框
                    cacheId: false, //开启必须使用唯一标示！！！
                    showCallback: function($thisBox, $contentBox){},
                    ajaxUrl: false,
                    ajaxType: 'get',
                    ajaxDataType: 'json',
                    jsonpCallback:'',
                    ajaxData: '',//ajax参数
                    ajaxSuccess: function(msg, $thisBox, $contentBox) {},
                    ajaxError: function(XMLHttpRequest, textStatus, errorThrown) {},
                    doneBtnText:'确定',
                    runDone: function($this, $thisBox, dialogClose) {},
                    closeBtnText:'取消',
                    runClose: function($this, $thisBox) {}
                },
                options = $.extend(options, param);

            //cache缓存隐藏dom start
            if (options.cacheId && $( '[cache = ' + options.cacheId + ']' ).length) {
                var dialogMainId = '#' + $( '[cache = ' + options.cacheId + ']' ).attr( 'id' ),
                    dialogCoverId = dialogMainId.replace( 'dialogMain', 'dialogCover' );
                $(dialogCoverId).show();
                $(dialogMainId).show();
                return;
            }
            //cache缓存隐藏dom end

            var main = '<div class="head"><a href="JavaScript:;" class="dialogFullClose">×</a></div><div class="content"></div>',
                doneBtn = options.doneBtnText ? '<a href="JavaScript:;" class="btn-Blue dialogFullDone">' + options.doneBtnText + '</a>' : '',
                closeBtn = options.closeBtnText ? '<a href="JavaScript:;" class="btn-Grey dialogFullClose">' + options.closeBtnText + '</a>' : '',
                confirm = '<div class="btn-confirm">'
                    + doneBtn + closeBtn +
                    '</div>',
                time = (new Date()).getTime(),
                dialogMainId = '#dialogMain' + time,
                dialogCoverId = '#dialogCover' + time;

            if( options.confirm == 'alert' ){
                confirm = '<div class="btn-confirm">\
                    <a href="JavaScript:;" class="btn-Blue dialogFullClose">确定</a>\
                    </div>';
            }
            var $dom = $('<div />').addClass('dialogPopBox').attr( 'id', dialogMainId.substring(1) ).addClass(options.boxClass.substring(1));
            $dom.append(main).find('.head').append(options.title);
            $dom.find('.content').append(options.content);
            options.confirm ? $dom.append(confirm) : '';
            if( options.cacheId && !options.ajaxUrl ){
                $dom.attr( 'cache', options.cacheId );
            };
            $dom.css({
                height: options.height,
                width: options.width
            });
            if( options.clear ){
                $( '.dialogFullClose' ).click();
                //this.offEvent();
            };
            if (options.cover) {
                var $coverDom = $('<div />').addClass('bodyCover').attr('id', dialogCoverId.substring(1));
                $('body').append($coverDom);
            }
            $('body').append($dom);

            options.showCallback( $( dialogMainId ), $contentBox );//show回调
            var dialogFullCloseDom = dialogMainId + ' .dialogFullClose',
                dialogFullDoneDom = dialogMainId + ' .dialogFullDone',
                $contentBox = $(dialogMainId).find('.content');
            var dialogClose = function(delCache){
                if( !options.cacheId || delCache ) {
                    $(dialogMainId).remove();
                    $(dialogCoverId).remove();
                    $(document).off( 'click', dialogFullCloseDom ).off( 'click', dialogFullDoneDom ).off( 'click', dialogCoverId );
                }else {
                    $(dialogMainId).hide();
                    $(dialogCoverId).hide();
                }
            };
            $(document).on('click', dialogFullCloseDom, function() {
                dialogClose();
                options.runClose( $( this ), $( dialogMainId ) );
            });
            //底部确定/取消按钮，点击时回调函数start
            if (options.confirm) {
                $(document).on('click', dialogFullDoneDom, function() {
                    options.runDone($(this), $( dialogMainId ), dialogClose);
                });
            }
            //底部确定/取消按钮，点击时回调函数end

            //点击遮罩关闭弹框 start
            if (options.coverClose) {
                $(document).on('click', dialogCoverId, function() {
                    $( dialogFullCloseDom ).click();
                });
            }
            //点击遮罩关闭弹框 end

            //ajax start
            if (options.ajaxUrl) {
                $.ajax({
                    type: options.ajaxType,
                    url: options.ajaxUrl,
                    dataType: options.ajaxDataType,
                    jsonpCallback: options.jsonpCallback,
                    data: options.ajaxData,
                    success: function(msg) {
                        options.ajaxSuccess(msg, $( dialogMainId ), $contentBox);
                        if( options.cacheId && msg.code == 0  ){
                             $(dialogMainId).attr( 'cache', options.cacheId );
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        options.ajaxError(XMLHttpRequest, textStatus, errorThrown)
                    }
                });
            }
            //ajax end
        },
        Tips: function(param) {
            var options = {
                    box: '.DomTipsClass',
                    text: '消息提示',
                    status: true,//error/false||success/true||warning||
                    setTime: 5000
                },
                options = $.extend(options, param);
            if( typeof param == 'string' || typeof param == 'number' ){
                options.text = param;
            }
            var $dom = $('<div />').addClass( 'dialogTipsBox' ).addClass(options.box.substring(1)).html(options.text);
            $( '.dialogTipsBox' ).remove();
            $('body').append($dom);
            if( options.status === true || options.status === 'success' ){
                $(options.box).slideDown(200);
            }else if( !options.status || options.status === 'error' ) {
                $(options.box).addClass('error').slideDown(200);
            }else if ( options.status === 'warning' ) {
                $(options.box).addClass('tip-warning').slideDown(200);
            }else{
                $(options.box).slideDown(200);                
            }
            if (options.setTime) {
                setTimeout(function() {
                    $( '.dialogTipsBox' ).slideUp(200, function() {
                        $( '.sdialogTipsBox' ).remove();
                    })
                }, options.setTime);
            }
        },
        Alert: function(param) {
            var options = {
                width: 400,
                clear: false,
                confirm: 'alert',
                runDone: function($this, $thisBox, handClose) { handClose(); }
            };
            if (typeof param == 'string' || typeof param == 'number') {
                options.content = param;
            } else {
                options = $.extend(options, param);
            }
            this.Pop(options);
        },
        offEvent: function(){}
    }
    //美化dialog end
    export default $dialogFull;