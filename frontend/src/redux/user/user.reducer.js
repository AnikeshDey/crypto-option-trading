import ActionTypes from './user.types';

const INITIAL_STATE = {
    isLoggedIn: true,
    user: {
      "u_id": "1680259800439246",
      "email": "mailto:debdutt_karpas@test.com",
      "password": "$2b$10$Lk.DXThdEtX53cZ9Qx.h8uj1VUUt9jarBVtGz4YCP7OthJUjkV8.S",
      "isVerified": false,
      "log_un": "debdut_11",
      "handleUn": "debdutt_karpas",
      "fn": "Debdut",
      "ln": "Karpas",
      "p_i": "",
      "coverPic": "",
      "p_bio": "",
      "gndr": "",
      "dob": "",
      "s_t": "de",
      "s_t_u": "de",
      "toa": "normal",
      "c_p": 1680259800522,
      "flw_c": -2,
      "flwr_c": 6,
      "u_status": 0,
      "profile_like": 0,
      "f_bin": [
        "flwr"
      ],
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVfaWQiOiIxNjgwMjU5ODAwNDM5MjQ2IiwiZW1haWwiOiJkZWJkdXR0X2thcnBhc0B0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJExrLkRYVGhkRXRYNTNjWjlReC5oOHVqMVZVVXQ5amFyQlZ0R3o0WUNQN090aEpVamtWOC5TIiwiaXNWZXJpZmllZCI6ZmFsc2UsImxvZ191biI6ImRlYmR1dF8xMSIsImhhbmRsZVVuIjoiZGViZHV0dF9rYXJwYXMiLCJmbiI6IkRlYmR1dCIsImxuIjoiS2FycGFzIiwicF9pIjoiIiwiY292ZXJQaWMiOiIiLCJwX2JpbyI6IiIsImduZHIiOiIiLCJkb2IiOiIiLCJzX3QiOiJkZSIsInNfdF91IjoiZGUiLCJ0b2EiOiJub3JtYWwiLCJjX3AiOjE2ODAyNTk4MDA1MjIsImZsd19jIjotMiwiZmx3cl9jIjo1LCJ1X3N0YXR1cyI6MCwicHJvZmlsZV9saWtlIjowLCJmX2JpbiI6WyJmbHdyIl0sInRva2VuIjowLCJpbnRlcmVzdCI6WyJDcmlja2V0IiwiRm9vdGJhbGwiLCJDcnlwdG8iXSwicG9zdF9jIjoxfSwiaWF0IjoxNjgzMzc1MTYxfQ.7-C-yQqWY2m6pd9_Gp3-ea5YCdCT-LZQ7LAVSF9coiI",
      "interest": [
        "Cricket",
        "Football",
        "Crypto"
      ],
      "post_c": 1
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVfaWQiOiIxNjgwMjU5ODAwNDM5MjQ2IiwiZW1haWwiOiJkZWJkdXR0X2thcnBhc0B0ZXN0LmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJExrLkRYVGhkRXRYNTNjWjlReC5oOHVqMVZVVXQ5amFyQlZ0R3o0WUNQN090aEpVamtWOC5TIiwiaXNWZXJpZmllZCI6ZmFsc2UsImxvZ191biI6ImRlYmR1dF8xMSIsImhhbmRsZVVuIjoiZGViZHV0dF9rYXJwYXMiLCJmbiI6IkRlYmR1dCIsImxuIjoiS2FycGFzIiwicF9pIjoiIiwiY292ZXJQaWMiOiIiLCJwX2JpbyI6IiIsImduZHIiOiIiLCJkb2IiOiIiLCJzX3QiOiJkZSIsInNfdF91IjoiZGUiLCJ0b2EiOiJub3JtYWwiLCJjX3AiOjE2ODAyNTk4MDA1MjIsImZsd19jIjotMiwiZmx3cl9jIjo1LCJ1X3N0YXR1cyI6MCwicHJvZmlsZV9saWtlIjowLCJmX2JpbiI6WyJmbHdyIl0sInRva2VuIjowLCJpbnRlcmVzdCI6WyJDcmlja2V0IiwiRm9vdGJhbGwiLCJDcnlwdG8iXSwicG9zdF9jIjoxfSwiaWF0IjoxNjgzMzc1MTYxfQ.7-C-yQqWY2m6pd9_Gp3-ea5YCdCT-LZQ7LAVSF9coiI",
    wallet:null,
    stats:{}
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.USER_LOGIN:
          return {
                ...state,
                isLoggedIn: true,
                user: action.user,
                token: action.token,
            };
          break;
        case ActionTypes.USER_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                token: null,
                stats:{},
                wallet:null
            };
          break;
        case ActionTypes.SET_USER_WALLET:
          return {
            ...state,
            wallet:action.wallet
          }
          break;
        case ActionTypes.SET_USER_STATS:
          return {
            ...state,
            stats:{
              [action.key]:action.stats,
              exp:new Date(new Date().getTime() + (12 * 60 * 60 * 1000)).getTime()
            }
          }
          break;
        default:
            return state;
      }
}