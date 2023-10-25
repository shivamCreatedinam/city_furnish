import resources from '../../../res';

export const optionsForLoggedIn = [
  {
    image: resources.images.navigation_icn,
    title: 'Change City',
    key: 'change_city',
  },
  {
    image: resources.images.icn_order,
    title: 'My Orders',
    key: 'orders',
  },
  {
    image: resources.images.icn_order,
    title: 'My Service Requests',
    key: 'my_service_requests',
  },
  {
    image: resources.images.icn_notification,
    title: 'My Notifications',
    key: 'my_notification',
  },
  {
    image: resources.images.icn_payments,
    title: 'My Payments',
    key: 'my_payments',
  },
  {
    image: resources.images.icn_invoice,
    title: 'My Invoices',
    key: 'my_invoice',
  },
  // {
  //     image: resources.images.icn_auto_payments,
  //     title: "Auto Pay",
  //     key: 'auto_pay'
  // },
  {
    image: resources.images.icn_customerPayment,
    title: 'Customer Payment',
    key: 'customer_payment',
  },
  {
    image: resources.images.icn_order,
    title: 'Corporate Orders',
    key: 'corporate_orders',
  },
  {
    image: resources.images.icn_coin,
    title: 'Cityfurnish Coins',
    key: 'cityfurnish_coins',
  },
  {
    image: resources.images.icn_referral_code,
    title: 'Referral Code',
    key: 'referral_code',
  },
  {
    image: resources.images.icn_profile_setting,
    title: 'Profile Settings',
    key: 'profile_settings',
  },
  {
    image: resources.images.icn_password,
    title: 'Change Password',
    key: 'change_password',
  },
  {
    image: resources.images.icn_kycDocuments,
    title: 'Documentation',
    key: 'documentation',
  },
  {
    image: resources.images.icn_address,
    title: 'Shipping Address',
    key: 'shipping_address',
  },
  // {
  //     image: resources.images.icn_chat,
  //     title: "Chat",
  //     key: 'chat'
  // },
  {
    image: resources.images.icn_capitalExpenditure,
    title: 'Benefits',
    key: 'benefits',
  },
  {
    image: resources.images.icn_faQs,
    title: 'FAQs',
    key: 'faq',
  },
  {
    image: resources.images.icn_howItWorks,
    title: 'How it works',
    key: 'how_it_works',
  },
  {
    image: resources.images.icn_documents,
    title: 'Privacy Policy',
    key: 'privacy_policy',
  },
  {
    image: resources.images.icn_documents,
    title: 'Terms and Conditions',
    key: 'terms_condition',
  },
  {
    image: resources.images.icn_contactUs,
    title: 'Contact Us',
    key: 'contact_us',
  },
];

export const optionsForNotLoggedIn = [
  {
    id : 0,
    title : 'ACCOUNT',
    subMenu : [
      {

      }
    ]
  }
  // {
  //   image: resources.images.navigation_icn,
  //   title: 'Change City',
  //   key: 'change_city',
  // },
  // {
  //   image: resources.images.icn_customerPayment,
  //   title: 'Customer Payment',
  //   key: 'customer_payment',
  // },
  // {
  //   image: resources.images.icn_referral_code,
  //   title: 'Referral Code',
  //   key: 'referral_code_not_loggedin',
  // },
  // {
  //   image: resources.images.icn_capitalExpenditure,
  //   title: 'Benefits',
  //   key: 'benefits',
  // },
  // {
  //   image: resources.images.icn_faQs,
  //   title: 'FAQs',
  //   key: 'faq',
  // },
  // {
  //   image: resources.images.icn_howItWorks,
  //   title: 'How it works',
  //   key: 'how_it_works',
  // },
  // {
  //   image: resources.images.icn_documents,
  //   title: 'Privacy Policy',
  //   key: 'privacy_policy',
  // },
  // {
  //   image: resources.images.icn_documents,
  //   title: 'Terms and Conditions',
  //   key: 'terms_condition',
  // },
  // {
  //   image: resources.images.icn_contactUs,
  //   title: 'Contact Us',
  //   key: 'contact_us',
  // },
];

