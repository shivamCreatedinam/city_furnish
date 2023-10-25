import Document from './Document'

class KycModal {
    constructor(response) {
        this.currentSelectedPos = 0;
        this.userType = "";
        this.linkedinProfileUrl = "";
        this.remarks = "";
        this.documents = [];
        response.data.forEach(element => {
            let document = new Document(element)
            this.documents.push(document);
        });
        console.log("this.documents",this.documents)

    }
}

export default KycModal