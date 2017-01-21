var board=new Array();
var score=0;

var startX=0;
var startY=0;
var endX=0;
var endY=0;


var hasconflicted=new Array();
$(document).ready(function(){
      prepareForMobile();
      newgame();


});


//移动端尺寸设置；

function  prepareForMobile(){

	if(documentWidth>500){
         gridContainterWidth=500;
         cellSpance=20;
         cellLength=100;



	}
	$('#grid-containter').css('width',gridContainterWidth-2*cellSpance);
	$('#grid-containter').css('height',gridContainterWidth-2*cellSpance);
	$('#grid-containter').css('padding',cellSpance);
	$('#grid-containter').css('border-radius',0.02*gridContainterWidth);

	$('.grid-cell').css('width',cellLength);
	$('.grid-cell').css('height',cellLength);
	$('.grid-cell').css('border-radius',0.02*cellLength);


}


function newgame(){
     //初始化棋盘格
     init();

     //随机生存数字
	generateOneNumber();
	generateOneNumber();
}

function init(){

	for(var i=0;i<4;i++) 
		for(var j=0;j<4;j++){

			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
    for(var i=0;i<4;i++){

        board[i]=new Array();
        hasconflicted[i]=new Array();

        for(var j=0;j<4;j++){
          board[i][j]=0;
          hasconflicted[i][j]=false;
       }
    }
    updateBoardView();
}

//根据数据更新棋盘页面
function updateBoardView(){

	$(".number-cell").remove();
    for(var i=0;i<4;i++) {
		for(var j=0;j<4;j++){
			$("#grid-containter").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
			var theNumberCell=$('#number-cell-'+i+'-'+j);

			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSpance/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSpance/2);

			}
			else{
                theNumberCell.css('width',cellLength+'px');
				theNumberCell.css('height',cellLength+'px');
                theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));

				theNumberCell.text(board[i][j]);
			}
            hasconflicted[i][j]=false;
           theNumberCell.css('line-height',cellLength+'px');
           theNumberCell.css('font-size',0.6*cellLength+'px');  
          // theNumberCell.css('border-radius',0.02*cellLength+'px'); 
		}
	}
}


 function generateOneNumber(){

 	if( nospace(board))
 		return false;
   //随机一个位置
    var randx=parseInt(Math.floor( Math.random()*4));
    var randy=parseInt(Math.floor( Math.random()*4));

    var times=0
    while(times<50){
    	              if(board[randx][randy]==0){
    		          break;
    		          }
        
                  else{

    	              randx=parseInt(Math.floor( Math.random()*4));
    	              randy=parseInt(Math.floor( Math.random()*4));
    	              times++;
    	             }
                   }
    if(times==50){
      for(var i=0;i<4;i++)
       for (var j = 0; j<4; j++) {
    	  if(board[i][j]==0){
    		 randx=i;
    		 randy=j;			
    	  }		 	
      }
    }
   //随机一个数字
    var randomNumber=Math.random()<0.5? 2:4;
   //在随机的位置里显示随机数字
   board[randx][randy]=randomNumber;
   showNumberWithAnimation(randx,randy,randomNumber);

 	return true;
 }

 $(document).keydown(function(event) {
 	switch(event.keyCode){
        case 37: //left
           event.preventDefault();
           if( moveLeft() ){
             setTimeout("generateOneNumber()",210);
             setTimeout("isgameover()",300);
           }
           break;
        case 38:
        event.preventDefault();
            if(moveUp()){
             setTimeout("generateOneNumber()",210);
             setTimeout("isgameover()",300);
           }
           break;

        case 39:
        event.preventDefault();
           if(moveRight()){
             setTimeout("generateOneNumber()",210);
             setTimeout("isgameover()",300);
           }
           break;

        case 40:
        event.preventDefault();
           if(moveDown()){
             setTimeout("generateOneNumber()",210);
             setTimeout("isgameover()",300);
           }
           break;
        default:
           break;

 	}

 });

//移动端触摸事件监听
document.addEventListener('touchstart',function(){

    startX=event.touches[0].pageX;
    startY=event.touches[0].pageY;
});


//发现移动端问题后新添加的  
//（当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。）
document.addEventListener('touchmove',function(){
  
  event.preventDefault();  

});

