/**
 * Native-like menu Drawer 
 * Depends on Hammer.js 
 * for smooth touch handeling
 * 
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 * 
 */

angular.module('nativeDrawer', [])
.factory('$nativeDrawer', [function(){
  // set global variables needed for proper drawer functioning
  var swipe, swipeH, body, bodyH, 
      drawer, drawerH, drawerDimm, drawerDimmH, 
      navToggle, deviceW, viewContent,
      burger, burgerTop, burgerBottom;
  var settings = {};
  //
  var nDrawer = {
    open: false,
    plusActive: false,
    holdingDrawerPosition: null,
    options: {
      maxWidth: 300,
      topBarHeight: 0,
      speed: 0.2,
      animation: 'ease-out',
      modifyViewContent: false,
      useActionButton: false,
      burger: {
        endX: 6,
        endY: 6,
        startScale: 1,
        endScale: 0.7
      }
    },
    show: function(){
      // show drawer with animation
      drawer.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
      nDrawer.translate( drawer, 0, '', 0, '', 0, '', nDrawer.maxWidth );
      // dimm background
      drawerDimm.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = '1';
      // set open state and toggle burger
      nDrawer.open = true;
      nDrawer.toggleBurger(true);
    },
    hide: function(){
      // hide drawer
      drawer.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      nDrawer.translate( drawer, nDrawer.maxWidth, '-', 0, '', 0, '' );
      // dimm background
      drawerDimm.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      drawerDimm.style.visibility = 'hidden';
      drawerDimm.style.opacity = '0';
      // toggle burger
      if( nDrawer.open ){
        nDrawer.toggleBurger(false);
      }
      // set open state
      nDrawer.open = false;
    },
    toggle: function(){
      //alert('drawer.toggle()!');
      if( nDrawer.open ){
        nDrawer.hide();
      }else{
        nDrawer.show();
      }
    },
    move: function( ev, holdingDrawer ){
      // check for direction
      nDrawer.direction = ev.type === 'panleft' ? 'left' : 'right';
      // figure out position, depending on wheter we are holding drawer itself somwhere in the middle
      // or just the edge
      var pos = ev.center.x - nDrawer.maxWidth;
      if( holdingDrawer ){
        nDrawer.holdingDrawerPosition = nDrawer.holdingDrawerPosition ? nDrawer.holdingDrawerPosition : pos;
        pos = pos + Math.abs(nDrawer.holdingDrawerPosition);
      };
      pos = pos < 0 ? pos : 0;
      // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
      var opacityModder = nDrawer.maxWidth - Math.abs(pos); 
      var opacity = ( opacityModder / (nDrawer.maxWidth/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      // animate burger menu icon
      nDrawer.animateBurger( pos );
      // dimm background
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = opacity;
      drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
      // move the drawer
      drawer.style.transition = 'none';
      nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
      nDrawer.translate( drawer, pos, '', 0, '', 0, '', nDrawer.maxWidth );
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      nDrawer.open = true;
      if( ev.isFinal ){
        if( nDrawer.direction === 'left' ){
          nDrawer.hide();
        }else{
          nDrawer.show();
        }
        nDrawer.endTrue = false;
        nDrawer.holdingDrawerPosition = null;
      }else{
        nDrawer.endTrue = true;
      }
    },
    animateBurger: function( pos ){
      var total = nDrawer.maxWidth;
      var current = total - Math.abs(pos);
      var currentPerc = Math.floor( (100/total)*current);
      if( currentPerc > 0 ){
        //
        //var currentWidth = nDrawer.options.burger.startWidth - Math.floor(((6/100)*currentPerc));
        var scale = nDrawer.options.burger.startScale - Math.abs((((1-nDrawer.options.burger.endScale)/100)*currentPerc)).toFixed(2);
        // for both lines
        var rotate = Math.floor(((45/100)*currentPerc));
        var x_pos_top = x_pos_bottom = Math.floor(((nDrawer.options.burger.endX/100)*currentPerc));
        var y_pos_top = Math.floor(((nDrawer.options.burger.endY/100)*currentPerc));
            y_pos_top = y_pos_bottom = y_pos_top < nDrawer.options.burger.endY ? y_pos_top : nDrawer.options.burger.endY;
        // Complete burger rotation
        var rotateComplete = Math.floor(((180/100)*currentPerc));
        //
        if( nDrawer.direction === 'left' && currentPerc < 100 ){
          rotateComplete = 180+(180-rotateComplete);
        }
        //
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        //
        nDrawer.translate( burger, 0, '', 0, '', rotateComplete, '', false );
        nDrawer.translate( burgerTop, 0, '', y_pos_top, '', rotate, '', '', scale );
        nDrawer.translate( burgerBottom, 0, '', y_pos_bottom, '-', rotate, '-', '', scale );
      }
    },
    translate: function(myElement, x, pmX, y, pmY, deg, pmDeg, width, scale, mozieo){
      var x = x || 0,
          y = y || 0,
          pmX = pmX || '',
          pmY = pmY || '',
          pmDeg = pmDeg || '',
          width = width || false,
          scale = scale ? 'scale3d('+scale+',1,1)' : '',
          el = myElement;
      if( el.id === 'burger-top' ){
        el.style.transformOrigin = '100% 100%';
      }else if( el.id === 'burger-bottom' ){
        el.style.transformOrigin = '100% 0%';
      }
      el.style.transform = 'translate3d('+pmX+x+'px, '+pmY+y+'px, 0) rotate3d( 0, 0, 1, '+pmDeg+deg+'deg ) ' + scale;
      el.style.webkitTransform = 'translate('+pmX+x+'px, '+pmY+y+'px) translateZ(0) rotate('+pmDeg+deg+'deg) ' + scale;
      if( width ) el.style.width = width+'px';
      // only for mozzila, opera and IE
      if( mozieo ) el.style.msTransform = el.style.MozTransform = el.style.OTransform = 'translateX('+pmX+x+'px) translateY('+pmY+y+'px) rotate('+pmDeg+deg+'deg)';
    },
    toggleBurger: function( toggle ){
      // set transitions length for animation
      burger.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      burgerTop.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      burgerBottom.style.transition = 'all '+nDrawer.options.speed+'s '+nDrawer.options.animation;
      //
      if(toggle){
        // ON
        nDrawer.translate( burgerTop, 0, '', nDrawer.options.burger.endY, '', 45, '', '', nDrawer.options.burger.endScale );
        nDrawer.translate( burgerBottom, 0, '', nDrawer.options.burger.endY, '-', 45, '-', '', nDrawer.options.burger.endScale );
        nDrawer.translate( burger, 0, '', 0, '-', 180, '' );
      }else{
        // OFF
        nDrawer.translate( burgerTop, 0, '', 0, '', 0, '', '', nDrawer.options.burger.startScale );
        nDrawer.translate( burgerBottom, 0, '', 0, '', 0, '', '', nDrawer.options.burger.startScale );
        nDrawer.translate( burger, 0, '', 0, '-', 360, '' );
      
      }
      // reset burger state after the animation is done
      var timeout = nDrawer.options.speed*1000;
      setTimeout( function(){
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        if(!toggle){
          nDrawer.translate( burger, 0, '', 0, '-', 0, '' );
        }
      }, timeout );
    },
    // Fired on touch end event
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      element.addEventListener('touchend', function(e){
        // get the touch reference
        // reference first touch point for this event
        var touchobj = e.changedTouches[0] 
        // if the drawer is pulled more than 50% of its maxWidth
        var isBigger = touchobj.clientX > (nDrawer.maxWidth/2);
        // combined with the direction
        var isLeft = nDrawer.direction === 'left';
        var isRight = nDrawer.direction === 'right';
        var endTrue = nDrawer.endTrue;
        // decide if show or hide the drawer
        if( endTrue ){
          if( (isBigger && isLeft) || (isBigger && isRight) ){
            nDrawer.show();
          }else if( (!isBigger && isLeft) || (!isBigger && isRight) ){
            nDrawer.hide();
          }
        }
        // clean up our temp variables
        nDrawer.direction = false;
        nDrawer.endTrue = false;
        nDrawer.holdingDrawerPosition = null;
        e.preventDefault()
      }, false)
    },// Initialize the drawer
    init: function( config ){
      // get options passed from initialization and merge them with default ones
      var options = nDrawer.merge_options(nDrawer.options, config);
      nDrawer.options = options;
      // get references to all needed elements on page
      console.log( 'init drawer' );
        swipe = document.getElementById('swipe-stripe');
        swipeH = new Hammer(swipe);
        body = document.getElementById('cont');
        bodyH = new Hammer(body);
        drawer = document.getElementById( 'drawer' );
        drawerH = new Hammer(drawer);
        drawerDimm = document.getElementById( 'drawer-dimm' );
        drawerDimmH = new Hammer(drawerDimm);
        // burger elements
        burger = document.getElementById( 'burger' );
        burgerTop = document.getElementById( 'burger-top' );
        burgerBottom = document.getElementById( 'burger-bottom' );
      // get device width and height for proper scaling of drawer
      deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // modify view-content,
      // used only when the drawer is set to have offset from top (so the topbar remains visible)
      if( nDrawer.options.modifyViewContent ){
        viewContent = document.getElementById( 'view-content' );
        viewContent.style.position = 'absolute';
        viewContent.style.width = deviceW+'px';
        viewContent.style.height = deviceH-nDrawer.options.topBarHeight+'px';
        viewContent.style.top = nDrawer.options.topBarHeight+'px';
      }
      // set initial styles (position and size)
      nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
      nDrawer.translate( drawer, nDrawer.maxWidth, '-', 0, '', '0', '', nDrawer.maxWidth );
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
      window.onresize = function(event) {
        deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if( nDrawer.options.modifyViewContent ){
          viewContent.style.position = 'absolute';
          viewContent.style.width = deviceW+'px';
          viewContent.style.height = deviceH-nDrawer.options.topBarHeight+'px';
        }
        nDrawer.maxWidth = nDrawer.options.maxWidth > deviceW-56 ? deviceW-56 : nDrawer.options.maxWidth;
        drawer.style.width = nDrawer.maxWidth+'px';
        if( !nDrawer.open ){
          nDrawer.translate( drawer, nDrawer.maxWidth, '-', 0, '', '0', '', '' );
        }
      }
      // listen for pan events on elements
      drawerH.on("panleft panright", function( ev ){
        if( nDrawer.open ) nDrawer.move( ev, true );
      });
      drawerDimmH.on("panleft panright", function(ev) {
        if( nDrawer.open ) nDrawer.move( ev );
      });
      swipeH.on("panright panleft", function(ev) {
        nDrawer.move( ev );
      });
      // register touch end listeners
      nDrawer.touchEnd( swipe );
      nDrawer.touchEnd( drawer );
      nDrawer.touchEnd( drawerDimm );
    },// Toggle plus action icon
    togglePlus: function( hide ){
      // action button
      // used only if enabled in setting when initializing
      if( nDrawer.options.useActionButton ){
        var add_panel = document.getElementById('add-panel-switch');
        var drawer_overlay = document.getElementById('drawer-dimm');
        if( !nDrawer.plusActive && !hide ){
          nDrawer.plusActive = true;
          add_panel.classList.add('active');
          drawer_overlay.style.visibility = 'visible';
          drawer_overlay.style.opacity = '1';
        }else{
          if( !nDrawer.open ){
            drawer_overlay.style.visibility = 'hidden';
            drawer_overlay.style.opacity = '0';
          } 
          nDrawer.plusActive = false;
          add_panel.classList.remove('active');
        }
      }
    },
    merge_options: function(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
  };
  return nDrawer; 
}]);