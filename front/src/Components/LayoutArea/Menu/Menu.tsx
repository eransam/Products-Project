import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import store from "../../../redux/Store";
import "./Menu.css";

function Menu(): JSX.Element {
    const [user, setUser] = useState<any>("null");

    useEffect(() => {
    setUser(store.getState().authState.user);

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
        setUser(store.getState().authState.user);
      });

      return () => {
        unsubscribe();
      };
    }, []);
    
    return (
        <div className="Menu">
        
        
        <p className="borderBottum"><b>תפריט </b></p>
        <NavLink to="/vacation/new">הוספת מוצר</NavLink>
        <NavLink to="/VacationList">רשימת מוצרים</NavLink>

              
     
{/*
תגית זו היא בעצם קומפוננטה והיא מרנדרת את הפעולה מבלי ללכת לשרת ולאתחל שוב את כל 
דף האיצטיאמאל הראשי שלנו
וכך אנו יוצרים סינגל פייז טהור */}

{/*<NavLink to="/home">NavLink home</NavLink>*/}
            

        </div>
    );
}
export default Menu;
