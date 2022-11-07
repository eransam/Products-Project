import { Parallax } from "react-parallax";
import { NavLink } from "react-router-dom";
import vacationPic from '../../../Assets/Images/vacation1.jpg'
import { Button } from "@material-ui/core";
import "./homeEnter.css";
import { useEffect } from "react";
import vacationService from "../../../service/VacationService";
import store from "../../../redux/Store";



function HomeEnter(): JSX.Element {
    useEffect(() => {
        try {
            if (store.getState().authState.user !== null) {
            vacationService.fetchVacotion(false)
            }
        }
         catch (error) {
            
        }
      
    }, []);

    return (


        <div >     
    <Parallax className='image' blur={0} bgImage={vacationPic} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">
                סיור באתר המוצרים הגדול בישראל
                <br />
                
                
                <Button variant="contained" ><NavLink to="/login">Login</NavLink></Button>
                <Button variant="outlined" className="Bcolor"><NavLink to="/register">register</NavLink></Button>

                </span>
            </div> 
    </Parallax>
    <div className='text-box'>
            <h3 dir="rtl">אודותינו </h3>
            <p dir="rtl">
                פירוט.

        </p>
        </div>

        <div>

        </div>

        

        </div>
        
            
        
        
    );
}

export default HomeEnter;
