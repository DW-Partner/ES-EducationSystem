/**
 * Copyright (c) 2011 - 2015,social-touch Inc. All rights reserved.
 * @fileoverview social-touch  美化select
 * @author  weijialu | @social-touch.com
 * @version 1.1 | 2015-09-26
 * @param
 * @example
 */
    var AutoHide = false;
    var selectSim = function( param ){
        var options = {
            element: '.select',//必须为class类名
            reset: true,//重置value为select第一个选项
            changeCallback:false,//function(checkedValue,checkedText){},
            callbackFun:false//function
        };
        options = $.extend(options, param);
        var $Dom = $( options.element );
        $Dom.hide();
        var random = Math.random();
        for( var i = 0; i < $Dom.length; i++ ){
            var thisSelect = $Dom.eq( i ),
                option = thisSelect.find( 'option' ),
                $html = $( '<div />' ).attr( 'class', 'selectSim' ).append( '<p />' ).append( '<ul />' );
                $html.find( 'p' ).attr( 'select', 'run-'+random ).append( '<span />' ).append( '<em>' );
            for( var k = 0; k < option.length; k++ ){
                var text = option.eq( k ).text(),
                    value = option.eq( k ).val(),
                    $li = $('<li />');
                $li.text( text ).data( 'selectoption', value ).attr( 'select', 'check-'+random );
                $html.find( 'ul' ).hide().append( $li );
            }
            if( options.reset ){
                thisSelect.val( option.eq( 0 ).val() );
                $html.find( 'span' ).text( option.eq( 0 ).text() );
            }else{
                $html.find( 'span' ).text( thisSelect.find("option:selected").text() );
            }
            thisSelect.removeClass( options.element.substr(1) ).addClass( options.element.substr(1) + 'Ready' ).after( $html );
        }
        $( document ).on('click', '[select=run-' + random + ']', function( e ){
            var dom = {
                runDom: $( this ),
                showDom: $( this ).siblings( 'ul' )
            };
            if( dom.showDom.css('display') == 'none' ){
                $( '[showStatus = true]' ).click();
                dom.showDom.slideDown( function(){
                    dom.runDom.attr( 'showStatus', 'true' );
                });
            }else{
                dom.showDom.slideUp( function(){
                    dom.runDom.attr( 'showStatus', 'false' );
                });
            }
            if(e.stopPropagation){
                e.stopPropagation();
            }else {
                e.cancelBubble = true;
            }
        }).on('click', '[select=check-' + random + ']', function(){
            var self = $(this),
                checkedValue = self.data( 'selectoption' ),
                checkedText = self.text(),
                $select = self.parent().parent().prev( 'select' );
            $select.val( checkedValue );
            options.changeCallback && options.changeCallback(checkedValue,checkedText);
//          $select.trigger('change');//change事件由select额外绑定，此处为激发调用事件
            $( this ).parent().prev( 'p' ).find( 'span' ).text( checkedText );
        });
        options.callbackFun && options.callbackFun($Dom);
        if( !AutoHide ){
            $(document).on('click', function(){ 
                $( '[showStatus = true]' ).click();
            });
            AutoHide = true;
        }
    }

    export default selectSim;
