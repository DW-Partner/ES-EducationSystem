/**
 * Copyright (c) 2011 - 2015,social-touch Inc. All rights reserved.
 * @fileoverview social-touch  json自动分页插件
 * @author  weijialu | @social-touch.com
 * @version 1.0 | 2015-09-21
 * @param
 * @example
 */
    let jsonPage = function( param ){
        let options = {
            listBox: 'ul.body',//列表容器
            pageBox: '.page p',//分页容器
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
            eachDataHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
            eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
            noData: false,//Function : function( $listBox, $pageBox ){}
            codeKeyName: 'code',//状态标示key名
            codeSuccess: 0,//状态标示值
            successRunBefore: false,//function(data,pageNum, pageSize, $listBox, $pageBox) { return msg }
            successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {},//function(msg) {  }
            ajaxCodeError: function( msg ){},
            ajaxError: false,//function(XMLHttpRequest, textStatus, errorThrown, text) {}
            gotoIndex: 1 
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
        options.run = function( num, _pageSize ){
            if( _pageSize ){
                this.pageSize = _pageSize;
            }
            var pageSize = this.pageSize;
            this.ajaxData[ this.pageKeyName ] = num - 1;
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
                    if( options.successRunBefore ){
                        var msg = options.successRunBefore( msg, num, pageSize, $( options.listBox ), $( options.pageBox ) ) || msg;
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
                        list[i]._page = num-1;
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
                    if( options.pageBar ){
                        //构建分页start
                        var totalHtml = '<strong>共<em>' + total + '</em>条数据</strong>',
                            pageLength = msg.data.page_num || Math.ceil( +total / pageSize ) || 0,
                            prevHtml = '',
                            startHtml = '',
                            ellipsisLeft = '',
                            pageHtml = '',
                            ellipsisRight = '',
                            endHtml = '',
                            nextHtml = '';
                        var prevVar = '<a href="javascript:;" data-page="' + (num-1) + '" class="prev"></a>',
                            startVar = '<a href="javascript:;" data-page="1">1</a>',
                            ellipsisVar = '<span>…</span>',
                            endVar = '<a href="javascript:;" data-page="' + pageLength + '">' + pageLength + '</a>',
                            nextVar = '<a href="javascript:;" data-page="' + (num+1) + '" class="next"></a>';
                        if(!pageLength){
                            if( options.noData ){
                                options.noData( $( options.listBox ), $( options.pageBox ) );
                            } else{
                                //$( options.pageBox ).html( totalHtml );
                            }
                            return;
                        }
                        if(pageLength==1){
                            $( options.pageBox ).html( '' );
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
                        //构建分页end

                        pageHtml = prevHtml + startHtml + ellipsisLeft + pageHtml + ellipsisRight + endHtml + nextHtml;
                        $( options.pageBox ).html( pageHtml );
                    }
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
        options.run( +options.gotoIndex || 1 );
        if( !options.pageBar ){
            return false;
        }
        //事件绑定start
        var pageElement = '[data-page]';
        $( options.pageBox ).off('click', pageElement).on('click', pageElement, function(){
            var pageNum = $( this ).attr( 'data-page' );
            options.run( +pageNum );
        });
        //事件绑定end
    };
    export default jsonPage;
