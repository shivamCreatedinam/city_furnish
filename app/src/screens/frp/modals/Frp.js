import Room from './Room'

class Frp {
    constructor(response) {
        this.totalCount=response.total_items_count;
        this.productDescription=response.frp_product_description;
        this.productRefundableDeposit=response.frp_refundable_deposit;
        this.rooms = [];
        response.data.forEach(element => {
            let roomObj = new Room(element)
            this.rooms.push(roomObj);
        });
        
    }
}

export default Frp