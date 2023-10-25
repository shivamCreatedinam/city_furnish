class Document {
    constructor(response) {
        this.docName = response.doc_name;
        this.caseFieldName = response.case_field_name;
        this.docId = response.doc_id;
        this.maxFiles = response.max_files;
        this.supportedDocs = response.supported_docs;
        this.description = response.description;
        this.uriArr = [];
        this.documentArr = [];
        this.documentType = response.document_type;
        // this.uriArr = ["https://picsum.photos/200/300","https://picsum.photos/200/300"]; 
    }
}

export default Document