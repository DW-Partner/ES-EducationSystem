/**
 * Copyright (c) 2011 - 2015,social-touch Inc. All rights reserved.
 * @fileoverview social-touch  json自动分页插件
 * @author  weijialu | @social-touch.com
 * @version 1.0 | 2015-09-21
 * @param
 * @example
 */
    var jsonPage = function( param ){
        var options = {
            listBox: '#listBox',//列表容器
            pageBox: '#pageBox',//分页容器
            ajaxUrl: '',
            ajaxType: 'get',
            ajaxDataType: 'json',
            jsonpCallback:'',
            ajaxData: {},//上行参数
            template: '',//列表模板
            pageSize: 10,//值——上行请求-页面容量值
            pageSizeKeyName: 'pageSize',//key名——上行使用: pageSizeKeyName  
            pageKeyName: 'page',//key名——上行使用: pageKeyName:num
            listKey: ['data','list'],//下行结构
            totalKey: ['data','total'],//下行结构
            pageBar: true,//是否启用分页
            showTotal: true,//是否显示总条数
            selectPageSize: true,//是否启用下拉选择每页数量
            selectPageSizeList: [10,20,30,50],
            jump: true,//是否执行跳转分页
            hashPage: true,
            eachDataHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
            eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
            noData: false,//Function : function( $listBox, $pageBox ){}
            codeKeyName: 'code',//状态标示key名
            codeSuccess: 0,//状态标示值
            successRunBefor: false,//function(data,pageNum, pageSize, $listBox, $pageBox) { return msg }
            successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {},//function(msg) {  }
            ajaxCodeError: function( msg ){},
            ajaxError: false//function(XMLHttpRequest, textStatus, errorThrown, text) {}
        };
        options = $.extend(options, param);
        options.replaceTemplate = function(tpl, json) {
                var html = tpl.replace(/\{([^\{|^\}]+)\}/ig, function($0, $1) {
                    if ($0 && $1) {
                        return json[$1] || json[$1] === 0 ? json[$1] : '';
                    }
                });
                return html;
            },
        options.run = function( num, pageSize ){
            if( pageSize ){
                this.pageSize = pageSize;
            }
            var pageSize = this.pageSize;
            this.ajaxData[ this.pageKeyName ] = num;
            this.ajaxData[ this.pageSizeKeyName ] = pageSize;
            $.ajax({
                type: this.ajaxType,
                url: this.ajaxUrl,
                dataType: this.ajaxDataType,
                jsonpCallback: this.jsonpCallback,
                data: this.ajaxData,
                success: function(msg) {
                    if( msg[ options.codeKeyName ] != options.codeSuccess ){
                        options.ajaxCodeError(msg);
                        return;
                    }
                    if( options.successRunBefor ){
                        var msg = options.successRunBefor( msg, num, pageSize, $( options.listBox ), $( options.pageBox ) ) || msg;
                    };
                    var list = msg;
                    for( var k in options.listKey  ){
                        var key = options.listKey[ k ];
                        list = list[ key ];
                    }
                    var total = msg;
                    for( var k in options.totalKey  ){
                        var key = options.totalKey[ k ];
                        total = total[ key ];
                    }
                    var listHtml = '';
                    for( var i in list ){
                        if( options.eachDataHandle ){
                            list[ i ] = options.eachDataHandle( list[ i ], num, pageSize );
                        }
                        if( options.eachTemplateHandle ){
                            var template = options.eachTemplateHandle( list[ i ], num, pageSize );
                            options.template = template;
                        }
                        listHtml += options.replaceTemplate( options.template, list[ i ] );
                    }
                    $( options.listBox ).html( listHtml );
                    if( !options.pageBar ){
                        return false;
                    }
                    //构建分页start
                    var totalHtml = '<strong>共<em>' + total + '</em>条数据</strong>',
                        selectHtml = '',
                        pageLength = Math.ceil( +total / pageSize ),
                        prevHtml = '',
                        startHtml = '',
                        ellipsisLeft = '',
                        pageHtml = '',
                        ellipsisRight = '',
                        endHtml = '',
                        nextHtml = '',
                        jumpHtml = '';
                    var prevVar = '<a href="javascript:;" data-page="' + (num-1) + '" class="prev"></a>',
                        startVar = '<a href="javascript:;" data-page="1">1</a>',
                        ellipsisVar = '<span>…</span>',
                        endVar = '<a href="javascript:;" data-page="' + pageLength + '">' + pageLength + '</a>',
                        nextVar = '<a href="javascript:;" data-page="' + (num+1) + '" class="next"></a>';
                    if(!pageLength){
                        if( options.noData ){
                            options.noData( $( options.listBox ), $( options.pageBox ) );
                        } else{
                            $( options.pageBox ).addClass( 'content-page' ).html( totalHtml );
                        }
                        return;
                    }
                    if( pageLength <= 5 ){
                        prevHtml = prevVar;
                        nextHtml = nextVar;
                        var startNum = 1,
                            endNum = pageLength;
                    }else{
                        if( num <= 3 ){
                            prevHtml = prevVar;
                            ellipsisRight = ellipsisVar;
                            endHtml = endVar;
                            nextHtml = nextVar;
                            var startNum = 1,
                                endNum = 4;
                        }else if( num >= (pageLength-2) ){
                            prevHtml = prevVar;
                            startHtml = startVar;
                            ellipsisLeft = ellipsisVar;
                            nextHtml = nextVar;
                            var startNum = pageLength - 3,
                                endNum = pageLength;
                        }else{
                            prevHtml = prevVar;
                            startHtml = startVar;
                            ellipsisLeft = ellipsisVar;
                            ellipsisRight = ellipsisVar;  
                            endHtml = endVar;
                            nextHtml = nextVar;
                            var startNum = num - 1,
                                endNum = num + 1;
                        }
                    };
                    num == 1 ? prevHtml = '' : '';
                    num == pageLength ? nextHtml = '' : '';
                    for (var x = startNum; x <= endNum; x++) {
                        if( x == num ){
                            pageHtml += '<a class="on" href="javascript:;">' + x + '</a>';
                        }else{
                            pageHtml += '<a href="javascript:;" data-page="' + x + '">' + x + '</a>';                                    
                        }
                    };
                    totalHtml = options.showTotal ? totalHtml : '';
                    $( options.pageBox ).addClass( 'sui-page' );
                    //构建分页end
                    //下拉分页start
                    if( options.selectPageSize ){
                        var li = '';
                        for( var i in options.selectPageSizeList ){
                            li = '<li data-pagesize="' + options.selectPageSizeList[ i ] + '">' + options.selectPageSizeList[ i ] + '</li>' + li;
                        }
                        selectHtml = '<div class="selectPageSize">\
                            <span>每页</span>\
                            <div class="slect" select-ajax="pageSize">\
                                <span class="pageSize">' + pageSize + '</span>\
                                <ul class="options">'
                                +li+
                                '</ul>\
                            </div>\
                            <span>条</span>\
                        </div>';
                    };
                    //下拉分页end
                    //跳转分页start
                    if( options.jump ){
                        jumpHtml = '<div class="jump">\
                            <span>跳转到</span>\
                            <input type="text" value="" class="pageNumText" data-pagelength="' + pageLength + '" />\
                            <span>页</span>\
                            <a href="javascript:;" class="goPage">go</a>\
                            </div>';
                    }
                    //跳转分页end
                    pageHtml = totalHtml + selectHtml + '<div class="pageNumList">' + prevHtml + startHtml + ellipsisLeft + pageHtml + ellipsisRight + endHtml + nextHtml + '</div>' + jumpHtml;
                    $( options.pageBox ).html( pageHtml );
                    options.successRunAfter( msg, num, pageSize, $( options.listBox ), $( options.pageBox ) );//回调函数：数据、当前页、页面容量
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var text;
                    if( textStatus == 'timeout' ){
                        text = '链接超时，请刷新页面或稍后重试';
                    }else if( textStatus == null ){
                        text = '链接错误，请刷新页面或稍后重试';
                    }else{
                        text = '网络错误，请刷新页面或稍后重试';                    
                    }
                    if( options.ajaxError ){
                        options.ajaxError(XMLHttpRequest, textStatus, errorThrown, text);
                    }else{
                        alert( text );
                    }
                }
            });
        }
        var goPageNum = options.hashPage ? +window.location.hash.split( '#pageon=' )[ 1 ] : 1; 
        options.run( goPageNum || 1 );
        if( !options.pageBar ){
            return false;
        }
        //事件绑定start
        var pageElement = '[data-page]',
            selectElement = '[select-ajax=pageSize]',
            selectPageSizeElement = '[data-pagesize]';
        $( options.pageBox ).off('click', pageElement).on('click', pageElement, function(){
            var pageNum = $( this ).attr( 'data-page' );
            options.run( +pageNum );
            //window.location.hash = 'pageon=' + pageNum;
        }).off('click', selectElement).on('click', selectElement, function( event ){
            var event = event ? event : window.event;
            var dom = {
                runDom: $( this ),
                showDom: $( this ).find( 'ul' )
            };
            if( dom.showDom.css('display') == 'none' ){
                $( '[pageshowstatus = true]' ).click();
                dom.showDom.slideDown( function(){
                    dom.runDom.attr( 'pageshowstatus', 'true' );
                }).attr( 'selsctautoHide', 'mark' );
            }else{
                dom.showDom.slideUp( function(){
                    dom.runDom.attr( 'pageshowstatus', 'false' );
                }).attr( 'selsctautoHide', 'mark' );
            }
            if (event.stopPropagation){ 
                event.stopPropagation(); 
            }else {
                event.cancelBubble = true;
            }
        }).off('click', selectPageSizeElement).on('click', selectPageSizeElement, function(){
            var pageSize = + $( this ).attr( 'data-pagesize' );
            options.run( 1, pageSize );
            //window.location.hash = 'pageon=1';
        }).off('blur', '.pageNumText').on('blur', '.pageNumText', function(){
            var pageNum = parseInt( $( this ).val() ),
                pageLength = +$( this ).data( 'pagelength' );
            if( !pageNum || pageNum < 1 ){
                $( this ).val( '' );
                return;
            }else if( pageNum > pageLength ){
                pageNum = pageLength
            }
            $( this ).val( pageNum );
            options.run( pageNum );
        }).off('keydown', '.pageNumText').on('keydown', '.pageNumText', function(event){
            var event = event ? event : window.event;
            if ( event.keyCode == 13) {
                $( this ).blur();
            }
        });
        // .on('click', '.goPage', function(){
        //     var input = $( this ).siblings( 'input' ),
        //         pageNum = parseInt( input.val() ),
        //         pageLength = +input.data( 'pagelength' );
        //     if( !pageNum || pageNum < 1 ){
        //         input.val( '' );
        //         return;
        //     }else if( pageNum > pageLength ){
        //         pageNum = pageLength
        //     }
        //     input.val( pageNum );
        //     options.run( pageNum );
        // });
        //事件绑定end
    };
    // $('body').on('click', function(){ 
    //     $( '[pageshowstatus = true]' ).click();
    // }).on('click', '[selsctautoHide]', function(event){
    //     var event = event ? event : window.event;
    //     if (event.stopPropagation){
    //         event.stopPropagation(); 
    //     }
    //     else {
    //         event.cancelBubble = true; 
    //     }
    // });
    export default jsonPage;