document.addEventListener('touchend',function(){
     endX=event.changedTouches[0].pageX;
     endY=event.changedTouches[0].pageY;
	 var deltax=endX-startX;
	 var deltay=endY-startY;
     if(Math.abs(deltax)<0.2*documentWidth&&Math.abs(deltay)<0.2*documentWidth){
     	return;
     }
	 //x
	 if(Math.abs(deltax)>=Math.abs(deltay)){

	 	if(deltax>0){
	 		if(moveRight()){
             setTimeout("generateOneNumber()",210);
             setTimeout("isgameover()",300);
           }
       }
         else{
            if( moveLeft() ){
              setTimeout("generateOneNumber()",210);
              setTimeout("isgameover()",300);
             }
          } 
       

	 }
	 //y
	 else{

           if(deltay>0){
           	  if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
              }
         }
         else{
              if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
             }
         }
	 }
});

 function moveLeft(){
   if(!canMoveLeft(board)){
   	  return false;
   }
   else{
        
      for (var i=0;i<4;i++){
      	 for(var j=1;j<4;j++){
            if(board[i][j]!=0){
              for(var k=0;k<j;k++){
              	if(board[i][k]==0&&noBlockHorizon(i,k,j,board)){
              		//move
              		 showMove(i,j,i,k)
                     board[i][k]=board[i][j];
                     board[i][j]=0; 
              		continue;
              	}
              	else if(board[i][k]==board[i][j]&&noBlockHorizon(i,k,j,board)&& !hasconflicted[i][k]){
                    //move
                    showMove(i,j,i,k)
                    board[i][k]+=board[i][j];
                    board[i][j]=0; 

                    hasconflicted[i][k]=true;
              		continue;
              	}
              }
            }
      	 }
      }
   }
   setTimeout("updateBoardView()",200);

  return true;

 }


 function moveRight(){
   if(!canMoveRight(board)){
   	  return false;
   }
   else{
        
      for (var i=0;i<4;i++){
      	 for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
              for(var k=3;k>j;k--){
              	if(board[i][k]==0&&noBlockHorizon(i,j,k,board)){
              		//move
              		showMove(i,j,i,k)
                     board[i][k]=board[i][j];
                     board[i][j]=0; 
              		continue;
              	}
              	else if(board[i][k]==board[i][j]&&noBlockHorizon(i,j,k,board)&& !hasconflicted[i][k]){
                    //move
                    showMove(i,j,i,k)
                    board[i][k]+=board[i][j];
                    board[i][j]=0; 
                    hasconflicted[i][k]=true;
              		continue;
              	}
              }
            }
      	 }
      }
   }
   setTimeout("updateBoardView()",200);
  return true;

 }




 function moveUp(){
   if(!canMoveUp(board)){
   	  return false;
   }
   else{
        
      for (var j=0;j<4;j++){
      	 for(var i=1;i<4;i++){
            if(board[i][j]!=0){
              for(var k=0;k<i;k++){
              	if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
              		//move
              		showMove(i,j,k,j)
                     board[k][j]=board[i][j];
                     board[i][j]=0; 
              		continue;
              	}
              	else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&& !hasconflicted[k][j]){
                    //move
                    showMove(i,j,k,j)
                    board[k][j]+=board[i][j];
                    board[i][j]=0; 
                    hasconflicted[k][j]=true;
              		continue;
              	}
              }
            }
      	 }
      }
   }
   setTimeout("updateBoardView()",200);
  return true;

 }

function moveDown(){
   if(!canMoveDown(board)){
   	  return false;
   }
   else{
        
      for (var j=0;j<4;j++){
      	 for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
              for(var k=3;k>i;k--){
              	if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
              		//move
              		showMove(i,j,k,j)
                     board[k][j]=board[i][j];
                     board[i][j]=0; 
              		continue;
              	}
              	else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&& !hasconflicted[k][j]){
                    //move
                    showMove(i,j,k,j)
                    board[k][j]+=board[i][j];
                    board[i][j]=0; 
                    hasconflicted[k][j]=true;
              		continue;
              	}
              }
            }
      	 }
      }
   }
   setTimeout("updateBoardView()",200);
  return true;

 }


 function isgameover(){

 	if(nospace(board)&&nomove(board)){
       alert("game over");
 	}

 }