export const optionsForLoggedInRazorpay = (paymentFlag, autoPayFlag) => {
  let optionsForLoggedInAutoPay = [
    {
      title : "ACCOUNT",
      subMenu : [
        { 
          index: 11,
          image: resources.images.icn_profile_setting,
          title: 'Your Profile',
          key: 'profile_settings',
        },
         {
          index: 14,
          image: resources.images.icn_address,
          title: 'Shipping Address',
          key: 'shipping_address',
        },
        {
          index: 13,
          image: resources.images.icn_kycDocuments,
          title: 'Documentation',
          key: 'documentation',
        },
      ]
    },
    {
      title : "ORDERS & PAYMENTS ",
      subMenu : [
        {
           
            index: 2,
            image: resources.images.icn_order,
            title: 'My Orders',
            key: 'orders',
          
        },
        {
          index: 6,
          image: resources.images.icn_invoice,
          title: 'My Invoices',
          key: 'my_invoice',
        },
         {
      index: 5,
      image: resources.images.icn_payments,
      title: 'My Payments',
      key: 'my_payments',
    },
      ]
    },
    {
      title : "BENEFITS ",
      subMenu : [
        {  
          index: 9,
          image: resources.images.icn_coin,
          title: 'Cityfurnish Coins',
          key: 'cityfurnish_coins',
        },
        {
          index: 6,
          image: resources.images.icn_referral_code,
          title: 'Refer a friend',
          key: 'referral_code',
        },
        {
            index: 5,
            image: resources.images.icn_referral_codefrd,
            title: 'Have a referral code from friend?',
            key: 'my_payments',
        },
      ]
    },
    {
      title : "HELP & REQUESTS ",
      subMenu : [
        {
           
              index: 9,
      image: resources.images.icn_coin,
      title: 'Requests',
      key: 'cityfurnish_coins',
          
        },
        {
          index: 6,
          image: resources.images.icn_referral_code,
          title: 'Help & support',
          key: 'faq',
        },
        {
          index: 3,
          image: resources.images.icn_order,
          title: 'My Service Requests',
          key: 'my_service_requests',
        },
         
      ]
    }
    // {
    //   index: 1,
    //   image: resources.images.navigation_icn,
    //   title: 'Change City',
    //   key: 'change_city',
    // },
    // {
    //   index: 2,
    //   image: resources.images.icn_order,
    //   title: 'My Orders',
    //   key: 'orders',
    // },
    // {
    //   index: 3,
    //   image: resources.images.icn_order,
    //   title: 'My Service Requests',
    //   key: 'my_service_requests',
    // },
    // {
    //   index: 4,
    //   image: resources.images.icn_notification,
    //   title: 'My Notifications',
    //   key: 'my_notification',
    // },
    // {
    //   index: 5,
    //   image: resources.images.icn_payments,
    //   title: 'My Payments',
    //   key: 'my_payments',
    // },
    // {
    //   index: 6,
    //   image: resources.images.icn_invoice,
    //   title: 'My Invoices',
    //   key: 'my_invoice',
    // },
    // {
    //   index: 7,
    //   image: resources.images.icn_customerPayment,
    //   title: 'Customer Payment',
    //   key: 'customer_payment',
    // },
    // {
    //   index: 8,
    //   image: resources.images.icn_order,
    //   title: 'Corporate Orders',
    //   key: 'corporate_orders',
    // },
    // {
    //   index: 9,
    //   image: resources.images.icn_coin,
    //   title: 'Cityfurnish Coins',
    //   key: 'cityfurnish_coins',
    // },
    // {
    //   index: 10,
    //   image: resources.images.icn_referral_code,
    //   title: 'Referral Code',
    //   key: 'referral_code',
    // },
    // {
    //   index: 11,
    //   image: resources.images.icn_profile_setting,
    //   title: 'Profile Settings',
    //   key: 'profile_settings',
    // },
    // {
    //   index: 12,
    //   image: resources.images.icn_password,
    //   title: 'Change Password',
    //   key: 'change_password',
    // },
    // {
    //   index: 13,
    //   image: resources.images.icn_kycDocuments,
    //   title: 'Documentation',
    //   key: 'documentation',
    // },
    // {
    //   index: 14,
    //   image: resources.images.icn_address,
    //   title: 'Shipping Address',
    //   key: 'shipping_address',
    // },
    // // {
    // //     index: 15,
    // //     image: resources.images.icn_chat,
    // //     title: "Chat",
    // //     key: 'chat'
    // // },
    // {
    //   index: 16,
    //   image: resources.images.icn_capitalExpenditure,
    //   title: 'Benefits',
    //   key: 'benefits',
    // },
    // {
    //   index: 17,
    //   image: resources.images.icn_faQs,
    //   title: 'FAQs',
    //   key: 'faq',
    // },
    // {
    //   index: 18,
    //   image: resources.images.icn_howItWorks,
    //   title: 'How it works',
    //   key: 'how_it_works',
    // },
    // {
    //   index: 19,
    //   image: resources.images.icn_documents,
    //   title: 'Privacy Policy',
    //   key: 'privacy_policy',
    // },
    // {
    //   index: 20,
    //   image: resources.images.icn_documents,
    //   title: 'Terms and Conditions',
    //   key: 'terms_condition',
    // },
    // {
    //   index: 21,
    //   image: resources.images.icn_contactUs,
    //   title: 'Contact Us',
    //   key: 'contact_us',
    // },
  ];
  //   if (paymentFlag == 'Razorpay' && autoPayFlag) {
  //     // with AutoPay Setup
  //     let optionsForLoggedInWithAutoPay = {
  //       index: 22,
  //       image: resources.images.icn_auto_payments,
  //       title: 'Auto Pay',
  //       key: 'auto_pay',
  //     };
  //     optionsForLoggedInAutoPay.splice(6, 0, optionsForLoggedInWithAutoPay);
  //   }

  // without/With AutoPay Setup
  return optionsForLoggedInAutoPay;
};

