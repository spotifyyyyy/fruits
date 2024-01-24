!function(){
    var touchStartLocation = {
        x: null,
        y: null
    };
    
    var touchStartScrollTop = 0 ;
    var touchStartTime = null;
    var currentPageId = 'first-page';
    var nextPageId = null;

    var inMiddle = false;

    var pages = ['first-page','second-page','address-page', 'contact-page'];

    document.body.style.height = '100%';
    document.body.style.width = '100%'

    var preImagesDownloaded = 0;

    var logoImage = document.createElement('img');
    var computerImage = document.createElement('img');

    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    // console.log(isOpera);
    // console.log(isSafari);

    logoImage.addEventListener('load', imageLoaded);
    computerImage.addEventListener('load', imageLoaded);

    logoImage.setAttribute('src', '/images/logo.png');
    computerImage.setAttribute('src', '/images/lap3.png');
    

    // document.querySelectorAll('body > div > div:not(#anima-overlay):not(#pre-load)').forEach((element)=>{
    //     element.addEventListener('touchstart', handleTouchStart);
    //     element.addEventListener('touchmove', handleTouchMove);
    //     element.addEventListener('touchend', handleTouchEnd);
    // });

    // document.querySelectorAll('body > div > div:not(#pre-load)').forEach((element)=>{
    //     element.addEventListener('touchstart', handleTouchStart);
    //     element.addEventListener('touchmove', handleTouchMove);
    //     element.addEventListener('touchend', handleTouchEnd);
    // });

    document.querySelector('#anima-overlay').addEventListener('touchmove',(event)=>{
        event.preventDefault();
    });

    // if(window.matchMedia('(pointer: fine)').matches){
        document.querySelectorAll('#nav-buttons button').forEach((buttonElm)=>{
            buttonElm.addEventListener('click', (event)=>{
                console.log(event.currentTarget.getAttribute('data-target'));
                document.querySelector(`#${event.currentTarget.getAttribute('data-target')}`).scrollIntoView();
            })
            
            
        })
    // }

    

    

    document.querySelector('#anima-overlay div.gradient').addEventListener('transitionend', overlayTransitioned);

    document.querySelector('#tagline-container h4').addEventListener('transitionend', afterTaglineTransitioned)

    // document.querySelector('#second-sec-overlay').addEventListener('transitionend', afterRoadShown);

    document.querySelectorAll('button.btn-option[data-target]').forEach((element)=>{
        
        element.addEventListener('click', navClicked)
    });

    function handleTouchStart(event){
        
        touchStartLocation.x = event.changedTouches[0].pageX;
        touchStartLocation.y = event.changedTouches[0].pageY;
        touchStartScrollTop = event.currentTarget.scrollTop;
        
        touchStartTime = Date.now();
    };

    function handleTouchMove(event){
        if(event.touches.length > 1){
            
            touchStartLocation = {
              x: null,
              y: null
            };
            touchStartTime = null;
            return;
        }
        if(event.currentTarget.scrollHeight > event.currentTarget.clientHeight ){
            if(event.changedTouches[0].pageY < touchStartLocation.y){
                
                if((Math.abs(event.currentTarget.scrollHeight) - Math.abs(event.currentTarget.clientHeight)) === Math.abs(touchStartScrollTop)){
                    event.preventDefault();
                }
            }else{
                
                if(touchStartScrollTop === 0){
                    event.preventDefault();
                }
            }
        }else{
            
                event.preventDefault();
        }

        
    };

    function isAllowed(event){
        if(event.target.tagName.toLowerCase() === 'button' || event.target.closest('button') ||
            event.target.tagName.toLowerCase() === 'a' || event.target.closest('a') ){
            return true;
        }
        return false;
    }

    function handleTouchEnd(event){
        

        
        if(touchStartLocation.x === null){
            return;
        }

        if(event.currentTarget.scrollHeight > event.currentTarget.clientHeight ){
            if(event.changedTouches[0].pageY < touchStartLocation.y){
                
                if((Math.abs(event.currentTarget.scrollHeight) - Math.abs(event.currentTarget.clientHeight)) === Math.abs(touchStartScrollTop)){
                    if(!isAllowed){
                        event.preventDefault();
                    }
                    
                    
                }
            }else{
                
                if(touchStartScrollTop === 0){
                    if(!isAllowed){
                        event.preventDefault();
                    }
                    
                }
            }
        }else{
            
            if(!isAllowed){
                event.preventDefault();
            }
        }
        
        
        if( event.changedTouches[0].pageY > touchStartLocation.y && (event.changedTouches[0].pageY - touchStartLocation.y) / (Date.now() - touchStartTime) > 0.3){
            
            if(pages.indexOf(currentPageId) === 0 ){
                return;
            }
            if(touchStartScrollTop != 0 && event.currentTarget.id != 'anima-overlay'){
                return;
            }


            
            nextPageId = pages[pages.indexOf(currentPageId) -1]
            currentPageId = nextPageId;
            initiateFirstTransition();
            
        };
        
        
        if( event.changedTouches[0].pageY < touchStartLocation.y && -(event.changedTouches[0].pageY - touchStartLocation.y) / (Date.now() - touchStartTime) > 0.3){
            
            
            
            if(((event.currentTarget.scrollHeight > event.currentTarget.clientHeight + getBrowserOffset()) && (Math.abs(event.currentTarget.scrollHeight) - Math.abs(event.currentTarget.clientHeight)) > Math.abs(touchStartScrollTop) + 5 ) && event.currentTarget.id != 'anima-overlay'){
                
                return;
            }

            
            if(pages.indexOf(currentPageId) === pages.length -1){
                nextPageId = pages[1];
            }else{
                nextPageId = pages[pages.indexOf(currentPageId) +1] ;
            }
            currentPageId = nextPageId;
            // console.log(currentPageId);
            // console.log(nextPageId);
            initiateFirstTransition();
        }
    };

    function getBrowserOffset(){
        if(isSafari || isOpera){
            return 10;
        }
        return 0;
    }

    

    function overlayTransitioned(){
        if(document.querySelector('#anima-overlay div.gradient').classList.contains('first-transition')){
            
            document.querySelector('#anima-overlay div.gradient').classList.remove('first-transition');
            for(let id of pages){
                if(id != nextPageId){
                    document.querySelector(`#${id}`).style.top = '100%';
                }
            }
            
            document.querySelector(`#${nextPageId}`).style.top = '0';
            initiateSecondTransition();
        }else{
            document.querySelector('#anima-overlay').style.top = '100%';
            // currentPageId = nextPageId;
            inMiddle = false;
        }
    };

    function initiateFirstTransition(){
        // currentPageId = nextPageId;
        // if(document.querySelector('#anima-overlay div.gradient').classList.contains('first-transition') || inMiddle){
        //     return;
        // }
        // inMiddle = true;

        // for(let page of pages){

        // }

        document.querySelector('#anima-overlay').style.top = '0';

        document.querySelector('#anima-overlay div.gradient').classList.add('first-transition');
        
        document.querySelector('#anima-overlay div.gradient').style.boxShadow = 'inset 10px 10px 5px 65vh #FF9933'
        document.querySelectorAll('#anima-overlay  div.spiral').forEach((element, i)=>{
            // element.style.transform = `rotate(${540 + (i *180)}deg) translate3d(0, 0, 0) skewY(35deg)`;
            element.style.transform = `rotate(720deg) translate3d(0, 0, 0) skewY(35deg)`;
        });

    };

    function initiateSecondTransition(){
        
        document.querySelector('#anima-overlay div.gradient').style.boxShadow = 'inset 10px 10px 5px 1px #FF9933'
        document.querySelectorAll('#anima-overlay  div.spiral').forEach((element, index)=>{
            element.style.transform = `rotate(${(index * 90)}deg) translate3d(0, calc(-65vh - 2.5rem), 0) skewY(35deg)`;
        });
    }

    function navClicked(event){
        
        nextPageId = event.currentTarget.getAttribute('data-target');
        
        initiateFirstTransition();
    }

    function imageLoaded(){
        preImagesDownloaded++;
        if(preImagesDownloaded === 2){
            setTimeout(() => {
                document.querySelector('#pre-load').style.top = '100%';
                document.querySelector('#tagline-container img').style.opacity = 1;
                
                setTimeout(() => {
                    
                    document.querySelector('#tagline-container h4').style.opacity = '1';
                    

                }, 500);
            }, 100);
        }
    }

    function afterTaglineTransitioned(){
        // document.querySelector('#second-sec-overlay').style.top = '60vh';
        document.querySelector('#warranty-container img').style.visibility = 'visible';
        document.querySelector('#warranty-container img').style.opacity = 1;
        document.querySelector('#second-sec > div:nth-child(2)').style.visibility = 'visible';
        document.querySelector('#second-sec > div:nth-child(2)').style.top = '2rem';
        document.querySelector('#second-sec > div:nth-child(2)').style.opacity = 1;
    }

    function afterRoadShown(){
        // document.querySelector('#second-sec svg').style.opacity = 0.6;
        // document.querySelector('#second-sec > div:nth-child(2)').style.visibility = 'visible';
        // document.querySelector('#second-sec > div:nth-child(2)').style.top = '2rem';
        // document.querySelector('#second-sec > div:nth-child(2)').style.opacity = 1;
    }


}();