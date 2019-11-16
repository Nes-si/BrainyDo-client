import {LOGIN_RESPONSE, LOGOUT} from 'ducks/user';


export const INIT_END             = 'app/nav/INIT_END';
export const SHOW_MODAL           = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL          = 'app/nav/CLOSE_MODAL';
export const SET_SERVER_PROBLEM_A = 'app/nav/SET_SERVER_PROBLEM_A';
export const SET_SERVER_PROBLEM_B = 'app/nav/SET_SERVER_PROBLEM_B';


export const MODAL_TYPE_ALERT       = 'app/nav/modals/MODAL_TYPE_ALERT';
export const MODAL_TYPE_SIGN        = 'app/nav/modals/MODAL_TYPE_SIGN';
export const MODAL_TYPE_SETTLEMENT  = 'app/nav/modals/MODAL_TYPE_SETTLEMENT';



export function initEnd() {
  return {
    type: INIT_END
  };
}

export function showModal(modalType, params) {
  return {
    type: SHOW_MODAL,
    modalType,
    params
  };
}
export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function setServerProblemA (value = true) {
  return {
    type: SET_SERVER_PROBLEM_A,
    value
  };
}

export function setServerProblemB (value = true) {
  return {
    type: SET_SERVER_PROBLEM_B,
    value
  };
}


const initialState = {
  initEnded: false,

  modalShowing: false,
  modalType: null,
  modalParams: null,

  serverProblemA: false,
  serverProblemB: false
};


export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        initEnded: true
      };

    case LOGOUT:
      return {
        ...state,
        initEnded: false
      };

    case SHOW_MODAL:
      return {
        ...state,
        modalShowing: true,
        modalType: action.modalType,
        modalParams: action.params
      };

    case CLOSE_MODAL:
      return {
        ...state,
        modalShowing: false
      };

    case LOGIN_RESPONSE:
      if (action.authorized && state.modalType == MODAL_TYPE_SIGN)
        return {
          ...state,
          modalShowing: false
        };
      else
        return state;

    case SET_SERVER_PROBLEM_A:
      return {...state, serverProblemA: action.value};

    case SET_SERVER_PROBLEM_B:
      return {...state, serverProblemB: action.value};

    default:
      return state;
  }
}