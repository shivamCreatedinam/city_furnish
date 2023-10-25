import ApiEndpoints, {
  ADD_TO_CART_API,
  GET_CART_DETAIL_API,
  DELETE_FROM_CART_API,
  DELETE_COUPON_CODE_API,
  APPLY_COUPON_CODE_API,
} from '../../apimanager/ApiEndpoint';
import ApiSingleton from '../../apimanager/ApiSingleton';
import AppUser from '../../utility/AppUser';
import {POST, GET} from '../../apimanager/RequestMethods';
import {UPDATE_CART_BADGE_COUNT} from './../Type';
import AsyncStorage from '@react-native-community/async-storage';

export const onUpdateCartBadgeCount = data => {
  return {
    type: UPDATE_CART_BADGE_COUNT,
    payload: data,
  };
};

export const hitAddToCartApi = (
  product_id,
  quantity,
  attribute_values,
  city_id,
  user_id,
) => dispatch => {
  console.log(
    'this function runs',
    product_id,
    quantity,
    attribute_values,
    city_id,
    user_id,
  );
  return new Promise((resolve, reject) => {
    let appUser = AppUser.getInstance();
    const parameters = {
      product_id: product_id,
      quantity: quantity,
      attribute_values: attribute_values,
      city_id: city_id,
      user_id: appUser.userId ? appUser.userId : user_id,
    };
    let token = appUser.token;
    let Userid = appUser.userId;
    const Url = ApiEndpoints(ADD_TO_CART_API);

    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: POST,
        headersOverride: {
          'Content-Type': 'multipart/form-data',
          authtoken: token,
          userid: Userid,
        },
        onSuccess: async data => {
          resolve(data);
          console.log(user_id, 'success');
        },
        onFailure: error => {
          reject(error);
          console.log(user_id, 'failure');
        },
        label: ADD_TO_CART_API,
        data: parameters,
      }),
    );
  });
};

export const getCartDetailApi = (getUpfrontMode = false) => dispatch => {
  return new Promise(async (resolve, reject) => {
    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let Userid = appUser.userId;
    let cityId = appUser.selectedCityId;
    let tempUserId = await AsyncStorage.getItem('@temp_user_id');

    if (tempUserId == null) {
      let rnumber = Math.round(Date.now() * (Math.random() * 1000));
      let rnstring = rnumber.toString();
      await AsyncStorage.setItem('@temp_user_id', rnstring.substring(0, 9));
      tempUserId = rnstring.substring(0, 9);
    }
    const Url = ApiEndpoints(GET_CART_DETAIL_API);
    const parameters = {
      city_id: cityId,
      is_upfront: getUpfrontMode ? 1 : 0,
    };

    console.log(Userid, tempUserId);

    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: POST,
        headersOverride: {
          'Content-Type': 'multipart/form-data',
          authtoken: token,
          userid: Userid ? Userid : tempUserId,
        },
        onSuccess: async data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: GET_CART_DETAIL_API,
        data: parameters,
      }),
    );
  });
};

export const deleteProductFromCartApi = cart_id => dispatch => {
  return new Promise(async (resolve, reject) => {
    const parameters = {
      cart_id: cart_id,
    };

    let tempUserId = await AsyncStorage.getItem('@temp_user_id');

    if (tempUserId == null) {
      let rnumber = Math.round(Date.now() * (Math.random() * 1000));
      let rnstring = rnumber.toString();
      await AsyncStorage.setItem('@temp_user_id', rnstring.substring(0, 9));
      tempUserId = rnstring.substring(0, 9);
    }

    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let Userid = appUser.userId;
    const Url = ApiEndpoints(DELETE_FROM_CART_API);
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: POST,
        headersOverride: {
          'Content-Type': 'multipart/form-data',
          authtoken: token,
          userid: Userid ? Userid : tempUserId,
        },
        onSuccess: async data => {
          resolve(data);
          console.log(data, 'from remove cart api');
        },
        onFailure: error => {
          reject(error);
        },
        label: DELETE_FROM_CART_API,
        data: parameters,
      }),
    );
  });
};

export const deleteCouponCodeApi = coupon_code => dispatch => {
  return new Promise((resolve, reject) => {
    const parameters = {
      coupon_code: coupon_code,
    };
    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let Userid = appUser.userId;
    const Url = ApiEndpoints(DELETE_COUPON_CODE_API);
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: POST,
        headersOverride: {
          'Content-Type': 'multipart/form-data',
          authtoken: token,
          userid: Userid,
        },
        onSuccess: async data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: DELETE_COUPON_CODE_API,
        data: parameters,
      }),
    );
  });
};

export const applyCouponCodeApi = coupon_code => dispatch => {
  return new Promise((resolve, reject) => {
    const parameters = {
      coupon_code: coupon_code,
    };
    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let Userid = appUser.userId;
    const Url = ApiEndpoints(APPLY_COUPON_CODE_API);
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: POST,
        headersOverride: {
          'Content-Type': 'multipart/form-data',
          authtoken: token,
          userid: Userid,
        },
        onSuccess: async data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: APPLY_COUPON_CODE_API,
        data: parameters,
      }),
    );
  });
};
