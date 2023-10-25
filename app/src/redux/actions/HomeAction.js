import ApiEndpoints, {
  HOME_SCREEN_API,
  GET_APP_LIVE_VERSION_API,
  GET_CUSTOMER_PAYMENT_URL,
  BASE_URL,
  TRENDING_PRODUCT_API,
} from '../../apimanager/ApiEndpoint';
import ApiSingleton from '../../apimanager/ApiSingleton';
import {GET} from '../../apimanager/RequestMethods';

export const hitGetHomeScreenData = () => dispatch => {
  return new Promise((resolve, reject) => {
    const Url = ApiEndpoints(HOME_SCREEN_API);
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: GET,
        onSuccess: data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: HOME_SCREEN_API,
      }),
    );
  });
};

export const checkForAppUpdates = () => dispatch => {
  return new Promise((resolve, reject) => {
    const Url = ApiEndpoints(GET_APP_LIVE_VERSION_API);
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: GET,
        onSuccess: data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: GET_APP_LIVE_VERSION_API,
      }),
    );
  });
};

export const getCustomerPaymentUrl = code => dispatch => {
  return new Promise((resolve, reject) => {
    // console.log("BASE_URL",BASE_URL)
    const Url = `${BASE_URL}${'/ajxapi/get_customer_payment_full_url/'}${code}`;
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: GET,
        onSuccess: data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: GET_CUSTOMER_PAYMENT_URL,
      }),
    );
  });
};


export const hitGetHomeTreandinProduct = () => dispatch => {
  console.log("dff")
  return new Promise((resolve, reject) => {
    const Url = ApiEndpoints(TRENDING_PRODUCT_API);
    console.log(Url)
    dispatch(
      ApiSingleton.getInstance().apiActionCall({
        url: Url,
        method: GET,
        onSuccess: data => {
          resolve(data);
        },
        onFailure: error => {
          reject(error);
        },
        label: TRENDING_PRODUCT_API,
      }),
    );
  });
};