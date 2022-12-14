class VacationModel {
    public vacationId: number = 0; // PK
    public Name: string ="";
    public Description: string ="";
    public CreationDate: string;
    public Price: string;
    public imageName: string = ""; // The image name on the backend ("1.jpg")
    public image: FileList = null; // The image file to send to backend
    public isFollowing: boolean = false;
    public followersCount: number = 0;
}

export default VacationModel;