export const optionsForLoggedInPayu = [
  {
    image: resources.images.navigation_icn,
    title: 'Change City',
    key: 'change_city',
  },
  {
    image: resources.images.icn_order,
    title: 'My Orders',
    key: 'orders',
  },
  {
    image: resources.images.icn_order,
    title: 'My Service Requests',
    key: 'my_service_requests',
  },
  {
    image: resources.images.icn_notification,
    title: 'My Notifications',
    key: 'my_notification',
  },
  {
    image: resources.images.icn_payments,
    title: 'My Payments',
    key: 'my_payments',
  },
  {
    image: resources.images.icn_invoice,
    title: 'My Invoices',
    key: 'my_invoice',
  },
  {
    image: resources.images.icn_customerPayment,
    title: 'Customer Payment',
    key: 'customer_payment',
  },
  {
    image: resources.images.icn_order,
    title: 'Corporate Orders',
    key: 'corporate_orders',
  },
  {
    image: resources.images.icn_coin,
    title: 'Cityfurnish Coins',
    key: 'cityfurnish_coins',
  },
  {
    image: resources.images.icn_referral_code,
    title: 'Referral Code',
    key: 'referral_code',
  },
  {
    image: resources.images.icn_profile_setting,
    title: 'Profile Settings',
    key: 'profile_settings',
  },
  {
    image: resources.images.icn_password,
    title: 'Change Password',
    key: 'change_password',
  },
  {
    image: resources.images.icn_kycDocuments,
    title: 'Documentation',
    key: 'documentation',
  },
  {
    image: resources.images.icn_address,
    title: 'Shipping Address',
    key: 'shipping_address',
  },
  // {
  //     image: resources.images.icn_chat,
  //     title: "Chat",
  //     key: 'chat'
  // },
  {
    image: resources.images.icn_capitalExpenditure,
    title: 'Benefits',
    key: 'benefits',
  },
  {
    image: resources.images.icn_faQs,
    title: 'FAQs',
    key: 'faq',
  },
  {
    image: resources.images.icn_howItWorks,
    title: 'How it works',
    key: 'how_it_works',
  },
  {
    image: resources.images.icn_documents,
    title: 'Privacy Policy',
    key: 'privacy_policy',
  },
  {
    image: resources.images.icn_documents,
    title: 'Terms and Conditions',
    key: 'terms_condition',
  },
  {
    image: resources.images.icn_contactUs,
    title: 'Contact Us',
    key: 'contact_us',
  },
];
