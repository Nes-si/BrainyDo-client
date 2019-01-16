import {LOGOUT} from 'ducks/user';


export const INIT_END     = 'app/nav/INIT_END';
export const SHOW_ALERT   = 'app/nav/SHOW_ALERT';
export const CLOSE_ALERT  = 'app/nav/CLOSE_ALERT';
export const SHOW_MODAL   = 'app/nav/SHOW_MODAL';
export const CLOSE_MODAL  = 'app/nav/CLOSE_MODAL';


export const MODAL_TYPE_SIGN    = 'app/nav/modals/MODAL_TYPE_SIGN';


export function initEnd() {
  return {
    type: INIT_END
  };
}

export function showAlert(params) {
  return {
    type: SHOW_ALERT,
    params
  };
}
export function closeAlert() {
  return {
    type: CLOSE_ALERT
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


const initialState = {
  initEnded: false,

  alertShowing: false,
  alertParams: null,

  modalShowing: false,
  modalType: null,
  modalParams: null
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

    case SHOW_ALERT:
      return {
        ...state,
        alertShowing: true,
        alertParams: action.params
      };

    case CLOSE_ALERT:
      return {
        ...state,
        alertShowing: false
      };

    case SHOW_MODAL:
      return {
        ...state,
        modalShowing: true,
        modalType: action.modalType,
        modalParams: action.params
      };

    case CLOSE_MODAL:
      return {...state, modalShowing: false};

    default:
      return state;
  }
}