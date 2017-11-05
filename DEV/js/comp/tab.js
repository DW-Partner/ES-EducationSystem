/**
 * Copyright (c) 
 * @fileoverview tab
 * @author  weijialu
 * @version 1.1 | 2017-09-26
 * @param
 * @example
 */
    let tab = (param) => {
        let options = {
            nav: '.tab_nav',//
            nav_on_class: 'on'
            content: '.tab_item',//
            show_index:0,
            event: 'click'
        };
        options = $.extend( options, param );
        $( options.nav ).eq( options.show_index ).addClass( options.nav_on_class );
        $( options.content ).hide().eq( options.show_index ).show();
        $(document).on(options.event, options.nav, ()=>{
            const index = $( options.nav ).index( this );
            $( this ).addClass( options.nav_on_class ).siblings( options.nav ).removeClass( options.nav_on_class );
            $( options.content ).eq( index ).show().siblings( options.content ).hide();
        });
        return {
            distory: ()=>{
                $(document).off( options.event, options.nav );
            }
        }
    }
    export default tab;
