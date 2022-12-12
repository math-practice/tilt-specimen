/* ------------------------------------------------------------
  Mouse control > variable axes
------------------------------------------------------------ */

let w = window.innerWidth;
var h = window.innerHeight;
var maxRotation = 45;
var minRotation = -45;
var hrot, vrot, transformW, transformH;


$(".sign").mousemove(function(event){
  var x = event.pageX - $(this).offset().left;
  var y = event.pageY - $(this).offset().top;
  var w = $(this).width();
  var h = $(this).height();
  hrot = (x / w * maxRotation * 2 - maxRotation) * -1;
  vrot = (y / h * maxRotation * 2 - maxRotation) * -1;
  transformW = (100 - Math.abs(hrot)) / 100;
  transformH = (100 - Math.abs(vrot)) / 100;
  // console.log (hrot + ", " + vrot);
  $(this).find(".inner p").css({
    fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
    // lineHeight: 105 * transformH + "%"
  });

  $(this).find(".reactive").css({
    width: 100-Math.abs(hrot) + "%",
    // height: 100-Math.abs(vrot) + "%",
  })

  $(this).find(".arc p span").each(function(){
    // rotation angle of this letter
    var r = getRotationDegrees($(this));
    // console.log($(this).attr('class') + ":" + r);
    // console.log ("x: " + x + " y: " + y + " HROT: " + hrot + " VROT: " + vrot);

    //r * pi / 180 to return sine wave, then shift the r 90 degrees to get the wave to start from 1 (not 0)
    //https://docs.google.com/spreadsheets/d/1L3u8t-3eQaisRTdMZ-T2UWpbDCKLc8AIePK4wCZYsFE/edit#gid=0

    var sinShift = Math.sin( r * Math.PI / 180);
    var sin = Math.sin( (r + 90) % 360 * Math.PI / 180);

    //calc initial rotations
    var newHrot = sin * hrot + sinShift * vrot;
    var newVrot = sin * vrot + sinShift * hrot;

    if ($(this).attr('class') == 'arc-1') {
      console.log ("HROT: " + hrot + " VROT: " + vrot + " NEW HROT:" + newHrot);
    }

    //hrot to look at vrot, vice versa
    // newHrot = newHrot + 45 - newVrot;
    // newVrot = newVrot + 45 - newHrot;

    $(this).css({
      fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
    });
    // fontVariationSettings: "'HROT' " + hrot + ", 'VROT' " + vrot,
  });


  //if box
  svgTransform($(this).find(".box"), 33); //width in vw;
  // svgTransform($(this).find(".bowery"), 40); //width in vw;
});

$(".sign").mouseleave(function(event){
  $(this).find(".inner p, .arc p").css({
    fontVariationSettings: "'HROT' 0, 'VROT' 0",
    width: "",
    height: ""
  });
  $(this).find(".reactive").css({
    width: "100%",
    // height: "100%"
  });

});

function svgTransform(svg, svgWidth){
  if (svg.length) {
    svg.css ({
      width: svgWidth * transformW + "vw"
    });
  }
  // console.log ("[" + svgWidth + ", " + svgHeight + "] " + transformW + ", " + transformH);
}

function getRotationDegrees(obj) {
  //https://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery
  var matrix = obj.css("-webkit-transform") ||
  obj.css("-moz-transform")    ||
  obj.css("-ms-transform")     ||
  obj.css("-o-transform")      ||
  obj.css("transform");
  if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } else { var angle = 0; }
  return (angle < 0) ? angle + 360 : angle;
}

/* ------------------------------------------------------------
  Other stuff
------------------------------------------------------------ */
$('.open-glyphs-table').click(function(event){
  event.preventDefault();
  $(this).closest('section').next(".glyphs-table").slideToggle();
});




// 2022 ----------------------------------------


