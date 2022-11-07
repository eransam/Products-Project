import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../redux/Store";
import notify from "../../../service/NotifyService";
import VacationService from "../../../service/VacationService";
import "./UpdateVacation.css";

function UpdateVacation(): JSX.Element {
    const [user, setUser] = useState<any>(store.getState().authState.user);


    const params = useParams();
    const id = +params.id;
    var imgName:string = "";

    const navigate = useNavigate();

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();

    useEffect(() => {
        //updataVacation זה בעצם מה שיוצג כערכים ראשוניים בתיבות הטקסט  בקובץ ה 
        //בדומה לפלייס הולדר
        VacationService.getOneVacotion(id)
            .then(vacation => {
                imgName = vacation.imageName;
                setValue("Name", vacation.Name);
                setValue("Description", vacation.Description);
                setValue("CreationDate", vacation.CreationDate);
                setValue("Price", vacation.Price);
                //setValue("imageName", vacation.imageName);                
                
                const unsubscribe = store.subscribe(() => {
                    setUser(store.getState().authState.user);
                  });
            
                  return () => {
                    unsubscribe();
                  };
                

            })
            .catch(err => notify.error(err));
    }, []);


    async function submit(vacation: VacationModel) {
        try {
            console.log("imageName",vacation.imageName);            
            vacation.vacationId = id;

            console.log("vacation in update vacation: " ,vacation);
            
            const updatedVacation =  await VacationService.updateVacotion(vacation);
            console.log("updatedVacation" + updatedVacation);
            

            notify.success("vacation updated.");

            // Navigate back to all products: 
            navigate("/VacationList");
            
        }
        catch (err: any) {
            notify.error(err);
        }
    }
    console.log("user123: " , user );
    

    return (<>
        {user.role === "admin" ?
        (
        <div className="UpdateVacation Box">

            <form onSubmit={handleSubmit(submit)}>

                <h2>Update vacation</h2>

                <label>Name: </label>
                <input type="text" {...register("Name", {
                    required: { value: true, message: "Missing description" }
                })} />
                <span>{formState.errors.Name?.message}</span>


                <label>Description: </label>
                <input type="text" {...register("Description", {
                    required: { value: true, message: "Missing Description" }
                })} />
                <span>{formState.errors.Description?.message}</span>



                <label>CreationDate: </label>
                <input type="string"  {...register("CreationDate", {
                    required: { value: true, message: "Missing CreationDate" },
                })} />
                <span>{formState.errors.CreationDate?.message}</span>





                <label>Price: </label>
                <input type="number" {...register("Price", {
                    required: { value: true, message: "Missing Price" },
                    min: { value: 0, message: "Stock can't be negative" },
                    max: { value: 1000, message: "Stock can't exceed 1000" },
                })} />
                <span>{formState.errors.Price?.message}</span>

                <label>Image: </label>
                <input type="file" accept="image/*" {...register("image")} />

                <button>Update</button>
                <button onClick={() => navigate(-1)}>Back</button>


            </form>

        </div>
        
    )
    :
    (
        notify.error("Sorry you do not have permission to access this page")
    )
     
            }
    </>)
}



export default UpdateVacation;
