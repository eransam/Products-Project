import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import notify from "../../../service/NotifyService";
import VacationService from "../../../service/VacationService";
import config from "../../../utils/Config";
import "./AddVacation.css";

function AddVacation(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<VacationModel>();

    const navigate = useNavigate();

    async function submit(vacation: VacationModel) {
        try {
            console.log("vacation: " ,vacation)
            await VacationService.addNewVacation(vacation);
            
            // notify.success("vacation has been added!");

            
            navigate("/VacationList");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation Box">

            <form onSubmit={handleSubmit(submit)}>

                <h2>Add vacation</h2>

                <label>Name: </label>
                <input type="text" {...register("Name", {
                    required: { value: true, message: "Missing Name name" }
                })} />
                <span>{formState.errors.Name?.message}</span>

                <label>Description: </label>
                <input type="text" {...register("Description", {
                    required: { value: true, message: "Missing Description" }
                })} />
                <span>{formState.errors.Description?.message}</span>




                <label>CreationDate: </label>
                <input type="datetime-local" {...register("CreationDate", {
                    required: { value: true, message: "Missing CreationDate" }
                })} />
                <span>{formState.errors.CreationDate?.message}</span>



                <label>Price: </label>
                <input type="number" {...register("Price", {
                    required: { value: true, message: "Missing Price" },
                    min: { value: 0, message: "Price can't be negative" },
                    max: { value: 100000, message: "Price can't exceed 1000" },
                })} />
                <span>{formState.errors.Price?.message}</span>

                <label>Image: </label>
                <input type="file" accept="image/*" {...register("image")} />

                <button>Add</button>
                <button onClick={() => navigate(-1)}>Back</button>


            </form>

        </div>
    );
}

export default AddVacation;