document.querySelectorAll('.tester').forEach((tester) => {

  console.log(tester);

  tester.querySelector('.vrot input').addEventListener('input',updateParam.bind({prop:'v-rot'}));
  tester.querySelector('.hrot input').addEventListener('input',updateParam.bind({prop:'h-rot'}));

  let hovered=false;
  let animationActive=false;
  let mousePos={x:0,y:0};
  let current={x:60,y:119};
  let exactTrack=false;

  // $.on( "mouseenter mouseleave", handlerInOut );

  tester.addEventListener('mouseenter',startHoverAnimate);

  tester.addEventListener('mouseleave',function(){
    hovered=false;
    exactTrack=false;
  })

  function startHoverAnimate(){
    if(!animationActive){
      window.requestAnimationFrame(moveIbeam);
      animationActive=true;
    }
    hovered=true;
  }

  tester.addEventListener('mousemove',function(){
    if(!event.target.classList.contains('slider')){
      startHoverAnimate();
    } else{
      hovered=false;
      exactTrack=false;
    }
    mousePos={
      x:event.pageX,
      y:event.pageY-tester.offsetTop
    };
  })

  function updateParam(event){
    tester.style.setProperty('--'+this.prop,event.srcElement.value);
  }

  let ibeam=tester.querySelector('.moving');


  function moveIbeam(){
    const incr=30;
    const target=hovered?mousePos:{x:60,y:119};
    const delta={
      x:target.x - current.x,
      y:target.y - current.y
    };

    if(!exactTrack){
      const angle=Math.atan(delta.y/delta.x);
      const shift={
        x:Math.cos(angle) * incr,
        y:Math.sin(angle) * incr
      }

      if(Math.sign(delta.x)!==Math.sign(shift.x)) shift.x *=-1;
      if(Math.sign(delta.y)!==Math.sign(shift.y)) shift.y *=-1;

      current.x+=Math.abs(delta.x)>Math.abs(shift.x)?shift.x:delta.x;
      current.y+=Math.abs(delta.y)>Math.abs(shift.y)?shift.y:delta.y;
    }else{
      current.x=mousePos.x;
      current.y=mousePos.y;
    }


    ibeam.style.left=current.x+'px';
    ibeam.style.top=current.y+'px';

    if((delta.x==0)&&(delta.y==0)&&hovered){
      exactTrack=true;
    }

    if(!hovered&&(delta.x==0)&&(delta.y==0)){
      animationActive=false;
    }else{
      window.requestAnimationFrame(moveIbeam);
    }


  }


  function frameToTarget(targetX,targetY){
    const currentX=ibeam.style.left;
    const currentY=ibeam.style.top;
    ibeam.style.left=currentX + (targetX>currentX?1:-1)+'px';
    ibeam.style.top=currentY + (targetY>currentY?1:-1)+'px';
  }

});




document.querySelectorAll('.scroller').forEach((section) => {
  let str=section.innerText;
  section.innerText='';
  let scrolled=0;

  let letters=[]
  for(let i=0; i<str.length; i++){
    let letter=document.createElement('span');
    letter.innerText=str[i];
    letters.push(letter);
    section.appendChild(letter);
  }

  function setLetters(mouse){
    for(let letter of letters){
      const left=letter.offsetLeft + letter.offsetWidth/2;
      const rot=mouse!==undefined?Math.round((mouse - left + scrolled) / Math.min(w,1300) * 90):0;
      letter.style.fontVariationSettings=`"HROT" ${rot}, "VROT" var(--vrot)`;
    }
  }
  section.addEventListener('scroll',function(){
    scrolled=section.scrollLeft;
  })

  section.addEventListener('mousemove',function(){
    setLetters(event.clientX);
    //mobile issue: 120 is half the height of the scroller on desktop
    section.style.setProperty('--vrot',((event.pageY - section.offsetTop) - 120)/240 * 10);
  })

  section.addEventListener('mouseleave',function(){
    setLetters();
  })

});

function setPageWidth(){
  w=window.innerWidth;
}

window.addEventListener('resize',setPageWidth)
window.addEventListener('load',setPageWidth)
