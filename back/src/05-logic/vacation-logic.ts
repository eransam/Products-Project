import { OkPacket } from "mysql";
import ErrorModel from "../03-models/error-model";
import VacationModel from "../03-models/vacation-model";
import dal from "../04-dal/dal";
import { v4 as uuid } from 'uuid';

async function getAllVacations(userId: string): Promise<VacationModel[]> {

    const sql = `SELECT DISTINCT
    V.*,
   EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId AND userId = ?) AS isFollowing,
   COUNT(F.userId) AS followersCount
   FROM vacations as V LEFT JOIN followers as F
   ON V.vacationId = F.vacationId
   GROUP BY vacationId
   ORDER BY isFollowing DESC`;

    //יוצרים משתנה ומבצעים לתוכו בקשה לדאטה בייס עם השאילתה שיצרנו קודם לכן
    const vacations = await dal.execute(sql, [userId]);
    //אנו מחזירים את המשתנה שמכיל בתוכו את התשובה מהבקשה שלנו 
    //שבמקרה שלנו התשובה זה כל המוצרים מהדאטה בייס
    return vacations;
}

//פה אנו יוצרים פונ' שמחזירה לנו רק מוצר אחד
async function getOneVacation(id: number): Promise<VacationModel> {
    const sql = `SELECT
    vacationId,
    Name,
    Description,
    CreationDate,
    Price,
    CONCAT(vacationId, '.jpg') AS imageName 
     FROM vacations
                    WHERE vacationId = ${id}`;

    const allVacation = await dal.execute(sql);
    console.log("one vacation" + allVacation);
    


    const Vacations = allVacation[0];
    console.log("one vacation [0]" + Vacations);


    if(!Vacations) throw new ErrorModel(404, `id ${id} not found`);

    return Vacations;
}

async function addVacation(Vacation: VacationModel): Promise<VacationModel> {
    console.log("Vacation: " ,Vacation);
    
    const errors = Vacation.validatePost();
    if (errors) {
        throw new ErrorModel(400, errors)
    }
    if (Vacation.image) {
    const extension = Vacation.image.name.substring(
        Vacation.image.name.lastIndexOf('.')
    );
    Vacation.imageName = uuid() + extension;
    console.log("Vacation.imageName: " , Vacation.imageName);
    
    await Vacation.image.mv('./src/assets/images/vacations/' + Vacation.imageName);
    delete Vacation.image;
  }

  let sql = ` INSERT INTO vacations 
  ( Name, 
    Description, 
    CreationDate,
    Price,
    imageName)
  VALUES(?,?,?,?,?)`;
let parameters = [
    Vacation.Name,
    Vacation.Description,
    Vacation.CreationDate,
    Vacation.Price,
    Vacation.imageName
];

const info: OkPacket = await dal.execute(sql, parameters);
Vacation.vacationId = info.insertId;
  
  return Vacation;
}



//פונ' עדכון מוצר מלא
async function updateFullVacation(Vacation: VacationModel): Promise<VacationModel> {

    //בדיקת ולידציה
    const errors = Vacation.validatePut();
    if (errors) throw new ErrorModel(400, errors);

    console.log("Vacation in logic: " ,Vacation );

    if (Vacation.image) {
        console.log('PUT. Have image! logic');
        const extension = Vacation.image.name.substring(
            Vacation.image.name.lastIndexOf('.')
        );
        Vacation.imageName = uuid() + extension;
        console.log('have image name! logic - ', Vacation.imageName);
        await Vacation.image.mv('./src/assets/images/vacations/' + Vacation.imageName);
        delete Vacation.image;
      }
    



                let sql = ` UPDATE vacations 
                SET
                Name = ?,
                Description = ?,
                CreationDate = ?,
                Price = ?,
                imageName = ?
                WHERE vacationId = ?`;
let parameters = [
    Vacation.Name,
    Vacation.Description,
    Vacation.CreationDate,
    Vacation.Price,
    Vacation.imageName,
    Vacation.vacationId];

    //זה הודעה שהמערכת מציגה כאשר מוצר לדוגמא עודכן בהצלחה והיא מכילה את כל הנתונים של המוצר OkPacket
    const info: OkPacket = await dal.execute(sql, parameters);

    if(info.affectedRows === 0) throw new ErrorModel(404, `id ${Vacation.vacationId} not found`);

    return Vacation;
}

async function updatePartialVacation(Vacation: VacationModel): Promise<VacationModel> {
    console.log("1" + Vacation);

    //בדיקת ולידציה
    const errors = Vacation.validatePatch();
    if (errors) throw new ErrorModel(400, errors);

    //פה אנו מכניסים לתוך המשתנה שלנו את המוצר המלא לפני העדכון שאותו אנו רוצים לעדכן חלקית
    const dbVacation = await getOneVacation(Vacation.vacationId);
    console.log(Vacation.vacationId);
    
    console.log("dbVacation" + dbVacation);
    
    //פה אנו מבצעים על המוצר המעודכן לולאת פרופ
    for(const prop in Vacation) {
        //במידה ויש ערך לפרופרטי זאת אומרת שבמידה ושלחו בפונקציה פרופרטי מסויים מעודכן 
        //אנו נכנס לתנאי ונשתה את הפרופרטי המקורי במעודכן 
        //זאת אומרת שלא רצו לעדכן או לשנות את אותו הפרופרטי  undefined ובמידה והפרופרטי שהתקבל בפונקציה הוא 
        //ואני לא נכנס לתנאי
        if(Vacation[prop] !== undefined) {
            dbVacation[prop] = Vacation[prop];
        }
    }
    
    // dbVacation.startDate = dbVacation.endDate.toString();
    // dbVacation.endDate = dbVacation.endDate.toString();

    console.log("dbVacation: " , dbVacation);
    
    const updatedVacation = await updateFullVacation(new VacationModel(dbVacation));

    return updatedVacation;
}


//פונ' שמוחקת מוצר
async function deleteVacation(id: number): Promise<void> {
    
    //שאילתת מחיקה 
    const sql = `DELETE FROM vacations WHERE vacationId = ${id}`;

    //פה המשתנה שלנו יכיל את כל מידע על המוצר שנימחק 
    const info: OkPacket = await dal.execute(sql);

    if(info.affectedRows === 0) throw new ErrorModel(404, `id ${id} not found`);
}


export default {
    getAllVacations,
    deleteVacation,
    updatePartialVacation,
    updateFullVacation,
    addVacation,
    getOneVacation
}

