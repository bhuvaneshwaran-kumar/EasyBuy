import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import './homeStyles/Slider.css'


function Slider() {
    let slides = useRef([])

    let slideIndex = 0;
    

    function plusSlides(n) {
    showSlides(slideIndex += n);
    
    }


    function showSlides(n) {
        if (n > 2){
            n = 0
            slideIndex = 0 
        } 
        if(n < 0){
            n = 2
            slideIndex = 2 
        } 
        for(let i=0;i<3;i++){
            slides.current[i].style.display="none"
        }
        slides.current[n].style.display="block"
 
    }

    useEffect(() => {
        for(let i=1;i<3;i++){
            slides.current[i].style.display="none"
        }
        let timer = setInterval(()=>{
            plusSlides(1);
        },3000)
        return ()=>clearInterval(timer)
    }, [])
   

    return (
    <>    
        
        <div className="slideshow-container" >

        {
            [0,0,0].map((elm,index)=>(
                
                <div key={index} ref = {(ref)=>slides.current.push(ref)} className="mySlides fade">
                    <div className="numbertext">{index+1} / 3</div>
                    <img src={`/slider/${index+1}.png`} style={{width : '100%'}}alt="this is the slider"/>
                </div>
            ))
        }
            <>
            
                <p className="prev" onClick={()=>plusSlides(-1)}>&#10094;</p>
                <p className="next" onClick={()=>plusSlides(1)}>&#10095;</p>

            </>
        
        </div>
        
        <br/>
      


        
        
    </>
    )
}

export default Slider
