class Slot {
    constructor(data) {
        this.id = data.slot_id;
        this.name = data.room_name;
        this.icon = data.img;
        this.selectedImgUrl = null;
        this.associatedProductId = null;
        this.productType = null  //"premium" : "associated"
        this.additionalAmount = 0
    }

}

export default Slot