import React, { useReducer } from 'react';
import flipperLogger from 'use-reducer-flipper';
import { createContainer } from 'react-tracked';

import { INITIAL_STATE as PROPERTY_INITIAL_STATE } from './Property/Reducers';
import { INITIAL_STATE as TEAM_INITIAL_STATE } from './Team/Reducers';
import { INITIAL_STATE as FORM_INITIAL_STATE } from './Form/Reducers';
import { INITIAL_STATE as HOME_INITIAL_STATE } from './Home/Reducers';
import { INITIAL_STATE as USER_INITIAL_STATE } from './User/Reducers';
import { INITIAL_STATE as SYNC_INITIAL_STATE } from './Sync/Reducers';
import { INITIAL_STATE as INSPECTION_INITIAL_STATE } from './Inspection/Reducers';
import { INITIAL_STATE as SURVEY_INITIAL_STATE } from './Survey/Reducers';
import { INITIAL_STATE as FILE_INITIAL_STATE } from './File/Reducers';
import { INITIAL_STATE as DELIVERY_INITIAL_STATE } from './Delivery/Reducers';
import { INITIAL_STATE as INVENTORY_INITIAL_STATE } from './Inventory/Reducers';
import { INITIAL_STATE as NOTIFICATION_INITIAL_STATE } from './Notification/Reducers';
import { INITIAL_STATE as JR_INITIAL_STATE } from './JobRequest/Reducers';
import { INITIAL_STATE as APP_INITIAL_STATE } from './App/Reducers';
import { INITIAL_STATE as ATTENDANCE_INITIAL_STATE } from './Attendance/Reducers';
import { INITIAL_STATE as VISITOR_INITIAL_STATE } from './Visitor/Reducers';
import { INITIAL_STATE as WORKFLOW_INITIAL_STATE } from './Workflow/Reducers';
import { INITIAL_STATE as SAVILLS_USER_INITIAL_STATE } from './SavillsUser/Reducers';
import { INITIAL_STATE as ASSET_INITIAL_STATE } from './Asset/Reducers';

import reducers from './Reducers';
import { SHOW_LOADING } from './App/Actions';

// export const StateContext = createContext();

const initialState = {
  property: PROPERTY_INITIAL_STATE,
  team: TEAM_INITIAL_STATE,
  form: FORM_INITIAL_STATE,
  home: HOME_INITIAL_STATE,
  user: USER_INITIAL_STATE,
  sync: SYNC_INITIAL_STATE,
  inspection: INSPECTION_INITIAL_STATE,
  survey: SURVEY_INITIAL_STATE,
  file: FILE_INITIAL_STATE,
  delivery: DELIVERY_INITIAL_STATE,
  inventory: INVENTORY_INITIAL_STATE,
  notification: NOTIFICATION_INITIAL_STATE,
  jobRequest: JR_INITIAL_STATE,
  app: APP_INITIAL_STATE,
  attendance: ATTENDANCE_INITIAL_STATE,
  visitor: VISITOR_INITIAL_STATE,
  workflow: WORKFLOW_INITIAL_STATE,
  savillsUser: SAVILLS_USER_INITIAL_STATE,
  asset: ASSET_INITIAL_STATE,
};

const useValue = () => {
  const [state, dispatch] = useReducer(
    __DEV__ && typeof jest === 'undefined' ? flipperLogger(reducers) : reducers,
    initialState
  );
  return [state, dispatch];
};

export const { Provider, useTrackedState, useUpdate: useDispatch } = createContainer(useValue);

export const StateProvider = ({ children, ...props }) => <Provider {...props}>{children}</Provider>;

export const processRequest = (dispatch) => (actionType, fnc, options) =>
  async function (params) {
    const showLoading = (show) => {
      if (options.showLoading) {
        dispatch({
          type: SHOW_LOADING,
          payload: show,
        });
      }
    };

    try {
      showLoading(true);
      dispatch({
        type: actionType.REQUEST,
        payload: params,
      });
      const result = await fnc(params);
      dispatch({
        type: actionType.SUCCESS,
        payload: result,
      });
      return result;
    } catch (err) {
      dispatch({
        type: actionType.FAILURE,
        payload: err?.message,
      });
      return null;
    } finally {
      showLoading(false);
    }
  };

export const useStateValue = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();

  return [state, dispatch];
};

export const useHandlerAction = () => {
  const dispatch = useDispatch();

  const createRequestHandler = (showLoading) => (type, fnc) => processRequest(dispatch)(type, fnc, { showLoading });

  const withLoadingAndErrorHandling = createRequestHandler(true);
  const withErrorHandling = createRequestHandler(false);
  return {
    withLoadingAndErrorHandling,
    withErrorHandling,
  };
};
