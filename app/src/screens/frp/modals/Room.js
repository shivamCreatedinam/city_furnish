import Slot from './Slot';

class Room {
    constructor(data) {
        this.productId = data.product_id
        this.productName = data.product_name
        this.id = data.room_id;
        this.slots = [];
        data.slots.forEach(element => {
            let slotObj = new Slot(element)
            this.slots.push(slotObj)
        });
    }
}
export default Room
